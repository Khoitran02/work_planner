import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({
    name: 'USERNAME',
    type: 'varchar',
    nullable: false,
  })
  username: string;

  @Column({
    name: 'PASSWORD',
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    name: 'EMAIL',
    type: 'varchar',
    nullable: true,
  })
  email: string;

  @Column({ name: 'HOTEN', type: 'varchar', nullable: true })
  hoTen: string;

  @Column({
    name: 'PHANQUYEN',
    type: 'varchar',
    nullable: false,
  })
  phanquyen: string;

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
  @Column({
    name: 'REFESHTOKEN',
    type: 'varchar',
  })
  refreshToken: string;
}
