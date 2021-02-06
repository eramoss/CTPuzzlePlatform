import { Body, Controller, Get, HttpCode, Inject, Param, Post } from '@nestjs/common';
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

  @Post('sendPasswordRecoveryLink')
  sendPasswordRecoveryLink(@Body() data: { email: string }): Promise<any> {
    return this.userService.sendPasswordRecoveryLink(data.email);
  }

  @Get('validateRecoveryLink/:hash')
  validateRecoveryLink(@Param('hash') hash: string) {
    return this.userService.validateRecoveryLink(hash);
  }

  @Post('updatePassword')
  async updatePassword(@Body() updatePasswordInfo: { hash: string, newPassword: string }): Promise<any> {
    return this.userService.updatePassword(updatePasswordInfo);
  }

}
