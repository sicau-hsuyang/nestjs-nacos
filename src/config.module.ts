import { DynamicModule } from "@nestjs/common";
import { NacosConfigService } from "./config.service";
import { NacosConfigOptions } from "./interfaces/config.options";
import { NACOS_CONFIG_OPTIONS } from "./config.constants";

export class NacosConfigModule {
  static register(options: NacosConfigOptions): DynamicModule {
    return {
      module: NacosConfigModule,
      providers: [
        NacosConfigService,
        {
          provide: NACOS_CONFIG_OPTIONS,
          useValue: options,
        },
      ],
      exports: [NacosConfigService],
    };
  }
}

export * from "./config.constants";
export * from "./config.service";
