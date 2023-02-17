// package com.ssafy.ssarijileo.openvidu.controller;
//
// import java.util.Map;
//
// import javax.annotation.PostConstruct;
//
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestHeader;
// import org.springframework.web.bind.annotation.RestController;
//
// import com.ssafy.ssarijileo.api.room.dto.RoomDto;
// import com.ssafy.ssarijileo.api.room.dto.RoomRequestDto;
// import com.ssafy.ssarijileo.api.room.service.RoomService;
//
// import io.openvidu.java.client.Connection;
// import io.openvidu.java.client.ConnectionProperties;
// import io.openvidu.java.client.OpenVidu;
// import io.openvidu.java.client.OpenViduHttpException;
// import io.openvidu.java.client.OpenViduJavaClientException;
// import io.openvidu.java.client.Session;
// import io.openvidu.java.client.SessionProperties;
// import lombok.AllArgsConstructor;
// import lombok.RequiredArgsConstructor;
//
// @CrossOrigin(origins = "*")
// @RestController("/api/v1/room")
// @RequiredArgsConstructor
// public class OpenviduController {
//
// 	@Value("${OPENVIDU_URL}")
// 	private String OPENVIDU_URL;
//
// 	@Value("${OPENVIDU_SECRET}")
// 	private String OPENVIDU_SECRET;
//
// 	private OpenVidu openvidu;
//
// 	private final RoomService roomService;
//
// 	@PostConstruct
// 	public void init() {
// 		this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
// 	}
//
// 	/**
// 	 * @param params The Session properties
// 	 * @return The Session ID
// 	 */
// 	// 세션 초기화
// 	// 동일한 세션에 연결된 참가자는 스트림을 주고 받을 수 있다.
// 	@PostMapping("/sessions")
// 	public ResponseEntity<String> initializeSession(@RequestBody(required = false) Map<String, Object> params)
// 		throws OpenViduJavaClientException, OpenViduHttpException {
// 		SessionProperties properties = SessionProperties.fromJson(params).build();
// 		Session session = openvidu.createSession(properties);
// 		return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
// 	}
//
// 	/**
// 	 * @param sessionId The Session in which to create the Connection
// 	 * @param roomDto   The Connection properties
// 	 * @return The Token associated to the Connection
// 	 */
// 	// 특정 세션에 대한 연결 생성
// 	// 각 참가자는 토근을 사용해 하나의 연결을 사용하여 연결
// 	@PostMapping("/{sessionId}/connections/{host}")
// 	public ResponseEntity<String> createConnection(@RequestHeader String userId,
// 		@PathVariable String sessionId, @PathVariable(required = false) String host,
// 		@RequestBody(required = false) RoomDto roomDto)
// 		throws OpenViduJavaClientException, OpenViduHttpException {
// 		Session session = openvidu.getActiveSession(sessionId);
// 		if (session == null) {
// 			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
// 		}
// 		ConnectionProperties properties = ConnectionProperties.fromJson(null).build();
// 		Connection connection = session.createConnection(properties);
//
// 		if (host != null) {
// 			// 방장이 방 생성 때
// 			roomDto.setUserId(userId);
// 			roomDto.setSessionId(sessionId);
// 			roomService.createRoom(roomDto);
// 		} else if (roomDto.getPassword() != null && !roomDto.getPassword()
// 			.equals(roomService.findRoomBySessionId(sessionId).getPassword())) {
// 			// 비공개 방인데 비밀번호가 일치하지 않을 때
// 			return new ResponseEntity<>(null, HttpStatus.OK);
// 		} else {
// 			// 방 입장
// 			roomService.enterRoom(new RoomRequestDto(sessionId, userId));
// 		}
//
// 		return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
// 	}
// }
