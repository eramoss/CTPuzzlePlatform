import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { AxiosResponse } from 'axios';
import User from '~/types/User'
export const actions: ActionTree<any, any> = {

  async saveUser(state, user: User):Promise<AxiosResponse> {
    return $axios.post('/users', user);
  }

}
