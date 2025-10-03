import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759490912979 implements MigrationInterface {
  name = 'Migration1759490912979';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lists" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "user_id" character varying NOT NULL, CONSTRAINT "PK_268b525e9a6dd04d0685cb2aaaa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "list_items" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "item_id" character varying NOT NULL, "list_id" character varying NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_26260957b2b71a1d8e2ecd005f8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "lists" ADD CONSTRAINT "FK_f01581ed98cd99b38495bcdd16b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_items" ADD CONSTRAINT "FK_ac3b5466a5f2799771ca190c09f" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_items" ADD CONSTRAINT "FK_8bf07909d6d9e95e8e637bd5b3e" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "list_items" DROP CONSTRAINT "FK_8bf07909d6d9e95e8e637bd5b3e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_items" DROP CONSTRAINT "FK_ac3b5466a5f2799771ca190c09f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lists" DROP CONSTRAINT "FK_f01581ed98cd99b38495bcdd16b"`,
    );
    await queryRunner.query(`DROP TABLE "list_items"`);
    await queryRunner.query(`DROP TABLE "lists"`);
  }
}
