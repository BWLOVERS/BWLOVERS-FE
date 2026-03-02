import LabeledInput from '@/SignUp/components/LabeledInput';
import ProfileImg from '@/SignUp/components/ProfileImg';
import { useEffect, useMemo, useState } from 'react';
import { useUserAccountStore } from '@/SignUp/stores/userAccountStore';
import SingleBtnModal from '@/common/components/SingleBtnModal';
import ActionButtonMini from '@/common/components/ActionButtonMini';

export default function EditAccount() {
  const {
    me,
    fetchMe,
    updateName,
    updateProfileImage,
    deleteProfileImage,
    isLoadingMe,
    isUploadingProfile
  } = useUserAccountStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
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
  const userProfileUrl = me?.profileImage ?? null;

  const imageUrl = useMemo(
    () => previewUrl ?? userProfileUrl ?? null,
    [previewUrl, userProfileUrl]
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
      console.error('profile upload failed:', e);
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
    if (!me || !isNicknameValid) return;

    try {
      await updateName({ username: trimmedNickname });
      setIsModalOpen(true);
    } catch (e) {
      console.error('update name failed:', e);
      window.alert('닉네임 수정에 실패했습니다.');
    }
  };

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center">
        <ProfileImg
          imageUrl={imageUrl}
          onChange={handleProfileChange}
          onDelete={handleDeleteProfile}
        />

        <div className="mb-15 flex w-73.25 flex-col items-start gap-4.5">
          <div className="flex flex-row items-end gap-2">
            <LabeledInput
              label="닉네임"
              value={nickname}
              onChange={setNickname}
              maxLength={10}
            />
            <div className="mb-1.5">
              <ActionButtonMini
                label="수정"
                variant="primary"
                disabled={!isNicknameValid || isLoadingMe || isUploadingProfile}
                onClick={handleNameEdit}
              />
            </div>
          </div>
          <LabeledInput label="e-mail" value={email} disabled />
          <LabeledInput label="전화번호" value={phone} disabled />
        </div>
      </div>

      <div className="flex w-full justify-end px-11.5 pb-9.75"></div>

      <SingleBtnModal
        open={isModalOpen}
        title="수정 완료"
        content="회원 정보가 수정되었습니다."
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
      />
    </>
  );
}
