import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ImgModule } from './img/img.module';
import { BinhLuanModule } from './binh_luan/binh_luan.module';
import { JwtStrategy } from './strategy/strategy';
import { ConfigModule } from '@nestjs/config';




@Module({
  imports: [UserModule, ImgModule, BinhLuanModule, ConfigModule.forRoot({
    isGlobal:true
  }) ],
  controllers: [AppController],
  providers: [AppService,JwtStrategy],
})
export class AppModule {}
