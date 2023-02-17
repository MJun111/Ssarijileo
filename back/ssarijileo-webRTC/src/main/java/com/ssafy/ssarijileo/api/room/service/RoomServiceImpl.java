package com.ssafy.ssarijileo.api.room.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ssarijileo.api.room.client.RoomClient;
import com.ssafy.ssarijileo.api.room.dto.RoomDto;
import com.ssafy.ssarijileo.api.room.dto.RoomRequestDto;
import com.ssafy.ssarijileo.api.room.dto.RoomResponseDto;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RoomServiceImpl implements RoomService{

	private final RoomClient roomClient;

	@Override
	public List<RoomResponseDto> findAllRoom() {
		return roomClient.findAllRoom();
	}

	@Override
	public RoomDto findRoomBySessionId(String sessionId) {
		return roomClient.findRoomBySessionId(sessionId);
	}

	@Override
	public void createRoom(RoomDto roomDto) {
		roomClient.createRoom(roomDto);
	}

	@Override
	public void enterRoom(RoomRequestDto roomRequestDto) {
		roomClient.enterRoom(roomRequestDto);
	}

	@Override
	public void leaveRoom(RoomRequestDto roomRequestDto) {
		roomClient.leaveRoom(roomRequestDto);
	}

	@Override
	public void updateRoom(RoomDto roomDto) {
		roomClient.updateRoom(roomDto);
	}

	@Override
	public void deleteRoom(String sessionId) {
		roomClient.deleteRoom(sessionId);
	}
}
