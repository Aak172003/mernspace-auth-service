import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTables1749751059852 implements MigrationInterface {
    name = "RenameTables1749751059852";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop constraint from the old table name first
        await queryRunner.query(
            `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`,
        );

        // Then rename the tables
        await queryRunner.renameTable("user", "users");
        await queryRunner.renameTable("refresh_token", "refreshTokens");

        // Finally add the new constraint
        await queryRunner.query(
            `ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`,
        );

        await queryRunner.renameTable("users", "user");
        await queryRunner.renameTable("refreshTokens", "refresh_token");
    }
}
