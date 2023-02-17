## 소개

싸리질러 프로젝트 Backend

<!-- 필수 항목 -->

## 기술스택 및 라이브러리

| Stack  | Version                      | Description |
| ------ | ---------------------------- | ----------- |
| Java   | 11<br> (build 11.0.17+8-LTS) |             |
| Gradle | 6.7+                         | Build Tool  |
| MySQL  | 8.0.31                       | DB          |
|        |                              |             |

### 디렉토리 구조

---

```
.
└── main
    ├── java
    │   └── com
    │       └── ssafy
    │           └── ssarijileo
    │               ├── SsarijileoApplication.java
    │               ├── config
    │               ├── exception
    │               ├── user /* user 관련 정의 */
    │               ├── controller
    │               │   └── UserController.java
    │               ├── dto
    │               │   └── UserDto.java
    │               ├── entity
    │               │   └── User.java
    │               ├── repository
    │               │   └── UserRepository.java
    │               └── service
    │                   ├── UserService.java
    │                   └── UserServiceImpl.java
    └── resources
        ├── application.yml /* 웹 리소스(서버 host/port, 디비 host/port/계정/패스워드) 관련 설정 정의 \*/
        ├── static
        │   └── index.html
        └── tmplates
```

// 자동 빌드 테스트
