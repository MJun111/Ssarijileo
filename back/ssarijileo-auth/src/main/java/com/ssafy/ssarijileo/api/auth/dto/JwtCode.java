package com.ssafy.ssarijileo.api.auth.dto;

import lombok.Getter;

@Getter
public enum JwtCode {
	DENIED,
	ACCESS,
	EXPIRED;
}
