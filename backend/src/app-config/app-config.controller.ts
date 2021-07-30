import { Controller, Get } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import SiteConfig from './site.config.dto';

@Controller('config')
export class AppConfigController {

    constructor(private appConfigService: AppConfigService) { }

    @Get('/siteConfig')
    getSiteConfig(): SiteConfig {
        return this.appConfigService.getSiteConfig()
    }

}
