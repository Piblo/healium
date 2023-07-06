ALTER TABLE `users_to_health_entities` MODIFY COLUMN `user_id` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `users_to_health_entities` MODIFY COLUMN `health_entity_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `users_to_health_entities` ADD PRIMARY KEY(`health_entity_id`,`user_id`);