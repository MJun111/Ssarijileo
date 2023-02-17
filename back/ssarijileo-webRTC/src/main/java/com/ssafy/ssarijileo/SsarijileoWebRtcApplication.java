package com.ssafy.ssarijileo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class SsarijileoWebRtcApplication {

	public static void main(String[] args) {
		SpringApplication.run(SsarijileoWebRtcApplication.class, args);
	}

}
