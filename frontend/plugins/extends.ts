import { Context } from '@nuxt/types';
import Vue from 'vue';
import User from '~/types/User';

Vue.prototype.getUser = function (context: Context) {
    let user = Object.assign(new User(), context.$auth.user);
    return user;
}