import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { EmailRegisterDto } from './dto/email-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.user({ email });

    if (!user) return null;

    if (!bcrypt.compare(pass, user?.password)) return null;

    const { password, ...result } = user;

    return result;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, roles: user.roles };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: EmailRegisterDto) {
    return this.userService.createUser({
      email: data.email,
      name: data.name,
      password: data.password,
    });
  }
}
