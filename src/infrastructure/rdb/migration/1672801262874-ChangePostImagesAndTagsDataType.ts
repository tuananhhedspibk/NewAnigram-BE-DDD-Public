import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePostImagesAndTagsDataType1672801262874
  implements MigrationInterface
{
  name = 'ChangePostImagesAndTagsDataType1672801262874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `posts` DROP COLUMN `tags`');
    await queryRunner.query('ALTER TABLE `posts` ADD `tags` json NOT NULL');
    await queryRunner.query('ALTER TABLE `posts` DROP COLUMN `images`');
    await queryRunner.query('ALTER TABLE `posts` ADD `images` json NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `posts` DROP COLUMN `images`');
    await queryRunner.query(
      'ALTER TABLE `posts` ADD `images` varchar(255) NOT NULL',
    );
    await queryRunner.query('ALTER TABLE `posts` DROP COLUMN `tags`');
    await queryRunner.query(
      'ALTER TABLE `posts` ADD `tags` varchar(255) NOT NULL',
    );
  }
}
