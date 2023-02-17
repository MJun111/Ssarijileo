package com.ssafy.ssarijileo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@EnableFeignClients
@EnableScheduling
@SpringBootApplication
public class SsarijileoRankingApplication {

	public static void main(String[] args) {
		SpringApplication.run(SsarijileoRankingApplication.class, args);
	}

}
