import { useState } from "react";
import type { Game } from "../types";
import GameCard from "./GameCard";

interface GameListProps {
  games: Game[];
  onToggleLike: (id: string) => void;
}

function GameList({ games, onToggleLike }: GameListProps) {
  // 1. 검색어 상태(searchTerm)를 MainPage가 아닌 여기서 관리합니다.
  const [searchTerm, setSearchTerm] = useState("");

  // 2. 필터링 로직도 이 컴포넌트 안에서 처리합니다.
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="게임 이름으로 검색..."
          className="input input-bordered w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2 className="text-2xl font-bold mb-4">🎲 전체 게임 목록</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <GameCard
            key={game._id} // key를 _id로 변경
            game={game}
            onToggleLike={onToggleLike} // onToggleLike 함수를 그대로 전달
          />
        ))}
      </div>
    </section>
  );
}

export default GameList;
