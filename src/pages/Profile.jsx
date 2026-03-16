import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Header from "../component/Header.jsx";
import Khubaby from "../assets/khubaby.png";
import Trust from "../assets/Trust.png";

const API_BASE = "http://34.64.57.155:5500/api";
const USER_ID = "681de41a3d38382a8024b708";

const Profile = () => {
  const [tab, setTab] = useState("SALE");
  const [salePosts, setSale] = useState([]);
  const [buyPosts, setBuy] = useState([]);
  const [loading, setLoad] = useState(true);
  const [error, setErr] = useState(null);

  /* ───── 1) 판매 내역 한 번만 조회 ───── */
  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await axios.get(`${API_BASE}/posts/me/${USER_ID}`);
        const posts = res.data.data;

        /* fert 추가 호출 */
        const fertIds = [...new Set(posts.map((p) => p.fertId))];
        const fertMap = await getFertMap(fertIds);

        const merged = posts.map((p) => ({
          post_id: p.postId,
          image_url: p.imageUrl,
          title: p.title,
          price: fertMap[p.fertId]?.price
            ? `${fertMap[p.fertId].price.toLocaleString()}원`
            : "--원",
          weight: fertMap[p.fertId]?.weightKg
            ? `${fertMap[p.fertId].weightKg}kg`
            : "--kg",
          grade: fertMap[p.fertId]?.grade
            ? `${fertMap[p.fertId].grade} 등급`
            : "-",
          status: p.isSold ? "COMPLETED" : "PENDING",
        }));
        setSale(merged);
      } catch (e) {
        console.error(e);
        setErr("판매 내역을 불러오지 못했어 🥲");
      } finally {
        setLoad(false);
      }
    };
    fetchSale();
  }, []);

  /* ───── 2) 구매 내역은 탭 클릭 시 조회 ───── */
  useEffect(() => {
    if (tab !== "PURCHASE" || buyPosts.length) return;

    const fetchBuy = async () => {
      try {
        setLoad(true);

        /* 거래 목록 */
        const res = await axios.get(`${API_BASE}/transactions/me/${USER_ID}`);
        const trans = res.data.data; // [{ postId, status, ... }]

        /* 해당 postId → 게시글 정보 */
        const postPromises = trans.map((t) =>
          axios.get(`${API_BASE}/posts/${t.postId}`)
        );
        const postResults = await Promise.allSettled(postPromises);

        /* fertId 모으기 */
        const fertIds = postResults
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value.data.data.fertId);
        const fertMap = await getFertMap(fertIds);

        /* 조합 */
        const merged = trans.map((t, idx) => {
          const postData =
            postResults[idx].status === "fulfilled"
              ? postResults[idx].value.data.data
              : {};
          const f = fertMap[postData.fertId] || {};
          return {
            post_id: postData.postId || t.postId,
            image_url: postData.imageUrl || "",
            title: postData.title || "(삭제된 글)",
            price: f.price ? `${f.price.toLocaleString()}원` : "--원",
            weight: f.weightKg ? `${f.weightKg}kg` : "--kg",
            grade: f.grade ? `${f.grade} 등급` : "-",
            status: t.status, // PENDING / COMPLETED
          };
        });

        setBuy(merged);
      } catch (e) {
        console.error(e);
        setErr("구매 내역을 불러오지 못했어 🥲");
      } finally {
        setLoad(false);
      }
    };
    fetchBuy();
  }, [tab, buyPosts.length]);

  /* ---------- 화면에 보여줄 리스트 ---------- */
  const list = tab === "SALE" ? salePosts : tab === "PURCHASE" ? buyPosts : [];

  /* ───── fertId → 비료정보 매핑 헬퍼 ───── */
  const getFertMap = async (ids) => {
    const uniq = [...new Set(ids)];
    const req = uniq.map((id) => axios.get(`${API_BASE}/fertilizers/${id}`));
    const res = await Promise.allSettled(req);
    const map = {};
    res.forEach((r) => {
      if (r.status === "fulfilled") {
        const f = r.value.data.data;
        map[f.fertId] = f;
      }
    });
    return map;
  };

  return (
    <>
      <Header />
      <Frame>
        <Title>사용자 프로필</Title>
      </Frame>

      <Wrapper>
        <ProfileHead>
          <AvatarWrap>
            <Avatar src={Khubaby} alt="avatar" />
            <div>
              <Nickname>경희베이비</Nickname>
              <p>경희대 구내식당</p>
            </div>
          </AvatarWrap>
          <SproutWrap>
            <img src={Trust} alt="trust" width={40} height={40} />
            <SproutText>
              싹 신뢰도
              <br />
              <strong>곡식 단계</strong>
            </SproutText>
          </SproutWrap>
        </ProfileHead>

        <TabNav>
          {["SALE", "PURCHASE", "JANBAN"].map((t) => (
            <Tab key={t} active={tab === t} onClick={() => setTab(t)}>
              {t === "SALE"
                ? "판매 내역"
                : t === "PURCHASE"
                ? "구매 내역"
                : "잔반머니 조회"}
            </Tab>
          ))}
        </TabNav>

        {error && <p>{error}</p>}
        {tab === "JANBAN" ? (
          <>
            <h2 style={{ marginTop: 10 }}>🌱 잔반머니</h2>
            <p style={{ fontSize: "35px", fontWeight: "bold", marginTop: 0 }}>
              3,500원
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                gap: "15px",
              }}
            >
              <button
                style={{
                  width: "200px",
                  height: "50px",
                  backgroundColor: "#FAF4D5",
                }}
              >
                충전
              </button>
              <button
                style={{
                  width: "200px",
                  height: "50px",
                  backgroundColor: "#F3F3F3",
                }}
              >
                송금
              </button>
            </div>
          </>
        ) : loading ? (
          <p style={{ marginTop: 80 }}>불러오는 중...</p>
        ) : (
          <Grid>
            {list.map((item) => (
              <Card key={item.id}>
                <Img src={item.img} alt={item.title} />
                <Row>
                  {item.status === "PENDING" ? (
                    <PendingBadge>진행 중</PendingBadge>
                  ) : (
                    <CompletedBadge>완료</CompletedBadge>
                  )}
                  <CardTitle>{item.title}</CardTitle>
                </Row>
                <Row>
                  <span>{item.price}</span>
                  <Badge>{item.grade}</Badge>
                </Row>
                <span>{item.weight}</span>
              </Card>
            ))}
          </Grid>
        )}
      </Wrapper>
    </>
  );
};

export default Profile;

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

const Wrapper = styled.main`
  padding-top: 180px; /* Header 높이 만큼 여백 */
  min-height: calc(100vh - 180px); /* 남은 영역을 꽉 채워야 세로 중앙 가능 */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  margin-left: 400px;
`;

const ProfileHead = styled.section`
  width: 900px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const AvatarWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Avatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
`;

const Nickname = styled.h2`
  font-size: 22px;
  font-weight: 700;
`;

const SproutWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SproutText = styled.p`
  font-size: 16px;
  line-height: 1.3;
  text-align: center;
`;

const TabNav = styled.nav`
  width: 900px;
  display: flex;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 40px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 14px 0;
  font-size: 18px;
  font-weight: 600;
  background: none;
  border: none;
  border-radius: 0;
  outline: none;
  cursor: pointer;
  border-bottom: ${({ active }) => (active ? "3px solid #000" : "none")};
  color: ${({ active }) => (active ? "#000" : "#9c9c9c")};
`;

const Grid = styled.div`
  flex: 1;
  // background-color: #f0f0f0;
  display: grid;
  grid-template-columns: repeat(3, 220px);
  justify-content: center;
  column-gap: 70px;
  row-gap: 50px;
`;

const Card = styled.div``;

const Row = styled.div`
  display: flex;
  width: 220px;
  justify-content: space-between;
  align-items: center;
`;

const Img = styled.img`
  width: 220px;
  height: 220px;
  border-radius: 15px;
  object-fit: cover;
`;

const CardTitle = styled.p`
  width: 120px; /* 원하는 너비 */
  white-space: nowrap; /* 줄바꿈 없이 한 줄로 */
  overflow: hidden; /* 넘친 텍스트 숨김 */
  text-overflow: ellipsis; /* 말줄임(...) 표시 */
`;

const PendingBadge = styled.div`
  background-color: #d9ffc4;
  color: #559731;
  width: 70px;
  text-align: center;
  border-radius: 10px;
  font-size: 17px;
`;

const CompletedBadge = styled.div`
  background-color: #d9d9d9;
  color: #636363;
  width: 80px;
  text-align: center;
  border-radius: 10px;
  font-size: 17px;
`;

const Badge = styled.div`
  background-color: #f8f4d9;
  color: #94917c;
  width: 70px;
  padding: 1px;
  font-size: 16px;
  border-radius: 10px;
  text-align: center;
`;
