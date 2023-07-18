CREATE TABLE `job_offers` (
	`id` varchar(36) PRIMARY KEY NOT NULL,
	`health_entity_id` varchar(36),
	`title` varchar(256) NOT NULL,
	`description` text,
	`region` varchar(128),
	`city` varchar(128),
	`contract_type` enum('full-time','part-time','fixed-term'),
	`start_date` date,
	`end_date` date
);
