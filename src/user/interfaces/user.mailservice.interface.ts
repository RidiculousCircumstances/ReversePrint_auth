export interface IMailService {
  sendActivationLink: (to: string, link: string) => Promise<void>;
}
