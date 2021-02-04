import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import UserDto from './user.dto'

@Controller('users')
export class UsersController {

  @Get('/melancia')
  getMelancia(): string {
    return 'melancia';
  }


  @Post()
  @HttpCode(204)
  register(@Body() userDto: UserDto): UserDto {
    return userDto
  }

}
