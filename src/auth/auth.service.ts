import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '../integration/dto/users-service/register/RegisterUserDto';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    const isPasswordCorrect = await verify(user.password, password);

    if (isPasswordCorrect) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, userId: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: RegisterUserDto) {
    const existingUser = await this.usersService.findUserByEmail(user.email);

    if (existingUser) {
      throw new HttpException(
        `User ${user.email} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.usersService.createUser(user);
  }
}
