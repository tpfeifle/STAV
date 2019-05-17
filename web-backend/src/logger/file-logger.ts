import { Logger } from '@nestjs/common';
import * as fs from 'fs';

export class FileLogger extends Logger {
  private errorStream: fs.WriteStream = fs.createWriteStream('error.txt', {
    flags: 'a',
  });
  private logStream: fs.WriteStream = fs.createWriteStream('log.txt', {
    flags: 'a',
  });
  error(message: any, trace?: string, context?: string): void {
    this.errorStream.write(`Message: ${message}\nTrace: ${trace}\nContext: ${context}\n`);
    super.error(message, trace, context);
  }
  warn(message: any, context?: string): void {
    this.logStream.write(`Message: ${message}\nContext: ${context}\n`);
    super.warn(message, context);
  }
  log(message: any, context?: string): void {
    this.logStream.write(`Message: ${message}\nContext: ${context}\n`);
    super.log(message, context);
  }
}
