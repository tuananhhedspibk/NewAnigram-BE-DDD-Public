import { PostDetailDto } from '@view/dto/post-detail-dto';
import { UserPostDto } from '@view/dto/user-post-dto';
import BaseViewRepository from './base';

export default abstract class IPostViewRepository extends BaseViewRepository {
  getPostDetail: (id: number) => Promise<PostDetailDto | null>;
  getUserPosts: (userId: number) => Promise<UserPostDto[]>;
}
