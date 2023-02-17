package com.ssafy.ssarijileo.api.friend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.ssarijileo.api.friend.dto.FriendDto;
import com.ssafy.ssarijileo.api.friend.dto.FriendResponseDto;
import com.ssafy.ssarijileo.api.friend.dto.MyFriendDto;
import com.ssafy.ssarijileo.api.friend.entity.Friend;
import com.ssafy.ssarijileo.api.friend.entity.QFriend;
import com.ssafy.ssarijileo.api.profile.entitiy.QProfile;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class FriendRepositoryImpl implements FriendRepository {

	private final JPAQueryFactory jpaQueryFactory;

	QFriend friend = QFriend.friend;
	QProfile profile = QProfile.profile;

	@Override
	public Optional<List<FriendResponseDto>> findAllFriend(String nickname) {
		List<FriendResponseDto> friendList = jpaQueryFactory
			.select(Projections.fields(FriendResponseDto.class,
					profile.nickname,
					profile.image
					))
				.from(profile)
				.where(
					profile.nickname.ne(nickname)
							.and(
								profile.nickname.notIn(
									JPAExpressions
										.select(
											friend.fromProfile.nickname
												.when(nickname).then(friend.toProfile.nickname)
												.otherwise(friend.fromProfile.nickname)
										)
										.from(friend)
										.where(
											(friend.fromProfile.nickname.eq(nickname)
												.and(friend.status.ne("X")))
												.or(
													friend.toProfile.nickname.eq(nickname)
														.and(friend.status.ne("X"))
												)
										)
								)
							)
				).fetch();

		if (friendList == null)
			return Optional.empty();
		return Optional.ofNullable(friendList);
	}

	@Override
	public Optional<List<MyFriendDto>> findFriendByNickname(String nickname) {
		List<MyFriendDto> friendList = jpaQueryFactory
			.select(Projections.fields(MyFriendDto.class,
				friend.friendId,
				friend.fromProfile.nickname
					.when(nickname).then(friend.toProfile.nickname)
					.otherwise(friend.fromProfile.nickname)
					.as("nickname"),
				profile.image,
				friend.status))
			.from(friend)
			.leftJoin(profile)
			.on(friend.fromProfile.nickname
				.when(nickname).then(friend.toProfile.nickname)
				.otherwise(friend.fromProfile.nickname).eq(profile.nickname))
			.where(
				friend.status.ne("X")
					.and(
						(friend.fromProfile.nickname.eq(nickname)
							.and(friend.status.eq("A")))
							.or(friend.toProfile.nickname.eq(nickname))
					)
			)
			.orderBy(friend.status.desc())
			.fetch();

		if (friendList == null)
			return Optional.empty();
		return Optional.ofNullable(friendList);
	}
}
