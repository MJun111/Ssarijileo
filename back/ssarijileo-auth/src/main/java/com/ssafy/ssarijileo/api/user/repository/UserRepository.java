package com.ssafy.ssarijileo.api.user.repository;

import com.ssafy.ssarijileo.api.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUserId(UUID userId);
    Optional<User> findBySocialId(String userId);
}
