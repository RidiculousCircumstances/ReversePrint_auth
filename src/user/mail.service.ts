import { Inject, Injectable } from 'inversion-tools';
import { IMailService } from './interfaces/user.mailservice.interface';
import nodemailer, { Transporter } from 'nodemailer';
import { TYPES } from '../types';
import { IConfigService } from '../config/interfaces/config.service.interface';

@Injectable()
export class MailService implements IMailService {
  transporter: Transporter;
  constructor(@Inject(TYPES.ConfigService) private readonly configService: IConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: +this.configService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }
  async sendActivationLink(to: string, link: string): Promise<void> {
    this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to,
      subject: 'Активация аккаунта на ' + this.configService.get('API_URL'),
      text: '',
      html: `
        <div>
          <h1>Для активации аккаунта ReversePrint перейдите по ссылке:</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
    });
  }
}
