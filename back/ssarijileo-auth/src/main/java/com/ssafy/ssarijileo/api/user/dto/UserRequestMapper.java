package com.ssafy.ssarijileo.api.user.dto;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class UserRequestMapper {
    public ProfileDto toDto(OAuth2User oAuth2User) {
        var attributes = oAuth2User.getAttributes();
        log.info("oAuth2User attributes = {}", attributes);

        return ProfileDto.builder()
                .image(String.valueOf(attributes.get("image")))
                .nickname(String.valueOf(attributes.get("nickname")))
                .build();
    }
}