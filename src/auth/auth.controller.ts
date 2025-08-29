import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GetUser } from './decorators/get-user.decorator';
import { Auth } from './decorators/auth.decorator';
import { Role, User as UserModel } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('/status/:id')
  status(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.getStatus(id);
  }

  @Get('private')
  @Auth(Role.STUDENT, Role.TEACHER)
  testingPrivateRoute2(@GetUser() user: Partial<UserModel>) {
    return { user };
  }
}
