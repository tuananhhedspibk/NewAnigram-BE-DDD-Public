import { UserFeedPostDto } from '@view/dto/user-feed-post-dto';
import { UserProfileDto } from '@view/dto/user-profile-dto';
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

export class CreateUserFeedPostDtoParams {
  id: number;
  content: string;
  createdAt: Date;
  user: {
    id: number;
    userName: string;
    userDetail: {
      avatarURL: string;
    };
  };
  images: {
    list: string[];
  };
  tags: {
    list: string[];
  };
  likes: {
    id: number;
  }[];
  comments: {
    id: number;
    content: string;
    createdAt: Date;
    user: {
      id: number;
      userName: string;
      userDetail: {
        avatarURL: string;
      };
    };
  }[];
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

  createUserFeedPostDto(params: CreateUserFeedPostDtoParams): UserFeedPostDto {
    return {
      id: params.id,
      user: {
        id: params.user.id,
        userName: params.user.userName,
        avatarURL: params.user.userDetail.avatarURL,
      },
      createdAt: params.createdAt,
      content: params.content,
      tags: params.tags.list,
      images: params.images.list,
      likes: params.likes,
      comments: params.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          id: comment.user.id,
          userName: comment.user.userName,
          avatarURL: comment.user.userDetail.avatarURL,
        },
      })),
    };
  }

  createUserFeedPostDtoList(
    params: CreateUserFeedPostDtoParams[],
  ): UserFeedPostDto[] {
    return params.map((param) => this.createUserFeedPostDto(param));
  }
}
