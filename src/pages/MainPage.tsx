import { useState, useEffect } from 'react';
import type { Game } from '../types';
import SplitText from '../components/reactbits/SplitText';
import GameCard from '../components/GameCard';
import GameList from '../components/GameList'; // 1. GameList 컴포넌트 import
import Modal from '../components/Modal';

// ... 임시 데이터 및 shuffleArray 함수는 동일 ...
const initialGames: Game[] = [
  { id: 1, name: '사이버펑크 2077', description: '미래 도시 나이트 시티에서의 모험', imageUrl: 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp', isLiked: true },
  { id: 2, name: '엘든 링', description: '광활한 세계를 탐험하는 판타지 액션 RPG', imageUrl: 'https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp', isLiked: true },
  { id: 3, name: '스타듀 밸리', description: '평화로운 농장 생활을 즐겨보세요', imageUrl: 'https://img.daisyui.com/images/stock/photo-1565035010268-a3845f9df217.webp', isLiked: false },
  { id: 4, name: '젤다: 야생의 숨결', description: '끝없는 하이랄 왕국을 탐험하세요', imageUrl: 'https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp', isLiked: false },
  { id: 5, name: '레드 데드 리뎀션 2', description: '서부 시대의 장대한 서사시', imageUrl: 'https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp', isLiked: false },
  { id: 6, name: '위쳐 3: 와일드 헌트', description: '괴물 사냥꾼 게롤트의 여정', imageUrl: 'https://img.daisyui.com/images/stock/photo-1550258987-190a21d4c9a7.webp', isLiked: false },
];

const shuffleArray = (array: Game[]) => [...array].sort(() => Math.random() - 0.5);

function MainPage() {
  const [games, setGames] = useState<Game[]>([]);
  // 2. searchTerm 상태는 이제 GameList 컴포넌트로 이동했으므로 제거합니다.
  // const [searchTerm, setSearchTerm] = useState(''); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const userName = "UNICON";

  useEffect(() => {
    setGames(shuffleArray(initialGames));
  }, []);

  const handleToggleLike = (id: number) => {
    const likedCount = games.filter(g => g.isLiked).length;
    const targetGame = games.find(g => g.id === id);

    if (likedCount >= 2 && !targetGame?.isLiked) {
      setModalContent({ 
        title: 'UNICON에 갓겜은 많지만...', 
        message: '투표는 최대 2개까지 가능합니다.' 
      });
      setIsModalOpen(true);
      return;
    }

    setGames(games.map(game =>
      game.id === id ? { ...game, isLiked: !game.isLiked } : game
    ));
  };

  const likedGames = games.filter(game => game.isLiked);
  // 3. filteredGames 로직도 GameList로 이동했으므로 제거합니다.

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
            {likedGames.map(game => (
              <GameCard key={game.id} game={game} onToggleLike={handleToggleLike} />
            ))}
          </div>
        ) : (
          <div className="card bg-base-100/50 p-8 text-center">
            <p className="text-base-content/60">아직 찜한 게임이 없어요. 하트를 눌러보세요!</p>
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