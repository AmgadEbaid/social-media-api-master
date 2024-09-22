import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { authService } from '../auth.service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: authService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.sinin(email, password);

    // find local user with email and password
    // get local user id and find that user from the general user table 
    // and finally if user found return this user in the req params then handel it in the auth service 
    if (!user) {
      throw new UnauthorizedException();
    }
    // create a new user 

    return user;
  }
}
