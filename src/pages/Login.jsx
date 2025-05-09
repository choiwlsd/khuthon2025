import React from "react";
import styled from "styled-components";
import Header from "../component/Header";

const Login = () => {
  return (
    <>
      <Header />
      <FlexContainer>
        <h2>로그인</h2>
        <CustomInput type="text" placeholder="아이디" />
        <CustomInput type="password" placeholder="비밀번호" />
      </FlexContainer>
    </>
  );
};

export default Login;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CustomInput = styled.input`
  width: 300px;
  height: 30px;
  border: 1px solid #d8d8d8;
  border-radius: 15px;
  margin-bottom: 20px;

  &::placeholder {
    color: #d8d8d8;
  }
`;
