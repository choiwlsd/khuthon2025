import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Header from "../component/header";

const API_BASE = "http://34.64.57.155:5500/api";
const USER_ID = "681de41a3d38382a8024b708";

const Purchase = () => {
  const { state } = useLocation(); // PostDetail 에서 넘긴 객체
  const [item] = useState(state); // post_id, price, 이미지 등 포함
  const [paying, setPaying] = useState(false);

  //console.log("item:", item);

  /* 결제(=거래 생성) */
  const handlePay = async () => {
    try {
      setPaying(true);
      await axios.post(`${API_BASE}/transactions/${item.post_id}/${USER_ID}`);
      alert("결제 완료! 🎉");
      // TODO: 필요하면 페이지 이동 or 상태 초기화
    } catch (e) {
      console.error(e);
      alert("결제 실패 🥲 다시 시도해 주세요.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <>
      <Header />
      <Frame>
        <Title>상품 구매하기</Title>
      </Frame>

      <Wrapper>
        <LeftContainer>
          <SectionTitle>구매 품목</SectionTitle>

          <ItemContainer>
            <ItemImg src={item.image_url} alt="post-photo" />
            <ItemInfo>
              <ItemTitle>{item.title}</ItemTitle>
              <MetaRow>
                <MetaLabel>발효 시작일</MetaLabel>
                <MetaValue>25.04.28</MetaValue>
              </MetaRow>
              <MetaRow>
                <MetaLabel>발효 완료일</MetaLabel>
                <MetaValue>25.05.09</MetaValue>
              </MetaRow>
              <Row>
                <Badge>{item.grade}</Badge>
                <Dot>·</Dot>
                <Weight>{item.weight}</Weight>
              </Row>
            </ItemInfo>
          </ItemContainer>
          <PurchaseLeftContainer>
            <PurchaseSectionTitle>배송 정보</PurchaseSectionTitle>
            <ItemContainer>
              <ShippingForm>
                <FormGroup>
                  <Label>이름</Label>
                  <SmallInput type="text" placeholder="김진수" />
                </FormGroup>

                <FormGroup>
                  <Label>배송주소</Label>
                  <InputRow>
                    <Input
                      type="text"
                      placeholder="16710"
                      style={{ width: "200px" }}
                    />
                    <FindZipButton>우편번호 찾기</FindZipButton>
                  </InputRow>
                  <Input
                    type="text"
                    placeholder="경희대학교 국제캠퍼스 제2기숙사"
                  />
                  <Input type="text" placeholder="B동 428호" />
                </FormGroup>

                <FormGroup>
                  <Label>휴대폰</Label>
                  <InputRow>
                    <Input
                      type="text"
                      placeholder="010"
                      style={{ width: "120px" }}
                    />
                    <span>-</span>
                    <Input
                      type="text"
                      placeholder="1234"
                      style={{ width: "120px" }}
                    />
                    <span>-</span>
                    <Input
                      type="text"
                      placeholder="1234"
                      style={{ width: "120px" }}
                    />
                  </InputRow>
                </FormGroup>
              </ShippingForm>
            </ItemContainer>
          </PurchaseLeftContainer>
        </LeftContainer>

        <TotalContainer>
          <SummaryCol>
            <SummaryRow>
              <SummaryLabel>총 상품 금액</SummaryLabel>
              <SummaryValue>{item.price.toLocaleString()}</SummaryValue>
            </SummaryRow>

            <SubRow>
              <SubText>상품 1개</SubText>
              <SubText>{item.price.toLocaleString()}</SubText>
            </SubRow>

            <SummaryRow>
              <SummaryLabel>총 추가 금액</SummaryLabel>
              <SummaryValue>0원</SummaryValue>
            </SummaryRow>

            <Divider />

            <SummaryRow>
              <FinalLabel>최종 결제 금액</FinalLabel>
              <FinalValue>{item.price.toLocaleString()}</FinalValue>
            </SummaryRow>

            <PayButton onClick={handlePay} disabled={paying}>
              {paying ? "결제 중..." : "결제하기"}
            </PayButton>
          </SummaryCol>
        </TotalContainer>
      </Wrapper>
    </>
  );
};

export default Purchase;

const Frame = styled.div`
  position: fixed;
  top: 140px; /* header 아래 공간 확보 */
  padding-left: 70px;
  width: 420px;
  z-index: 10;
`;

const Title = styled.h2`
  font-size: 25px;
  font-weight: bold;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 60px;
  margin: 150px 0 0 110px; /* 위 여백만 유지 */
  padding: 0 200px; /* ← 왼쪽(오른쪽) 여백 맞추기 */
  width: 1500px;
  box-sizing: border-box; /* 패딩 포함해서 폭 계산 */
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 700px; /* ← 폭 제한해서 중앙 쪽으로 */
  flex: 1;
  margin-top: 80px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  font-size: 22px;
`;

const ItemContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px 0;
  border-top: 1.2px solid #f2f2f2;
`;

const ItemImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 10px;
  object-fit: cover;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ItemTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Badge = styled.span`
  background: #f0e9d8;
  color: #6b5438;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
`;

const Dot = styled.span`
  font-size: 14px;
  color: #999;
`;

const Weight = styled.span`
  font-size: 14px;
  color: #666;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 10px;
  font-size: 14px;
`;

const MetaLabel = styled.span`
  color: #777;
  width: 90px; /* 정렬용 고정폭 */
`;

const MetaValue = styled.span`
  color: #444;
`;

const TotalContainer = styled.div`
  width: 300px;
  margin-top: 100px;
`;

const SummaryCol = styled.div`
  border: 1px solid #e7e7e7;
  border-radius: 20px;
  padding: 30px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const SummaryLabel = styled.span`
  font-size: 14px;
  color: #444;
`;

const SummaryValue = styled.span`
  font-size: 18px;
  font-weight: 700;
`;

const SubRow = styled(SummaryRow)`
  margin-top: -6px;
`;

const SubText = styled.span`
  font-size: 12px;
  color: #999;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 10px 0;
  margin-top: 100px;
`;

const FinalLabel = styled(SummaryLabel)`
  font-weight: 700;
`;

const FinalValue = styled(SummaryValue)`
  font-size: 20px;
`;

const PayButton = styled.button`
  margin-top: 12px;
  padding: 12px 0;
  background: #f0e9d8;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

const PurchaseLeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 700px; /* ← 폭 제한해서 중앙 쪽으로 */
  flex: 1;
  margin-top: 20px;
`;

const PurchaseSectionTitle = styled.h2`
  margin: 0 0 20px 0;
  font-size: 22px;
`;

const ShippingForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 80%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const SmallInput = styled.input`
  width: 150px;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FindZipButton = styled.button`
  padding: 12px 14px;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
`;
