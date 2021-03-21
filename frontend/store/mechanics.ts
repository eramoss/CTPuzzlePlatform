import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { AxiosResponse } from 'axios';
import Mechanic from '~/types/Mechanic'
import { PageRequest, PageResponse } from '~/types/pagination';
export const actions: ActionTree<any, any> = {

  async save(state, mechanic: Mechanic): Promise<AxiosResponse> {
    return $axios.post('/mechanics', mechanic);
  },

  async getById(state, id: number): Promise<Mechanic> {
    return $axios.$get('/mechanics/byId/' + id);
  },

  async softDeleteById(state, id: number): Promise<AxiosResponse> {
    return $axios.$delete('/mechanics/softDelete/' + id);
  },

  async restore(state, id: number): Promise<any> {
    return $axios.$get('/mechanics/restore/' + id);
  },

  async paginate(state, pageRequest: PageRequest): Promise<PageResponse<Mechanic>> {
    return $axios.$post('/mechanics/paginate', pageRequest);
  },

  async findAll(state): Promise<Mechanic[]> {
    return $axios.$get('/mechanics/findAll');
  },

}
