export interface NacosConfigOptions {
  /**
   * 超时时间
   */
  timeout?: number;
  /**
   * 命名空间
   */
  namespace?: string;
  /**
   * nacos的服务器地址
   */
  url: string;
}
