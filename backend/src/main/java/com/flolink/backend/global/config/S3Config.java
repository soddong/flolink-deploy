package com.flolink.backend.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;

@Configuration
public class S3Config {

	@Value("${aws.s3.access-key}")
	private String accessKey;

	@Value("${aws.s3.secret-key}")
	private String secretKey;

	@Value("${aws.s3.endpoint}")
	private String endpoint;

	@Bean
	public S3Client s3Client() {
		AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKey, secretKey);

		return S3Client
				.builder()
				.endpointOverride(URI.create(endpoint)) // MinIO 엔드포인트 설정
				.credentialsProvider(StaticCredentialsProvider.create(awsCreds))
				.serviceConfiguration(S3Configuration.builder()
						.pathStyleAccessEnabled(true) // MinIO는 path-style을 사용
						.build())
				.build();
	}
}
