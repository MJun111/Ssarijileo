package com.ssafy.ssarijileo.api.profile.entitiy;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.ssafy.ssarijileo.api.profile.dto.ProfileDto;
import com.ssafy.ssarijileo.api.profile.dto.ProfileInfoDto;
import com.ssafy.ssarijileo.api.songsetting.entity.SongSetting;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Profile implements Serializable {

	// PK
	@Id
	private String profileId;

	// 닉네임
	@Column(name = "nickname")
	private String nickname;

	// 프로필이미지
	private String image;

	@OneToOne(mappedBy = "profile")
	SongSetting songSetting;

	// Dto to Entity
	@Builder
	public Profile(ProfileDto profileDto) {
		this.profileId = profileDto.getProfileId();
		this.nickname = profileDto.getNickname();
		this.image = profileDto.getImage();
	}

	public void updateNickname(String nickname) {
		this.nickname = nickname;
	}

	public void updateImage(String image) {
		this.image = image;
	}

	// Entity to Dto
	public ProfileInfoDto toDto() {
		return new ProfileInfoDto(profileId, nickname, image, songSetting.getEco(), songSetting.getVolume());
	}
}
