DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('reviewing', 'accepted', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "proposals_table" (
	"id" uuid DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"image" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" "status"
);
