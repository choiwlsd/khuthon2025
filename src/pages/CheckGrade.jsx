import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../component/Header.jsx";
import Graph from "../assets/Graph.png";

const CheckGrade = () => {
  const navigate = useNavigate();
  const [measured, setMeasured] = useState(false); // 결과 영역 표시 여부
  const [loading, setLoading] = useState(false); // 측정 중인지

  /* 측정 버튼 핸들러 */
  const startMeasure = () => {
    setLoading(true);
    setTimeout(() => {
      // 2.5초 후 측정 완료
      setMeasured(true);
      setLoading(false);
    }, 2500);
  };

  return (
    <>
      <Header />
      <Frame>
        <Title>비료 등급 확인하기</Title>
      </Frame>

      <FullWrap>
        {/* ① 측정하기 버튼 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        ></div>
        {!measured && (
          <MeasureButton onClick={startMeasure} disabled={loading}>
            {loading ? "측정 중..." : "측정하기"}
          </MeasureButton>
        )}

        {/* 결과 + 측정완료 버튼 */}
        {measured && (
          <Wrap>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h2>AI가 분석한 당신의 비료는..</h2>
            </div>
            <Container>
              <CustomImage src={Graph} alt="graph" />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ marginLeft: 50 }}>
                  <Row>
                    <p>책정 등급:</p>
                    <Bold>A</Bold>
                  </Row>
                  <Row>
                    <p>책정 무게:</p>
                    <Bold>13kg</Bold>
                  </Row>
                  <Row>
                    <p>책정가:</p>
                    <Bold>13,000원</Bold>
                  </Row>
                </div>

                <PurchaseButton onClick={() => navigate("/newpost")}>
                  판매하러 가기
                </PurchaseButton>
              </div>
            </Container>
            {/* ▶ 측정완료 + 재측정 */}
            <BtnRow>
              <ActionButton
                onClick={() => {
                  setMeasured(false);
                  startMeasure();
                }}
              >
                재측정
              </ActionButton>
              <ActionButton>측정완료</ActionButton>
            </BtnRow>
          </Wrap>
        )}
      </FullWrap>
    </>
  );
};

export default CheckGrade;

/* ─ styled-components ─ */
const Frame = styled.div`
  position: fixed;
  top: 140px;
  padding-left: 70px;
  width: 420px;
  z-index: 10;
`;
const Title = styled.h2`
  font-size: 25px;
  font-weight: 700;
`;
/* Wrapper 전체를 중앙 정렬 */
const FullWrap = styled.div`
  margin-top: 120px;
  min-height: calc(100vh-180px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 40px;
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 60px;
`;
const CustomImage = styled.img`
  width: 700px;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Bold = styled.p`
  font-size: 20px;
  font-weight: 700;
  margin-left: 12px;
`;
const PurchaseButton = styled.button`
  width: 300px;
  background: #f8f4d9;
  border-radius: 10px;
  color: #6f6f2b;
  margin-top: 50px;
`;

const ActionButton = styled.button`
  width: 200px;
  padding: 14px 0;
  border: none;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 600;
  background: #f0e9d8;
  color: #444;
  cursor: pointer;
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};
`;

const MeasureButton = styled.button`
  margin-left: 750px;
  width: 200px;
  padding: 14px 0;
  border: none;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 600;
  background: #f0e9d8;
  color: #444;
  cursor: pointer;
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};
`;

const BtnRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
  justify-content: center;
`;

const Wrap = styled.div`
  margin-left: 300px;
`;
