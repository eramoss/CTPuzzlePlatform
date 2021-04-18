import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { AxiosResponse } from 'axios';
import { PageRequest, PageResponse } from '~/types/pagination';
import Item from '~/types/Item';
export const actions: ActionTree<any, any> = {

    async save(state, item: Item): Promise<Item> {
        return $axios.$post('/items', item);
    },

    async getById(state, id: number): Promise<Item> {
        return $axios.$get('/items/byId/' + id);
    },

    async softDeleteById(state, id: number): Promise<AxiosResponse> {
        return $axios.$delete('/items/softDelete/' + id);
    },

    async restore(state, id: number): Promise<AxiosResponse> {
        return $axios.$get('/items/restore/' + id);
    },

    async paginate(state, pageRequest: PageRequest): Promise<PageResponse<Item>> {
        return $axios.$post('/items/paginate', pageRequest);
    },

    async findAll(state, pageRequest: PageRequest): Promise<Item[]> {
        return $axios.$get('/items/findAll');
    },

}
export const ACTION_FIND_ALL_ITEMS = "items/findAll"