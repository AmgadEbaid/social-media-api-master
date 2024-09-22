import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(process.env.JWT_SECRET,"sfsdf")
    return "hello";
  }
}
