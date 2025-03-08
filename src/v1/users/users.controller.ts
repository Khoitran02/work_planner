import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from './users.service';
import { UsersDto } from '../dto/users.dto';
import { OnlyOwnerGuard } from '../auth/guards/only_owner.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('1')
  async GetAllUser() {
    const users = await this.usersService.findAll();
    if (users) {
      return {
        status: 200,
        data: users,
      };
    } else throw new BadRequestException('Thao tác thất bại!');
  }

  @Post('create_user')
  async CreateUser(@Body() userDto: UsersDto) {
    const user = await this.usersService.createUser(userDto);
    if (user) {
      return {
        status: 201,
        data: user,
      };
    } else {
      throw new BadRequestException('Thao tác thất bại!');
    }
  }

  @Patch('update_user')
  @UseGuards(JwtAuthGuard, OnlyOwnerGuard, RoleGuard)
  async updateUser(
    @Query('id') id: number,
    @Body() userDto: UsersDto,
    @Req() req: any,
  ) {
    const update_userid = req.user.id;
    const update_userrole = req.user.phanquyen;
    const user = await this.usersService.updateUser(
      id,
      userDto,
      update_userid,
      update_userrole,
    );
    if (user.status === 200)
      return {
        status: 200,
        message: 'Cập nhật người dùng thành công!',
        data: user.data,
      };
    else if (user.status === 400) {
      throw new BadRequestException('Thao tác thất bại!');
    } else
      throw new ConflictException('User không có quyền thực hiện thao tác!');
  }

  @Patch('update_password')
  async updatePassword(@Body() userDto: UsersDto) {
    const user = await this.usersService.updatePassword(userDto);
    if (user.status === 200)
      return {
        status: 200,
        message: 'Cập nhật mật khẩu thành công!',
      };
    else throw new BadRequestException('Thao tác thất bại!');
  }

  @Patch('delete_user')
  @UseGuards(JwtAuthGuard, OnlyOwnerGuard, RoleGuard)
  async deleteUser(@Query('id') id: number, @Req() req: any) {
    const delete_userid = req.user.id;
    const user = await this.usersService.deleteUser(id, delete_userid);
    if (user.status === 200)
      return {
        status: 200,
        message: 'Xóa người dùng thành công!',
      };
    else throw new BadRequestException('Thao tác thất bại!');
  }
}
