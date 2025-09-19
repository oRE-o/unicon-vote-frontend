import { useState, useEffect } from 'react';
import SplitText from "../components/reactbits/SplitText";
import ErrorMessage from "../components/ErrorMessage"; // 1. ErrorMessage 컴포넌트 import

function LoginPage() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const idFromQr = 'scanned_user_id'; // 임시 ID
    setUserId(idFromQr);
    setUserName('scanned_user_name'); // 임시 이름
  }, []);

  const handleLogin = () => {
    if (password !== "game") {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    console.log(`로그인 시도:`, { id: userId, password: password });
    alert(`${userId}님, 환영합니다!`);
  };
    const handleAnimationComplete = () => {
        console.log('Animation complete');
    };

  return (
    <>
    
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center gap-3 p-4">
        <SplitText
            text="Vote@UNICON!"
            className="text-5xl font-bold text-center p-1"
            delay={50}
            duration={2}
            ease="elastic.out"
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
        />
        <SplitText
            text="당신의 갓겜, UNICON의 갓겜."
            className="text-xl font-semibold text-center "
            delay={400}
            duration={2}
            ease="elastic.out"
            splitType="words"
            from={{ opacity: 0, y: 10 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
        />

      {/* card 대신 fieldset 구조 사용 */}
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        {/* h2 대신 legend 태그로 제목 표시 */}
        <legend className="fieldset-legend px-2 text-xl font-bold">로그인</legend>
        
        <label className="label">User ID</label>
        <input
            type="text"
            value={userId}
            className="input input-bordered input-disabled"
            disabled
        />
        <label className="label">이름</label>
        <input
            type="text"
            value={userName}
            className="input input-bordered input-disabled"
            disabled
        />
        <label className="label">비밀번호</label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
        {error && <ErrorMessage message={error} />}

        <button className="btn btn-neutral mt-4" onClick={handleLogin}>
              로그인
        </button>
      </fieldset>
    </div>
    </>
  );
}

export default LoginPage;