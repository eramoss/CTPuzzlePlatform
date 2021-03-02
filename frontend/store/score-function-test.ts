import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { AxiosResponse } from 'axios';
import Mechanic from '~/types/Mechanic'
import ScoreFunctionTestDto from '~/types/ScoreFunctionTestDto';
import ScoreFunctionTestResult from '~/types/ScoreFunctionTestResult';
export const actions: ActionTree<any, any> = {

    async execute(state, scoreFunctionTestDto: ScoreFunctionTestDto): Promise<ScoreFunctionTestResult> {
        return $axios.$post('/score-function-test/execute', scoreFunctionTestDto);
    },

}
