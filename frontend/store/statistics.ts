
import StatisticsPanel from '~/types/StatisticsPanel'
import { v4 as uuidv4 } from "uuid";

class StatisticsState {
    test!: string
    panels!: StatisticsPanel[]
}

export const state = (): StatisticsState => ({
    test: 'abacate',
    panels: []
})

export const mutations = {
    setTest(state: StatisticsState, value: string) {
        state.test = value
    },

    addPanel(state: StatisticsState) {
        let panel = new StatisticsPanel();
        panel.id = uuidv4();
        state.panels.push(panel);
    },

    rmPanel(state: StatisticsState, value: StatisticsPanel) {
        state.panels.splice(state.panels.indexOf(value), 1);
    },

    storeUpdatePanel(state: StatisticsState, panel: StatisticsPanel) {
        let index = state.panels.indexOf(panel)
        state.panels.splice(index, 1, panel)
    }
}
