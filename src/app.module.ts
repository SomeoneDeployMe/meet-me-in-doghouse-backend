import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Event } from './modules/events/event.entity';
import { EventsModule } from './modules/events/events.module';
import { User } from './entities/user/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfigLoader, ConfigProps } from './config/app-config-loader';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfigLoader] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigProps>) => ({
        type: 'postgres',
        host: configService.get('db.host'),
        port: configService.get('db.port'),
        username: configService.get('db.user'),
        password: configService.get('db.password'),
        database: configService.get('db.name'),
        schema: configService.get('db.schema'),
        synchronize: configService.get('db.sync'),
        entities: [Event, User],
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigProps>) => ({
        transport: {
          host: configService.get('mailer.host'),
          port: configService.get('mailer.port'),
          secure: false,
          auth: {
            user: configService.get('mailer.user'),
            pass: configService.get('mailer.password'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@mmid>',
        },
      }),
    }),
    EventsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
