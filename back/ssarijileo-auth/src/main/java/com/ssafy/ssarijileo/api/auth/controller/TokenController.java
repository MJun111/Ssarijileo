package com.ssafy.ssarijileo.api.auth.controller;

import com.ssafy.ssarijileo.api.auth.dto.JwtCode;
import com.ssafy.ssarijileo.api.auth.service.TokenProvider;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/token")
public class TokenController {

    private final TokenProvider tokenProvider;
    //
    // /**
    //  * 토큰 시간 만료 시 로직
    //  * @return
    //  */
    // @ApiOperation(
    //     value = "토큰 만료 시",
    //     notes = "토큰 만료 시 로직 ~~"
    // )
    // @GetMapping("/expired")
    // public String auth() {
    //    throw new RuntimeException();
    // }
    //
    // /**
    //  *
    //  * @param request
    //  * @return
    //  */
    // @ApiOperation(
    //         value = "리프레시 토큰 검증",
    //         notes = "리프레시 토큰을 검증 하여 토큰 재발급"
    // )
    // @GetMapping("/refresh")
    // public ResponseEntity<String> refreshAuth(HttpServletRequest request) {
    //     HttpHeaders responseHeader = new HttpHeaders();
    //     String token = request.getHeader(TokenKey.REFRESH.getKey());
    //
    //     if (token != null && tokenProvider.validateToken(token) == JwtCode.ACCESS) {
    //         String email = tokenProvider.getUid(token);
    //         Token newToken = tokenProvider.generateToken(email, Role.USER.getKey());
    //
    //         responseHeader.set(TokenKey.ACCESS.getKey(), newToken.getAccessToken());
    //         responseHeader.set(TokenKey.REFRESH.getKey(), newToken.getRefreshToken());
    //         responseHeader.setContentType(MediaType.APPLICATION_JSON);
    //
    //         return ResponseEntity.ok()
    //                 .headers(responseHeader)
    //                 .body("new Token");
    //     }
    //     throw new RuntimeException();
    // }
}