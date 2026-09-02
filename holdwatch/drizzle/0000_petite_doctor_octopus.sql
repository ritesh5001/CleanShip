CREATE TYPE "public"."hw_job_status" AS ENUM('scheduled', 'in-progress', 'complete', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."hw_job_type" AS ENUM('hold-cleaning', 'tank-cleaning');--> statement-breakpoint
CREATE TYPE "public"."hw_stage_action" AS ENUM('completed', 'undone');--> statement-breakpoint
CREATE TYPE "public"."hw_user_role" AS ENUM('admin', 'supervisor', 'client');--> statement-breakpoint
CREATE TABLE "hw_clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"contact_name" varchar(120),
	"contact_email" varchar(160),
	"contact_phone" varchar(40),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hw_compartments" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"position" integer NOT NULL,
	"label" varchar(40) NOT NULL,
	"completed" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"notes" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hw_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"reference" varchar(32) NOT NULL,
	"vessel_name" varchar(160) NOT NULL,
	"imo" varchar(16),
	"port" varchar(160) NOT NULL,
	"berth" varchar(120),
	"job_type" "hw_job_type" DEFAULT 'hold-cleaning' NOT NULL,
	"status" "hw_job_status" DEFAULT 'scheduled' NOT NULL,
	"client_id" integer NOT NULL,
	"supervisor_id" integer,
	"compartment_count" integer DEFAULT 5 NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"scheduled_for" timestamp with time zone,
	"notes" text,
	"share_token" varchar(64) NOT NULL,
	"share_revoked" integer DEFAULT 0 NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hw_stage_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"compartment_id" integer NOT NULL,
	"stage_key" varchar(40) NOT NULL,
	"action" "hw_stage_action" NOT NULL,
	"user_id" integer NOT NULL,
	"user_name" varchar(120) NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"idempotency_key" varchar(64)
);
--> statement-breakpoint
CREATE TABLE "hw_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(160) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(120) NOT NULL,
	"role" "hw_user_role" DEFAULT 'supervisor' NOT NULL,
	"client_id" integer,
	"phone" varchar(40),
	"active" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "hw_compartments_job_position_idx" ON "hw_compartments" USING btree ("job_id","position");--> statement-breakpoint
CREATE INDEX "hw_compartments_job_idx" ON "hw_compartments" USING btree ("job_id");--> statement-breakpoint
CREATE UNIQUE INDEX "hw_jobs_reference_idx" ON "hw_jobs" USING btree ("reference");--> statement-breakpoint
CREATE UNIQUE INDEX "hw_jobs_share_token_idx" ON "hw_jobs" USING btree ("share_token");--> statement-breakpoint
CREATE INDEX "hw_jobs_client_idx" ON "hw_jobs" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "hw_jobs_supervisor_idx" ON "hw_jobs" USING btree ("supervisor_id");--> statement-breakpoint
CREATE INDEX "hw_stage_events_job_idx" ON "hw_stage_events" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "hw_stage_events_compartment_idx" ON "hw_stage_events" USING btree ("compartment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "hw_stage_events_idem_idx" ON "hw_stage_events" USING btree ("idempotency_key");--> statement-breakpoint
CREATE UNIQUE INDEX "hw_users_email_idx" ON "hw_users" USING btree ("email");