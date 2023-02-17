package com.ssafy.ssarijileo.api.singingcontest.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.ssarijileo.api.singingcontest.entity.SingingContest;

@Repository
public interface SingingContestJpaRepository extends JpaRepository<SingingContest, Long> {

	Optional<List<SingingContest>> findByStatus(String status);

	Optional<List<SingingContest>> findByRecording_Profile_ProfileIdAndStatus(String userId, String status);
}
