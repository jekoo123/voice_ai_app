./application.py
    STT, TTS, OPENAI api 처리와 앱과 DB의 연결을 위한 서버 코드.
    flask 사용.
    aws에 배포되어있음.
    api key들은 aws secret manager를 통해 안전하게 보관.

./uploads  
    mp3파일의 임시 저장소.

./react_native_app

    리액트 네이티브 기본 구성 파일들
    /expo /node_modules
        expo의 패키지 모듈들
    /app.json
        애플리케이션의 기본 정보들
    /eas.json
        배포시, 번들 파일로 빌드를 위해 필요한 파일
        서버 배포가 끝나고 앱 배포 직전까지 갔었으나 비용과 보안적인 문제로 보류 중.
    /babel.config.js
        자바스크립트 언어를 안드로이드와 ios의 언어인 자바, 코틀린 그리고 스위프트로 변환할때 필요한 파일
    /package-lock.json
        패키지 요약 파일
    /package.json
        패키지 파일
    /yarn.lock
        yarn 패키지 파일
    


    작성한 파일들
    
    /App.js 
        앱의 진입점이 되는 파일.
        라우팅(앱 상에서의 페이지 이동 관리) 시행
    
    /config.js
        ip설정용 설정파일

    /assets
        이미지, 객체 들을 저장한 폴더

    /components
        반복되어 사용되어지는 요소들을 컴포넌트화 하여 보관한 폴더
        e.g. 하단 Toolbar

    /storage/
        react native의 전역 상태 관리 도구인 redux를 사용하기 위한 폴더

    /pages/
        home.js
            처음 화면 -> 터치 시 앱 시작
            로그인 정보가 디스크에 있을때, 로그인 화면을 스킵하게 되는데 이 경우 db에서 정보를 가져오는 역할도 맡음

        login.js
            로그인 정보가 디스크에 없을때, home화면에서 넘어오는 곳
            로그인 시 db에서 정보를 가져옴.

        signup.js
            회원가입 파일.
            유저의 기본적인 정보를 db에 전달. ( e.g. 언어코드 : 일어)

        voice.js
            ai와 대화하는 앱의 주요 화면.

        chat.js
            채팅 로그 화면, 사용자와 AI의 대화와 수정된 문장을 보여줌

        My.js
            나의 정보 화면, 
            오늘의 표현, 단어장,
            점수 및 포인트 관리 (지금까지 한 대화에서 점수를 추출. 한번 추출된 대화는 점수에는 적용되나 포인트로는 추가 되지 않음)

        list.js
            채팅로그 화면에서 저장한 문장들이 표현되는 단어장 파일

        shop.js
            쇼핑화면,
            아바타를 살 수 있고, 장착 시 voice화면에서 대화하는 ai의 모습이 장착한 아바타에 따라 바뀜
        

    