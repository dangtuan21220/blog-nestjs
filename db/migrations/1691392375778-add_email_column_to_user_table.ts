import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailColumnToUserTable1691392375778 implements MigrationInterface {
    name = 'AddEmailColumnToUserTable1691392375778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
    }

}
