import { NacosConfigService } from './../../dist/config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(protected nacosConfigService: NacosConfigService) {}

  getHello() {
    return this.nacosConfigService.getConfig({
      dataId: 'oss-config.development.json',
    });
  }
}
