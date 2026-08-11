CREATE TYPE "public"."enquiry_status" AS ENUM('new', 'in_progress', 'quoted', 'won', 'lost', 'spam');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'editor');--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"email" varchar(160) NOT NULL,
	"phone" varchar(60),
	"company" varchar(160),
	"vessel" varchar(120),
	"service" varchar(160),
	"message" text NOT NULL,
	"status" "enquiry_status" DEFAULT 'new' NOT NULL,
	"notes" text,
	"source_path" varchar(255),
	"user_agent" varchar(255),
	"ip_hash" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(140) NOT NULL,
	"vessel_type" varchar(160) NOT NULL,
	"scope_label" varchar(160) NOT NULL,
	"category_slug" varchar(120),
	"service_slug" varchar(120),
	"challenge" text NOT NULL,
	"approach" text NOT NULL,
	"outcome" text NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(160) NOT NULL,
	"seo_title" varchar(200) NOT NULL,
	"meta_description" text NOT NULL,
	"tagline" varchar(200) NOT NULL,
	"summary" text NOT NULL,
	"intro" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"icon" varchar(40) NOT NULL,
	"keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"faqs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(160) NOT NULL,
	"seo_title" varchar(200) NOT NULL,
	"meta_description" text NOT NULL,
	"tagline" varchar(200) NOT NULL,
	"summary" text NOT NULL,
	"intro" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"highlights" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"scope" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"process" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"applies_to" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"faqs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"coverage_areas" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"coverage_worldwide" boolean DEFAULT false NOT NULL,
	"media_slug" varchar(120),
	"position" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(160) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(120) NOT NULL,
	"role" "user_role" DEFAULT 'editor' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "enquiries_status_idx" ON "enquiries" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_unique" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "projects_position_idx" ON "projects" USING btree ("position");--> statement-breakpoint
CREATE UNIQUE INDEX "service_categories_slug_unique" ON "service_categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "service_categories_position_idx" ON "service_categories" USING btree ("position");--> statement-breakpoint
CREATE UNIQUE INDEX "services_category_slug_unique" ON "services" USING btree ("category_id","slug");--> statement-breakpoint
CREATE INDEX "services_position_idx" ON "services" USING btree ("position");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");