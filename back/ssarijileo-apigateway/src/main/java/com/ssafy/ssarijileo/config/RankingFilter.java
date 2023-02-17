package com.ssafy.ssarijileo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import com.ssafy.ssarijileo.util.JwtUtil;

@Component
public class RankingFilter extends AbstractGatewayFilterFactory<RankingFilter.Config> {
	@Autowired
	private JwtUtil jwtUtil;

	public RankingFilter() {
		super(RankingFilter.Config.class);
	}

	public static class Config {
		// application.yml 파일에서 지정한 filer의 Argument값을 받는 부분
	}

	@Override
	public GatewayFilter apply(RankingFilter.Config config) {
		return (exchange, chain) -> {

			if (!exchange.getRequest().getHeaders().containsKey("Authorization")) {
				return chain.filter(exchange);
			}

			String token = exchange.getRequest().getHeaders().get("Authorization").get(0).substring(7);   // 헤더의 토큰 파싱 (Bearer 제거)

			String userId = jwtUtil.getUid(token);

			addAuthorizationHeaders(exchange.getRequest(), userId);
			return chain.filter(exchange);
		};
	}

	private void addAuthorizationHeaders(ServerHttpRequest request, String userId) {
		request.mutate()
			.header("userId", userId)
			.build();
	}
}
