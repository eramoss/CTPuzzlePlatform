import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { AxiosResponse } from 'axios';
import { PageRequest, PageResponse } from '~/types/pagination';
import TestItem from '~/types/TestItem';
export const actions: ActionTree<any, any> = {

  async save(state, testItem: TestItem): Promise<TestItem> {
    return $axios.$post('/test-items', testItem);
  },

  async getById(state, id: number): Promise<TestItem> {
    return $axios.$get('/test-items/byId/' + id);
  },

  async removeById(state, id: number): Promise<AxiosResponse> {
    return $axios.$delete('/test-items/remove/' + id);
  },

  async paginate(state, pageRequest: PageRequest): Promise<PageResponse<TestItem>> {
    return $axios.$post('/test-items/paginate', pageRequest);
  },

}
