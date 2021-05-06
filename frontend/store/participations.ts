import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { AxiosResponse } from 'axios';
import Participation from '~/types/Participation';


export const actions: ActionTree<any, any> = {

    async getById(state, id: number): Promise<Participation> {
        return $axios.$get('/participations/byId/' + id);
    },

    async getByIdPublic(state, id: number): Promise<Participation> {
        return $axios.$get('/participations/public/byId/' + id);
    },

    async recalculateAllResponseItems(state, id: number): Promise<Participation> {
        return $axios.$get('/participations/recalculateAllResponseItems/' + id);
    },

    async softDeleteById(state, id: number): Promise<AxiosResponse> {
        return $axios.$delete('/participations/softDelete/' + id);
    },

    async save(state, participation: Participation): Promise<Participation> {
        return $axios.$post('/participations', participation);
    },

    async saveQuizResponse(state, participation: Participation): Promise<Participation> {
        return $axios.$post('/participations/public/saveQuizResponse', participation);
    },

    async restore(state, id: number): Promise<AxiosResponse> {
        return $axios.$get('/participations/restore/' + id);
    },

}

export const ACTION_SAVE_PARTICIPATION = 'participations/save';
export const ACTION_SAVE_QUIZ_RESPONSE = 'participations/saveQuizResponse';
export const ACTION_GET_BY_ID_PUBLIC_PARTICIPATION = 'participations/getByIdPublic';
export const ACTION_RECALCULATE_ALL_SCORES = "participations/recalculateAllResponseItems"
export const ACTION_REMOVE_PARTICIPATION_BY_ID = "participations/removeById"