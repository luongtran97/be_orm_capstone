import { Injectable } from '@nestjs/common';
import { PrismaClient, hinh_anh, luu_anh } from '@prisma/client';
import { decoToken } from 'src/config/jwt';
import {
  decodeTokenType,
  hinh_id,
  luu_hinhApi,
} from 'src/user/entities/interface';

@Injectable()
export class ImgService {
  prisma = new PrismaClient();
  // lấy hình ảnh
  async getImg(): Promise<hinh_anh[]> {
    let data: hinh_anh[] = await this.prisma.hinh_anh.findMany({
      include: {
        nguoi_dung: {
          select: {
            hoTen: true,
            email: true,
            taiKhoan: true,
            nguoi_dung_id: true,
          },
        },
      },
    });
    return data;
  }

  // lấy hình đẫ tạo theo id hình
  async getImgById(id, res) {
    let data: hinh_anh = await this.prisma.hinh_anh.findFirst({
      where: {
        hinh_id: id,
      },
      include: {
        nguoi_dung: {
          select: {
            hoTen: true,
            email: true,
            taiKhoan: true,
            nguoi_dung_id: true,
          },
        },
      },
    });
    res.send(data);
  }

  // lấy hình đã lưu theo id user
  async getSavedImgById(id, res) {
    let data: luu_anh[] = await this.prisma.luu_anh.findMany({
      where: {
        nguoi_dung_id: id,
      },
      include: {
        nguoi_dung: {
          select: {
            hoTen: true,
            email: true,
            taiKhoan: true,
            nguoi_dung_id: true,
          },
        },
      },
    });
    res.send(data);
  }

  // tìm kiếm hình theo tên
  async getImgByName(name: string, res) {
    let data: hinh_anh[] = await this.prisma.hinh_anh.findMany({
      where: {
        ten_hinh: {
          contains: name,
        },
      },
    });
    res.send(data);
  }

  //  xóa ảnh theo id hình
  async delImgCreatedByIdImg(body, res) {
    const { hinh_id } = body;
    try {
      const existingImg: hinh_id = await this.prisma.hinh_anh.findUnique({
        where: {
          hinh_id,
        },
      });
      if (existingImg) {
        await this.prisma.hinh_anh.delete({
          where: {
            hinh_id,
          },
        });
        res.send('Xóa thành công!!');
      } else {
        res.status(404).send('Không tìm thấy hình');
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // lưu ảnh
  async saveImg(body, token, res,) {
    const decode: decodeTokenType = decoToken(token);

    const { hinh_id } = body;

    const { nguoi_dung_id } = decode.data;

    const checkSavedImg = await this.prisma.luu_anh.findFirst({
      where: {
        hinh_id,
        AND: {
          nguoi_dung_id,
        },
      },
    });

    if (checkSavedImg) {
      const isImgSaved = await this.prisma.luu_anh.findFirst({
        where: {
          nguoi_dung_id,
          hinh_id,
          tinh_trang: true,
        },
      });

      if (isImgSaved) {
        try {
          const response = await this.prisma.luu_anh.update({
            data: { ...isImgSaved, tinh_trang: false },
            where: { luu_anh_id: checkSavedImg.luu_anh_id },
          });
          res.send(response);
        } catch (error) {
          res.status(500).send(error.message);
        }
      } else {
        try {
          const response = await this.prisma.luu_anh.update({
            data: { ...isImgSaved, tinh_trang: true },
            where: { luu_anh_id: checkSavedImg.luu_anh_id },
          });
          res.send(response);
        } catch (error) {
          res.status(500).send(error.message);
        }
      }
    } else {
      try {
        const response = await this.prisma.luu_anh.create({
          data: {
            nguoi_dung_id,
            hinh_id,
            tinh_trang: true,
            ngay_luu: new Date(),
          },
        });
        res.send(response);
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  }

  // tạo hình
  async createImg( token, file, res,body) {
    const decode: decodeTokenType = decoToken(token);
    const { ten_hinh, mo_ta } = body;
    const { nguoi_dung_id } = decode.data;
    const data = {
      ten_hinh,
      mo_ta,
      duong_dan: file.filename,
      nguoi_dung_id,
    };
    try {
      await this.prisma.hinh_anh.create({ data });
      res.send('thêm hình thành công');
    } catch (error) {
      res.send(error);
    }
  }
}
