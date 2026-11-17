# 화재감지 순찰로봇 앱 (PWA)

브라우저 대시보드를 폰 홈 화면에 설치하는 앱으로 만든 폴더입니다.

## 폴더 구성
| 파일 | 역할 |
|---|---|
| index.html | 화면 + 동작 코드 (MQTT 접속, 상태 표시, 조종) |
| manifest.webmanifest | 앱 이름, 아이콘, 실행 방식 정보 |
| sw.js | 서비스 워커 (앱 화면을 폰에 저장해 두는 역할) |
| mqtt.min.js | MQTT 라이브러리 (CDN 없이 내장) |
| icons/ | 앱 아이콘 |

## 1. 먼저 바꿀 값
`index.html` 안의 `TOPIC_PREFIX` 를 ESP32 코드(`esp32_robot_mqtt.ino`)와 똑같이 맞추세요.

## 2. HTTPS 로 올리기 (필수)
PWA 설치와 서비스 워커는 HTTPS 주소에서만 동작합니다 (파일을 직접 열면 안 됨).
무료 정적 호스팅 예시: GitHub Pages, Firebase Hosting, Netlify, Cloudflare Pages.

GitHub Pages 기준:
1. 새 저장소를 만들고 이 폴더의 파일을 전부 올립니다 (폴더 구조 유지).
2. Settings > Pages 에서 브랜치를 선택하고 저장합니다.
3. 발급된 `https://...github.io/...` 주소를 폰에서 엽니다.

내 PC 에서 먼저 확인하려면 이 폴더에서 `python3 -m http.server 8000` 실행 후
`http://localhost:8000` 으로 접속하세요 (localhost 는 예외적으로 허용됩니다).

## 3. 폰에 설치
- 안드로이드(Chrome): 주소 접속 후 상단의 "홈 화면에 앱으로 설치" 버튼 또는 메뉴의 "앱 설치"
- 아이폰(Safari): 공유 버튼 > "홈 화면에 추가"  (Chrome 이 아니라 Safari 로 열어야 합니다)

## 4. 알아둘 점
- 카메라: HTTPS 페이지에서는 `http://` 카메라 주소(예: ESP32-CAM 의 :81/stream)가 브라우저에 의해 차단됩니다
  (혼합 콘텐츠). 같은 Wi-Fi 에서 카메라까지 시험하려면 PC 의 localhost 로 여는 방법을 쓰세요.
  외부에서 보려면 ESP32-CAM 이 HTTPS 저장소에 스냅샷을 올리는 구조가 필요합니다.
- 알림: 지금은 앱이 열려 있을 때만 알림이 갑니다. 앱이 꺼져 있을 때의 푸시는 FCM 연동이 필요합니다.
- 파일을 수정해 다시 올릴 때는 `sw.js` 맨 위의 `CACHE` 버전 숫자(v1 -> v2)를 올려야
  폰이 새 파일을 받습니다.
- 공개 테스트 브로커는 누구나 접속할 수 있으니 실제 운영 전에 인증과 TLS 를 적용하세요.
