package com.ssafy.ssarijileo.api.user.service;

import java.util.UUID;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ssarijileo.common.exception.NotFoundException;
import com.ssafy.ssarijileo.api.user.entity.User;
import com.ssafy.ssarijileo.api.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	@Override
	public void withdrawlUser(String userId) {
		User user = userRepository.findByUserId(UUID.fromString(userId)).orElseThrow(NotFoundException::new);
		log.info("user id = {}, user status = {}", user.getUserId(), user.getStatus());
		user.updateStatus("X");
		log.info("update user status = {}", user.getStatus());
	}
}
