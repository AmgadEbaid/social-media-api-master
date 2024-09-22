import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { authService } from './auth.service';
import { UseGuards } from '@nestjs/common/decorators';
import { users } from 'src/users/user.entity';
import { localAuthGard } from './gards/local.gard';
import { createUser } from 'src/users/dtos/create.user.dto';
import { JwtAuthGuard } from './gards/jwt.gard';
import { currentUser } from 'src/decorators/current-user.decorator';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { GoogleOAuthGuard } from './gards/google-oauth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class authControler {
  constructor(private authservice: authService) {}

  @Post('login')
  @UseGuards(localAuthGard)
  async login(@Request() req) {
    return this.authservice.login(req.user);
  }

  @Post('singup')
  async singup(@Body() User: createUser) {
    const user: users = await this.authservice.sinup(User);
    return this.authservice.login(user);
  }

  @Get('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@currentUser() user: users) {
    return this.authservice.refreshToken(user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getprofile(@currentUser() user: users) {
    return user;
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.authservice.googleLogin(req);
  }
}
