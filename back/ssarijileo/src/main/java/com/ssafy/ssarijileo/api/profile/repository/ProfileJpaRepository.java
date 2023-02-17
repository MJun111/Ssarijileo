package com.ssafy.ssarijileo.api.profile.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.ssarijileo.api.profile.entitiy.Profile;

@Repository
public interface ProfileJpaRepository extends JpaRepository<Profile, String> {

	Optional<Profile> findByNickname(String nickname);
}
