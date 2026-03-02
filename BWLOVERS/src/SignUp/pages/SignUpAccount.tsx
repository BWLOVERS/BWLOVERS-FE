import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionButton from '@/common/components/ActionButton';
import Header from '@/common/components/Header';
import ProgressBar from '@/common/components/ProgressBar';
import LabeledInput from '../components/LabeledInput';
import ProfileImg from '../components/ProfileImg';
import { useUserAccountStore } from '@/SignUp/stores/userAccountStore';
import { tokenStorage } from '@/apis/auth/tokenStorage';
import ActionButtonMini from '@/common/components/ActionButtonMini';

export default function SignUpAccount() {
  const navigate = useNavigate();

  const {
    me,
    fetchMe,
    updateName,
    updateProfileImage,
    deleteProfileImage,
    isLoadingMe,
    isUploadingProfile
  } = useUserAccountStore();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) return;
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (!me) return;
    setNickname((prev) => (prev ? prev : (me.username ?? '')));
  }, [me]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const email = me?.email ?? '';
  const phone = me?.phone ?? '';
  const userProfile = me?.profileImage ?? null;

  const imageUrl = useMemo(
    () => previewUrl ?? userProfile ?? null,
    [previewUrl, userProfile]
  );

  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length > 0 && trimmedNickname.length <= 10;

  const handleProfileChange = async (file: File) => {
    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextUrl;
    });

    try {
      await updateProfileImage(file);
      setPreviewUrl(null);
    } catch (e) {
      console.error(e);
      window.alert('프로필 이미지 업로드에 실패했습니다.');
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await deleteProfileImage();
      setPreviewUrl(null);
    } catch (e) {
      console.error(e);
      window.alert('프로필 이미지 삭제에 실패했습니다.');
    }
  };

  const handleNameEdit = async () => {
    if (!isNicknameValid) return;

    await updateName({ username: trimmedNickname });
  };

  const handleNext = () => {
    if (!isNicknameValid || !me) return;

    navigate('/signup/info');
  };

  return (
    <>
      <Header title="가입 정보 확인" showBack={false} />

      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center">
          <ProfileImg
            imageUrl={imageUrl}
            onChange={handleProfileChange}
            onDelete={handleDeleteProfile}
          />

          <div className="flex w-73.25 flex-col items-start gap-4.5">
            <div className="flex flex-row items-end gap-2">
              <LabeledInput
                label="닉네임"
                value={nickname}
                onChange={setNickname}
                maxLength={10}
              />
              <div className="mb-1.5">
                <ActionButtonMini
                  label="변경"
                  variant="primary"
                  disabled={
                    !isNicknameValid || isLoadingMe || isUploadingProfile
                  }
                  onClick={handleNameEdit}
                />
              </div>
            </div>
            <LabeledInput label="e-mail" value={email} disabled />
            <LabeledInput label="전화번호" value={phone} disabled />
          </div>
        </div>
      </main>

      <div className="flex w-full justify-end px-11.5 pb-9.75">
        <ActionButton
          label="다음 ->"
          variant="primary"
          disabled={!isNicknameValid || isLoadingMe || isUploadingProfile}
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
