import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { PlotRequest, PlotResponse } from '~/types/plot';
import { CsvData } from '~/types/CsvData';


export const actions: ActionTree<any, any> = {
    async plot(state, plotRequest: PlotRequest): Promise<PlotResponse> {
        return $axios.$post('/r/plot', plotRequest);
    },
    async runScript(state, payload: { script: string, csv: string }): Promise<string> {
        return $axios.$post('/r/run', payload)
    }
}

export const ACTION_R_PLOT = "r/plot"
export const ACTION_R_RUN_SCRIPT = "r/runScript"