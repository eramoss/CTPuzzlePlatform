import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post } from '@nestjs/common';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
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

    @Get('byId/:id')
    getUserById(@Param('id') id: number):Promise<User> {
        return this.userService.getById(id);
    }

    @Post('updatePassword')
    updatePassword(@Body() updatePasswordInfo: { hash: string, newPassword: string }): Promise<any> {
        return this.userService.updatePassword(updatePasswordInfo);
    }

    @Post('paginate')
    paginate(@Body() pageRequest: PageRequest): Promise<PageResponse<User>> {
        return this.userService.paginate(pageRequest);
    }

    @Delete('/softDelete/:id')
    softDelete(@Param('id') id: number): Promise<DeleteResult> {
        return this.userService.softDeleteById(id);
    }

    @Get('/restore/:id')
    restore(@Param('id') id: number): Promise<UpdateResult> {
        return this.userService.restore(id);
    }

}
