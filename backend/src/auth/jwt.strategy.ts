import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "./constants";

export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: jwtConstants.secret,
            passReqToCallback: true
        })
    }

    async validate(req: Request, payload: any): Promise<any> {
        return {
            userId: payload.sub,
            username: payload.username,
            name: payload.name,
            researchGroup: payload.researchGroup,
            roles: payload.roles
        }
    }

}
