import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsEntity } from 'src/entities/groups.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupsEntity])],

  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
