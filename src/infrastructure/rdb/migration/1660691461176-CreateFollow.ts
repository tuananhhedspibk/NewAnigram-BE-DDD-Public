import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFollow1660691461176 implements MigrationInterface {
  name = 'CreateFollow1660691461176';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `follows` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `source_user_id` int NOT NULL, `destination_user_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `follows` ADD CONSTRAINT `FK_adf545d2bac8ec4dafb1bc9d7cd` FOREIGN KEY (`destination_user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `follows` ADD CONSTRAINT `FK_73a427691964065faf4da3715ee` FOREIGN KEY (`source_user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `follows` DROP FOREIGN KEY `FK_73a427691964065faf4da3715ee`',
    );
    await queryRunner.query(
      'ALTER TABLE `follows` DROP FOREIGN KEY `FK_adf545d2bac8ec4dafb1bc9d7cd`',
    );
    await queryRunner.query('DROP TABLE `follows`');
  }
}
