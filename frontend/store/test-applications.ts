import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { PageRequest, PageResponse } from '~/types/pagination';
import { AxiosResponse } from 'axios'
import TestApplication from '~/types/TestApplication';
import { downloadWithAxios } from '~/utils/utils';
export const actions: ActionTree<any, any> = {

    generateItemResponsesCsv(state, testApplicationId: number) {
        let url = '/test-applications/generateItemResponsesCsv/' + testApplicationId;
        downloadWithAxios($axios, url, `respostas_aplicacao_${testApplicationId}.csv`)
    },

    save(state, testApplication: TestApplication): Promise<TestApplication> {
        return $axios.$post('/test-applications', testApplication);
    },

    getById(state, id: number): Promise<TestApplication> {
        return $axios.$get('/test-applications/byId/' + id);
    },

    /* removeById(state, id: number): Promise<AxiosResponse> {
      return $axios.$delete('/test-applications/remove/' + id);
    }, */

    paginate(state, pageRequest: PageRequest): Promise<PageResponse<TestApplication>> {
        return $axios.$post('/test-applications/paginate', pageRequest);
    },

    findAll(state, pageRequest: PageRequest): Promise<TestApplication[]> {
        return $axios.$get('/test-applications/findAll');
    },

    removeById(state, id: number): Promise<AxiosResponse> {
        return $axios.$delete('/test-applications/remove/' + id);
    },

}
