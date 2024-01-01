import { Inject } from "@nestjs/common";
import { NacosConfigClient } from "nacos";
import { NacosConfigOptions } from "./interfaces/config.options";
import { NACOS_CONFIG_OPTIONS } from "./config.constants";
import { NacosConfigSubscribeParams } from "./interfaces/config.subscrib-params";
import { NacosConfigGetItemParams } from "./interfaces/config.get-item-params";

export class NacosConfigService {
  private client: NacosConfigClient;

  private map: Map<string, string> = new Map();

  public get nacosClient() {
    return this.client;
  }

  private timeout = 0;

  constructor(@Inject(NACOS_CONFIG_OPTIONS) protected readonly configOptions: NacosConfigOptions) {
    const timeout = this.configOptions.timeout || 3000;
    this.client = new NacosConfigClient({
      serverAddr: this.configOptions.url,
      namespace: this.configOptions.namespace,
      // 默认30000
      requestTimeout: timeout,
    });
    this.timeout = timeout;
  }

  private timeoutTrigger() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("connect nacos service timeout"));
      }, this.timeout);
    });
  }

  /**
   * 监听nacos的变更
   * @param subscribeDetail { NacosConfigSubscribeParams }
   */
  public subscribeKeyItem({ dataId, group = "DEFAULT_GROUP", handler }: NacosConfigSubscribeParams) {
    this.client.subscribe({ dataId, group }, (config: string) => {
      const prevConfig = this.map.get(dataId) || null;
      handler(config, prevConfig);
      this.map.set(dataId, config);
    });
  }

  /**
   * 获取配置
   * @param item {NacosConfigGetItemParams}
   * @returns
   */
  public async getKeyItemConfig({ dataId, group = "DEFAULT_GROUP" }: NacosConfigGetItemParams): Promise<string> {
    try {
      const config = (await Promise.race([this.client.getConfig(dataId, group), this.timeoutTrigger()])) as string;
      return config;
    } catch (exp) {
      throw new Error("初始化nacos配置解析失败，详细信息" + exp.message || "");
    }
  }
}
