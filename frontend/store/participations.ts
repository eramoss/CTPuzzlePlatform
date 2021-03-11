import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { AxiosResponse } from 'axios';
import { PageRequest, PageResponse } from '~/types/pagination';
import Participation from '~/types/Participation';
export const actions: ActionTree<any, any> = {

//   async save(state, participation: Participation): Promise<Participation> {
//     return $axios.$post('/participations', participation);
//   },

//   async getById(state, id: number): Promise<Participation> {
//     return $axios.$get('/participations/byId/' + id);
//   },

  async removeById(state, id: number): Promise<AxiosResponse> {
    return $axios.$delete('/participations/remove/' + id);
  },

//   async paginate(state, pageRequest: PageRequest): Promise<PageResponse<Participation>> {
//     return $axios.$post('/participations/paginate', pageRequest);
//   },

//   async findAll(state): Promise<Participation[]> {
//     return $axios.$get('/participations/findAll');
//   },

}
