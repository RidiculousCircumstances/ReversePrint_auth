import { User } from '../common/user.entity';

export interface IUserRepository {
  create: (user: User) => Promise<void>;
  find: (email: string) => Promise<void | null>;
}
