import LabeledInput from '@/SignUp/components/LabeledInput';
import ProfileImg from '@/SignUp/components/ProfileImg';
import ActionButton from '@/common/components/ActionButton';
import { useEffect, useMemo, useState } from 'react';
import { useUserAccountStore } from '@/SignUp/stores/userAccountStore';
import SingleBtnModal from '@/common/components/SingleBtnModal';

export default function EditAccount() {
  const { me, fetchMe, updateMe } = useUserAccountStore();
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

  const email = me?.email ?? '';
  const phone = me?.phone ?? '';
  const userProfileUrl = me?.profileImageUrl ?? null;

  const imageUrl = useMemo(() => {
    return previewUrl ?? userProfileUrl ?? null;
  }, [previewUrl, userProfileUrl]);

  const handleProfileChange = (file: File) => {
    const nextUrl = URL.createObjectURL(file);

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextUrl;
    });

    //나중에 업로드 api 연결
    // uploadProfileImage(file);
  };

  const handleEdit = async () => {
    if (!me || !isNicknameValid) return;

    const profileImageUrlToSend = me.profileImageUrl ?? null;

    await updateMe({
      username: nickname.trim(),
      profileImageUrl: profileImageUrlToSend
    });

    setIsModalOpen(true);
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
          onClick={handleEdit}
        />
      </div>

      <SingleBtnModal
        open={isModalOpen}
        title="수정 완료"
        content={`회원 정보가 수정되었습니다.`}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
