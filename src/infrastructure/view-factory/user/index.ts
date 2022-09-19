import { UserProfileDto } from '../../../view/dto/user-profile-dto';
import BaseViewFactory from '../base';

export class CreateUserProfileDtoParams {
  email: string;
  userName: string;
  userDetail: {
    avatarURL: string;
    nickName: string;
    gender: string;
  };
}

export default class UserViewFactory extends BaseViewFactory {
  createUserProfileDto(params: CreateUserProfileDtoParams): UserProfileDto {
    return this.createEntity(UserProfileDto, {
      email: params.email,
      userName: params.userName,
      detail: {
        avatarURL: params.userDetail?.avatarURL || '',
        nickName: params.userDetail?.nickName || '',
        gender: params.userDetail?.gender || '',
      },
    });
  }
}
