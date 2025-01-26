import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import onboarding1 from "../../assets/common/onboarding1.png";
import onboarding2 from "../../assets/common/onboarding2.png";
import onboarding3 from "../../assets/common/onboarding3.png";
import IntroPageStyle from "../../css/intropage/IntroPage.module.css";

const IntroPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const slides = [
    {
      title: "가족과 함께 추억을 쌓는 공간",
      image: onboarding1,
      detail: "가족과 사진을 공유하며\n특별한 순간을 함께 기록하세요!",
    },
    {
      title: "나만의 개성을 표현하는 마이룸",
      image: onboarding2,
      detail: "다양한 아이템으로 마이룸을 꾸미고\n가족에게 공유해보세요!",
    },    
    {
      title: "가족과 함께 추억을 가꾸는 기억정원",
      image: onboarding3,
      detail: "매월 함께한 소중한 추억을 \n기억정원에 기록해주어요!",
    },
  ];

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem("hasSeenIntro", "true");
      navigate("/login");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenIntro", "true");
    navigate("/login");
  };

  return (
    <div className={IntroPageStyle.root}>
      <div className={IntroPageStyle.content}>
        <div className={IntroPageStyle.imageWrapper}>
          <img
            src={slides[currentStep].image}
            alt="Slide Visual"
            className={IntroPageStyle.image}
          />
        </div>
        <h1 className={IntroPageStyle.title}>{slides[currentStep].title}</h1>
        <p className={IntroPageStyle.detail}>
          {slides[currentStep].detail.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </div>
      <div className={IntroPageStyle.progressBar}>
        {slides.map((_, index) => (
          <div
            key={index}
            className={`${IntroPageStyle.dot} ${
              currentStep === index ? IntroPageStyle.activeDot : ""
            }`}
          />
        ))}
      </div>
      <div className={IntroPageStyle.controls}>
        <span className={IntroPageStyle.skip} onClick={handleSkip}>
          건너뛰기
        </span>
        <span className={IntroPageStyle.next} onClick={handleNext}>
          {currentStep === slides.length - 1 ? "시작하기" : "다음"}
        </span>
      </div>
    </div>
  );
};

export default IntroPage;
