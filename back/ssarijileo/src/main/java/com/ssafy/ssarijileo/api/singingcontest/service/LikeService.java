package com.ssafy.ssarijileo.api.singingcontest.service;

import java.util.Set;

public interface LikeService {
    void like(String userId, Long singingContestId);
    void unlike(String userId, Long singingContestId);
    Long getLikeCount(Long singingContestId);
    Set<String> getLikeUsers(Long singingContestId);
    Boolean hasLiked(String userId, Long singingContestId);
}
