import { PostDetailDto } from '@view/dto/post-detail-dto';
import { UserPostDto } from '@view/dto/user-post-dto';
import BaseViewFactory from '../base';

export interface CreatePostDetailDtoParams {
  id: number;
  createdAt: Date;
  content: string;
  tags: {
    list: string[];
  };
  images: {
    list: string[];
  };
  likes: {
    id: number;
    user: {
      id: number;
      userName: string;
    };
  }[];
  comments: {
    id: number;
    content: string;
    createdAt: Date;
    user: {
      id: number;
      userName: string;
    };
  }[];
  user: {
    id: number;
    userName: string;
  };
}

export interface CreateUserPostDtoParams {
  id: number;
  images: {
    list: string[];
  };
  likes: {
    id: number;
  }[];
  comments: {
    id: number;
  }[];
  user: {
    id: number;
  };
}

export default class PostViewFactory extends BaseViewFactory {
  createPostDetailDto(params: CreatePostDetailDtoParams): PostDetailDto {
    return this.createEntity(PostDetailDto, {
      id: params.id,
      content: params.content,
      createdAt: params.createdAt,
      tags: params.tags.list.map((tag) => tag),
      user: {
        id: params.user.id,
        userName: params.user.userName,
      },
      images: params.images.list.map((image) => image),
      comments: params.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          id: comment.user.id,
          userName: comment.user.userName,
        },
      })),
      likes: params.likes.map((like) => ({
        id: like.id,
        user: {
          id: like.user.id,
          userName: like.user.userName,
        },
      })),
    });
  }

  createUserPostDto(params: CreateUserPostDtoParams): UserPostDto {
    return {
      id: params.id,
      likesCount: params.likes.length,
      commentsCount: params.comments.length,
      thumbnail: params.images.list[0],
    };
  }

  createUserPosts(params: CreateUserPostDtoParams[]): UserPostDto[] {
    return params.map((param) => this.createUserPostDto(param));
  }
}
