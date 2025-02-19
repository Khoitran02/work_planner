import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthPayloadDto } from '../dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './/guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Body() authPayload: AuthPayloadDto) {
    const token = await this.authService.validateUser(authPayload);

    return {
      status: 201,
      access_token: token,
    };
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    try {
      return {
        status: 200,
        user: req.user,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại!',
      );
    }
  }
}
