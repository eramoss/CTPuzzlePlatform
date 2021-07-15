import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { PageRequest, PageResponse } from '~/types/pagination';
import { AxiosResponse } from 'axios'
import TestApplication from '~/types/TestApplication';
import { downloadWithAxios } from '~/utils/utils';
import ItemResponse from '~/types/ItemResponse';
import { CsvData } from '~/types/CsvData';
import Participation from '~/types/Participation';
export const actions: ActionTree<any, any> = {

    generateItemResponsesCsv(state, testApplicationId: number) {
        let date = new Date();
        let dateString = `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}`;
        let url = `/test-applications/generateItemResponsesCsv/${testApplicationId}`;
        downloadWithAxios($axios, url, `respostas_aplicacao_${testApplicationId}___${dateString}.csv`)
    },

    getCsvData(state, testApplication: TestApplication): Promise<CsvData> {
        return $axios.$get('/test-applications/getCsvData/' + testApplication.id)
    },

    generateItemResponsesCsvForIRT(state, testApplicationId: number) {
        let date = new Date();
        let dateString = `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}`;
        let url = `/test-applications/generateItemResponsesCsvForIRT/${testApplicationId}`;
        downloadWithAxios($axios, url, `respostas_aplicacao_${testApplicationId}___${dateString}.csv`)
    },

    async recalculateAllApplicationScores(state, testApplication: TestApplication) {
        return $axios.$get(`/test-applications/recalculateAllApplicationParticipationScores/${testApplication.id}`)
    },

    updateVisibility(state, testApplication: TestApplication): Promise<any> {
        return $axios.put('/test-applications/updateVisibility', testApplication)
    },

    save(state, testApplication: TestApplication): Promise<TestApplication> {
        return $axios.$post('/test-applications', testApplication);
    },

    getPuplicApplications(state): Promise<TestApplication[]> {
        return $axios.$get('/test-applications/public/getPuplicApplications');
    },

    participateInTheTest(state, payload: { applicationHash: string, userHash: string }): Promise<Participation> {
        return $axios.$get('/test-applications/public/participate/' + payload.applicationHash + "/" + payload.userHash);
    },

    getById(state, id: number): Promise<TestApplication> {
        return $axios.$get('/test-applications/byId/' + id);
    },

    getAll(state, id: number): Promise<TestApplication[]> {
        return $axios.$get('/test-applications/findAll/');
    },

    getLastResponse(state, id: number): Promise<ItemResponse> {
        return $axios.$get('/test-applications/getLastResponse/' + id);
    },

    paginate(state, pageRequest: PageRequest): Promise<PageResponse<TestApplication>> {
        return $axios.$post('/test-applications/paginate', pageRequest);
    },

    softDeleteById(state, id: number): Promise<AxiosResponse> {
        return $axios.$delete('/test-applications/softDelete/' + id);
    },

    restore(state, id: number): Promise<AxiosResponse> {
        return $axios.$get('/test-applications/restore/' + id);
    },
}

export const ACTION_GENERATE_CSV = "test-applications/generateItemResponsesCsv"
export const ACTION_GET_LAST_RESPONSE = "test-applications/getLastResponse"
export const ACTION_SAVE_TEST_APPLICATION = "test-applications/save"
export const ACTION_UPDATE_VISIBILITY = "test-applications/updateVisibility"
export const ACTION_PAGINATE_APPLICATIONS = "test-applications/paginate"
export const ACTION_GET_CSV_DATA_TEST_APPLICATION = "test-applications/getCsvData"
export const ACTION_RECALCULATE_ALL_APPLICATION_SCORES = "test-applications/recalculateAllApplicationScores"
export const ACTION_GET_APPLICATIONS = "test-applications/getAll"
export const ACTION_GET_APPLICATION_DATA = "test-applications/paft"
export const ACTION_PARTICIPATE_IN_THE_TEST = "test-applications/participateInTheTest"
export const ACTION_GET_BY_ID = "test-applications/getById";