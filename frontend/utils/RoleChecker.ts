import Vue from 'vue';

export default class RoleChecker {
    component: Vue;

    constructor(component: Vue) {
        this.component = component;
    }

    userHasRoles(...rolesList: string[]) {
        let user = this.component.$auth.user;
        let has = false;
        if (user) {
            let roles = user.roles as string[];
            if (roles) {
                if (roles.length) {
                    let count = 0;
                    rolesList.forEach(r => {
                        if (roles.indexOf(r) >= 0) {
                            count++;
                        }
                    })
                    has = count === rolesList.length
                }
            }
        }
        return has;
    }
}