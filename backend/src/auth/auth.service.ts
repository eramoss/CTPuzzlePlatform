import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);
        if (user && user.password === password) {
            const { password, ...result } = user
            return result
        }
        return null
    }

    async login(user: User) {
        const payload = {
            username: user.email,
            sub: user.id,
            name: user.name,
            researchGroup: user.researchGroup,
            roles: user.roles
        }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    async logout(user: User) {
        //...
    }

}
