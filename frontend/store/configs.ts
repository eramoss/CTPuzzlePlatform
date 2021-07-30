import { ActionTree } from 'vuex';
import SiteConfig from '~/types/SiteConfig';
import { $axios } from '~/utils/axios';
export const actions: ActionTree<any, any> = {

    async getSiteConfig(state): Promise<SiteConfig> {
        return $axios.$get('/config/siteConfig');
    },
}

export const ACTION_GET_SITE_CONFIG = 'configs/getSiteConfig'