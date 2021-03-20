import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import ItemResponse from '~/types/ItemResponse';
export const actions: ActionTree<any, any> = {

    async calculateScoreFromItem(state, itemResponse: ItemResponse): Promise<string> {
        return $axios.$post('/item-responses/calculateScoreFromItem', itemResponse);
    },

    async removeById(state, id: number): Promise<string> {
        return $axios.$delete('/item-responses/remove/'+id);
    },

}
