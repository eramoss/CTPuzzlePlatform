import { Body, Controller, Get, HttpCode, Inject, Post } from '@nestjs/common';
import { User } from './user.entity'
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  constructor(private readonly userService: UsersService) { }

  @Post()
  register(@Body() user: User): Promise<User> {
    return this.userService.save(user)
  }

  @Post('validateConfirmationCode')
  validateConfirmationCode(@Body() validationInfo: { email: string, code: string }): Promise<boolean> {
    return this.userService.validateConfirmationCode(validationInfo);
  }

}
