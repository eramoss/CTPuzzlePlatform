import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { AxiosResponse } from 'axios';
import { PageRequest, PageResponse } from '~/types/pagination';
import Test from '~/types/Test';
export const actions: ActionTree<any, any> = {

  async save(state, test: Test): Promise<Test> {
    return $axios.$post('/tests', test);
  },

  async getById(state, id: number): Promise<Test> {
    return $axios.$get('/tests/byId/' + id);
  },

  async removeById(state, id: number): Promise<AxiosResponse> {
    return $axios.$delete('/tests/remove/' + id);
  },

  async paginate(state, pageRequest: PageRequest): Promise<PageResponse<Test>> {
    return $axios.$post('/tests/paginate', pageRequest);
  },

  async findAll(state): Promise<Test[]> {
    return $axios.$get('/tests/findAll');
  },

  async getPuzzleBaseUrl(state, testId:number): Promise<string> {
    return $axios.$get('/tests/getPuzzleBaseUrl/'+testId);
  }

}
