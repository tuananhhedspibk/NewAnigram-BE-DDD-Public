import { UserProfileDto } from '@view/dto/user-profile-dto';
import IUserViewRepository from '@view/view-repository/user-view-repository';
import {
  SelectQueryBuilder,
  Repository as TypeOrmRepository,
  getRepository,
} from 'typeorm';
import RDBUserEntity from '@infrastructure/rdb/entity/user';
import UserViewFactory from '@infrastructure/view-factory/user';

const userViewFactory = new UserViewFactory();

export default class UserViewRepository implements IUserViewRepository {
  async getUserProfileById(id: number): Promise<UserProfileDto | null> {
    const repository = getRepository(RDBUserEntity);

    const query = this.getBaseQuery(repository);
    const user = await query.where('user.id = :id', { id }).getOne();

    return user ? userViewFactory.createUserProfileDto(user) : null;
  }

  private getBaseQuery(
    repository: TypeOrmRepository<RDBUserEntity>,
  ): SelectQueryBuilder<RDBUserEntity> {
    const query = repository
      .createQueryBuilder('user')
      .select([
        'user.email',
        'user.userName',
        'userDetail.nickName',
        'userDetail.avatarURL',
        'userDetail.gender',
      ])
      .leftJoin('user.userDetail', 'userDetail');

    return query;
  }
}
