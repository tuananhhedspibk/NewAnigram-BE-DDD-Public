import {
  SelectQueryBuilder,
  Repository as TypeOrmRepository,
  getRepository,
} from 'typeorm';

import { PostDetailDto } from '@view/dto/post-detail-dto';
import IPostViewRepository from '@view/view-repository/post-view-repository';
import PostViewFactory, {
  CreatePostDetailDtoParams,
} from '@infrastructure/view-factory/post';
import Post from '@infrastructure/rdb/entity/post';

const postViewFactory = new PostViewFactory();

export default class PostViewRepository implements IPostViewRepository {
  async getPostDetail(id: number): Promise<PostDetailDto | null> {
    const repository = getRepository(Post);

    const query = this.getBaseQuery(repository);
    const post = await query.where('post.id = :id', { id }).getOne();

    return post
      ? postViewFactory.createPostDetailDto(
          post as unknown as CreatePostDetailDtoParams,
        )
      : null;
  }

  private getBaseQuery(
    repository: TypeOrmRepository<Post>,
  ): SelectQueryBuilder<Post> {
    const query = repository
      .createQueryBuilder('post')
      .select([
        'post.id',
        'post.content',
        'post.createdAt',
        'post.tags',
        'post.images',
        'like.id',
        'comment.id',
        'comment.content',
        'comment.createdAt',
        'commentUser.id',
        'commentUser.userName',
        'likeUser.id',
        'likeUser.userName',
        'postUser.id',
        'postUser.userName',
      ])
      .leftJoin('post.likes', 'like')
      .leftJoin('post.comments', 'comment')
      .leftJoin('comment.user', 'commentUser')
      .leftJoin('like.user', 'likeUser')
      .innerJoin('post.user', 'postUser');

    return query;
  }
}
