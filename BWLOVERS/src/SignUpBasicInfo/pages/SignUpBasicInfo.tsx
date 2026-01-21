import { useNavigate } from 'react-router-dom';
import ActionButton from '@/common/components/ActionButton';
import Header from '@/common/components/Header';
import ProgressBar from '@/common/components/ProgressBar';

export default function SignUpBasicInfo() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/signup/health');
  };

  const handleBack = () => {
    navigate('/signup/account');
  };

  return (
    <>
      <Header title="산모 기본 정보" />
      <main className="mb-1.5 flex flex-1">SignUpBasicInfo</main>
      <div className="flex w-full justify-between px-11.5 pb-9.75">
        <ActionButton
          label="<- 이전"
          variant="secondary"
          onClick={handleBack}
        />
        <ActionButton label="다음 ->" variant="primary" onClick={handleNext} />
      </div>
      <div className="relative">
        <ProgressBar currentStep={2} />
      </div>
    </>
  );
}
