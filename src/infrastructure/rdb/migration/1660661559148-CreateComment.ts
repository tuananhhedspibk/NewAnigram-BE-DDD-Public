import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateComment1660661559148 implements MigrationInterface {
  name = 'CreateComment1660661559148';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `comment_entities` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `content` varchar(255) NOT NULL, `user_id` int NOT NULL, `post_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `comment_entities` ADD CONSTRAINT `FK_3635868cd061cff4bf1ae6fb12f` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `comment_entities` ADD CONSTRAINT `FK_63c7812e524428b78bc6456097f` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `comment_entities` DROP FOREIGN KEY `FK_63c7812e524428b78bc6456097f`',
    );
    await queryRunner.query(
      'ALTER TABLE `comment_entities` DROP FOREIGN KEY `FK_3635868cd061cff4bf1ae6fb12f`',
    );
    await queryRunner.query('DROP TABLE `comment_entities`');
  }
}
