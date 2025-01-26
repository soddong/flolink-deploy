package com.flolink.backend.global.auth.handler;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.convert.Jsr310Converters;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.flolink.backend.domain.user.entity.enumtype.RoleType;
import com.flolink.backend.global.auth.dto.response.OAuth.CustomOAuth2UserResponse;
import com.flolink.backend.global.auth.entity.Refresh;
import com.flolink.backend.global.auth.repository.RefreshRepository;
import com.flolink.backend.global.util.JwtUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomSuccessHandler implements AuthenticationSuccessHandler {

	private final JwtUtil jwtUtil;
	private final RefreshRepository refreshRepository;
	// @Value("${spring.jwt.expiration.refresh-token}")
	private Long REFRESH_TOKEN_EXPIRATION = 86400000L;
	// @Value("${spring.jwt.expiration.access-token}")
	private Long ACCESS_TOKEN_EXPIRATION = 21600000L;
	// @Value("https://flolink-plus.xyz")
	private String targetUrl = "https://flolink-plus.xyz";

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication authentication) throws IOException, ServletException {

		log.info("===Oauth2 Login 성공===");
		//OAuth2User
		CustomOAuth2UserResponse customUserDetails = (CustomOAuth2UserResponse)authentication.getPrincipal();
		System.out.println(customUserDetails.getUseYn());
		if (!customUserDetails.getUseYn()) {
			unsuccessfulAuthentication(request, response, new DisabledException("User account is disabled"));
			return;
		}

		int userId = customUserDetails.getUserId();
		RoleType role = customUserDetails.getRoleType();
		String loginId = customUserDetails.getLoginId();

		//현재 시간
		LocalDateTime date = LocalDateTime.now();
		Date now = Jsr310Converters.LocalDateTimeToDateConverter.INSTANCE.convert(date);

		//토큰 생성
		String access = jwtUtil.createJwt("access", userId, loginId, role, ACCESS_TOKEN_EXPIRATION, now);
		String refresh = jwtUtil.createJwt("refresh", userId, loginId, role, REFRESH_TOKEN_EXPIRATION, now);

		//Refresh 토큰 저장
		Refresh refreshEntity = Refresh.builder()
			.refreshToken(refresh)
			.expiredAt(date.plusSeconds(REFRESH_TOKEN_EXPIRATION))
			.build();
		refreshRepository.save(refreshEntity);

		//응답 설정

		// response.addHeader("Authorization", "Bearer " + access);
		response.addCookie(jwtUtil.createCookies("refresh", refresh));
		response.setStatus(HttpStatus.OK.value());
		response.sendRedirect(targetUrl + "/auth/fetch?accessToken=Bearer " + access);
	}

	protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
		AuthenticationException failed) throws IOException, ServletException {
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	}
}
