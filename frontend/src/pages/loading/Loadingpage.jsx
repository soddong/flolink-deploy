import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loadingImage from "../../assets/logo/logo.png";
import waveImage from "../../assets/loading_background/image.png";
import LoadingPageStyle from "../../css/loading/Loadingpage.module.css";

function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // localStorage에서 방문 여부 확인
      const hasVisited = localStorage.getItem("hasSeenIntro");

      if (hasVisited) {
        navigate("/login"); // 방문한 적이 있다면 /login으로 이동
      } else {
        localStorage.setItem("hasSeenIntro", "true"); // 방문 여부 기록
        navigate("/intro"); // 처음 방문이라면 /intro로 이동
      }
    }, 1000); // 1초 후 리다이렉트

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [navigate]);

  return (
    <div className={LoadingPageStyle.root}>
      <img src={loadingImage} alt="Loading" className={LoadingPageStyle.logo} />
      <p className={LoadingPageStyle.subtitle}>하나로, 연결 된 우리</p>
      <p className={LoadingPageStyle.title}>'동행'이 함께합니다</p>
      <img src={waveImage} alt="Wave" className={LoadingPageStyle.wave} />
    </div>
  );
}

export default LoadingPage;
