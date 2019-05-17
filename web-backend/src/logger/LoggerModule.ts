import { Module } from '@nestjs/common';
import { FileLogger } from './file-logger';

@Module({
  providers: [FileLogger],
  exports: [FileLogger],
})
export class LoggerModule {}
