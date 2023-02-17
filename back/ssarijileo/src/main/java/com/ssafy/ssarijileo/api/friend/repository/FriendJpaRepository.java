package com.ssafy.ssarijileo.api.friend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.ssarijileo.api.friend.dto.MyFriendDto;
import com.ssafy.ssarijileo.api.friend.entity.Friend;

@Repository
public interface FriendJpaRepository extends JpaRepository<Friend, Long> {
}
