import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeLikeAndCommentTableName1660661620786 implements MigrationInterface {
    name = 'ChangeLikeAndCommentTableName1660661620786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `likes` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `user_id` int NOT NULL, `post_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `comments` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `content` varchar(255) NOT NULL, `user_id` int NOT NULL, `post_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `likes` ADD CONSTRAINT `FK_3f519ed95f775c781a254089171` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `likes` ADD CONSTRAINT `FK_741df9b9b72f328a6d6f63e79ff` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `comments` ADD CONSTRAINT `FK_4c675567d2a58f0b07cef09c13d` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `comments` ADD CONSTRAINT `FK_259bf9825d9d198608d1b46b0b5` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `comments` DROP FOREIGN KEY `FK_259bf9825d9d198608d1b46b0b5`");
        await queryRunner.query("ALTER TABLE `comments` DROP FOREIGN KEY `FK_4c675567d2a58f0b07cef09c13d`");
        await queryRunner.query("ALTER TABLE `likes` DROP FOREIGN KEY `FK_741df9b9b72f328a6d6f63e79ff`");
        await queryRunner.query("ALTER TABLE `likes` DROP FOREIGN KEY `FK_3f519ed95f775c781a254089171`");
        await queryRunner.query("DROP TABLE `comments`");
        await queryRunner.query("DROP TABLE `likes`");
    }

}
