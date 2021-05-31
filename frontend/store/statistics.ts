
import StatisticsPanel from '~/types/StatisticsPanel'
import { v4 as uuidv4 } from "uuid";
import LogicFilter from '~/types/LogicFilter';
import { TransformOperation } from '~/types/TransformOperation';

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
    },

    storeFilters(state: StatisticsState, payload: { panel: StatisticsPanel, filters: LogicFilter[] }) {
        if (payload.panel) {
            let index = state.panels.indexOf(payload.panel)
            let panel = state.panels[index]
            if (panel) {
                panel.filters = payload.filters
                state.panels.splice(index, 1, panel)
            }
        }
    },

    storeTransforms(state: StatisticsState, payload: { panel: StatisticsPanel, transforms: TransformOperation[] }) {
        if (payload.panel) {
            let index = state.panels.indexOf(payload.panel)
            let panel = state.panels[index]
            if (panel) {
                panel.transforms = payload.transforms
                state.panels.splice(index, 1, panel)
            }
        }
    }
}
