import { FaviconOptions, NamedIconOptions } from "../config/defaults";
import { opaqueIcon } from "../config/icons";
import { FaviconHtmlElement } from "../index";
import { Platform, uniformIconOptions } from "./base";

const ICONS_OPTIONS: NamedIconOptions[] = [
  { name: "safari-pinned-tab.svg", ...opaqueIcon(1024) },
];

export class SafariPlatform extends Platform {
  constructor(options: FaviconOptions) {
    super(
      options,
      uniformIconOptions(options, options.icons.safari, ICONS_OPTIONS),
    );
  }

  override async createHtml(): Promise<FaviconHtmlElement[]> {
    return this.iconOptions.map(({ name, ...options }) => {
      return `<link rel="mask-icon" href="${this.cacheBusting(this.relative(name))}" color="${this.options.theme_color}">`
    });
  }
}
