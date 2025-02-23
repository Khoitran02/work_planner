import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { UsersDto } from '../dto/users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async findUserById(id: number) {
    const findUser = await this.usersRepository.findOne({
      select: [
        'id',
        'username',
        'email',
        'hoTen',
        'active',
        'create_at',
        'update_at',
        'update_userid',
        'delete_at',
        'delete_userid',
      ],
      where: { id },
    });
    return findUser;
  }

  async findUser({ username }: UsersDto) {
    const findUser = await this.usersRepository.findOne({
      where: { username },
    });
    return findUser ? findUser.username : null;
  }

  async findAll() {
    return await this.usersRepository.find({
      select: [
        'id',
        'username',
        'email',
        'hoTen',
        'active',
        'create_at',
        'update_at',
        'update_userid',
        'delete_at',
        'delete_userid',
      ],
      where: { active: 1 },
    });
  }

  async createUser(userDto: UsersDto) {
    const { username, password, hoTen, email } = userDto;
    const findUser = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .orWhere('user.email = :email', { email })
      .getOne();
    if (findUser) {
      if (findUser.username === username) return 'Username_already_exists';
      if (findUser.email === email) return 'Email_already_exists';
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
      hoTen,
      email,
      phanquyen: '0',
      create_at: new Date(),
    });

    return await this.usersRepository.save(newUser);
  }

  async updateUser(
    id: number,
    userDto: UsersDto,
    update_userid: number,
    update_userrole: string,
  ) {
    const { username, hoTen, email } = userDto;

    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    if (update_userrole === '1' || id === user.id) {
      const updateResult = await this.usersRepository.update(
        { id },
        { username, hoTen, email, update_at: new Date(), update_userid },
      );

      if (updateResult.affected === 0) {
        return { status: 400 };
      }
      const dataUser_update = await this.usersRepository.findOne({
        where: { id },
      });
      const { password, phanquyen, ...user_upadte } = dataUser_update;

      return {
        status: 200,
        data: user_upadte,
      };
    } else return { status: 409, data: null };
  }

  async updatePassword(userDto: UsersDto) {
    const user = await this.usersRepository.findOne({
      where: { email: userDto.email },
    });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    const updateResult = await this.usersRepository.update(
      { id: user.id },
      { password: userDto.password },
    );

    if (updateResult.affected === 0) {
      return { status: 400 };
    }

    return { status: 200 };
  }

  async deleteUser(id: number, delete_userid: number) {
    const user = await this.usersRepository.findOne({
      where: { id, active: 1 },
    });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    const updateResult = await this.usersRepository.update(
      { id },
      { active: 0, delete_at: new Date(), delete_userid },
    );
    if (updateResult.affected === 0) {
      return { status: 400 };
    }
    return { status: 200 };
  }
}
