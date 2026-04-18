ALTER TABLE "reservations" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'confirmed'::text;--> statement-breakpoint
DROP TYPE "public"."reservation_statuses";--> statement-breakpoint
CREATE TYPE "public"."reservation_statuses" AS ENUM('pending', 'confirmed', 'completed', 'canceled_by_client', 'canceled_by_staff', 'declined', 'no_show');--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'confirmed'::"public"."reservation_statuses";--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DATA TYPE "public"."reservation_statuses" USING "status"::"public"."reservation_statuses";