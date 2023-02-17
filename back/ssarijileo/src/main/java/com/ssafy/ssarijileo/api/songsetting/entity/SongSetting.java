package com.ssafy.ssarijileo.api.songsetting.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import org.hibernate.annotations.DynamicInsert;

import com.ssafy.ssarijileo.api.profile.entitiy.Profile;
import com.ssafy.ssarijileo.api.songsetting.dto.SongSettingDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SongSetting {

	// PK
	@Id
	private String songSettingId;

	// 에코
	private double eco;

	// 음량
	private double volume;

	// 프로필
	@OneToOne
	@JoinColumn(name = "song_setting_id")
	Profile profile;

	// to Entity
	@Builder
	public SongSetting(String userId) {
		this.songSettingId = userId;
		this.eco = 0.5;
		this.volume = 0.5;
	}

	// Entity to Dto
	public SongSettingDto toDto() {
		return new SongSettingDto(songSettingId, eco, volume);
	}

	public void updateSetting(double eco, double volume) {
		this.eco = eco;
		this.volume = volume;
	}
}
