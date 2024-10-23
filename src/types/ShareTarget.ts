// 定义分享参数的类型
interface ShareParams {
  title?: string;
  text?: string;
  url?: string;
  files?: FileParam[];
}

// 定义文件参数的类型
interface FileParam {
  name: string;
  accept: string;
}

// 定义支持的 enctype 类型
type Enctype =
  | "application/x-www-form-urlencoded"
  | "multipart/form-data"
  | "text/plain"
  | "application/json";

// 定义 share_target 接口
export interface ShareTarget {
  action: string;
  method: "POST" | "GET";
  enctype: Enctype;
  params: ShareParams;
}

// 示例: 创建 share_target 的对象
const shareTarget: ShareTarget = {
  action: "/share", // 处理分享的 URL
  method: "POST", // 使用 POST 方法
  enctype: "application/json", // 数据编码类型
  params: {
    title: "分享的标题",
    text: "分享的文本内容",
    url: "https://example.com", // 分享的 URL
    files: [
      {
        name: "file", // 文件参数的名称
        accept: "image/*", // 接受所有图像文件
      },
    ],
  },
};

// 使用示例: 在 manifest.webmanifest 中引入 share_target
const manifest = {
  name: "My PWA",
  short_name: "PWA",
  start_url: "/",
  display: "standalone",
  share_target: shareTarget, // 引入 share_target
};

// 你可以根据需要在其他地方使用 shareTarget 对象
console.log(manifest);
