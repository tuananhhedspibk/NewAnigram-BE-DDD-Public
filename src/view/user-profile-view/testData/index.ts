import { plainToClass } from '@nestjs/class-transformer';
import { Gender } from '@infrastructure/rdb/entity/user-detail';
import { UserProfileDto } from '../../dto/user-profile-dto';

const userProfileDto = plainToClass(UserProfileDto, {
  email: 'test@mail.com',
  userName: 'userName',
  detail: {
    gender: Gender.Male,
    avatarURL: 'image/avatar.jpg',
    nickName: 'nick name',
  },
});

export { userProfileDto };
