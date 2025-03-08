import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GroupsMemberEntity } from './group_members.entity';
@Entity({ name: 'groups' })
export class GroupsEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({
    name: 'GROUPNAME',
    type: 'varchar',
    nullable: false,
  })
  groupname: string;

  @OneToMany(() => GroupsMemberEntity, (grm) => grm.group)
  members: GroupsMemberEntity[];

  @Column({ name: 'ACTIVE', type: 'int', default: 1 })
  active: number;

  @Column({
    name: 'NGAY_TAO',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  create_at: Date;

  @Column({
    name: 'USER_CREATECREATE',
    type: 'int',
    nullable: true,
  })
  create_userid: number;

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
