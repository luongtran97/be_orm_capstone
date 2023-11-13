import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImgService } from './img.service';
import { hinh_anh, luu_anh } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { hinh_id, luu_hinhApi, tao_hinhApi } from 'src/user/entities/interface';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

class upLoadImg {
  @ApiProperty({ type: String, format: 'binary' })
  img: any;

  @ApiProperty()
  ten_hinh: string;

  @ApiProperty()
  mo_ta: string;

}

class delImg {
  @ApiProperty()
  hinh_id: number;
}
class create {
  @ApiProperty()
  ten_hinh: string;

  @ApiProperty()
  mo_ta: string;
}

class saveImg {
  @ApiProperty()
  hinh_id: number;
}

@ApiTags('img')
@Controller('img')
export class ImgController {
  constructor(private readonly imgService: ImgService) {}

  // api lấy hình ảnh
  @Get('/getAllImg')
  @HttpCode(200)
  getAllImg(): Promise<hinh_anh[]> {
    return this.imgService.getImg();
  }

  // api lấy hình ảnh đã tạo theo id hình
  @Get('/getImgById/:id')
  @HttpCode(200)
  getImgById(@Param('id') id: number, @Res() res) {
    return this.imgService.getImgById(+id, res);
  }

  // api lấy hình ảnh đã lưu theo id người dùng
  @Get('/getSavedImgByIdUser/:idUser')
  @HttpCode(200)
  getSavedImgById(@Param('idUser') id: number, @Res() res) {
    return this.imgService.getSavedImgById(+id, res);
  }

  // api tìm kiếm theo tên hình ảnh
  @Get('/getImgByName/:name')
  @HttpCode(200)
  getImgByName(@Param('name') name: string, @Res() res) {
    return this.imgService.getImgByName(name, res);
  }

  // api xóa ảnh theo id
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delImgCreated')
  @HttpCode(200)
  delImgCreatedByIdImg(@Body() body: delImg, @Res() res) {
    return this.imgService.delImgCreatedByIdImg(body, res);
  }

  // api lưu ảnh
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/saveImg')
  @HttpCode(201)
  saveImg(@Headers('token') token: string, @Body() body: saveImg, @Res() res) {
    return this.imgService.saveImg(body, token, res);
  }

  // api tạo ảnh
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    type: upLoadImg,
  })
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, callback) => {
          callback(null, new Date().getTime() + '_' + file.originalname);
        },
      }),
    }),
  )
  @Post('/createImg')
  @HttpCode(201)
  createImg(
    @Body() body:upLoadImg,
    @UploadedFile() file: Express.Multer.File,
    @Headers('token') token: string,
    @Res() res,
  ) {
    return this.imgService.createImg(token, file, res,body);
  }
}
