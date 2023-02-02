package com.ssafy.ssarijileo.common.kafka.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import com.ssafy.ssarijileo.common.kafka.event.FriendRequestEvent;
import com.ssafy.ssarijileo.common.sse.service.SseService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class FriendRequestConsumer {

	private final SseService sseService;

	@KafkaListener(topics = "friend request")
	public void consumeAlarmEvent(FriendRequestEvent event, Acknowledgment ack) {
		log.info("Friend Request Alarm consumed from kafka topic: {}", event);
		sseService.sendFriendRequest(event);
		ack.acknowledge();
	}
}