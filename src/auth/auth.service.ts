import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { userService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { users } from 'src/users/user.entity';
import { randomBytes, scrypt, scryptSync } from 'crypto';
import { createUser } from 'src/users/dtos/create.user.dto';
import { oauthUser } from 'src/users/dtos/oauth.user.dto';

@Injectable()
export class authService {
  constructor(
    private userservice: userService,
    private jwtservice: JwtService,
  ) {}

  async login(user: users) {
    const expiresIn = 20 * 1000; // 1 hour in milliseconds
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + expiresIn);

    const payload = { username: user.diplayname, sub: user.id };
    return {
      username: user.diplayname,
      id: user.id,
      email: user.email,
      image: user.image,
      IsAdmin: user.IsAdmin,
      access_token: this.jwtservice.sign(payload, { expiresIn: '1m' }),
      refresh_token: this.jwtservice.sign(payload, { expiresIn: '7d' }),
      expiresIn: expirationDate,
    };
  }
  async refreshToken(user: users) {
    const expiresIn = 20 * 1000; // 1 hour in milliseconds
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + expiresIn);
    const payload = { username: user.diplayname, sub: user.id };
    return {
      access_token: this.jwtservice.sign(payload, { expiresIn: '5h' }),
      refresh_token: this.jwtservice.sign(payload, { expiresIn: '7d' }),
      expiresIn: expirationDate,
    };
  }

  async sinup(user: createUser) {
    const users = await this.userservice.find(user.email);
    if (users.length) {
      throw new BadRequestException('email is used');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scryptSync(
      user.password,
      salt,
      40,
    )) as unknown as Buffer;

    const ruslt = salt + '.' + hash.toString('hex');
    user.password = ruslt;
    return await this.userservice.create(user);
  }

  async sinin(email: string, password: string) {
    const [user] = await this.userservice.find(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }
    if(user.provider !== "local" ){
      throw new UnauthorizedException(`user is not a local user, try to login with: ${user.provider}`,user.provider)
    }
    const [salt, stordHash] = user.password.split('.');

    const hash = (await scryptSync(password, salt, 40)) as unknown as Buffer;

    if (stordHash == hash.toString('hex')) {
      return user;
    } else {
      throw new NotFoundException('bad password');
    }
  }



  async oauthLogin(oauthuser: oauthUser) {
    const [user] = await this.userservice.find(oauthuser.email);
    if (user) {
      return this.login(user);
    }
    const newOauthUser = await this.userservice.CreateOauthUser(oauthuser);
    return this.login(newOauthUser);
  }

}
