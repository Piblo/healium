-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `health_entities` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`logo_url` text,
	`address` text,
	`phone_number` varchar(20),
	`email` varchar(255),
	CONSTRAINT `health_entities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_application` (
	`id` varchar(36) NOT NULL,
	`job_offer_id` varchar(36),
	`user_id` varchar(36),
	`created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `job_application_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_offers` (
	`id` varchar(36) NOT NULL,
	`health_entity_id` varchar(36) NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`region` varchar(128),
	`city` varchar(128),
	`contract_type` enum('full-time','part-time','fixed-term'),
	`start_date` date,
	`end_date` date,
	`created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `job_offers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_to_health_entities` (
	`health_entity_id` varchar(36) NOT NULL,
	`invited_date` datetime NOT NULL,
	`email` varchar(256) NOT NULL,
	`accepted_date` datetime,
	`status` enum('pending','accepted') NOT NULL,
	`user_id` varchar(256),
	CONSTRAINT `users_to_health_entities_email_health_entity_id` PRIMARY KEY(`email`,`health_entity_id`)
);

*/