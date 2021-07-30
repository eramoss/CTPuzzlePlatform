import { Injectable } from '@nestjs/common';
import SiteConfig from './site.config.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {

    constructor(private configService: ConfigService) {
    }

    getSiteConfig(): SiteConfig {
        let siteConfig = new SiteConfig();
        siteConfig.docsLocation = this.configService.get('DOCS_LOCATION')
        return siteConfig
    }
}
