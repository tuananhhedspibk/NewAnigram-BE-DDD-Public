import { PostDetailDto } from '@view/dto/post-detail-dto';
import BaseViewRepository from './base';

export default abstract class IPostViewRepository extends BaseViewRepository {
  getPostDetail: (id: number) => Promise<PostDetailDto | null>;
}
