package com.ssafy.ssarijileo.api.file.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {

	String fileUpload(MultipartFile multipartFile);
}
