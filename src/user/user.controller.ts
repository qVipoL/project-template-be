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
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/auth/decorators/has-roles.decorator';
import { Response } from 'express';
import { exclude, excludeFromArray } from 'src/utils/helpers';

@ApiTags('User (Protected)')
@HasRoles('ADMIN')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query('_start', ParseIntPipe) _start: number,
    @Query('_end', ParseIntPipe) _end: number,
    @Res() response: Response,
  ) {
    const totalUsers = await this.userService.count({});
    response.set('x-total-count', totalUsers.toString());

    const users = await this.userService.users({
      skip: _start,
      take: _end - _start,
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
