import { Injectable, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, binh_luan } from '@prisma/client';
import { decoToken } from 'src/config/jwt';
import { decodeTokenType } from 'src/user/entities/interface';

@Injectable()
export class BinhLuanService {
  prisma = new PrismaClient();
  // lấy bình luận theo thông id hình

  async getComment(idHinh, res) {
    let data: binh_luan[] = await this.prisma.binh_luan.findMany({
      where: {
        hinh_id: idHinh,
      },
      include: {
        nguoi_dung: {
          select: {
            hoTen: true,
            anh_dai_dien: true,
          },
        },
      },
    });
    res.send(data);
  }

  // gửi bình luận
  async postComment(token, res, body) {
    let decode: decodeTokenType = decoToken(token);

    const { nguoi_dung_id } = decode.data;

    const { hinh_id, noi_dung } = body;

    let data = {
      ngay_binh_luan: new Date(),
      nguoi_dung_id,
      hinh_id,
      noi_dung,
    };

    let response = await this.prisma.binh_luan.create({
      data: data,
      include: {
        nguoi_dung: {
          select: {
            anh_dai_dien: true,
            hoTen: true,
          },
        },
      },
    });
    res.send(response);
  }
}
