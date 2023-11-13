import {
  Controller,
  Post,
  UploadedFile,
  Res,
  UseInterceptors,
  Body,
  HttpCode,
  Put,
  Get,
  Headers,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { nguoi_dung } from '@prisma/client';
import { userSignIn, userUpdateInfo } from './entities/interface';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

 class uploadAvatar {
  @ApiProperty({ type: String, format: 'binary' })
  avatar: any;
}

class signIn{
  @ApiProperty()
  taiKhoan: string;

  @ApiProperty()
  matKhau: string;
}

class signUpBody {
  @ApiProperty()
  hoTen: string;

  @ApiProperty()
  matKhau: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  taiKhoan: string;
}
class updateUserInfo {
  @ApiProperty()
  hoTen: string;

  @ApiProperty()
  matKhau: string;

  @ApiProperty()
  email: string;
}

// router
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // api đăng ký tài khoản
  @Post('/signUp')
  @HttpCode(201)
  signUp(@Body() body: signUpBody, @Res() res) {
    return this.userService.signUp(body, res);
  }

  // api lấy thông tin user
  @Get('/getUser/:id')
  getUser(@Param('id') id: number, @Res() res) {
    return this.userService.getUser(+id, res);
  }

  //api đăng nhập
  @Post('/signIn')
  @HttpCode(200)
  signIn(@Body() body: signIn, @Res() res) {
    return this.userService.signIn(body, res);
  }

  // api update thông tin cá nhân
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('/userUpdateInfo')
  @HttpCode(200)
  updateInfo(
    @Body() body: updateUserInfo,
    @Res() res,
    @Headers('token') token: string,
  ) {
    return this.userService.updateInfo(body, res, token);
  }

  // api upload avatar user
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: uploadAvatar,
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, callback) => {
          callback(null, new Date().getTime() + '_' + file.originalname);
        },
      }),
    }),
  )
  @Put('/uploadAvatar')
  @HttpCode(200)
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Headers('token') token: string,
    @Res() res,
  ) {
    return this.userService.uploadAvatar(file, token, res);
  }
}
