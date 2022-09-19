import { TypeOrmModule } from '@nestjs/typeorm';

import CustomNamingStrategy from '../typeorm-custom-name-strategy';
import RDBConfig from '../../';

import User from '@infrastructure/rdb/entity/user';
import UserDetail from '@infrastructure/rdb/entity/user-detail';
import Post from '@infrastructure/rdb/entity/post';
import Like from '@infrastructure/rdb/entity/like';
import Comment from '@infrastructure/rdb/entity/comment';
import Follow from '@infrastructure/rdb/entity/follow';
import Notification from '@infrastructure/rdb/entity/notification';

const getConnection = () => {
  const entities = [
    User,
    UserDetail,
    Post,
    Like,
    Comment,
    Follow,
    Notification,
  ];

  return TypeOrmModule.forRoot({
    type: RDBConfig.type,
    host: RDBConfig.host,
    port: RDBConfig.port,
    username: RDBConfig.username,
    password: RDBConfig.password,
    database: RDBConfig.database,
    entities,
    timezone: 'Z',
    synchronize: false,
    logging: true,
    // logger: TypeormCustomLogger, → TODO: need to be configured
    namingStrategy: new CustomNamingStrategy(),
  });
};

export const connection = getConnection();
