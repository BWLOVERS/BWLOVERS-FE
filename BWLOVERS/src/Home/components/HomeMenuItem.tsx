type HomeMenuItemProps = { label: string };

export default function HomeMenuItem({ label }: HomeMenuItemProps) {
  return (
    <div className="rounded-lg p-2.5 text-body-md text-gray-60 hover:bg-gray-20">
      {label}
    </div>
  );
}
