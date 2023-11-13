import {
  Controller,
  Get,
  Body,
  HttpCode,
  Param,
  Post,
  Res,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { BinhLuanService } from './binh_luan.service';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

class bodyType {
  @ApiProperty()
  hinh_id: number;

  @ApiProperty()
  noi_dung: string;
}

@ApiTags('comment')
@Controller('comment')
export class BinhLuanController {
  constructor(private readonly binhLuanService: BinhLuanService) {}

  // lấy bình luận theo thông id hình
  @Get('/getCommentById/:idHinh')
  getComment(@Param('idHinh') idHinh: number, @Res() res) {
    return this.binhLuanService.getComment(+idHinh, res);
  }

  // bình luận
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/postComment')
  @HttpCode(201)
  postComment(
    @Body() body: bodyType,
    @Headers('token') token: string,
    @Res() res,
  ) {
    return this.binhLuanService.postComment(token, res, body);
  }
}
