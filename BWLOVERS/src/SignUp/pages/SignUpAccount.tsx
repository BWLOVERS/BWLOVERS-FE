import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionButton from '@/common/components/ActionButton';
import Header from '@/common/components/Header';
import ProgressBar from '@/common/components/ProgressBar';
import LabeledInput from '../components/LabeledInput';
import ProfileImg from '../components/ProfileImg';

import { useUserAccountStore } from '@/SignUp/stores/userAccountStore';
import { tokenStorage } from '@/apis/auth/tokenStorage';

export default function SignUpAccount() {
  const navigate = useNavigate();

  const { me, fetchMe, updateMe, isLoadingMe } = useUserAccountStore();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // ✅ 업로드용(나중에 사용)

  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken?.();
    if (!accessToken) return;
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (!me) return;
    setNickname((prev) => (prev ? prev : (me.username ?? '')));
  }, [me]);

  const email = me?.email ?? '';
  const phone = me?.phone ?? '';
  const userProfileUrl = me?.profileImageUrl ?? null;

  const imageUrl = useMemo(() => {
    return previewUrl ?? userProfileUrl ?? null;
  }, [previewUrl, userProfileUrl]);

  const handleProfileChange = (file: File) => {
    setSelectedFile(file);

    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextUrl;
    });
  };

  const isNicknameValid = nickname.trim().length > 0 && nickname.length <= 10;

  const handleNext = async () => {
    if (!isNicknameValid || !me) return;

    // ✅ 1) 사진 업로드 API가 아직 없으므로, 지금은 기존 URL 유지
    // 나중에 upload API 붙이면 아래 profileImageUrl을 업로드 결과로 교체하면 됨.
    let profileImageUrlToSend: string | null = me.profileImageUrl ?? null;

    // 예: 나중에 업로드 API 붙였을 때
    // if (selectedFile) {
    //   const uploadedUrl = await imageApi.uploadProfile(selectedFile);
    //   profileImageUrlToSend = uploadedUrl;
    // }

    // ✅ 2) 둘 중 하나만 바뀌어도 둘 다 보내기(백엔드 정책에 맞춤)
    await updateMe({
      username: nickname.trim(),
      profileImageUrl: profileImageUrlToSend
    });

    navigate('/signup/info');
  };

  return (
    <>
      <Header title="가입 정보 확인" showBack={false} />

      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center">
          <ProfileImg imageUrl={imageUrl} onChange={handleProfileChange} />

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
          disabled={!isNicknameValid || isLoadingMe}
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
