package com.ssafy.ssarijileo.api.room.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ssarijileo.api.reservation.repository.ReservationRepository;
import com.ssafy.ssarijileo.api.reservation.service.ReservationService;
import com.ssafy.ssarijileo.api.reservation.service.ReservationServiceImpl;
import com.ssafy.ssarijileo.api.room.dto.RoomDto;
import com.ssafy.ssarijileo.api.room.dto.RoomRequestDto;
import com.ssafy.ssarijileo.api.room.dto.RoomResponseDto;
import com.ssafy.ssarijileo.api.room.service.RoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/room")
@RequiredArgsConstructor
public class RoomController {

	private final RoomService roomService;
	private final ReservationService reservationService;

	@GetMapping
	List<RoomResponseDto> findAllRoom() {
		return roomService.findAllRoom();
	}

	@GetMapping("/{sessionId}")
	RoomDto findRoomBySessionId(@PathVariable String sessionId) {
		return roomService.findRoomBySessionId(sessionId);
	}

	@PostMapping
	void createRoom(@RequestBody RoomDto roomDto) {
		roomService.createRoom(roomDto);
		reservationService.createReservation(roomDto.getSessionId());
	}


	@PutMapping("/in")
	void enterRoom(@RequestBody RoomRequestDto roomRequestDto) {
		roomService.enterRoom(roomRequestDto);
	}

	@PutMapping("/out")
	void leaveRoom(@RequestBody RoomRequestDto roomRequestDto) {
		roomService.leaveRoom(roomRequestDto);
	}

	@PutMapping
	void updateRoom(@RequestBody RoomDto roomDto) {
		roomService.updateRoom(roomDto);
	}

	@DeleteMapping("/{sessionId}")
	void deleteRoom(@PathVariable String sessionId) {
		roomService.deleteRoom(sessionId);
	}
}
