CREATE TABLE `organization` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`logo_url` text,
	`plan` text DEFAULT 'basic' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`stripe_customer_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organization_slug_unique` ON `organization` (`slug`);--> statement-breakpoint
CREATE INDEX `org_slug_idx` ON `organization` (`slug`);--> statement-breakpoint
CREATE INDEX `org_status_idx` ON `organization` (`status`);--> statement-breakpoint
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`org_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `user_org_idx` ON `user` (`org_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_org_email_unique` ON `user` (`org_id`,`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`is_system` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`org_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `role_org_idx` ON `roles` (`org_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `role_org_name_unique` ON `roles` (`org_id`,`name`);--> statement-breakpoint
CREATE TABLE `permission` (
	`id` text PRIMARY KEY NOT NULL,
	`role_id` text NOT NULL,
	`resource` text NOT NULL,
	`action` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `perm_role_idx` ON `permission` (`role_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `perm_role_resource_action_unique` ON `permission` (`role_id`,`resource`,`action`);--> statement-breakpoint
CREATE TABLE `user_role` (
	`user_id` text NOT NULL,
	`role_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `role_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_role_user_idx` ON `user_role` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_role_role_idx` ON `user_role` (`role_id`);--> statement-breakpoint
CREATE TABLE `project` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'active' NOT NULL,
	`public_api_key` text,
	`domain` text,
	`git_repo` text,
	`created_by_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`org_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `project_public_api_key_unique` ON `project` (`public_api_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `project_domain_unique` ON `project` (`domain`);--> statement-breakpoint
CREATE INDEX `project_org_idx` ON `project` (`org_id`);--> statement-breakpoint
CREATE INDEX `project_status_idx` ON `project` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `project_org_slug_unique` ON `project` (`org_id`,`slug`);--> statement-breakpoint
CREATE TABLE `project_member` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role_id` text NOT NULL,
	`added_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `proj_member_project_idx` ON `project_member` (`project_id`);--> statement-breakpoint
CREATE INDEX `proj_member_user_idx` ON `project_member` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `proj_member_project_user_unique` ON `project_member` (`project_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `content_type` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`schema` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `content_type_project_idx` ON `content_type` (`project_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `content_type_project_slug_unique` ON `content_type` (`project_id`,`slug`);--> statement-breakpoint
CREATE TABLE `content` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`content_type_id` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`data` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_by_id` text NOT NULL,
	`updated_by_id` text,
	`published_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`content_type_id`) REFERENCES `content_type`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`updated_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `content_project_idx` ON `content` (`project_id`);--> statement-breakpoint
CREATE INDEX `content_status_idx` ON `content` (`status`);--> statement-breakpoint
CREATE INDEX `content_published_idx` ON `content` (`published_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `content_project_slug_unique` ON `content` (`project_id`,`slug`);--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`name` text NOT NULL,
	`file_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`file_size` integer NOT NULL,
	`storage_path` text NOT NULL,
	`public_url` text NOT NULL,
	`width` integer,
	`height` integer,
	`tags` text NOT NULL,
	`alt_text` text NOT NULL,
	`uploaded_by_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uploaded_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `media_project_idx` ON `media` (`project_id`);--> statement-breakpoint
CREATE TABLE `api_token` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`name` text NOT NULL,
	`token_hash` text NOT NULL,
	`scopes` text NOT NULL,
	`last_used_at` integer,
	`expires_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `api_token_token_hash_unique` ON `api_token` (`token_hash`);--> statement-breakpoint
CREATE INDEX `api_token_project_idx` ON `api_token` (`project_id`);