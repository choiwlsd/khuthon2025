import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Header from "../component/Header";

const API_BASE = "http://34.64.57.155:5500/api";
const TEMP_FERT_ID = "681df200e946431c23904975";
const USER_ID = "681de41a3d38382a8024b708";
const FERT_ID = "681df200e946431c23904975";

const NewPost = () => {
  const [imageFile, setImageFile] = useState(null); // 서버로 보낼 실제 파일
  const [previewUrl, setPreviewUrl] = useState(null); // 화면에 미리보기
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  /* ─ 비료 정보 ─ */
  const [fert, setFert] = useState(null); // { price, weightKg, grade }

  /* fertId로 비료 데이터 조회 */
  useEffect(() => {
    const fetchFert = async () => {
      try {
        const res = await axios.get(`${API_BASE}/fertilizers/${FERT_ID}`);
        setFert(res.data.data); // { price, weightKg, grade, fertId }
      } catch (err) {
        console.error(err);
        alert("비료 정보를 가져오지 못했어 🥲");
      } finally {
        setLoading(false);
      }
    };
    fetchFert();
  }, []);

  /* ─ 파일 선택 ───────────────────────────────────────── */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("png 또는 jpg 이미지만 업로드 가능합니다.");
    }
  };

  /* ─ 업로드 제출 ─────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!imageFile || !title.trim() || !desc.trim()) {
      alert("이미지·제목·설명을 모두 입력해 줘!");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("fertId", TEMP_FERT_ID);
      form.append("title", title);
      form.append("description", desc);
      form.append("image", imageFile); // 파일 직접!

      await axios.post(`${API_BASE}/posts/${USER_ID}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("업로드 완료! 🎉");
      // TODO: 업로드 성공 후 페이지 이동 or 상태 초기화
    } catch (err) {
      console.error(err);
      alert("업로드 실패 🥲");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Frame>
        <Title>게시글 작성하기</Title>
      </Frame>
      <Container>
        <ContentBox>
          <LeftSection>
            <ImageLabel htmlFor="image-upload">
              {previewUrl ? (
                <PreviewImage src={previewUrl} />
              ) : (
                <UploadPlaceholder>사진 업로드</UploadPlaceholder>
              )}
            </ImageLabel>
            <HiddenInput
              id="image-upload"
              type="file"
              accept="image/png, image/jpeg"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            {/* 비료 정보 영역 */}
            {!loading && fert && (
              <PriceInfo>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "400px",
                  }}
                >
                  <PriceText>{fert.price.toLocaleString()}원</PriceText>
                  <GradeBadge>{fert.grade}등급</GradeBadge>
                </div>
                <WeightText>{fert.weightKg}kg</WeightText>
              </PriceInfo>
            )}
          </LeftSection>
          <RightSection>
            <Input
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <DateRow>
              <DateItem>
                <DateLabel>발효 시작일</DateLabel>
                <DateValue>25.04.28</DateValue>
              </DateItem>
              <DateItem>
                <DateLabel>발효 완료일</DateLabel>
                <DateValue>25.05.09</DateValue>
              </DateItem>
            </DateRow>
            <Textarea
              placeholder="설명을 입력하세요"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <UploadButton onClick={handleSubmit} disabled={loading}>
              {loading ? "업로드 중..." : "업로드"}
            </UploadButton>{" "}
          </RightSection>
        </ContentBox>
      </Container>
    </>
  );
};

export default NewPost;

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

const Container = styled.div`
  padding: 230px 50px 50px;
  width: 90vw;
  margin: 0 auto;
`;

const ContentBox = styled.div`
  display: flex;
  gap: 60px;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end; // 가로 가운데 정렬
  justify-content: center; // 세로 가운데 정렬
`;

const ImageLabel = styled.label`
  width: 400px;
  height: 400px;
  background-color: #f5f5f5;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const UploadPlaceholder = styled.div`
  font-size: 13px;
  text-decoration: underline;
  color: #555;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HiddenInput = styled.input`
  display: none;
`;

const PriceInfo = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PriceText = styled.div`
  font-weight: bold;
  font-size: 18px;
`;

const WeightText = styled.div`
  font-size: 14px;
  color: #555;
`;

const GradeBadge = styled.div`
  background-color: #f8f4d9;
  border-radius: 12px;
  font-size: 13px;
  padding: 4px 10px;
  width: fit-content;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-right: 50px;
`;

const Input = styled.input`
  font-size: 28px;
  padding: 12px 12px 20px 0px; // top, right, bottom, left
  border: none;
  border-bottom: 1px solid #e4e4e4;
  margin-bottom: 20px;
  outline: none;
  &::placeholder {
    color: #d7d7d7;
    font-family: Pretendard;
  }
`;

const Textarea = styled.textarea`
  font-size: 16px;
  font-family: Pretendard;
  padding: 30px 12px 20px 5px;
  border: none;
  border-top: 1px solid #e4e4e4;
  height: 100px;
  resize: none;
  &::placeholder {
    color: #d7d7d7;
    font-family: Pretendard;
    font-size: 18px;
  }
`;

const UploadButton = styled.button`
  align-self: flex-end;
  background-color: #f8f4d9;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-weight: bold;
  font-size: 15px;
  color: #94917c;
  cursor: pointer;
`;

const DateRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const DateItem = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const DateLabel = styled.div`
  font-size: 15px;
  display: flex;
  align-items: center;
  &::before {
    content: "📅";
    margin-right: 10px;
  }
`;

const DateValue = styled.div`
  font-size: 15px;
  color: #444;
`;
