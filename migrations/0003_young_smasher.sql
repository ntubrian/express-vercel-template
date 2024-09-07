CREATE TABLE IF NOT EXISTS "activities_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"proposal_id" uuid NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "proposals_table" RENAME COLUMN "title" TO "description";--> statement-breakpoint
ALTER TABLE "proposals_table" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "proposals_table" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "proposals_table" ADD COLUMN "author" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activities_table" ADD CONSTRAINT "activities_table_proposal_id_proposals_table_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposals_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
