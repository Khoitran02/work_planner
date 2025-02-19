import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(username: string, password: string) {
    const user = await this.authService.validateUser({ username, password });
    if (!user)
      throw new UnauthorizedException(
        'Thông tin đăng nhập không hợp lệ! Sai username hoặc mật khẩu!',
      );
    return user;
  }
}
