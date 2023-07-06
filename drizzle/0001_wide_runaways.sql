CREATE TABLE `users_to_health_entities` (
	`user_id` varchar(256),
	`health_entity_id` varchar(36));
--> statement-breakpoint
RENAME TABLE `HealthEntities` TO `health_entities`;--> statement-breakpoint
ALTER TABLE `users_to_health_entities` ADD CONSTRAINT `users_to_health_entities_health_entity_id_health_entities_id_fk` FOREIGN KEY (`health_entity_id`) REFERENCES `health_entities`(`id`) ON DELETE no action ON UPDATE no action;