import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS, adminUser } from './constants';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const admin = await this.user({
      email: adminUser.email,
    });

    if (admin) return;

    await this.createUser({
      email: adminUser.email,
      password: adminUser.password,
      roles: ['ADMIN'],
    });
  }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async count(params: { where?: Prisma.UserWhereInput }): Promise<number> {
    const { where } = params;
    return this.prisma.user.count({ where });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.user({
      email: data.email,
    });

    if (user) throw new BadRequestException('User already exists');

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    return this.prisma.user.create({
      data: {
        ...data,
        password: passwordHash,
      },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;

    const user = await this.user(where);

    if (!user) throw new BadRequestException('User not found');

    let passwordHash = '';

    if (data.password) {
      passwordHash = await bcrypt.hash(data.password as string, SALT_ROUNDS);
    }

    return this.prisma.user.update({
      data: {
        ...data,
        ...(passwordHash ? { password: passwordHash } : null),
      },
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.user(where);

    if (!user) throw new BadRequestException('User not found');

    return this.prisma.user.delete({
      where,
    });
  }
}
