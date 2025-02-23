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
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Body() authPayload: AuthPayloadDto) {
    const token = await this.authService.validateUser(authPayload);

    return {
      status: 201,
      token,
    };
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async status(@Req() req: any) {
    try {
      const userId = req.user.id;
      const user = await this.usersService.findUserById(userId);

      if (!user) {
        throw new UnauthorizedException('Người dùng không tồn tại!');
      }

      return {
        status: 200,
        user,
        about: req.user,
      };
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn!');
    }
  }
}
