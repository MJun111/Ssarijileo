package com.ssafy.ssarijileo.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR,
	reason = "Connect to notification occurs error")
public class AlarmException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public AlarmException() {
		super("알림 전송 중 오류가 발생했습니다.");
	}

	public AlarmException(String msg) {
		super(msg);
	}
}
