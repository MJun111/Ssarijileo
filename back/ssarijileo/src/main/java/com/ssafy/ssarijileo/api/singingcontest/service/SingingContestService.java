package com.ssafy.ssarijileo.api.singingcontest.service;

import java.util.List;

import com.ssafy.ssarijileo.api.singingcontest.dto.LikeDto;
import com.ssafy.ssarijileo.api.singingcontest.dto.SingingContestResponseDto;
import com.ssafy.ssarijileo.api.singingcontest.dto.SingingContestUpdateDto;

public interface SingingContestService {

	List<SingingContestResponseDto> findAllSingingContest(String userId);

	List<SingingContestResponseDto> findSingingContestByUserId(String userId);

	void insertSingingContest(Long recordingId);

	void updateSingingContest(SingingContestUpdateDto singingContestUpdateDto);

	Long setLike(LikeDto likeDto);
}
