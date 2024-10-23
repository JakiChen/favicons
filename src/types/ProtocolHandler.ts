// 定义允许的协议名称
type ProtocolName =
  | "web+example"
  | "web+jngl"
  | "web+jnglstore"
  | "web+service"
  | "web+app";

// 定义 ProtocolHandler 接口
export interface ProtocolHandler {
  protocol: ProtocolName;
  url: string;
}
