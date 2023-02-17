package com.ssafy.ssarijileo.sse.repository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.extern.slf4j.Slf4j;

@Slf4j // Simple Logging Facade for Java
@Repository
public class SseRepository {

	private Map<String, SseEmitter> emitterMap = new HashMap<>();

	public SseEmitter save(String id, SseEmitter emitter) {
		emitterMap.put(id, emitter);
		log.info("EmitterRepository save : {}", id);
		return emitter;
	}

	public Optional<SseEmitter> get(String id) {
		log.info("EmitterRepository get : {}", id);
		return Optional.ofNullable(emitterMap.get(id));
	}

	public void remove(String id) {
		log.info("EmitterRepository remove : {}", id);
		emitterMap.remove(id);
	}
}
