import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from 'src/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async validateUser({ username, password }: AuthPayloadDto) {
    const findUser = await this.usersRepository.findOne({
      where: { username, active: 1 },
    });
    if (!findUser) throw new UnauthorizedException('Tài khoản không tồn tại!');
    const isPasswordValid =
      findUser.password === password ||
      (await bcrypt.compare(password, findUser.password));
    if (!isPasswordValid) throw new UnauthorizedException('Sai mật khẩu!');
    const { password: _, ...user } = findUser;
    const accessToken = this.jwtService.sign(
      { id: user.id, username: user.username },
      { expiresIn: '100m' },
    );
    const refreshToken = this.jwtService.sign(
      { id: user.id },
      { expiresIn: '7d' },
    );
    await this.usersRepository.update(user.id, { refreshToken });

    return { accessToken, refreshToken };
  }
}
