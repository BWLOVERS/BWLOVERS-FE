type HomeMenuItemProps = { label: string; onClick?: () => void };

export default function HomeMenuItem({ label, onClick }: HomeMenuItemProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-lg p-2.5 text-body-md text-gray-60 hover:bg-gray-20"
    >
      {label}
    </div>
  );
}
