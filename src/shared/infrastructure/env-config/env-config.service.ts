import { Injectable } from '@nestjs/common'
import { EnvConfig } from './env-config.interface'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class EnvConfigService implements EnvConfig {
  constructor(private config: ConfigService) {}

  getAppPort(): number {
    return Number(this.config.get<number>('PORT'))
  }

  getNodeEnv(): string {
    return this.config.get<string>('NODE_ENV')
  }
}
