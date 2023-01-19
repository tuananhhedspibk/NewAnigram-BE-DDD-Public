import { PostDetailDto } from '@view/dto/post-detail-dto';
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
}
