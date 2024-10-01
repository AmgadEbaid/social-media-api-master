import {
  Controller,
  Get,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { userService } from './users.service';
import { createUser } from './dtos/create.user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class userscontroler {
  constructor(private userservice: userService) {}
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('createuser')
  async create(@Body() user: createUser) {
    return await this.userservice.create(user);
  }

  @Get('/:id')
  findone(@Param('id') id: string) {
    return this.userservice.findAuthor(id);
  }
}
