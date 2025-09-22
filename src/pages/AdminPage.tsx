import React, { useState, useEffect } from "react";
import api from "../api"; // 우리가 만든 axios 클라이언트
import type { Game } from "../types";
import { QRCodeSVG } from "qrcode.react"; // QR 코드 라이브러리 import
import Modal from "../components/Modal"; // 모달 컴포넌트 재사용

// 임시 User 타입
interface User {
  _id: string;
  name: string;
  uuid: string;
  role: string;
}

function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [newUserName, setNewUserName] = useState(""); // 사용자 생성 폼 state
  const [qrModalUuid, setQrModalUuid] = useState<string | null>(null); // QR 모달 state

  const fetchUsers = async () => {
    const usersRes = await api.get("/api/admin/users");
    setUsers(usersRes.data);
  };

  const fetchGames = async () => {
    const gamesRes = await api.get("/api/games");
    setGames(gamesRes.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchGames();
  }, []);

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newUserName.trim()) return;
    await api.post("/api/admin/users", { name: newUserName });
    setNewUserName("");
    await fetchUsers(); // 목록 새로고침
  };

  const handleResetPassword = async (uuid: string) => {
    if (
      window.confirm(
        "정말 이 사용자의 비밀번호를 초기화하시겠습니까?\n초기화 후에는 QR코드로 다시 접속하여 비밀번호를 설정해야 합니다."
      )
    ) {
      await api.patch(`/api/admin/users/${uuid}/reset-password`);
      alert("비밀번호가 초기화되었습니다.");
    }
  };

  const handleDeleteUser = async (uuid: string) => {
    if (
      window.confirm(
        "정말 이 사용자를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다."
      )
    ) {
      await api.delete(`/api/admin/users/${uuid}`);
      setUsers(users.filter((user) => user.uuid !== uuid)); // UI에서 즉시 제거
    }
  };

  const handleDeleteGame = async (id: string) => {
    if (window.confirm("정말 이 게임을 삭제하시겠습니까?")) {
      await api.delete(`/api/admin/games/${id}`);
      setGames(games.filter((g) => g._id !== id));
    }
  };

  const showQrCode = (uuid: string) => {
    setQrModalUuid(uuid);
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">관리자 대시보드</h1>

      {/* 사용자 관리 섹션 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">사용자 관리</h2>
        {/* --- 사용자 생성 폼 --- */}
        <form onSubmit={handleCreateUser} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="새 사용자 이름"
            className="input input-bordered w-full max-w-xs"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            생성
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>이름</th>
                <th>UUID</th>
                <th>역할</th>
                <th>액션</th> {/* 액션 컬럼 추가 */}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.uuid}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "admin" ? "badge-secondary" : ""
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="flex gap-2">
                    {" "}
                    {/* 버튼들 추가 */}
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => showQrCode(user.uuid)}
                    >
                      QR 보기
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleResetPassword(user.uuid)}
                    >
                      비번 초기화
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDeleteUser(user.uuid)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 게임 관리 섹션 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">게임 관리</h2>
        {/* ... 새 게임 추가 폼 ... */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>게임 이름</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game._id}>
                  <td>{game.name}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDeleteGame(game._id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        isOpen={!!qrModalUuid}
        onClose={() => setQrModalUuid(null)}
        title="사용자 로그인 QR 코드"
      >
        {qrModalUuid && (
          <div className="flex flex-col items-center gap-4">
            <QRCodeSVG
              value={`${window.location.origin}/login?uuid=${qrModalUuid}`}
              size={256}
            />
            <p className="text-sm text-center">
              이 QR코드를 스캔하여 로그인 페이지로 접속할 수 있습니다.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AdminPage;
