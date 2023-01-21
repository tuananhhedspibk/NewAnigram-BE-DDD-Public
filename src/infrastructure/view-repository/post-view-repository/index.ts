import {
  SelectQueryBuilder,
  Repository as TypeOrmRepository,
  getRepository,
} from 'typeorm';

import { PostDetailDto } from '@view/dto/post-detail-dto';
import IPostViewRepository from '@view/view-repository/post-view-repository';
import PostViewFactory, {
  CreatePostDetailDtoParams,
  CreateUserPostDtoParams,
} from '@infrastructure/view-factory/post';
import Post from '@infrastructure/rdb/entity/post';
import { UserPostDto } from '@view/dto/user-post-dto';

const postViewFactory = new PostViewFactory();

export default class PostViewRepository implements IPostViewRepository {
  async getPostDetail(id: number): Promise<PostDetailDto | null> {
    const repository = getRepository(Post);

    const query = this.getBaseQueryForPostDetail(repository);
    const post = await query.where('post.id = :id', { id }).getOne();

    return post
      ? postViewFactory.createPostDetailDto(
          post as unknown as CreatePostDetailDtoParams,
        )
      : null;
  }

  async getUserPosts(userId: number): Promise<UserPostDto[]> {
    const repository = getRepository(Post);

    const query = this.getBaseQueryForUserPost(repository);
    const posts = await query
      .where('postUser.id = :userId', { userId })
      .getMany();

    return posts.length > 0
      ? postViewFactory.createUserPosts(
          posts as unknown as CreateUserPostDtoParams[],
        )
      : [];
  }

  private getBaseQueryForPostDetail(
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

  private getBaseQueryForUserPost(
    repository: TypeOrmRepository<Post>,
  ): SelectQueryBuilder<Post> {
    const query = repository
      .createQueryBuilder('post')
      .select([
        'post.id',
        'post.images',
        'like.id',
        'comment.id',
        'postUser.id',
      ])
      .leftJoin('post.likes', 'like')
      .leftJoin('post.comments', 'comment')
      .innerJoin('post.user', 'postUser');

    return query;
  }
}
