import { useState, useEffect } from "react";
import axios from "axios";
import dotenv from 'dotenv';
import { useNavigate, useSearchParams } from "react-router-dom";
import SplitText from "../components/reactbits/SplitText"; // SplitText 컴포넌트 경로 확인!
import ErrorMessage from "../components/ErrorMessage"; // 1. ErrorMessage 컴포넌트 import

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000"; // 환경변수에서 API_BASE_URL 읽기

function SignUpPage() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [searchParams] = useSearchParams(); // URL 쿼리 파라미터를 읽기 위한 훅

  useEffect(() => {
    const uuid = searchParams.get("uuid"); // URL에서 'uuid' 파라미터 추출 (예: /signup?uuid=...)

    if (!uuid) {
      setError("잘못된 접근입니다. 유효한 QR코드를 이용해주세요.");
      return;
    }

    const fetchUserStatus = async () => {
      // URL 접속 시 바로 사용자 상태를 서버에서 확인
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/auth/status/${uuid}`
        );
        const { name, isFirstAccess } = response.data;

        if (!isFirstAccess) {
          // 이미 등록된 사용자라면 로그인 페이지로 보냄
          navigate(`/login?uuid=${uuid}`);
          return;
        }

        setUserId(uuid);
        setUserName(name);
      } catch (err) {
        setError("사용자 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchUserStatus();
  }, [searchParams, navigate]);

  const handleSignUp = async () => {
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
    try {
      // 백엔드 API 호출
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        uuid: userId,
        password: password,
      });

      // 성공 시
      alert("회원 설정이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate(`/login?uuid=${userId}`); // 로그인 페이지로 이동
    } catch (err: any) {
      // 실패 시 서버에서 보낸 에러 메시지를 표시
      const errorMessage =
        err.response?.data?.message || "알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center gap-3 p-6">
      {/* 텍스트 애니메이션 */}
      <SplitText
        text={`${userName}님, 환영해요!`}
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
