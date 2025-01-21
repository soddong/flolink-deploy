import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo/logo.png'
import kakaoLogo from '../../assets/login/kakao.png';
import googleLogo from '../../assets/login/google.png';
import LoginPageStyle from '../../css/login/Loginpage.module.css';
import { axiosCommonInstance } from '../../apis/axiosInstance';
import { login } from '../../service/auth/auth.js' 
import { getMyInfoinChannelSelect } from '../../service/userroom/userroomApi.js';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const token = localStorage.getItem("ACCESS_TOKEN");
      console.log('Loginpage.jsx 마운트 됨.')
      if (token) {
        try {
          myinfores = await axiosCommonInstance.get('/users/myInfo');
          if(myinfores.status == "200"){
            navigate('/channelselect'); 
          }
        } catch (error) {
          console.log("accessToken 존재하나, 에러 catch됨")
          localStorage.removeItem("ACCESS_TOKEN");
          document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
      }
    };
    
    checkAuthAndRedirect();
  }, []);

  const handleLogin = async () => {
    try {
      const { headers } = await login(username, password); // await으로 로그인 요청 처리
      const accessToken = headers.authorization; // headers에서 accessToken 추출
      localStorage.setItem('ACCESS_TOKEN', accessToken); // localStorage에 저장
      axiosCommonInstance.defaults.headers.common['Authorization'] = accessToken; // axios 인스턴스에 헤더 설정
      navigate('/channelselect'); // 로그인 성공 후 페이지 이동
    } catch (error) {
      console.error(error); // 자세한 에러 정보를 로그로 남김
      alert('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.'); // 에러 처리
    }
  };

  return (
    <div className={LoginPageStyle.root}>
      <img src={logo} alt="FLORINK" className={LoginPageStyle.logo} />
      <TextField
        className={LoginPageStyle.input}
        label="아이디"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        className={LoginPageStyle.input}
        label="비밀번호"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button className={LoginPageStyle.customButton} variant="contained" onClick={handleLogin}>로그인</Button>
      <Box className={LoginPageStyle.linksContainer}>
        <Button className={LoginPageStyle.linkButton} onClick={() => navigate('/FindAccount')}>아이디 찾기</Button>
        <Button className={LoginPageStyle.linkButton} onClick={() => navigate('/FindAccount')}>비밀번호 찾기</Button>
        <Button className={LoginPageStyle.linkButton} onClick={() => navigate('/signup')}>회원가입</Button>
      </Box>

      <hr className={LoginPageStyle.divider} />

      <Typography className={LoginPageStyle.snsLogin}>SNS 로그인</Typography>
      <Box className={LoginPageStyle.snsContainer}>
      <Button
          className={`${LoginPageStyle.snsButton} ${LoginPageStyle.kakaoButton}`}
          variant="contained"
          href={`${BASE_URL}/oauth2/authorization/kakao`}
        >
          <img src={kakaoLogo} alt="Kakao" className={LoginPageStyle.snsLogo} /> 카카오로 계속
        </Button>
        <Button
          className={`${LoginPageStyle.snsButton} ${LoginPageStyle.googleButton}`}
          variant="contained"
          href={`${BASE_URL}/oauth2/authorization/google`}
        >
          <img src={googleLogo} alt="Google" className={LoginPageStyle.snsLogo} /> 구글로 계속
        </Button>
      </Box>
    </div>
  );
}

export default LoginPage;
