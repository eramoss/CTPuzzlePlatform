import { ActionTree } from 'vuex'
import { $axios } from '~/utils/axios'
import { AxiosResponse } from 'axios';
import Mechanic from '~/types/Mechanic'
import ScoreFunctionTestDto from '~/types/ScoreFunctionTestDto';
import ScoreFunctionTestResult from '~/types/ScoreFunctionTestResult';
import { ItemTestCase } from '~/types/ItemTestCase';
export const actions: ActionTree<any, any> = {

    execute(state, scoreFunctionTestDto: ScoreFunctionTestDto): Promise<ScoreFunctionTestResult> {
        return $axios.$post('/score-function-test/execute', scoreFunctionTestDto);
    },

    runTestCases(state, mechanic: Mechanic): Promise<ItemTestCase[]> {
        return $axios.$post('/score-function-test/runTestCases/', mechanic)
    }

}
