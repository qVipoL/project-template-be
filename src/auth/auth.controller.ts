import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { EmailRegisterDto } from './dto/email-register.dto';
import { UserService } from 'src/user/user.service';
import { HasRoles } from './decorators/has-roles.decorator';

@ApiTags('Auth (Public)')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'admin@admin.com',
        },
        password: {
          type: 'string',
          example: 'admin',
        },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() data: EmailRegisterDto) {
    return this.authService.register(data);
  }

  @HasRoles()
  @Get('me')
  async me(@Request() req) {
    const user = await this.userService.user({ id: req.user.id });

    if (!user) return new NotFoundException('User not found');

    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      avatar: user.avatar,
    };
  }
}
