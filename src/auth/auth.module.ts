import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCred } from 'src/admin/entities/admin.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { AxiosClientModule } from 'src/axios-client/axios-client.module';
import { EmailModule } from 'src/email/email.module';
import { CacheManagerModule } from 'src/cache-manager/cache-manager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([AdminCred, Cliente]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    AxiosClientModule,
    EmailModule,
    CacheManagerModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
