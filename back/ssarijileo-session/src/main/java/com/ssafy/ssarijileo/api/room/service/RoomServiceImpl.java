package com.ssafy.ssarijileo.api.room.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ssafy.ssarijileo.api.room.dto.RoomDto;
import com.ssafy.ssarijileo.api.room.dto.RoomRequestDto;
import com.ssafy.ssarijileo.api.room.dto.RoomResponseDto;
import com.ssafy.ssarijileo.api.room.repository.RoomRedisRepository;
import com.ssafy.ssarijileo.common.exception.NotFoundException;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RoomServiceImpl implements RoomService{

	private final RoomRedisRepository roomRedisRepository;

	@Override
	public List<RoomResponseDto> findAllRoom() {
		return roomRedisRepository.getList().stream().map(RoomDto::toResponseDto).collect(Collectors.toList());
	}

	@Override
	public RoomDto findRoomBySessionId(String sessionId) {
		return roomRedisRepository.get(sessionId).orElseThrow(NotFoundException::new);
	}

	@Override
	public void createRoom(RoomDto roomDto) {
		// 방장 정보를 사용자 목록에 추가
		roomDto.getUserList().add(roomDto.getUserId());
		roomRedisRepository.set(roomDto.getSessionId(), roomDto);
	}

	@Override
	public void enterRoom(RoomRequestDto roomRequestDto) {
		RoomDto roomDto = roomRedisRepository.get(roomRequestDto.getSessionId()).orElseThrow(NotFoundException::new);
		roomDto.getUserList().add(roomRequestDto.getUserId());
		roomRedisRepository.set(roomDto.getSessionId(), roomDto);
	}

	@Override
	public void leaveRoom(RoomRequestDto roomRequestDto) {
		RoomDto roomDto = roomRedisRepository.get(roomRequestDto.getSessionId()).orElseThrow(NotFoundException::new);
		roomDto.getUserList().remove(roomRequestDto.getUserId());
		roomRedisRepository.set(roomDto.getSessionId(), roomDto);
	}

	@Override
	public void updateRoom(RoomDto roomDto) {
		roomRedisRepository.set(roomDto.getSessionId(), roomDto);
	}

	@Override
	public void deleteRoom(String sessionId) {
		roomRedisRepository.remove(sessionId);
	}
}
