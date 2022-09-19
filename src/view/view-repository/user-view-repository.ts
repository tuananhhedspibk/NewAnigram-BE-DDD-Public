import { UserProfileDto } from '../dto/user-profile-dto';
import BaseViewRepository from './base';

export default abstract class IUserViewRepository extends BaseViewRepository {
  getUserProfileById: (id: number) => Promise<UserProfileDto | null>;
}
