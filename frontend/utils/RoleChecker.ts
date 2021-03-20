import User from '~/types/User';

export default class RoleChecker {

    userHasSomeOfThisRoles(userArg: any, rolesToCheck: string[]) {
        let user = Object.assign(new User(), userArg);
        let has = false;
        if (user) {
            let userRoles = user.roles;
            if (userRoles.length) {
                userRoles.forEach((userRole: string) => {
                    if (rolesToCheck.indexOf(userRole) > -1) {
                        has = true;
                    }
                });
            }
        }
        return has;
    }
}