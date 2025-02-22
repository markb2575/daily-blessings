-- Clear existing database
DROP TABLE IF EXISTS `dailyblessings`.`account`;
DROP TABLE IF EXISTS `dailyblessings`.`answers`;
DROP TABLE IF EXISTS `dailyblessings`.`classroom_member`;
DROP TABLE IF EXISTS `dailyblessings`.`classroom`;
DROP TABLE IF EXISTS `dailyblessings`.`curriculum_questions`;
DROP TABLE IF EXISTS `dailyblessings`.`curriculum_day`;
DROP TABLE IF EXISTS `dailyblessings`.`curriculum`;
DROP TABLE IF EXISTS `dailyblessings`.`session`;
DROP TABLE IF EXISTS `dailyblessings`.`user`;
DROP TABLE IF EXISTS `dailyblessings`.`verification`;

-- Create Tables
CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` varchar(36) NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` timestamp,
	`refreshTokenExpiresAt` timestamp,
	`scope` text,
	`password` text,
	`createdAt` timestamp NOT NULL,
	`updatedAt` timestamp NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
CREATE TABLE `answers` (
	`questionId` int NOT NULL,
    `classroomId` int NOT NULL,
	`answer` text NOT NULL,
	`userId` varchar(36) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `answers_pk` PRIMARY KEY(`questionId`, `classroomId`, `userId`)
);
CREATE TABLE `classroom` (
	`classroomId` int AUTO_INCREMENT NOT NULL,
	`curriculumId` int NOT NULL,
    `studentCode` varchar(7) NOT NULL,
    `teacherCode` varchar(7) NOT NULL,
    `classroomName` varchar(24) NOT NULL,
    `dayIndex` int NOT NULL DEFAULT (0),
    `createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `classroom_classroomId` PRIMARY KEY(`classroomId`)
);
CREATE TABLE `classroom_member` (
	`classroomId` int NOT NULL,
	`userId` varchar(36) NOT NULL,
    `role` varchar(12) NOT NULL,
	CONSTRAINT `classroom_member_classroomId_userId_pk` PRIMARY KEY(`classroomId`,`userId`)
);
CREATE TABLE `curriculum` (
	`curriculumId` int AUTO_INCREMENT NOT NULL,
	`name` varchar(24),
	CONSTRAINT `curriculum_curriculumId` PRIMARY KEY(`curriculumId`)
);
CREATE TABLE `curriculum_day` (
	`curriculumId` int NOT NULL,
	`dayIndex` int NOT NULL,
	`book` varchar(24),
	`chapter` int,
	`lowerVerse` int,
	`upperVerse` int,
	CONSTRAINT `curriculum_day_curriculumId_date_pk` PRIMARY KEY(`curriculumId`,`dayIndex`)
);
CREATE TABLE `curriculum_questions` (
	`questionId` int AUTO_INCREMENT NOT NULL,
	`isFillInTheBlank` boolean NOT NULL,
	`question` text NOT NULL,
	`curriculumId` int NOT NULL,
    `dayIndex` int NOT NULL,
	CONSTRAINT `curriculum_questions_questionId` PRIMARY KEY(`questionId`)
);
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`token` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL,
	`updatedAt` timestamp NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` varchar(36) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`emailVerified` boolean NOT NULL,
	`role` varchar(12) DEFAULT 'none' NOT NULL,
	`image` text,
	`createdAt` timestamp NOT NULL,
	`updatedAt` timestamp NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp,
	`updatedAt` timestamp,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
ALTER TABLE `account` ADD CONSTRAINT `account_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `answers` ADD CONSTRAINT `answers_questionId_curriculum_questions_questionId_fk` FOREIGN KEY (`questionId`) REFERENCES `curriculum_questions`(`questionId`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `answers` ADD CONSTRAINT `answers_classroomId_classroom_classroomId_fk` FOREIGN KEY (`classroomId`) REFERENCES `classroom`(`classroomId`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `answers` ADD CONSTRAINT `answers_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `classroom` ADD CONSTRAINT `classroom_curriculumId_curriculum_curriculumId_fk` FOREIGN KEY (`curriculumId`) REFERENCES `curriculum`(`curriculumId`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `classroom_member` ADD CONSTRAINT `classroom_member_classroomId_classroom_classroomId_fk` FOREIGN KEY (`classroomId`) REFERENCES `classroom`(`classroomId`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `classroom_member` ADD CONSTRAINT `classroom_member_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `curriculum_day` ADD CONSTRAINT `curriculum_day_curriculumId_curriculum_curriculumId_fk` FOREIGN KEY (`curriculumId`) REFERENCES `curriculum`(`curriculumId`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `curriculum_questions` ADD CONSTRAINT `curric_quest_curric_day_fk` FOREIGN KEY (`curriculumId`,`dayIndex`) REFERENCES `curriculum_day`(`curriculumId`,`dayIndex`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `session` ADD CONSTRAINT `session_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;