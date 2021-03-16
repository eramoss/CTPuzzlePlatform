import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { AxiosResponse } from 'axios';
import Participation from '~/types/Participation';
export const actions: ActionTree<any, any> = {

    async getById(state, id: number): Promise<Participation> {
        return $axios.$get('/participations/byId/' + id);
    },
    
    async recalculateAllResponseItems(state, id: number): Promise<Participation> {
        return $axios.$get('/participations/recalculateAllResponseItems/' + id);
    },

    async removeById(state, id: number): Promise<AxiosResponse> {
        return $axios.$delete('/participations/remove/' + id);
    },

}
