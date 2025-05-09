import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ServiceName from "../assets/ServiceName.png";
import Profile from "../assets/Profile.png";
import Search from "../assets/Search.png";
import Likes from "../assets/Likes.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <>
      <MainFrame>
        <Title src={ServiceName} alt="잔반걸음" onClick={() => navigate("/")} />
        <NavigatorContainer>
          <Navigator onClick={() => navigate("/")}>비료 거래</Navigator>
          <Navigator>발효 등급표</Navigator>
          <Navigator>비료 만들기</Navigator>
          <Navigator>발효 꿀팁</Navigator>
        </NavigatorContainer>

        <MyContainer>
          {/* /checkgrade에서 /newpost로 이동하기 때문에 /checkgrade 먼저! */}
          <Write onClick={() => navigate("/checkgrade")}>내 비료 팔기</Write>
          <ImgContainer>
            <Img src={Search} alt="search" />
            <Img src={Likes} alt="likes" />
            <Img
              src={Profile}
              alt="profile"
              onClick={() => navigate("/profile")}
            />
          </ImgContainer>
        </MyContainer>
      </MainFrame>
    </>
  );
};

export default Header;

const MainFrame = styled.div`
  position: fixed;
  width: 100%;
  height: 110px;
  top: 0;
  border-bottom: 1px solid #f2f2f2;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000; /* Header는 가장 위에 와야함 */
`;

const Title = styled.img`
  width: 200px;
  margin-left: 20px;
  cursor: pointer;
`;

const NavigatorContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 40px;
`;

const Navigator = styled.div`
  font-size: 21px;
  font-weight: bold;
  cursor: pointer;
  margin: 0 30px;
  padding: 10px 0; /* 텍스트 위아래 여백 확보 */
`;

const MyContainer = styled.div`
  margin: 0;
  display: flex;
  align-items: center;
`;

const Write = styled.button`
  border: none;
  outline: none;
  height: 40px;
  background-color: #f8f4d9;
  border-radius: 25px;
  padding: 0px 16px;
  font-weight: bold;
  font-size: 14px;
  margin-right: 30px;
`;

const ImgContainer = styled.div`
  margin: 0 40px 0 0; // top right bottom left
  display: flex;
  align-items: center;
`;

const Img = styled.img`
  width: 50px;
  cursor: pointer;
`;
