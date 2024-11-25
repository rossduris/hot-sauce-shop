ALTER TABLE "product" ADD COLUMN "isActive" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "isArchived" boolean DEFAULT false NOT NULL;