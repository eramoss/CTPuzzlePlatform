import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { AxiosResponse } from 'axios';
import { PageRequest, PageResponse } from '~/types/pagination';
import Test from '~/types/Test';
import TestItemDifficulty from '~/types/TestItemDifficulty';
export const actions: ActionTree<any, any> = {

    async save(state, test: Test): Promise<Test> {
        return $axios.$post('/tests', test);
    },

    async getById(state, id: number): Promise<Test> {
        return $axios.$get('/tests/byId/' + id);
    },

    async softDeleteById(state, id: number): Promise<AxiosResponse> {
        return $axios.$delete('/tests/softDelete/' + id);
    },

    async restore(state, id: number): Promise<AxiosResponse> {
        return $axios.$get('/tests/restore/' + id);
    },

    async paginate(state, pageRequest: PageRequest): Promise<PageResponse<Test>> {
        return $axios.$post('/tests/paginate', pageRequest);
    },

    async findAll(state): Promise<Test[]> {
        return $axios.$get('/tests/findAll');
    },

    async getPuzzleBaseUrl(state, testId: number): Promise<string> {
        return $axios.$get('/tests/getPuzzleBaseUrl/' + testId);
    },

    async getAvgScoreByItem(state): Promise<TestItemDifficulty> {
        return $axios.$get('/tests/getAvgScoreByItem')
    }

}
export const ACTION_GET_TEST_BY_ID = "tests/getById"
export const ACTION_SAVE_TEST = "tests/save"
export const ACTION_GET_AVG_SCORE_BY_ITEM = "tests/getAvgScoreByItem"
