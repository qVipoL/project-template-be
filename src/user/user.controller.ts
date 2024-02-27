import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/auth/decorators/has-roles.decorator';
import { Response } from 'express';
import { exclude, excludeFromArray } from 'src/utils/helpers';
import { ParseOptionalIntPipe } from 'src/pipes/parse-optional-int.pipe';
import { Prisma, Role } from '@prisma/client';

@ApiTags('User (Protected)')
@HasRoles('ADMIN')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiQuery({ name: '_start', required: true, type: Number })
  @ApiQuery({ name: '_end', required: true, type: Number })
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  async findAll(
    @Res() response: Response,
    @Query('_start', ParseIntPipe) _start: number,
    @Query('_end', ParseIntPipe) _end: number,
    @Query('id', ParseOptionalIntPipe) id?: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('roles') roles?: Role[] | Role,
  ) {
    const filters: Prisma.UserWhereInput = {
      id: id ? id : undefined,
      name: name ? { contains: name } : undefined,
      email: email ? { contains: email } : undefined,
      roles: roles
        ? { hasEvery: Array.isArray(roles) ? roles : [roles] }
        : undefined,
    };

    const totalUsers = await this.userService.count({
      where: filters,
    });
    response.set('x-total-count', totalUsers.toString());

    const users = await this.userService.users({
      skip: _start,
      take: _end - _start,
      where: filters,
    });

    const result = excludeFromArray(users, ['password']);

    return response.json(result);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.user({ id });

    if (!user) throw new NotFoundException('User not found');

    return exclude(user, ['password']);
  }

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
    return this.userService.updateUser({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const { user } = req;

    if (user.id === id)
      throw new BadRequestException('You cannot delete yourself');

    return this.userService.deleteUser({ id });
  }
}
