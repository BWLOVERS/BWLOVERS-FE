import ActionButton from '@/common/components/ActionButton';
import Header from '@/common/components/Header';
import ProgressBar from '@/common/components/ProgressBar';
import { useNavigate } from 'react-router-dom';

export default function SignUpHealth() {
  const navigate = useNavigate();

  const handleDone = () => {
    alert('회원 가입이 완료되었습니다!');
  };

  const handleBack = () => {
    navigate('/signup/info');
  };

  return (
    <>
      <Header title="산모 건강 상태" />

      <main className="mb-1.5 flex flex-1">SignUpHealth</main>

      <div className="flex w-full justify-between px-11.5 pb-9.75">
        <ActionButton
          label="<- 이전"
          variant="secondary"
          onClick={handleBack}
        />
        <ActionButton label="완료" variant="primary" onClick={handleDone} />
      </div>
      <div className="relative">
        <ProgressBar currentStep={3} />
      </div>
    </>
  );
}
