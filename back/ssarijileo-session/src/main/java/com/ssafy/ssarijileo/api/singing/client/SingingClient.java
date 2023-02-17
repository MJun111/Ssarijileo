package com.ssafy.ssarijileo.api.singing.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.ssafy.ssarijileo.api.singing.dto.SingingDto;
import com.ssafy.ssarijileo.test.client.BaseResponseBody;

@FeignClient(name = "singing-client", url = "business:8080/api/v1/singing")
public interface SingingClient {
	@PostMapping
	ResponseEntity<? extends BaseResponseBody> insertSinging(@RequestBody SingingDto singingDto);
	@DeleteMapping
	ResponseEntity<? extends BaseResponseBody> deleteSinging(@RequestBody SingingDto singingDto);
}
