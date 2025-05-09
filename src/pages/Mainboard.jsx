import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Header from "../component/header";
import Sidebar from "../component/Sidebar";
import { useNavigate } from "react-router-dom";

const Mainboard = () => {
  const navigate = useNavigate();

  /* 서버에서 받아온 데이터를 저장할 상태 */
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [gradeFilter, setGradeFilter] = useState([]); // ["A","B",…]
  const [priceFilter, setPriceFilter] = useState(""); // "나눔" | 5000 | ...

  /** 첫 렌더링 때 서버 호출 */
  useEffect(() => {
    const API_BASE = "http://34.64.57.155:5500/api";
    const fetchData = async () => {
      try {
        setLoading(true);

        /* 1️⃣ 게시글 목록 가져오기 */
        const postRes = await axios.get(`${API_BASE}/posts`);
        const postData = postRes.data.data; // [{ postId, fertId, ... }]

        /* 2️⃣ 중복 없이 fertId 모으기 */
        const fertIds = [...new Set(postData.map((p) => p.fertId))];

        /* 3️⃣ fertId 별로 병렬 호출 */
        const fertPromises = fertIds.map((id) =>
          axios.get(`${API_BASE}/fertilizers/${id}`)
        );
        const fertResults = await Promise.allSettled(fertPromises);

        /* 4️⃣ fertId → 비료정보 매핑 테이블 만들기 */
        const fertMap = {};
        fertResults.forEach((res) => {
          if (res.status === "fulfilled") {
            const f = res.value.data.data;
            fertMap[f.fertId] = f; // { price, weightKg, grade }
          }
        });

        /* 5️⃣ 카드에 쓸 데이터 가공 */
        const merged = postData.map((p) => {
          const f = fertMap[p.fertId] || {};
          return {
            post_id: p.postId,
            image_url: p.imageUrl,
            title: p.title,
            price: f.price ? `${f.price.toLocaleString()}원` : "가격 정보 없음",
            weight: f.weightKg ? `${f.weightKg}kg` : "",
            grade: f.grade ? `${f.grade} 등급` : "",
            description: p.description,
          };
        });

        setPosts(merged);
      } catch (e) {
        console.error(e);
        setError("데이터를 불러오지 못했어 🥲");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* 로딩·에러 처리 */
  if (loading) return <FullMsg>불러오는 중...</FullMsg>;
  if (error) return <FullMsg>{error}</FullMsg>;

  const filtered = posts.filter((p) => {
    /* 등급 */
    if (gradeFilter.length && !gradeFilter.includes(p.grade[0])) return false;

    /* 가격 */
    const priceNum = Number(p.price.replaceAll(",", "").replace("원", ""));
    if (priceFilter === "나눔" && priceNum !== 0) return false;
    if (typeof priceFilter === "number" && priceNum > priceFilter) return false;

    return true;
  });

  return (
    <>
      <Header />

      <ContentRow>
        {/* ★ Sidebar에 props로 넘기기 */}
        <Sidebar
          gradeFilter={gradeFilter}
          priceFilter={priceFilter}
          onGradeChange={setGradeFilter}
          onPriceChange={setPriceFilter}
        />
        <div style={{ marginTop: "100px", width: "99vw", marginRight: "50px" }}>
          <Grid>
            {filtered.map((post) => (
              <Post
                key={post.post_id}
                onClick={() =>
                  navigate(`/post/${post.post_id}`, { state: post })
                } // ← 포스트 객체 통째로 전달
              >
                <CustomImage src={post.image_url} alt={post.title} />
                <p
                  style={{
                    fontSize: "14px",
                    marginTop: "12px",
                    marginLeft: "3px",
                  }}
                >
                  {post.title}
                </p>
                <PriceRow>
                  <p
                    style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}
                  >
                    {post.price}
                  </p>

                  <GradeBox>{post.grade}</GradeBox>
                </PriceRow>

                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    marginLeft: "5px",
                  }}
                >
                  {post.weight}
                </p>
              </Post>
            ))}
          </Grid>
        </div>
      </ContentRow>
    </>
  );
};

export default Mainboard;

const FullMsg = styled.p`
  margin-top: 120px;
  text-align: center;
`;

const ContentRow = styled.div`
  display: flex;
  margin-top: 80px; /* Header 높이만큼 */
  width: 99vw; /* 전체 너비 */
`;

const Grid = styled.div`
  flex: 1;
  // background-color: #f0f0f0;
  display: grid;
  grid-template-columns: repeat(4, 200px);
  justify-content: center;
  column-gap: 70px;
  row-gap: 50px;
`;

const Post = styled.div`
  width: 230px;
  height: auto;
  background: #fff;
  border-radius: 8px;
  // box-shadow: 0 2px 4px rgba(57, 52, 52, 0.1);
  cursor: pointer;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* 여기서 p 태그만 따로 왼쪽 정렬 */
  p {
    text-align: left;
    width: 100%;
    margin: 4px 0;
  }

  &:hover {
    color: #263a73;
    transition: 0.2s;
  }
`;

const CustomImage = styled.img`
  width: 230px;
  height: 230px;
  object-fit: cover; /* 이미지 비율 유지하면서 꽉 채움 */
  border-radius: 4px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
`;

const GradeBox = styled.div`
  background-color: #f8f4d9;
  font-size: 13px;
  font-weight: bold;
  color: #94917c;
  border-radius: 20px;
  padding: 3px 10px; /* ↓ 여백도 줄임 */
  white-space: nowrap;
`;
