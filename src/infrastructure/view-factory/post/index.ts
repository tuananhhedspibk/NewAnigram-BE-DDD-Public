import { PostDetailDto } from '@view/dto/post-detail-dto';
import BaseViewFactory from '../base';

export interface CreatePostDetailDtoParams {
  id: number;
}

export default class PostViewFactory extends BaseViewFactory {
  createPostDetailDto(params: CreatePostDetailDtoParams): PostDetailDto {
    return this.createEntity(PostDetailDto, {
      id: params.id,
    });
  }
}
