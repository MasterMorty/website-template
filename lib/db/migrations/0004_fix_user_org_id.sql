PRAGMA foreign_keys=OFF;
--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`role` text,
	`banned` integer DEFAULT false,
	`ban_reason` text,
	`ban_expires` integer,
	`org_id` text
);
--> statement-breakpoint
INSERT INTO `__new_user` SELECT
	id, name, email, email_verified, image, created_at, updated_at,
	role, banned, ban_reason, ban_expires,
	CASE
		WHEN EXISTS(SELECT 1 FROM organization WHERE organization.id = "user".org_id)
			THEN "user".org_id
		ELSE (SELECT organization_id FROM member WHERE member.user_id = "user".id LIMIT 1)
	END
FROM `user`;
--> statement-breakpoint
DROP TABLE `user`;
--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);
--> statement-breakpoint
PRAGMA foreign_keys=ON;
