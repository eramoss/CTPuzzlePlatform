import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { AxiosResponse } from 'axios';
import User from '~/types/User'
export const actions: ActionTree<any, any> = {

  async saveUser(state, user: User): Promise<AxiosResponse> {
    return $axios.post('/users', user);
  },

  async validateConfirmationCode(state, validationInfo: { email: string, code: string }): Promise<AxiosResponse> {
    return $axios.post('/users/validateConfirmationCode', validationInfo);
  },

  async sendPasswordRecoveryLink(state, email: string): Promise<AxiosResponse> {
    return $axios.post('/users/sendPasswordRecoveryLink', { email });
  },

  async validateRecoveryLink(state, hash: string): Promise<boolean> {
    return $axios.$get('/users/validateRecoveryLink/' + hash)
  },

  async updatePassword(state, updatePasswordInfo: { hash: string, newPassword: string }): Promise<any> {
    return $axios.$post('/users/updatePassword', updatePasswordInfo)
  }

}
