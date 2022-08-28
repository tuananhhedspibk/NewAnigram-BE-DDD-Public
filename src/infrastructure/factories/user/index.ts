import { UserEntity } from '@domain/entities/user';
import { BaseFactory } from '@infrastructure/factories/base';
import User from '@infrastructure/rdb/entities/user';

export class UserFactory extends BaseFactory {
  createUserEntity(user: User | null) {
    if (!user) return null;

    return this.createEntity(UserEntity, user);
  }

  createUserEntities(users: User[] | null) {
    if (!users) return null;

    return this.createEntityArray(UserEntity, users);
  }
}
