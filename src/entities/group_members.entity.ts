import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupsEntity } from './groups.entity';
import { UsersEntity } from './users.entity';

@Entity({ name: 'group_members' })
export class GroupsMemberEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @ManyToOne(() => GroupsEntity, (group) => group.members)
  @JoinColumn({ name: 'GROUPID' })
  group: GroupsEntity;

  @ManyToOne(() => UsersEntity, (user) => user.groups)
  @JoinColumn({ name: 'USERID' })
  user: UsersEntity;

  @Column({ name: 'ACTIVE', type: 'int', default: 1 })
  active: number;

  @Column({
    name: 'NGAY_TAO',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  create_at: Date;

  @Column({
    name: 'NGAY_UPDATE',
    type: 'timestamp',
    nullable: true,
  })
  update_at: Date;

  @Column({
    name: 'USER_UPDATE',
    type: 'int',
    nullable: true,
  })
  update_userid: number;

  @Column({
    name: 'NGAY_DELETE',
    type: 'timestamp',
    nullable: true,
  })
  delete_at: Date;

  @Column({
    name: 'USER_DEL',
    type: 'int',
    nullable: true,
  })
  delete_userid: number;
}
