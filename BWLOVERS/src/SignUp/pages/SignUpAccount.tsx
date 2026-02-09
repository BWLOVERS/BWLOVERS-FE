import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionButton from '@/common/components/ActionButton';
import Header from '@/common/components/Header';
import ProgressBar from '@/common/components/ProgressBar';
import LabeledInput from '../components/LabeledInput';
import ProfileImg from '../components/ProfileImg';
import TestProfile from '@/assets/common/profileTest.png';

export default function SignUpAccount() {
  const navigate = useNavigate();

  const userProfileUrl: string | null = TestProfile;

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [nickname, setNickname] = useState('봉원이');
  const [email] = useState('abc1234@naver.com');
  const [phone] = useState('010-1234-5678');

  const handleProfileChange = (file: File) => {
    const nextUrl = URL.createObjectURL(file);

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextUrl;
    });

    //나중에 업로드 api 연결
    // uploadProfileImage(file);
  };

  const isNicknameValid = nickname.trim().length > 0 && nickname.length <= 10;

  const handleNext = () => {
    if (!isNicknameValid) return;
    navigate('/signup/info');
  };

  return (
    <>
      <Header title="가입 정보 확인" showBack={false} />

      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center">
          <ProfileImg
            imageUrl={previewUrl ?? userProfileUrl}
            onChange={handleProfileChange}
          />

          {/* 입력 폼 */}
          <div className="flex w-73.25 flex-col items-start gap-4.5">
            <LabeledInput
              label="닉네임"
              value={nickname}
              onChange={setNickname}
              maxLength={10}
            />
            <LabeledInput label="e-mail" value={email} disabled />
            <LabeledInput label="전화번호" value={phone} disabled />
          </div>
        </div>
      </main>

      <div className="flex w-full justify-end px-11.5 pb-9.75">
        <ActionButton
          label="다음 ->"
          variant="primary"
          disabled={!isNicknameValid}
          onClick={handleNext}
        />
      </div>
      <div className="sticky bottom-0 z-50">
        <div className="relative">
          <ProgressBar currentStep={1} />
        </div>
      </div>
    </>
  );
}
