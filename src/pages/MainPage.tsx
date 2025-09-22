import { useState, useEffect } from "react";
import type { Game } from "../types";
import api from "../api";
import SplitText from "../components/reactbits/SplitText";
import GameCard from "../components/GameCard";
import GameList from "../components/GameList"; // 1. GameList 컴포넌트 import
import Modal from "../components/Modal";

function MainPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [likedGames, setLikedGames] = useState<Game[]>([]); // 2. '좋아요' 게임 목록 상태 분리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const userName = "UNICON"; // 실제로는 로그인 시 받은 사용자 이름으로 대체

  const fetchData = async () => {
    try {
      // 두 API를 동시에 호출해서 더 빠르게 데이터를 가져옵니다.
      const [allGamesRes, likedGamesRes] = await Promise.all([
        api.get<Game[]>("/api/games"),
        api.get<Game[]>("/api/games/my-likes"),
      ]);

      const allGames = allGamesRes.data;
      const liked = likedGamesRes.data;

      // '좋아요'한 게임 ID 목록을 Set으로 만들어 빠른 조회를 가능하게 합니다.
      const likedGameIds = new Set(liked.map((g) => g._id));

      // 전체 게임 목록에 isLiked 속성을 동적으로 추가합니다.
      const gamesWithLikeStatus = allGames.map((game) => ({
        ...game,
        isLiked: likedGameIds.has(game._id),
      }));

      setGames(gamesWithLikeStatus);
      setLikedGames(liked);
    } catch (error) {
      console.error("데이터를 불러오는 데 실패했습니다:", error);
      // TODO: 에러 처리 UI (예: 토큰 만료 시 로그인 페이지로 리디렉션)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleLike = async (gameId: string) => {
    const targetGame = games.find((g) => g._id === gameId);
    if (!targetGame) return;

    // 클라이언트 단에서 먼저 UI 피드백을 위한 검사
    if (likedGames.length >= 2 && !targetGame.isLiked) {
      setModalContent({
        title: "UNICON에 갓겜은 많지만...",
        message: "투표는 최대 2개까지 가능합니다.",
      });
      setIsModalOpen(true);
      return;
    }

    try {
      if (targetGame.isLiked) {
        // 좋아요 취소 API 호출
        await api.delete(`/api/games/${gameId}/like`);
      } else {
        // 좋아요 추가 API 호출
        await api.post(`/api/games/${gameId}/like`);
      }

      // 5. 요청 성공 후, 서버의 최신 데이터를 다시 불러와 화면을 동기화합니다.
      await fetchData();
    } catch (error: any) {
      const message = error.response?.data?.message || "오류가 발생했습니다.";
      setModalContent({ title: "요청 실패", message });
      setIsModalOpen(true);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-base-200 min-h-screen">
      <header className="text-center mb-10">
        <SplitText
          text={`안녕하세요, ${userName}님!`}
          className="text-4xl md:text-5xl font-bold pb-1 pt-10"
          splitType="chars"
          delay={70}
          duration={2}
          ease="elastic.out"
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
        />
        <p className="mt-4 text-lg text-base-content/80">
          UNICON의 게임들 중 가장 마음에 드는 작품에 투표해주세요!
        </p>
      </header>

      {/* 내가 찜한 게임 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">❤️ 내가 찜한 게임</h2>
        {likedGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {likedGames.map((game) => (
              <GameCard
                key={game._id} // 6. key를 _id로 변경
                game={{ ...game, isLiked: true }} // 이 목록의 게임은 항상 isLiked가 true
                onToggleLike={() => handleToggleLike(game._id)} // 7. id 전달 방식 변경
              />
            ))}
          </div>
        ) : (
          <div className="card bg-base-100/50 p-8 text-center">
            <p className="text-base-content/60">
              아직 찜한 게임이 없어요. 하트를 눌러보세요!
            </p>
          </div>
        )}
      </section>

      <div className="divider my-8"></div>

      {/* 4. 기존 검색창 및 목록 대신 GameList 컴포넌트를 렌더링합니다. */}
      <GameList games={games} onToggleLike={handleToggleLike} />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
      >
        <p>{modalContent.message}</p>
      </Modal>
    </div>
  );
}

export default MainPage;
