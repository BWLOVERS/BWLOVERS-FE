import LabeledInput from '@/SignUp/components/LabeledInput';
import ProfileImg from '@/SignUp/components/ProfileImg';
import TestProfile from '@/assets/common/profileTest.png';
import ActionButton from '@/common/components/ActionButton';
import { useState } from 'react';

export default function EditAccount() {
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

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center">
        <ProfileImg
          imageUrl={previewUrl ?? userProfileUrl}
          onChange={handleProfileChange}
        />

        <div className="mb-15 flex w-73.25 flex-col items-start gap-4.5">
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

      <div className="flex w-full justify-end px-11.5 pb-9.75">
        <ActionButton
          label="수정"
          variant="primary"
          disabled={!isNicknameValid}
        />
      </div>
    </>
  );
}
