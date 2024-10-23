// https://developer.mozilla.org/en-US/docs/Web/Manifest/screenshots
// 设备平台标识符
export type DevicePlatformIdentifiers =
  | "android"
  | "chromeos"
  | "ipados"
  | "ios"
  | "kaios"
  | "macos"
  | "windows"
  | "xbox"
  | (string & NonNullable<unknown>);

// 分发平台标识符
export type DistributionPlatformIdentifiers =
  | "chrome_web_store"
  | "itunes"
  | "microsoft-inbox"
  | "microsoft-store"
  | "play"
  | (string & NonNullable<unknown>);

export type AppCategory =
  | "beauty"
  | "books"
  | "books & reference"
  | "business"
  | "cars"
  | "dating"
  | "design"
  | "developer"
  | "developer tools"
  | "development"
  | "education"
  | "entertainment"
  | "events"
  | "fashion"
  | "finance"
  | "fitness"
  | "food"
  | "fundraising"
  | "games"
  | "government"
  | "graphics"
  | "graphics & design"
  | "health"
  | "health & fitness"
  | "kids"
  | "lifestyle"
  | "magazines"
  | "medical"
  | "multimedia"
  | "multimedia design"
  | "music"
  | "navigation"
  | "network"
  | "networking"
  | "news"
  | "parenting"
  | "personalization"
  | "pets"
  | "photo"
  | "photo & video"
  | "politics"
  | "productivity"
  | "reference"
  | "security"
  | "shopping"
  | "social"
  | "social networking"
  | "sports"
  | "transportation"
  | "travel"
  | "utilities"
  | "video"
  | "weather"
  | (string & NonNullable<unknown>);

export type Display = "fullscreen" | "standalone" | "minimal-ui" | "browser";

// https://github.com/w3c/manifest/wiki/Platforms
export type Platforms =
  | "android"
  | "app_store"
  | "chrome_web_store"
  | "chromeos_play"
  | "f-droid"
  | "huawei"
  | "play"
  | "windows"
  | "amazon"
  | "tizen"
  | "webapp"
  | (string & NonNullable<unknown>);

export { FileHandler } from "./FileHandler";
export { ShareTarget } from "./ShareTarget";
export { ProtocolHandler } from "./ProtocolHandler";
