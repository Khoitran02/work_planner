import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { GroupsDto } from '../dto/groups.dto';

@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllGroups() {
    const groups = await this.groupsService.getAllGroups();
    if (groups) {
      return {
        status: 200,
        message: 'Lấy danh sách nhóm thành công!',
        data: groups,
      };
    } else throw new BadRequestException('Thao tác thất bại!');
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findOneGroups(@Query('groupname') groupname: string) {
    const group = await this.groupsService.findOneGroups(groupname);
    if (group) {
      return {
        status: 200,
        message: 'Lấy thông tin nhóm thành công!',
        data: group,
      };
    } else throw new BadRequestException('Thao tác thất bại!');
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createGroup(@Body() groupsDto: GroupsDto, @Req() req: any) {
    const create_userid = req.user.id;

    const group = await this.groupsService.createGroup(
      create_userid,
      groupsDto,
    );
    if (group) {
      return {
        status: 200,
        message: 'Thêm nhóm thành công!',
        data: group,
      };
    } else throw new BadRequestException('Thao tác thất bại!');
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard)
  async updateGroup(
    @Query('groupid') groupid: number,
    @Body() groupsDto: GroupsDto,
    @Req() req: any,
  ) {
    const update_userid = req.user.id;

    const group = await this.groupsService.updateGroup(
      groupid,
      groupsDto,
      update_userid,
    );
    if (group) {
      return {
        status: 200,
        message: 'Cập nhật nhóm thành công!',
        data: group,
      };
    } else throw new BadRequestException('Thao tác thất bại!');
  }

  @Patch('delete')
  @UseGuards(JwtAuthGuard)
  async deleteGroup(@Query('groupid') groupid: number, @Req() req: any) {
    const delete_userid = req.user.id;

    const group = await this.groupsService.deleteGroup(groupid, delete_userid);
    if (group) {
      return {
        group,
        message: 'Xoá nhóm thành công!',
      };
    } else throw new BadRequestException('Thao tác thất bại!');
  }
}
