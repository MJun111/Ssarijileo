package com.ssafy.ssarijileo.api.auth.service;

import com.ssafy.ssarijileo.api.auth.dto.JwtCode;
import com.ssafy.ssarijileo.api.auth.dto.Role;
import com.ssafy.ssarijileo.api.auth.dto.TokenKey;
import com.ssafy.ssarijileo.api.auth.dto.Token;
import com.ssafy.ssarijileo.api.user.client.UserProfileClient;
import com.ssafy.ssarijileo.common.exception.NotFoundException;
import com.ssafy.ssarijileo.api.user.dto.UserDto;
import com.ssafy.ssarijileo.api.user.dto.ProfileDto;
import com.ssafy.ssarijileo.api.user.dto.UserRequestMapper;
import com.ssafy.ssarijileo.api.user.entity.User;
import com.ssafy.ssarijileo.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.parameters.P;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import java.io.IOException;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Transactional
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;
    private final UserRequestMapper userRequestMapper;
    private final UserProfileClient userProfileClient;
    private String redirectUrl = "https://www.gil-sang.uk/login";
    // private String redirectUrl = "http://localhost:3000/login";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
        throws IOException {
        OAuth2User oAuth2User = (OAuth2User)authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        log.info("[!] oAuth2User = {}",oAuth2User);
        log.info("[!] attributes = {}",oAuth2User.getAttributes());

        UserDto userDto = UserDto.builder()
            .socialId(String.valueOf(attributes.get("id")))
            .build();

        ProfileDto profileDto;

        User guest = new User();

        Token tokens = new Token();

        // 회원 정보 받아옴
        User user = userRepository.findBySocialId(userDto.getSocialId()).orElse(guest);

        // 최초 로그인이라면 회원가입 처리를 한다.
        if (user.equals(guest)) {
            // 회원 정보 저장
            userRepository.save(userDto.toUser(userDto));

            // 저장된 회원 정보 불러옴 -> userId 사용
            user = userRepository.findBySocialId(userDto.getSocialId()).orElseThrow(NotFoundException::new);

            profileDto = new ProfileDto(
                String.valueOf(user.getUserId())
                , attributes.get("nickname") + "_" + userDto.getSocialId().substring(2, 6)
                , String.valueOf(attributes.get("image"))
            );

            // 토큰 발행
            tokens = tokenProvider.generateToken(profileDto.getProfileId(), Role.USER.getKey());
            
            // 리프레시 토큰 캐시 저장
            tokenProvider.setSaveRefresh(
                String.valueOf(user.getUserId())
                , tokens.getRefreshToken()
                , tokenProvider.getExpiration(TokenKey.REFRESH)
            );

            // 프로필 DB에 저장
            userProfileClient.insertProfile(profileDto);
        } else {
            profileDto = new ProfileDto(
                String.valueOf(user.getUserId())
                , String.valueOf(attributes.get("image"))
            );

            String access = tokenProvider.generateAccess(profileDto.getProfileId(), Role.USER.getKey());

            // 리프레시 토큰 유효하면 그대로 사용, 아니면 재발행
            String refresh = tokenProvider.getSavedRefresh(String.valueOf(user.getUserId()));
            if (refresh != null && tokenProvider.validateToken(refresh) == JwtCode.ACCESS) {
                tokens = tokens.builder().accessToken(access)
                    .refreshToken(refresh).build();
            } else {
                tokens = tokenProvider.generateToken(profileDto.getProfileId(), Role.USER.getKey());
            }
            log.info("profileDto ={}", profileDto);

            userProfileClient.updateImage(profileDto);
        }

        String targetUrl;
        targetUrl = UriComponentsBuilder.fromUriString(redirectUrl)
            .queryParam(TokenKey.ACCESS.getKey(), "Bearer-" + tokens.getAccessToken())
            .queryParam(TokenKey.REFRESH.getKey(), "Bearer-" + tokens.getRefreshToken())
            .build().toUriString();

        // 프론트 페이지로 리다이렉트
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
