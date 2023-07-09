CREATE TABLE `health_entity_invites` (
	`id` varchar(256) PRIMARY KEY NOT NULL,
	`email` varchar(256) NOT NULL,
	`created_date` datetime NOT NULL);
--> statement-breakpoint
ALTER TABLE `users_to_health_entities` MODIFY COLUMN `created_date` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `users_to_health_entities` DROP COLUMN `invite_status`;