package com.ssafy.ssarijileo.api.friend.entity;

import java.util.UUID;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.ssafy.ssarijileo.api.friend.dto.FriendDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Friend {

	// PK (AUTO_INCREMENT)
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long friendId;

	// 보낸 사용자PK
	private UUID fromUserId;

	// 받는 사용자PK
	private UUID toUserId;

	// 상태(W:대기,A:수락,X:취소)
	private char status;

	// Dto to Entity
	@Builder
	public Friend(FriendDto friendDto) {
		this.friendId = friendDto.getFriendId();
		this.fromUserId = UUID.fromString(friendDto.getFromUserId());
		this.toUserId = UUID.fromString(friendDto.getToUserId());
		this.status = friendDto.getStatus();
	}

	// Entity to Dto
	public FriendDto toDto() {
		return new FriendDto(friendId, String.valueOf(fromUserId), String.valueOf(toUserId), status);
	}

	public void updateFriend(char status) {
		this.status = status;
	}
}
