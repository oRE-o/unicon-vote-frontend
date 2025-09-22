import type { Game } from "../types";

interface GameCardProps {
  game: Game;
  onToggleLike: (id: string) => void; // 하트 버튼 클릭 시 호출될 함수
}

function GameCard({ game, onToggleLike }: GameCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl transition-transform duration-300 hover:scale-105">
      <figure>
        <img
          src={game.imageUrl}
          alt={game.name}
          className="h-56 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{game.name}</h2>
        <p>{game.description}</p>
        <div className="card-actions justify-end">
          {/* 하트 버튼: isLiked 상태에 따라 모양과 색이 바뀜 */}
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => onToggleLike(game._id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${
                game.isLiked ? "text-red-500" : "text-gray-400"
              }`}
              fill={game.isLiked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
