package com.ssafy.ssarijileo.api.room.controller;

import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ssarijileo.api.room.dto.RoomDto;
import com.ssafy.ssarijileo.api.room.dto.RoomRequestDto;
import com.ssafy.ssarijileo.api.room.dto.RoomResponseDto;
import com.ssafy.ssarijileo.api.room.service.RoomService;
import com.ssafy.ssarijileo.common.model.BaseResponseBody;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/room")
@RequiredArgsConstructor
public class RoomController {

	@Value("${OPENVIDU_URL}")
	private String OPENVIDU_URL;

	@Value("${OPENVIDU_SECRET}")
	private String OPENVIDU_SECRET;

	private OpenVidu openvidu;

	private final RoomService roomService;

	@PostConstruct
	public void init() {
		this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
	}

	/**
	 * @title 방 목록
	 * @return
	 */
	@GetMapping
	ResponseEntity<List<RoomResponseDto>> findAllRoom() {
		return ResponseEntity.status(200).body(roomService.findAllRoom());
	}

	/**
	 * @title 방 정보
	 * @param sessionId
	 * @return
	 */
	@GetMapping("/{sessionId}")
	ResponseEntity<RoomDto> findRoomBySessionId(@PathVariable String sessionId) {
		return ResponseEntity.status(200).body(roomService.findRoomBySessionId(sessionId));
	}

	/**
	 * @title 세션 초기화
	 * 동일한 세션에 연결된 참가자는 스트림을 주고 받을 수 있다.
	 * @param params The Session properties
	 * @return The Session ID
	 */
	@PostMapping("/session")
	public ResponseEntity<String> initializeSession(@RequestBody(required = false) Map<String, Object> params)
		throws OpenViduJavaClientException, OpenViduHttpException {
		SessionProperties properties = SessionProperties.fromJson(params).build();
		Session session = openvidu.createSession(properties);
		return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
	}

	/**
	 * @title 세션 연결 (방 입장)
	 * 특정 세션에 대한 연결 생성
	 * 각 참가자는 토근을 사용해 하나의 연결을 사용하여 연결
	 * @param sessionId The Session in which to create the Connection
	 * @param roomDto   The Connection properties
	 * @return The Token associated to the Connection
	 */
	@PostMapping("/connection/{sessionId}/host")
	public ResponseEntity<String> createConnection(@RequestHeader String userId,
		@PathVariable String sessionId, @RequestBody RoomDto roomDto)
		throws OpenViduJavaClientException, OpenViduHttpException {

		// 방장이 방 생성
		roomDto.setUserId(userId);
		roomDto.setSessionId(sessionId);
		roomService.createRoom(roomDto);

		// openvidu
		Session session = openvidu.getActiveSession(sessionId);
		if (session == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		ConnectionProperties properties = ConnectionProperties.fromJson(null).build();
		Connection connection = session.createConnection(properties);

		return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
	}

	/**
	 * @title 방 입장
	 * 각 참가자는 토근을 사용해 하나의 연결을 사용하여 연결
	 * @param sessionId The Session in which to create the Connection
	 * @return The Token associated to the Connection
	 */
	@PostMapping("/connection/{sessionId}")
	public ResponseEntity<String> enterConnection(@RequestHeader String userId,
		@PathVariable String sessionId)
		throws OpenViduJavaClientException, OpenViduHttpException {

		// 방 입장
		roomService.enterRoom(new RoomRequestDto(sessionId, userId));

		// openvidu
		Session session = openvidu.getActiveSession(sessionId);
		if (session == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		ConnectionProperties properties = ConnectionProperties.fromJson(null).build();
		Connection connection = session.createConnection(properties);

		return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
	}

	/**
	 * @title 방 퇴장
	 * @param sessionId
	 * @return
	 */
	@PutMapping("/out/{sessionId}")
	ResponseEntity<? extends BaseResponseBody> leaveRoom(@RequestHeader String userId, @PathVariable String sessionId) {
		RoomRequestDto roomRequestDto = new RoomRequestDto(sessionId, userId);
		roomService.leaveRoom(roomRequestDto);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	/**
	 * @title 방 수정
	 * @param sessionId
	 * @return
	 */
	@PutMapping("/{sessionId}")
	ResponseEntity<? extends BaseResponseBody> updateRoom(@PathVariable String sessionId, @RequestBody RoomDto roomDto) {
		roomDto.setSessionId(sessionId);
		roomService.updateRoom(roomDto);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	/**
	 * @title 방 삭제
	 * @param sessionId
	 * @return
	 */
	@DeleteMapping("/{sessionId}")
	ResponseEntity<? extends BaseResponseBody> deleteRoom(@PathVariable String sessionId) {
		roomService.deleteRoom(sessionId);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}
}
