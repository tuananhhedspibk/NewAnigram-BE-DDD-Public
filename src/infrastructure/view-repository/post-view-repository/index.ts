import {
  SelectQueryBuilder,
  Repository as TypeOrmRepository,
  getRepository,
} from 'typeorm';

import { PostDetailDto } from '@view/dto/post-detail-dto';
import IPostViewRepository from '@view/view-repository/post-view-repository';
import PostViewFactory from '@infrastructure/view-factory/post';
import Post from '@infrastructure/rdb/entity/post';

const postViewFactory = new PostViewFactory();

export default class PostViewRepository implements IPostViewRepository {
  async getPostDetail(id: number): Promise<PostDetailDto | null> {
    const repository = getRepository(Post);

    const query = this.getBaseQuery(repository);
    const post = await query.where('post.id = :id', { id }).getOne();

    return post ? postViewFactory.createPostDetailDto(post) : null;
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
        'like.id',
        'like.userId',
        'comment.id',
        'comment.content',
        'comment.userId',
        'user.id',
        'user.userName',
      ])
      .leftJoin('post.likes', 'like')
      .leftJoin('post.comments', 'comment')
      .leftJoin('post.user', 'user');

    return query;
  }
}
