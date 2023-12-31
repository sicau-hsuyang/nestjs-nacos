import { NacosConfigItemParams } from "./config.item-params";

export interface NacosConfigSubscribeParams extends NacosConfigItemParams {
  /**
   * 监听变更的函数
   * @param config
   * @returns
   */
  handler: (config: Record<PropertyKey, unknown>) => void;
}
