package com.ssafy.ssarijileo.common.filter;

import com.ssafy.ssarijileo.api.auth.dto.JwtCode;
import com.ssafy.ssarijileo.api.auth.dto.Role;
import com.ssafy.ssarijileo.api.auth.dto.Token;
import com.ssafy.ssarijileo.api.auth.dto.TokenKey;
import com.ssafy.ssarijileo.api.user.dto.UserDto;
import com.ssafy.ssarijileo.api.auth.service.TokenProvider;
import com.ssafy.ssarijileo.api.user.dto.ProfileDto;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Arrays;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthFilter extends GenericFilterBean {

    private final TokenProvider tokenProvider;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        String token = tokenProvider.resolveToken(((HttpServletRequest)request).getHeader(TokenKey.ACCESS.getKey()));

        if (token != null && tokenProvider.validateToken(token) == JwtCode.ACCESS) {
            String userId = tokenProvider.getUid(token);

            UserDto userDto = UserDto.builder()
                    .userId(userId)
                    .build();

            Authentication auth = getAuthentication(userDto);
            SecurityContextHolder.getContext().setAuthentication(auth);
            log.info("set Authentication to security context for '{}', uri = {}", auth.getName(), ((HttpServletRequest)request).getRequestURI());
        } else if (token != null && tokenProvider.validateToken(token) == JwtCode.EXPIRED) {
            Claims claims = tokenProvider.getClaims(token);

            // 토큰에 저장된 유저정보
            UserDto userDto = UserDto.builder()
                    .userId(claims.getSubject())
                    .build();

            // 헤더에 존재하는 리프레시 토큰
            String refresh = tokenProvider.resolveToken(
                ((HttpServletRequest)request).getHeader(TokenKey.REFRESH.getKey()));

            // 캐시에 존재하는 리프레시 토큰
            String savedRefresh = tokenProvider.getSavedRefresh(userDto.getUserId());

            // refresh token을 확인해서 재발급
            if (token != null && refresh.equals(savedRefresh) && tokenProvider.validateToken(refresh) == JwtCode.ACCESS) {
                Token tokens = tokenProvider.generateToken(userDto.getUserId(), Role.USER.getKey());

                tokenProvider.setSaveRefresh(userDto.getUserId(),
                    tokens.getRefreshToken(), tokenProvider.getExpiration(TokenKey.REFRESH));

                ((HttpServletResponse)response).setHeader(TokenKey.ACCESS.getKey(), "Bearer " + tokens.getAccessToken());
                ((HttpServletResponse)response).setHeader(TokenKey.REFRESH.getKey(), "Bearer " + tokens.getRefreshToken());

                Authentication auth = getAuthentication(userDto);
                SecurityContextHolder.getContext().setAuthentication(auth);
                log.info("set Authentication to security context for '{}', uri = {}", auth.getName(), ((HttpServletRequest)request).getRequestURI());
            }
        } else {
            log.info("no valid JWT token found, uri: {}", ((HttpServletRequest)request).getRequestURI());
        }
        chain.doFilter(request, response);
    }

    public Authentication getAuthentication(UserDto member) {
        return new UsernamePasswordAuthenticationToken(member, "",
                Arrays.asList(new SimpleGrantedAuthority(Role.USER.getKey())));
    }
}