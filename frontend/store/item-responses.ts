import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import ItemResponse from '~/types/ItemResponse';
export const actions: ActionTree<any, any> = {

    async calculateScoreFromItem(state, itemResponse: ItemResponse): Promise<string> {
        return $axios.$post('/item-responses/calculateScoreFromItem', itemResponse);
    },

    async removeById(state, id: number): Promise<any> {
        return $axios.$delete('/item-responses/softDelete/' + id);
    },

    async restoreById(state, id: number): Promise<any> {
        return $axios.$get('/item-responses/restore/' + id);
    },

    async getTotal(state, researchGroupId: number): Promise<number> {
        return $axios.$get('/item-responses/getTotal/' + researchGroupId)
    },

    async getAvgScorePercent(state, researchGroupId): Promise<number> {
        return $axios.$get('/item-responses/getAvgScorePercent/' + researchGroupId)
    }

}

export const ACTION_GET_TOTAL_RESPONSES = "item-responses/getTotal"
export const ACTION_AVG_SCORE = "item-responses/getAvgScorePercent"
