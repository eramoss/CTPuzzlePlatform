import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import ItemResponse from '~/types/ItemResponse';
export const actions: ActionTree<any, any> = {

    async calculateScoreFromItem(state, itemResponse: ItemResponse): Promise<string> {
        return $axios.$post('/item-responses/calculateScoreFromItem', itemResponse);
    },

    async removeById(state, id: number): Promise<any> {
        return $axios.$delete('/item-responses/softDelete/'+id);
    },

    async restoreById(state, id: number): Promise<any> {
        return $axios.$get('/item-responses/restore/'+id);
    },

}
