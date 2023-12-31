import { Inject } from "@nestjs/common";
import { NacosConfigOptions } from "./interfaces/config.options";
import { NACOS_CONFIG_OPTIONS } from "./config.constants";
import { NacosConfigClient } from "nacos";
import { NacosConfigSubscribeParams } from "./interfaces/config.subscrib-params";
import { NacosConfigItemParams } from "./interfaces/config.item-params";

export class NacosConfigService {
  private client: NacosConfigClient;

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
  public subscribe({ dataId, group = "DEFAULT_GROUP", handler }: NacosConfigSubscribeParams) {
    this.client.subscribe({ dataId, group }, handler);
  }

  /**
   * 获取配置
   * @param item {NacosConfigItemParams}
   * @returns
   */
  public async getConfig({ dataId, group = "DEFAULT_GROUP" }: NacosConfigItemParams): Promise<string> {
    try {
      const config = (await Promise.race([this.client.getConfig(dataId, group), this.timeoutTrigger()])) as string;
      return config;
    } catch (exp) {
      throw new Error("初始化nacos配置解析失败，详细信息" + exp.message || "");
    }
  }
}
