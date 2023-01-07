import { PostEntity } from '@domain/entity/post';
import { BaseFactory } from '../base';
import Post from '@infrastructure/rdb/entity/post';

interface CreatePostEntityParams {
  id: number;
  images: string[];
  tags: string[];
  content: string;
  userId: number;
  createdAt: Date;
}

export class PostFactory extends BaseFactory {
  createPostEntity(post: Post | null) {
    if (!post) return null;

    const createEntityParams: CreatePostEntityParams = this.reconstruct(post);

    return this.createEntity(PostEntity, createEntityParams);
  }

  reconstruct(post: Post): CreatePostEntityParams {
    return {
      id: post.id,
      images: post.images.list,
      tags: post.tags.list,
      content: post.content,
      userId: post.user.id,
      createdAt: post.createdAt,
    };
  }

  createNewPostEntity(
    content: string,
    imageUrls: string[],
    tags: string[],
    userId: number,
  ) {
    const entity = this.createEntity(PostEntity, {
      content,
      tags,
      images: imageUrls,
      userId,
    });

    return entity;
  }
}
