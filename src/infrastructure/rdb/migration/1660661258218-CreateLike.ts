import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLike1660661258218 implements MigrationInterface {
  name = 'CreateLike1660661258218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `like_entities` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `user_id` int NOT NULL, `post_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `like_entities` ADD CONSTRAINT `FK_2bc1b7a1e239d520ddd40753ccb` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `like_entities` ADD CONSTRAINT `FK_4763d225b5f4077b998a58a8ae4` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `like_entities` DROP FOREIGN KEY `FK_4763d225b5f4077b998a58a8ae4`',
    );
    await queryRunner.query(
      'ALTER TABLE `like_entities` DROP FOREIGN KEY `FK_2bc1b7a1e239d520ddd40753ccb`',
    );
    await queryRunner.query('DROP TABLE `like_entities`');
  }
}
