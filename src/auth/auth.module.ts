import { Module } from '@nestjs/common';
import { userService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { authControler } from './auth.controler';
import { JwtService } from '@nestjs/jwt';
import { authService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { users } from 'src/users/user.entity';
import { JwtStrategy } from './stratiges/jwt.stratige';
import { LocalStrategy } from './stratiges/local.stratige';
import { jwtConstants } from './jwtconstant';
@Module({
  imports: [
    TypeOrmModule.forFeature([users]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2d' },
    }),
    UsersModule,
  ],
  controllers: [authControler],
  providers: [
    authService,
    userService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class authModule {}
