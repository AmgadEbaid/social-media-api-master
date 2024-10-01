import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { users } from './user.entity';
import { privateEncrypt } from 'crypto';
import { Repository } from 'typeorm';
import { createUser } from './dtos/create.user.dto';
import { oauthUser } from './dtos/oauth.user.dto';
@Injectable()
export class userService {
  constructor(
    @InjectRepository(users) private userRepository: Repository<users>,
  ) {}

  async findone(id: string) {
    if (!id) return;

    const user = this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) throw new NotFoundException('not found');
    return user;
  }

  async create(userbody: createUser) {
    const user = await this.userRepository.create(userbody);
    user.provider = 'local';
    await this.userRepository.save(user);
    return user;
  }
  async CreateOauthUser(oauthUser: oauthUser) {
    const user = await this.userRepository.create(oauthUser);
    user.provider = oauthUser.provider;
    user.password = null;
    await this.userRepository.save(user);
    return user;
  }
  async find(email: string) {
    const users = this.userRepository.find({ where: { email: email } });

    return users;
  }
  async findAuthor(id: string) {
    const user = this.userRepository.findOne({
      select: {
        diplayname: true,
        email: true,
        id: true,
        image: true,
        IsAdmin: true,
      },
      where: { id: id },
    });

    return user;
  }
}
