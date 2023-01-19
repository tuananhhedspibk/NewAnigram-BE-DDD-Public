import { PostDetailDto } from '@view/dto/post-detail-dto';

export const postDetailDto: PostDetailDto = {
  id: 1,
  content: 'Post content',
  tags: ['tag1', 'tag2'],
  images: ['image1', 'image2'],
  user: {
    id: 1,
    userName: 'user1',
  },
  likes: [
    {
      id: 1,
      user: {
        id: 2,
        userName: 'user2',
      },
    },
    {
      id: 2,
      user: {
        id: 3,
        userName: 'user3',
      },
    },
  ],
  comments: [
    {
      id: 1,
      content: 'comment-1',
      user: {
        id: 3,
        userName: 'user3',
      },
      createdAt: new Date(),
    },
    {
      id: 2,
      content: 'comment-2',
      user: {
        id: 4,
        userName: 'user4',
      },
      createdAt: new Date(),
    },
  ],
  createdAt: new Date(),
};
