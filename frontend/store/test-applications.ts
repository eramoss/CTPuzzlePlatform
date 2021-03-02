import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { PageRequest, PageResponse } from '~/types/pagination';
import { AxiosResponse } from 'axios'
import TestApplication from '~/types/TestApplication';
export const actions: ActionTree<any, any> = {

    async save(state, testApplication: TestApplication): Promise<TestApplication> {
        return $axios.$post('/test-applications', testApplication);
    },

    async getById(state, id: number): Promise<TestApplication> {
        return $axios.$get('/test-applications/byId/' + id);
    },

    /* async removeById(state, id: number): Promise<AxiosResponse> {
      return $axios.$delete('/test-applications/remove/' + id);
    }, */

    async paginate(state, pageRequest: PageRequest): Promise<PageResponse<TestApplication>> {
        return $axios.$post('/test-applications/paginate', pageRequest);
    },

    async findAll(state, pageRequest: PageRequest): Promise<TestApplication[]> {
        return $axios.$get('/test-applications/findAll');
    },

    async removeById(state, id: number): Promise<AxiosResponse> {
        return $axios.$delete('/test-applications/remove/' + id);
    },

}
