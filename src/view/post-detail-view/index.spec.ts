import PostViewRepository from '@infrastructure/view-repository/post-view-repository';
import { PostDetailDto } from '@view/dto/post-detail-dto';
import PostDetailView from '.';

import { postDetailDto } from './testData';

describe('PostDetail View Testing', () => {
  let view: PostDetailView;
  let result: { data: PostDetailDto | null };

  beforeAll(async () => {
    view = new PostDetailView(new PostViewRepository());
  });

  describe('getPostDetail Testing', () => {
    let postId;

    describe('Pass an existing post id', () => {
      beforeAll(async () => {
        postId = 1;

        jest
          .spyOn(PostViewRepository.prototype, 'getPostDetail')
          .mockResolvedValue(postDetailDto);

        result = await view.getPostDetail(postId);
      });

      it('PostDetailDto data will be returned', () => {
        expect(result).toEqual({ data: postDetailDto });
      });
    });

    describe('Pass a non-existing post id', () => {
      beforeAll(async () => {
        postId = 100;

        jest
          .spyOn(PostViewRepository.prototype, 'getPostDetail')
          .mockResolvedValue(null);

        result = await view.getPostDetail(postId);
      });

      it('null will be returned', () => {
        expect(result).toEqual({ data: null });
      });
    });
  });
});
