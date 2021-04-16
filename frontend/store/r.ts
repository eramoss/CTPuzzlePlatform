import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { PlotRequest, PlotResponse } from '~/types/plot';


export const actions: ActionTree<any, any> = {

    async plot(state, plotRequest: PlotRequest): Promise<PlotResponse> {
        return $axios.$post('/r/plot', plotRequest);
    },
}

export const ACTION_R_PLOT = "r/plot"