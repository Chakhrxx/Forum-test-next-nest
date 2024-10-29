import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string; timestamp: string } {
    return {
      message: 'Hello World!',
      timestamp: new Date().toLocaleString('th-TH', {
        timeZone: 'Asia/Bangkok',
      }),
    };
  }
}
