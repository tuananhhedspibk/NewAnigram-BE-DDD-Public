import { CommentEntity } from '@domain/entity/post/comment';

import Comment from '@infrastructure/rdb/entity/comment';

import { BaseFactory } from '../base';

interface ReconstructCommentParams {
  content: string;
  userId: number;
  postId: number;
}

export class CommentFactory extends BaseFactory {
  createCommentEntity(comment: Comment) {
    if (!comment) return null;

    return this.createEntity(CommentEntity, comment);
  }

  reconstruct(params: ReconstructCommentParams) {
    return this.createEntity(CommentEntity, {
      content: params.content,
      userId: params.userId,
      postId: params.postId,
    });
  }
}
