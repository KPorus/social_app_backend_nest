import { Controller, Get, HttpCode, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  @HttpCode(200)
  @Get('me')
  getMe(@GetUser() user) {
    return user;
  }

  @Patch('edit')
  async updateUser() {
    return;
  }
}
