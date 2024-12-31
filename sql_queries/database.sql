-- Clear existing database
DROP TABLE IF EXISTS `dailyblessings`.`account`;
DROP TABLE IF EXISTS `dailyblessings`.`answers`;
DROP TABLE IF EXISTS `dailyblessings`.`classroom_member`;
DROP TABLE IF EXISTS `dailyblessings`.`classroom`;
DROP TABLE IF EXISTS `dailyblessings`.`curriculum_questions`;
DROP TABLE IF EXISTS `dailyblessings`.`curriculum_day`;
DROP TABLE IF EXISTS `dailyblessings`.`curriculum`;
DROP TABLE IF EXISTS `dailyblessings`.`day`;
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
	`answerId` int AUTO_INCREMENT NOT NULL,
	`questionId` int NOT NULL,
	`answer` text NOT NULL,
	`userId` varchar(36) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `answers_answerId` PRIMARY KEY(`answerId`)
);
CREATE TABLE `classroom` (
	`classroomId` int AUTO_INCREMENT NOT NULL,
	`curriculumId` int NOT NULL,
	CONSTRAINT `classroom_classroomId` PRIMARY KEY(`classroomId`)
);
CREATE TABLE `classroom_member` (
	`classroomId` int NOT NULL,
	`userId` varchar(36) NOT NULL,
	CONSTRAINT `classroom_member_classroomId_userId_pk` PRIMARY KEY(`classroomId`,`userId`)
);
CREATE TABLE `curriculum` (
	`curriculumId` int AUTO_INCREMENT NOT NULL,
	`name` varchar(24),
	CONSTRAINT `curriculum_curriculumId` PRIMARY KEY(`curriculumId`)
);
CREATE TABLE `curriculum_day` (
	`curriculumId` int NOT NULL,
	`date` date NOT NULL,
	`book` varchar(24),
	`chapter` int,
	`lowerVerse` int,
	`upperVerse` int,
	CONSTRAINT `curriculum_day_curriculumId_date_pk` PRIMARY KEY(`curriculumId`,`date`)
);
CREATE TABLE `curriculum_questions` (
	`questionId` int AUTO_INCREMENT NOT NULL,
	`isFillInTheBlank` boolean NOT NULL,
	`question` text NOT NULL,
	`curriculumId` int NOT NULL,
	`date` date NOT NULL,
	CONSTRAINT `curriculum_questions_questionId` PRIMARY KEY(`questionId`)
);
CREATE TABLE `day` (
	`date` date NOT NULL,
	`copticDate` varchar(36) NOT NULL,
	`feast` text,
	CONSTRAINT `day_date` PRIMARY KEY(`date`)
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
	`userId` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`emailVerified` boolean NOT NULL,
	`role` text NOT NULL,
	`image` text,
	`createdAt` timestamp NOT NULL,
	`updatedAt` timestamp NOT NULL,
	CONSTRAINT `user_userId` PRIMARY KEY(`userId`),
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
ALTER TABLE `account` ADD CONSTRAINT `account_userId_user_userId_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `answers` ADD CONSTRAINT `answers_questionId_curriculum_questions_questionId_fk` FOREIGN KEY (`questionId`) REFERENCES `curriculum_questions`(`questionId`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `answers` ADD CONSTRAINT `answers_userId_user_userId_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `classroom` ADD CONSTRAINT `classroom_curriculumId_curriculum_curriculumId_fk` FOREIGN KEY (`curriculumId`) REFERENCES `curriculum`(`curriculumId`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `classroom_member` ADD CONSTRAINT `classroom_member_classroomId_classroom_classroomId_fk` FOREIGN KEY (`classroomId`) REFERENCES `classroom`(`classroomId`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `classroom_member` ADD CONSTRAINT `classroom_member_userId_user_userId_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `curriculum_day` ADD CONSTRAINT `curriculum_day_curriculumId_curriculum_curriculumId_fk` FOREIGN KEY (`curriculumId`) REFERENCES `curriculum`(`curriculumId`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `curriculum_day` ADD CONSTRAINT `curriculum_day_date_day_date_fk` FOREIGN KEY (`date`) REFERENCES `day`(`date`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `curriculum_questions` ADD CONSTRAINT `curric_quest_curric_day_fk` FOREIGN KEY (`curriculumId`,`date`) REFERENCES `curriculum_day`(`curriculumId`,`date`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `session` ADD CONSTRAINT `session_userId_user_userId_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE no action ON UPDATE no action;