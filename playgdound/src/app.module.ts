import { NacosConfigModule } from './../../dist/index';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    NacosConfigModule.register({
      url: '10.100.48.172:8848',
      namespace: 'act-bff',
      timeout: 4000,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
