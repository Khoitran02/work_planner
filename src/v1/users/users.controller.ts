import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
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
    return {
      status: 200,
      data: users,
    };
  }

  @Post('create_user')
  async CreateUser(@Body() userDto: UsersDto) {
    const user = await this.usersService.createUser(userDto);
    if (user === 'User_already_exists')
      throw new ConflictException('Username đã tồn tại trên hệ thống!');
    return {
      status: 201,
      data: user,
    };
  }

  @Patch('update_user/:id')
  @UseGuards(JwtAuthGuard, OnlyOwnerGuard, RoleGuard)
  @Roles('1', '2')
  async updateUser(
    @Param('id') id: number,
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
    else throw new ConflictException('User không có quyền thực hiện thao tác!');
  }
}
