import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user/user.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterUserDto } from '../integration/dto/users-service/register/RegisterUserDto';
import { argon2i, hash } from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  async createUser(user: RegisterUserDto) {
    const hashedPassword = await hash(user.password, { type: argon2i });

    const createdUser = this.usersRepository.create({
      email: user.email,
      password: hashedPassword,
    });

    await this.mailerService.sendMail({
      to: user.email,
      from: this.configService.get('mailer.user'),
      subject: 'Test message',
      text: 'welcome',
      html: '<a>GoGo</a>',
    });

    return this.usersRepository.save(createdUser);
  }
}
