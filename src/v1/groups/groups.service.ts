import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupsEntity } from 'src/entities/groups.entity';
import { Not, Repository } from 'typeorm';
import { GroupsDto } from '../dto/groups.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupsEntity)
    private groupsRepository: Repository<GroupsEntity>,
  ) {}

  async getAllGroups() {
    const group_data = await this.groupsRepository.find({
      select: [
        'id',
        'groupname',
        'active',
        'create_at',
        'create_userid',
        'update_at',
        'update_userid',
        'delete_at',
        'delete_userid',
      ],
      where: { active: 1 },
    });
    return group_data;
  }

  async findOneGroups(groupname: string) {
    const group = await this.groupsRepository.findOne({
      select: [
        'id',
        'groupname',
        'active',
        'create_at',
        'create_userid',
        'update_at',
        'update_userid',
        'delete_at',
        'delete_userid',
      ],
      where: { groupname, active: 1 },
    });
    if (!group) {
      throw new NotFoundException('Không tìm thấy nhóm!');
    }
    return group;
  }

  async createGroup(create_userid, groupsDto: GroupsDto) {
    const group = await this.groupsRepository.findOne({
      where: { groupname: groupsDto.groupname, active: 1 },
    });
    if (group) {
      throw new BadRequestException('Tên nhóm đã tồn tại!');
    }

    const newGroup = this.groupsRepository.create({
      groupname: groupsDto.groupname,
      active: 1,
      create_at: new Date(),
      create_userid,
    });
    return await this.groupsRepository.save(newGroup);
  }

  async updateGroup(
    groupid: number,
    groupsDto: GroupsDto,
    update_userid: number,
  ) {
    const group = await this.groupsRepository.findOne({
      where: {
        id: groupid,
        active: 1,
      },
    });
    if (!group) {
      throw new BadRequestException('Không tìm thấy nhóm!');
    }
    const duplicateGroup = await this.groupsRepository.findOne({
      where: {
        id: Not(groupid),
        groupname: groupsDto.groupname,
        active: 1,
      },
    });
    if (duplicateGroup) {
      throw new BadRequestException('Tên nhóm đã tồn tại!');
    }

    await this.groupsRepository.update(
      { id: groupid, active: 1 },
      {
        groupname: groupsDto.groupname,
        update_at: new Date(),
        update_userid: update_userid,
      },
    );
    const updatedGroup = await this.groupsRepository.findOne({
      where: { id: groupid, active: 1 },
    });

    return updatedGroup;
  }

  async deleteGroup(groupid: number, delete_userid: number) {
    const group = await this.groupsRepository.findOne({
      where: {
        id: groupid,
        active: 1,
      },
    });
    if (!group) {
      throw new BadRequestException('Không tìm thấy nhóm!');
    }
    await this.groupsRepository.update(
      { id: groupid, active: 1 },
      {
        active: 0,
        delete_at: new Date(),
        delete_userid: delete_userid,
      },
    );
    return { status: 200 };
  }
}
