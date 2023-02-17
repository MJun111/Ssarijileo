package com.ssafy.ssarijileo.api.room.service;

import java.util.List;

import com.ssafy.ssarijileo.api.room.dto.RoomDto;
import com.ssafy.ssarijileo.api.room.dto.RoomRequestDto;
import com.ssafy.ssarijileo.api.room.dto.RoomResponseDto;

public interface RoomService {

	List<RoomResponseDto> findAllRoom();

	RoomDto findRoomBySessionId(String sessionId);

	void createRoom(RoomDto roomDto);

	void enterRoom(RoomRequestDto roomEntryDto);

	void leaveRoom(RoomRequestDto roomEntryDto);

	void updateRoom(RoomDto roomDto);

	void deleteRoom(String sessionId);
}
