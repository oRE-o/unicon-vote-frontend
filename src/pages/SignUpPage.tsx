import { useState } from "react";
import SplitText from "../components/reactbits/SplitText"; // SplitText 컴포넌트 경로 확인!
import ErrorMessage from "../components/ErrorMessage"; // 1. ErrorMessage 컴포넌트 import

function SignUpPage() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = () => {
    setError(null);

    if (password.length < 4) {
      setError("비밀번호는 최소 4자리 이상이어야 합니다.");
      return;
    }
    // 2. 기존 비밀번호 일치 여부 검사
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    console.log("회원가입 정보:", { userId, userName, password });
    alert("회원가입이 완료되었습니다!");
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center gap-3 p-6">
      {/* 텍스트 애니메이션 */}
      <SplitText
        text="Welcome!"
        className="text-5xl font-bold text-center"
        delay={70}
        duration={2}
        ease="elastic.out"
        splitType="chars"
        from={{ opacity: 0, y: 20 }}
        to={{ opacity: 1, y: 0 }}
      />
      <SplitText
        text="새로운 계정을 만들어 시작해보세요."
        className="text-xl font-semibold text-center"
        delay={400}
        duration={2}
        ease="elastic.out"
        splitType="words"
        from={{ opacity: 0, y: 10 }}
        to={{ opacity: 1, y: 0 }}
      />

      {/* 회원가입 폼 */}
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-s border p-4  mt-2">
        <legend className="fieldset-legend px-2 text-xl font-bold">
          회원가입
        </legend>

        <label className="label mt-2">User ID</label>
        <input
          type="text"
          value={userId}
          className="input w-full input-disabled"
          disabled
        />

        <label className="label mt-2">이름</label>
        <input
          type="text"
          placeholder="이름"
          className="input input-bordered w-full"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />

        <label className="label  mt-2">비밀번호</label>
        <input
          type="password"
          placeholder="••••••••"
          className="input input-bordered w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="label mt-2">비밀번호 확인</label>
        <input
          type="password"
          placeholder="••••••••"
          className="input input-bordered w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* 2. 체크박스 JSX 추가 */}
        <div className="form-control mt-4">
          <label className="label cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="label-text">
              유니콘을 즐겁게 즐기고 공정한 투표를 할 것을 약속합니다
            </span>
          </label>
        </div>

        {/* 3. 버튼에 disabled 속성 추가 */}
        {error && <ErrorMessage message={error} />}
        <button
          onClick={handleSignUp}
          className="btn btn-neutral w-full mt-4 mb-4"
          disabled={!agreed}
        >
          회원 설정 완료
        </button>
      </fieldset>
    </div>
  );
}

export default SignUpPage;
