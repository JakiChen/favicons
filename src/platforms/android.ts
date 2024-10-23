import escapeHtml from "escape-html";
import { FaviconFile, FaviconHtmlElement, FaviconImage } from "../index";
import {
  FaviconOptions,
  IconOptions,
  NamedIconOptions,
} from "../config/defaults";
import { maskable, transparentIcon } from "../config/icons";
import {
  createFavicon,
  relativeTo,
  SourceImage,
  sourceImages,
  createScreenshot,
} from "../helpers";
import { Platform, uniformIconOptions } from "./base";

import {
  DevicePlatformIdentifiers,
  DistributionPlatformIdentifiers,
} from "../types";

interface Icon {
  readonly src: string;
  readonly sizes: string;
  readonly type: string;
}

interface Shortcut {
  readonly name: string;
  readonly short_name: string;
  readonly description?: string;
  readonly url: string;
  readonly icons?: Icon[];
}

export interface Screenshot {
  src: string;
  sizes: string;
  type: string;
  form_factor?: "narrow" | "wide";
  label?: string;
  platform?: DevicePlatformIdentifiers | DistributionPlatformIdentifiers;
}

const ICONS_OPTIONS: NamedIconOptions[] = [
  { name: "android-chrome-36x36.png", ...transparentIcon(36) },
  { name: "android-chrome-48x48.png", ...transparentIcon(48) },
  { name: "android-chrome-72x72.png", ...transparentIcon(72) },
  { name: "android-chrome-96x96.png", ...transparentIcon(96) },
  { name: "android-chrome-144x144.png", ...transparentIcon(144) },
  { name: "android-chrome-192x192.png", ...transparentIcon(192) },
  { name: "android-chrome-256x256.png", ...transparentIcon(256) },
  { name: "android-chrome-384x384.png", ...transparentIcon(384) },
  { name: "android-chrome-512x512.png", ...transparentIcon(512) },
];

const ICONS_OPTIONS_MASKABLE: NamedIconOptions[] = [
  {
    name: "android-chrome-maskable-36x36.png",
    ...maskable(transparentIcon(36)),
  },
  {
    name: "android-chrome-maskable-48x48.png",
    ...maskable(transparentIcon(48)),
  },
  {
    name: "android-chrome-maskable-72x72.png",
    ...maskable(transparentIcon(72)),
  },
  {
    name: "android-chrome-maskable-96x96.png",
    ...maskable(transparentIcon(96)),
  },
  {
    name: "android-chrome-maskable-144x144.png",
    ...maskable(transparentIcon(144)),
  },
  {
    name: "android-chrome-maskable-192x192.png",
    ...maskable(transparentIcon(192)),
  },
  {
    name: "android-chrome-maskable-256x256.png",
    ...maskable(transparentIcon(256)),
  },
  {
    name: "android-chrome-maskable-384x384.png",
    ...maskable(transparentIcon(384)),
  },
  {
    name: "android-chrome-maskable-512x512.png",
    ...maskable(transparentIcon(512)),
  },
];

const SHORTCUT_ICONS_OPTIONS: Record<string, IconOptions> = {
  "36x36.png": transparentIcon(36),
  "48x48.png": transparentIcon(48),
  "72x72.png": transparentIcon(72),
  "96x96.png": transparentIcon(96),
  "144x144.png": transparentIcon(144),
  "192x192.png": transparentIcon(192),
};

export class AndroidPlatform extends Platform {
  constructor(options: FaviconOptions) {
    super(
      options,
      uniformIconOptions(options, options.icons.android, ICONS_OPTIONS),
    );
  }

  override async createImages(
    sourceset: SourceImage[],
  ): Promise<FaviconImage[]> {
    let icons = await Promise.all(
      this.iconOptions.map((iconOption) =>
        createFavicon(sourceset, iconOption.name, iconOption),
      ),
    );

    // Generate android maskable images from a different source set
    if (
      this.options.manifestMaskable &&
      typeof this.options.manifestMaskable !== "boolean"
    ) {
      const maskableSourceset = await sourceImages(
        this.options.manifestMaskable,
      );

      const maskableIcons = await Promise.all(
        ICONS_OPTIONS_MASKABLE.map((iconOption) =>
          createFavicon(maskableSourceset, iconOption.name, iconOption),
        ),
      );

      icons = [...icons, ...maskableIcons];
    }
    if (
      Array.isArray(this.options.shortcuts) &&
      this.options.shortcuts.length > 0
    ) {
      icons = [...icons, ...(await this.shortcutIcons())];
    }

    // Convert screenshots
    if (this.options.screenshots) {
      icons = [...icons, ...(await this.screenshots())];
    }

    return icons;
  }

  override async createFiles(): Promise<FaviconFile[]> {
    return [await this.manifest()];
  }

  override async createHtml(): Promise<FaviconHtmlElement[]> {
    // prettier-ignore
    return [
      this.options.loadManifestWithCredentials
        ? `<link rel="manifest" href="${this.cacheBusting(this.relative(this.manifestFileName()))}" crossOrigin="use-credentials">`
        : `<link rel="manifest" href="${this.cacheBusting(this.relative(this.manifestFileName()))}">`,
      `<meta name="mobile-web-app-capable" content="yes">`,
      `<meta name="theme-color" content="${this.options.theme_color || this.options.background}">`,
      this.options.appName
        ? `<meta name="application-name" content="${escapeHtml(this.options.appName)}">`
        : `<meta name="application-name">`,
    ];
  }

  private async shortcutIcons(): Promise<FaviconImage[]> {
    const icons = await Promise.all(
      this.options.shortcuts.map(async (shortcut, index) => {
        if (!shortcut.name || !shortcut.url || !shortcut.icon) return null;
        const shortcutSourceset = await sourceImages(shortcut.icon);
        return Promise.all(
          Object.entries(SHORTCUT_ICONS_OPTIONS).map(([shortcutName, option]) =>
            createFavicon(
              shortcutSourceset,
              `shortcut${index + 1}-${shortcutName}`,
              option,
            ),
          ),
        );
      }),
    );
    return icons.flat();
  }

  private async screenshots(): Promise<FaviconImage[]> {
    const screenshots = await Promise.all(
      this.options.screenshots.map(async (screenshot, index) => {
        if (!screenshot.image) return null;
        const screenshotSourceset = await sourceImages(screenshot.image);
        const { width, height } = screenshotSourceset[0].metadata;
        const { platform, format } = screenshot;
        const Format = format || "webp";
        const prefix = platform ? `${platform}-` : "";

        const screenshotImages = await createScreenshot(
          screenshotSourceset,
          // prettier-ignore
          `${prefix}screenshots${index + 1}-${width}x${height}.${Format}`,
          Format,
        );
        return screenshotImages;
      }),
    );
    return screenshots.flat().filter((screenshot) => screenshot !== null);
  }

  private manifestFileName(): string {
    return (
      this.options.files?.android?.manifestFileName ?? "manifest.webmanifest"
    );
  }

  private async manifest(): Promise<FaviconFile> {
    const { options } = this;
    const basePath = options.manifestRelativePaths ? null : options.path;

    const properties: Record<string, unknown> = {
      name: options.appName,
      short_name: options.appShortName || options.appName,
      categories: options.appCategories,
      description: options.appDescription,
      dir: options.dir,
      lang: options.lang,
      display: options.display,
      display_override: options.display_override,
      file_handlers: options.file_handlers,
      orientation: options.orientation,
      protocol_handlers: options.protocol_handlers,
      scope: options.scope,
      id: options.id,
      share_target: options.share_target,
      start_url: options.start_url,
      background_color: options.background,
      theme_color: options.theme_color,
    };

    // Defaults to false, so omit the value https://developer.mozilla.org/en-US/docs/Web/Manifest/prefer_related_applications
    if (options.preferRelatedApplications) {
      properties.prefer_related_applications =
        options.preferRelatedApplications;
    }
    // Only include related_applications if a lengthy array is provided.
    if (
      Array.isArray(options.relatedApplications) &&
      options.relatedApplications.length > 0
    ) {
      properties.related_applications = options.relatedApplications;
    }

    let icons = this.iconOptions;

    // If manifestMaskable is set but is not a boolean
    // assume a file (or an array) is passed, and we should link
    // the generated files with maskable as purpose.
    if (
      options.manifestMaskable &&
      typeof options.manifestMaskable !== "boolean"
    ) {
      icons = [...icons, ...ICONS_OPTIONS_MASKABLE];
    }

    const defaultPurpose =
      options.manifestMaskable === true ? "maskable" : "any";

    properties.icons = icons.map((iconOptions) => {
      const { width, height } = iconOptions.sizes[0];

      return {
        src: this.cacheBusting(relativeTo(basePath, iconOptions.name)),
        sizes: `${width}x${height}`,
        type: "image/png",
        purpose:
          iconOptions.purpose ?? (width === 512 ? "any" : defaultPurpose), // 自动添加 any 以排除至少需要一个 any 的警告
      };
    });

    if (Array.isArray(options.shortcuts) && options.shortcuts.length > 0) {
      properties.shortcuts = this.manifestShortcuts(basePath);
    }

    // 添加 screenshots 属性
    if (Array.isArray(options.screenshots) && options.screenshots.length > 0) {
      properties.screenshots = await this.manifestScreenshots(basePath);
    }

    return {
      name: this.manifestFileName(),
      contents: JSON.stringify(properties, null, 2),
    };
  }

  private manifestShortcuts(basePath: string): Shortcut[] {
    return this.options.shortcuts
      .map((shortcut, index) => {
        if (!shortcut.name || !shortcut.url) return null; // skip if required name or url missing
        return {
          name: shortcut.name,
          short_name: shortcut.short_name || shortcut.name, // fallback to name
          description: shortcut.description, // optional
          url: shortcut.url,
          icons: shortcut.icon
            ? Object.entries(SHORTCUT_ICONS_OPTIONS).map(
                ([shortcutName, option]) => {
                  const { width, height } = option.sizes[0];
                  return {
                    src: this.cacheBusting(
                      relativeTo(
                        basePath,
                        `shortcut${index + 1}-${shortcutName}`,
                      ),
                    ),
                    sizes: `${width}x${height}`,
                    type: "image/png",
                  };
                },
              )
            : undefined,
        };
      })
      .filter((x) => x !== null);
  }

  private async manifestScreenshots(basePath: string): Promise<Screenshot[]> {
    const screenshots = await Promise.all(
      this.options.screenshots.map(async (screenshot, index) => {
        const { form_factor, label, platform, image, format } = screenshot;

        try {
          // 获取图片的宽高
          const screenshotSourceset = await sourceImages(image);
          if (screenshotSourceset.length === 0) {
            throw new Error("No valid source images found");
          }
          const { width, height } = screenshotSourceset[0].metadata;

          // 根据 width 动态生成 form_factor，如果没有指定则自动推断
          const calculatedFormFactor =
            form_factor || (width < 720 ? "narrow" : "wide");

          const prefix = platform ? `${platform}-` : "";

          const screenshotImageSrc = this.cacheBusting(
            relativeTo(
              basePath,
              // prettier-ignore
              `${prefix}screenshots${index + 1}-${width}x${height}.${format || "webp"}`,
            ),
          );

          return {
            src: screenshotImageSrc,
            sizes: `${width}x${height}`,
            type: `image/${format || "webp"}`,
            form_factor: calculatedFormFactor,
            label,
            platform,
          };
        } catch (error) {
          console.error(`Error processing screenshot ${index + 1}:`, error);
          return null;
        }
      }),
    );

    return screenshots.filter((screenshot) => screenshot !== null);
  }
}
