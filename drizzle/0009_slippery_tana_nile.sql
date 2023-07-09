DROP TABLE `health_entity_invites`;--> statement-breakpoint
ALTER TABLE `users_to_health_entities` RENAME COLUMN `created_date` TO `invited_date`;--> statement-breakpoint
ALTER TABLE `users_to_health_entities` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `users_to_health_entities` ADD `email` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `users_to_health_entities` ADD `accepted_date` datetime;--> statement-breakpoint
ALTER TABLE `users_to_health_entities` ADD `status` enum('pending','accepted');--> statement-breakpoint
ALTER TABLE `users_to_health_entities` DROP COLUMN `user_id`;--> statement-breakpoint
ALTER TABLE `users_to_health_entities` ADD PRIMARY KEY(`email`,`health_entity_id`);