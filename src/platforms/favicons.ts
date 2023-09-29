import { FaviconHtmlElement } from "../index";
import { FaviconOptions, NamedIconOptions } from "../config/defaults";
import { transparentIcon, transparentIcons } from "../config/icons";
import { OptionalMixin, Platform, uniformIconOptions } from "./base";

const ICONS_OPTIONS: (NamedIconOptions & OptionalMixin)[] = [
  { name: "favicon.ico", ...transparentIcons(16, 24, 32, 48, 64) },
  { name: "favicon-dark.ico", ...transparentIcons(16, 24, 32, 48, 64) },
  { name: "favicon-16x16.png", ...transparentIcon(16) },
  { name: "favicon-16x16-dark.png", ...transparentIcon(16) },
  { name: "favicon-32x32.png", ...transparentIcon(32) },
  { name: "favicon-32x32-dark.png", ...transparentIcon(32) },
  { name: "favicon-48x48.png", ...transparentIcon(48) },
  { name: "favicon-48x48-dark.png", ...transparentIcon(48) },
  { name: "favicon.svg", ...transparentIcon(1024), optional: true }, // arbitrary size. if more than one svg source is given, the closest to this size will be picked.
  { name: "favicon-dark.svg", ...transparentIcon(1024), optional: true },
];

export class FaviconsPlatform extends Platform {
  constructor(options: FaviconOptions) {
    super(
      options,
      uniformIconOptions(options, options.icons.favicons, ICONS_OPTIONS),
    );
  }

  override async createHtml(): Promise<FaviconHtmlElement[]> {
    return this.iconOptions.map(({ name, ...options }) => {

      if (options.darkMode) {
        if (name.endsWith(".ico")) {
          // prettier-ignore
          if (!name.endsWith("-dark.ico")) {
            return `<link rel="icon" type="image/x-icon" href="${this.cacheBusting(this.relative(name))}" media="(prefers-color-scheme: light)">`
          } else {
            return `<link rel="icon" type="image/x-icon" href="${this.cacheBusting(this.relative(name))}" media="(prefers-color-scheme: dark)">`
          }

        } else if (name.endsWith(".svg")) {
          // prettier-ignore
          if (!name.endsWith("-dark.svg")) {
            return `<link rel="icon" type="image/svg+xml" href="${this.cacheBusting(this.relative(name))}" media="(prefers-color-scheme: light)">`;
          } else {
            return `<link rel="icon" type="image/svg+xml" href="${this.cacheBusting(this.relative(name))}" media="(prefers-color-scheme: dark)">`;
          }
        }

        const { width, height } = options.sizes[0];

        // prettier-ignore
        if (!name.endsWith("-dark.png")) {
          return `<link rel="icon" type="image/png" sizes="${width}x${height}" href="${this.cacheBusting(this.relative(name))}" media="(prefers-color-scheme: light)">`
        } else {
          return `<link rel="icon" type="image/png" sizes="${width}x${height}" href="${this.cacheBusting(this.relative(name))}" media="(prefers-color-scheme: dark)">`
        }

      } else {
        if (name.endsWith(".ico")) {
          // prettier-ignore
          return `<link rel="icon" type="image/x-icon" href="${this.cacheBusting(this.relative(name))}">`;
        } else if (name.endsWith(".svg")) {
          // prettier-ignore
          return `<link rel="icon" type="image/svg+xml" href="${this.cacheBusting(this.relative(name))}">`;
        }

        const { width, height } = options.sizes[0];

        // prettier-ignore
        return `<link rel="icon" type="image/png" sizes="${width}x${height}" href="${this.cacheBusting(this.relative(name))}">`;
      }
    });
  }
}
