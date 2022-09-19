import { UserEntity } from '@domain/entity/user';
import { EmailVO } from '@domain/value-object/email-vo';
import { BaseFactory } from '@infrastructure/factory/base';
import User from '@infrastructure/rdb/entity/user';

export class UserFactory extends BaseFactory {
  createUserEntity(user: User | null) {
    if (!user) return null;

    const entity = this.createEntity(UserEntity, user);

    if (!user.userDetail) {
      entity.detail = null;
    }

    return entity;
  }

  createUserEntities(users: User[] | null) {
    if (!users) return null;

    return this.createEntityArray(UserEntity, users);
  }

  createFromEmailAndPassword(emailVO: EmailVO, password: string) {
    const entity = this.createEntity(UserEntity, {
      userName: emailVO.toString(),
      password,
    });

    entity.email = emailVO;

    return entity;
  }
}
