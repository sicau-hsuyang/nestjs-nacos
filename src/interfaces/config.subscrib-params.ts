import { NacosConfigGetItemParams } from "./config.get-item-params";

export interface NacosConfigSubscribeParams extends NacosConfigGetItemParams {
  /**
   * 监听变更的函数
   * @param config
   * @returns
   */
  handler: (config: string, prevConfig: string | null) => void;
}
