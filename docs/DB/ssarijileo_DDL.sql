-- 추후 로깅용 테이블 하나 생성 (권장)

-- Auth DB

CREATE DATABASE IF NOT EXISTS ssarijileo_auth;
USE ssarijileo_auth;

-- 사용자 테이블
/*
	탈퇴한 회원 정보는 삭제하지 않고 N년 동안 보관
    위 내용은 이용약관에 공지
*/

CREATE TABLE IF NOT EXISTS `user` (
	`user_id` VARCHAR(36) COMMENT 'PK',
    `social_id` VARCHAR(10) NOT NULL UNIQUE COMMENT '고유번호',
    `status` CHAR(1) NOT NULL DEFAULT 'A' COMMENT '상태(A:활동회원,X:탈퇴회원,B:차단회원)',
    PRIMARY KEY (`user_id`),
    INDEX `idx_social_id` (`social_id`)
)
ENGINE = InnoDB;

-- Business DB

CREATE DATABASE IF NOT EXISTS ssarijileo;
USE ssarijileo;

-- 프로필 테이블

CREATE TABLE IF NOT EXISTS `profile` (
	`profile_id` VARCHAR(36) COMMENT 'PK',
    `nickname` VARCHAR(50) NOT NULL UNIQUE COMMENT '닉네임',
    `image` VARCHAR(255) NOT NULL DEFAULT "default.jpg" COMMENT '프로필이미지',
    PRIMARY KEY (`profile_id`)
)
ENGINE = InnoDB;

-- 친구 테이블

CREATE TABLE IF NOT EXISTS `friend` (
	`friend_id` INT AUTO_INCREMENT COMMENT 'PK',
	`from_user_nickname` VARCHAR(50) NOT NULL COMMENT '보낸사람 닉네임',
	`to_user_nickname` VARCHAR(50) NOT NULL COMMENT '받는사람 닉네임',
	`status` CHAR(1) NOT NULL DEFAULT 'W' COMMENT '상태(W:대기,A:수락,X:취소)',
	PRIMARY KEY (`friend_id`),
	CONSTRAINT `fk_profile_friend_from`
		FOREIGN KEY (`from_user_nickname`)
        REFERENCES `profile` (`nickname`) ON DELETE CASCADE,
	CONSTRAINT `fk_profile_friend_to`
		FOREIGN KEY (`to_user_nickname`)
        REFERENCES `profile` (`nickname`) ON DELETE CASCADE
  )
  ENGINE = InnoDB;

-- 노래 테이블
/*
	좋아요수는 로그파일로 분리
*/

CREATE TABLE IF NOT EXISTS `song` (
	`song_id` INT AUTO_INCREMENT COMMENT 'PK',
    `title` VARCHAR(50) NOT NULL COMMENT '제목',
    `singer` VARCHAR(30) NOT NULL COMMENT '가수',
    `album` VARCHAR(60) NOT NULL COMMENT '앨범명',
	`time` TIME NOT NULL COMMENT '시간',
	`image` VARCHAR(255) NOT NULL DEFAULT "default.jpg" COMMENT '앨범이미지',
    `file` VARCHAR(255) NOT NULL DEFAULT "file.mp3" COMMENT '노래파일',
    `release_date` DATE NOT NULL COMMENT '발매일자',
    `note` TEXT COMMENT '시간음정',
    PRIMARY KEY (`song_id`)
)
ENGINE = InnoDB;

-- 가사 테이블
/*
	이어부르기 모드에서 사용
    상태값이 'O'랑 'H' 인 경우 가사순서맞추기 모드에서 사용
    'H(하이라이트)' 인 경우 가사를 랜덤으로 쪼개기
*/

CREATE TABLE IF NOT EXISTS `lyrics` (
	`lyrics_id` INT AUTO_INCREMENT COMMENT 'PK',
	`song_id` INT NOT NULL COMMENT '노래PK',
    `verse` VARCHAR(255) NOT NULL COMMENT '한소절',
    `time` DECIMAL(5,2) NOT NULL COMMENT '시간',
    PRIMARY KEY (`lyrics_id`),
	CONSTRAINT `fk_song_lyrics`
		FOREIGN KEY (`song_id`)
        REFERENCES `song` (`song_id`) ON DELETE CASCADE
)
ENGINE = InnoDB;

-- 사용자 노래 테이블

CREATE TABLE IF NOT EXISTS `singing` (
	`singing_id` INT AUTO_INCREMENT COMMENT 'PK',
    `user_id` VARCHAR(36) NOT NULL COMMENT '사용자PK',
    `song_id` INT NOT NULL COMMENT '노래PK',
    `mode` CHAR(1) NOT NULL DEFAULT 'N' COMMENT '모드(N:일반,P:퍼펙트스코어,O:가사순서맞추기,R:이어부르기)',
    `score` INT COMMENT '점수',
    `total_singing_time` TIME NOT NULL COMMENT '총부른시간',
    `state` CHAR(1) NOT NULL DEFAULT 'I' COMMENT '상태(I:추가,C:취소)',
    `singing_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '노래일시',
    PRIMARY KEY (`singing_id`),
	CONSTRAINT `fk_profile_singing`
		FOREIGN KEY (`user_id`)
        REFERENCES `profile` (`profile_id`) ON DELETE CASCADE,
	CONSTRAINT `fk_song_singing`
		FOREIGN KEY (`song_id`)
        REFERENCES `song` (`song_id`) ON DELETE CASCADE
)
ENGINE = InnoDB;

-- 애창곡 테이블
/*
	데이터가 홀수면 애창곡
    짝수면 애창곡 취소
*/

CREATE TABLE IF NOT EXISTS `favorite_song` (
	`favorite_song_id` INT AUTO_INCREMENT COMMENT 'PK',
	`user_id` VARCHAR(36) NOT NULL COMMENT '사용자PK',
    `song_id` TEXT NOT NULL COMMENT '노래PK',
    `register_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
    PRIMARY KEY (`favorite_song_id`),
	CONSTRAINT `fk_profile_favorite_song`
		FOREIGN KEY (`user_id`)
        REFERENCES `profile` (`profile_id`) ON DELETE CASCADE
)
ENGINE = InnoDB;

-- 노래 환경설정 테이블

CREATE TABLE IF NOT EXISTS `song_setting` (
	`song_setting_id` VARCHAR(36) COMMENT 'PK(사용자PK)',
    `eco` DECIMAL(2, 1) NOT NULL DEFAULT 0.5 COMMENT '에코',
    `volume` DECIMAL(2, 1) NOT NULL DEFAULT 0.5 COMMENT '음량',
    PRIMARY KEY (`song_setting_id`),
	CONSTRAINT `fk_profile_song_setting`
		FOREIGN KEY (`song_setting_id`)
        REFERENCES `profile` (`profile_id`) ON DELETE CASCADE
)
ENGINE = InnoDB;

-- 녹화 테이블

CREATE TABLE IF NOT EXISTS `recording` (
	`recording_id` INT AUTO_INCREMENT COMMENT 'PK',
	`user_id` VARCHAR(36) NOT NULL COMMENT '사용자PK',
    `song_id` INT NOT NULL COMMENT '노래PK',
    `file` VARCHAR(255) NOT NULL COMMENT '녹화파일',
    `register_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '녹화일시',
    `status` CHAR(1) NOT NULL DEFAULT 'V' COMMENT '상태(V:노출,D:삭제)',
    PRIMARY KEY (`recording_id`),
	CONSTRAINT `fk_profile_recording`
		FOREIGN KEY (`user_id`)
        REFERENCES `profile` (`profile_id`) ON DELETE CASCADE,
	CONSTRAINT `fk_song_recording`
		FOREIGN KEY (`song_id`)
        REFERENCES `song` (`song_id`) ON DELETE CASCADE
)
ENGINE = InnoDB;

-- 노래자랑 테이블
/*
	좋아요수는 로그파일로 분리
*/

CREATE TABLE IF NOT EXISTS `singing_contest` (
	`singing_contest_id` INT AUTO_INCREMENT COMMENT 'PK',
    `recording_id`  INT NOT NULL COMMENT '녹화PK',
	`register_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
    `status` CHAR(1) NOT NULL DEFAULT 'V' COMMENT '상태(V:노출,D:삭제,B:신고)',
    PRIMARY KEY (`singing_contest_id`),
	CONSTRAINT `fk_recording_singing_contest`
		FOREIGN KEY (`recording_id`)
        REFERENCES `recording` (`recording_id`) ON DELETE CASCADE
)
ENGINE = InnoDB;
