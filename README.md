# Description

the nacos integration in nestjs

# Installation

```bash
$ npm i --save nestjs-nacos
```

# Usage

register config module before use

```ts
import { NacosConfigModule } from "nestjs-nacos";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    NacosConfigModule.register({
      url: "xxx",
      // the namesapce is optional
      namespace: "xxx",
      // the timeout is optional, default 30000ms
      timeout: 4000,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

import service in your project

```ts
import { NacosConfigService } from "nestjs-nacos";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  constructor(protected nacosConfigService: NacosConfigService) {
    this.nacosConfigService.subscribeKeyItem({
      dataId: "oss-config.development.json",
      // the group is optional
      group: "DEFAULT_GROUP",
      handler: (config: string) => {
        console.log(config);
      },
    });
  }

  getHello() {
    return this.nacosConfigService.getKeyItemConfig({
      dataId: "oss-config.development.json",
      // the group is optional
      group: "DEFAULT_GROUP",
    });
  }
}
```

# API

initialize module options;

```ts
interface NacosConfigOptions {
  /**
   * nacos server address is required
   */
  url: string;
  /**
   * nacos gets the remote data timeout time
   */
  timeout?: number;
  /**
   * the namespace is optional
   */
  namespace?: string;
}
```

get config item or subscribe change

```ts
interface NacosConfigService {
  subscribeKeyItem({ dataId, group, handler }: NacosConfigSubscribeParams): void;
  getKeyItemConfig({ dataId, group }: NacosConfigGetItemParams): Promise<string>;
}
```
