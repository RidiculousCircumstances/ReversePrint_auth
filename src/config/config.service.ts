import { IConfigService } from './interfaces/config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { Injectable } from 'inversion-tools';

@Injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;
  constructor() {
    const result: DotenvConfigOutput = config();
    if (result.error) {
      console.log('[ConfigService] Не удалось прочитать файл .env, либо он остутствует');
    } else if (result.parsed != undefined) {
      this.config = result.parsed;
      console.log('[ConfigService] Конфигурация .env успешно загружена');
    } else {
      console.log('[ConfigService] Результат парсинга файла конфигурации вернул undefiend');
    }
  }
  get(key: string): string {
    return this.config[key];
  }
}
