package com.ssafy.ssarijileo.sse.service;

import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.ssafy.ssarijileo.common.exception.AlarmException;
import com.ssafy.ssarijileo.api.friend.dto.FriendInviteEvent;
import com.ssafy.ssarijileo.api.friend.dto.FriendRequestEvent;
import com.ssafy.ssarijileo.sse.repository.SseRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class SseServiceImpl implements SseService {

	private final SseRepository sseRepository;

	private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;

	@Override
	public SseEmitter connection(String userId) {
		SseEmitter emitter = sseRepository.save(userId, new SseEmitter(DEFAULT_TIMEOUT));

		emitter.onCompletion(() -> sseRepository.remove(userId));
		emitter.onTimeout(() -> sseRepository.remove(userId));

		System.out.println(userId + "님의 emitter" + emitter);

		System.out.println("in");
		try {
			emitter.send(
				SseEmitter.event()
					.data("{\"args\": {\"type\": \"connection\"}}\n\n"));
		} catch (Exception ex) {
			emitter.completeWithError(ex);
		}

		return emitter;
	}

	@Override
	public void sendFriendRequest(FriendRequestEvent event) {
		System.out.println(event.getArgs().getFromUserId() + "님이 " + event.getArgs().getToUserId() + "님에게 친구 요청");

		sseRepository.get(event.getArgs().getToUserId()).ifPresentOrElse(it -> {
				try {
					it.send(SseEmitter.event()
						.data(event));
					System.out.println("request send 완료");
				} catch (IOException exception) {
					System.out.println("request exception : " + exception.getMessage());
					sseRepository.remove(event.getArgs().getToUserId());
					throw new AlarmException("친구요청 알림 전송 중 오류가 발생했습니다.");
				}
			},
			() -> log.info("No friend request emitter founded")
		);
	}

	@Override
	public void sendFriendInvite(FriendInviteEvent event) {
		System.out.println(event.getArgs().getFromUserId() + "님이 " + event.getArgs().getToUserId() + "님에게 친구 초대");
		sseRepository.get(event.getArgs().getToUserId()).ifPresentOrElse(it -> {
				try {
					it.send(SseEmitter.event()
						.data(event));
					System.out.println("invite send 완료");
				} catch (IOException exception) {
					System.out.println("invite exception : " + exception.getMessage());
					sseRepository.remove(event.getArgs().getToUserId());
					throw new AlarmException("친구초대 알림 전송 중 오류가 발생했습니다.");
				}
			},
			() -> log.info("No friend invite emitter founded")
		);
	}
}
