import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { PageRequest, PageResponse } from '~/types/pagination';
import { AxiosResponse } from 'axios'
import TestApplication from '~/types/TestApplication';
import { downloadWithAxios } from '~/utils/utils';
import ItemResponse from '~/types/ItemResponse';
export const actions: ActionTree<any, any> = {

    generateItemResponsesCsv(state, testApplicationId: number) {
        let date = new Date();
        let dateString = `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}`;
        let url = `/test-applications/generateItemResponsesCsv/${testApplicationId}`;
        downloadWithAxios($axios, url, `respostas_aplicacao_${testApplicationId}___${dateString}.csv`)
    },

    generateItemResponsesCsvForIRT(state, testApplicationId: number) {
        let date = new Date();
        let dateString = `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}`;
        let url = `/test-applications/generateItemResponsesCsvForIRT/${testApplicationId}`;
        downloadWithAxios($axios, url, `respostas_aplicacao_${testApplicationId}___${dateString}.csv`)
    },

    save(state, testApplication: TestApplication): Promise<TestApplication> {
        return $axios.$post('/test-applications', testApplication);
    },

    getPuplicApplications(state): Promise<TestApplication[]> {
        return $axios.$get('/test-applications/public/getPuplicApplications');
    },

    getById(state, id: number): Promise<TestApplication> {
        return $axios.$get('/test-applications/byId/' + id);
    },

    getLastResponse(state, id: number): Promise<ItemResponse> {
        return $axios.$get('/test-applications/getLastResponse/' + id);
    },

    paginate(state, pageRequest: PageRequest): Promise<PageResponse<TestApplication>> {
        return $axios.$post('/test-applications/paginate', pageRequest);
    },

    findAll(state, pageRequest: PageRequest): Promise<TestApplication[]> {
        return $axios.$get('/test-applications/findAll');
    },

    softDeleteById(state, id: number): Promise<AxiosResponse> {
        return $axios.$delete('/test-applications/softDelete/' + id);
    },

    restore(state, id: number): Promise<AxiosResponse> {
        return $axios.$get('/test-applications/restore/' + id);
    },
}

export const ACTION_GENERATE_CSV = "test-applications/generateItemResponsesCsv"
export const ACTION_GENERATE_IRT_CSV = "test-applications/generateItemResponsesCsvForIRT"
export const ACTION_GET_LAST_RESPONSE = "test-applications/getLastResponse"
export const ACTION_SAVE_TEST_APPLICATION = "test-applications/save"