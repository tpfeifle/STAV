import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useFactory: () => {
        const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
        return new ConfigService(`${env}.env`);
      },
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
