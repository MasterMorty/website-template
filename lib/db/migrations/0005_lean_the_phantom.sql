DROP INDEX "account_userId_idx";--> statement-breakpoint
DROP INDEX "apikey_key_idx";--> statement-breakpoint
DROP INDEX "apikey_userId_idx";--> statement-breakpoint
DROP INDEX "invitation_organizationId_idx";--> statement-breakpoint
DROP INDEX "invitation_email_idx";--> statement-breakpoint
DROP INDEX "member_organizationId_idx";--> statement-breakpoint
DROP INDEX "member_userId_idx";--> statement-breakpoint
DROP INDEX "organization_slug_unique";--> statement-breakpoint
DROP INDEX "organization_slug_uidx";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "session_userId_idx";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
DROP INDEX "verification_identifier_idx";--> statement-breakpoint
DROP INDEX "project_public_api_key_unique";--> statement-breakpoint
DROP INDEX "project_domain_unique";--> statement-breakpoint
DROP INDEX "project_org_idx";--> statement-breakpoint
DROP INDEX "project_status_idx";--> statement-breakpoint
DROP INDEX "project_org_slug_unique";--> statement-breakpoint
DROP INDEX "content_type_project_idx";--> statement-breakpoint
DROP INDEX "content_type_project_slug_unique";--> statement-breakpoint
DROP INDEX "content_project_idx";--> statement-breakpoint
DROP INDEX "content_status_idx";--> statement-breakpoint
DROP INDEX "content_published_idx";--> statement-breakpoint
DROP INDEX "content_project_slug_unique";--> statement-breakpoint
DROP INDEX "media_project_idx";--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "org_id" TO "org_id" text;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `apikey_key_idx` ON `apikey` (`key`);--> statement-breakpoint
CREATE INDEX `apikey_userId_idx` ON `apikey` (`user_id`);--> statement-breakpoint
CREATE INDEX `invitation_organizationId_idx` ON `invitation` (`organization_id`);--> statement-breakpoint
CREATE INDEX `invitation_email_idx` ON `invitation` (`email`);--> statement-breakpoint
CREATE INDEX `member_organizationId_idx` ON `member` (`organization_id`);--> statement-breakpoint
CREATE INDEX `member_userId_idx` ON `member` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `organization_slug_unique` ON `organization` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `organization_slug_uidx` ON `organization` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
CREATE UNIQUE INDEX `project_public_api_key_unique` ON `project` (`public_api_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `project_domain_unique` ON `project` (`domain`);--> statement-breakpoint
CREATE INDEX `project_org_idx` ON `project` (`org_id`);--> statement-breakpoint
CREATE INDEX `project_status_idx` ON `project` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `project_org_slug_unique` ON `project` (`org_id`,`slug`);--> statement-breakpoint
CREATE INDEX `content_type_project_idx` ON `content_type` (`project_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `content_type_project_slug_unique` ON `content_type` (`project_id`,`slug`);--> statement-breakpoint
CREATE INDEX `content_project_idx` ON `content` (`project_id`);--> statement-breakpoint
CREATE INDEX `content_status_idx` ON `content` (`status`);--> statement-breakpoint
CREATE INDEX `content_published_idx` ON `content` (`published_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `content_project_slug_unique` ON `content` (`project_id`,`slug`);--> statement-breakpoint
CREATE INDEX `media_project_idx` ON `media` (`project_id`);