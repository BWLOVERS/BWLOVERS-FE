import ArrowUpIcon from '@/assets/SignUp/icon_arrow_up.svg?react';
import ArrowDownIcon from '@/assets/SignUp/icon_arrow_down.svg?react';

type DropdownProps = {
  placeholder: string;
  value?: string;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
};

export default function Dropdown({
  placeholder,
  value,
  isOpen,
  onToggle
}: DropdownProps) {
  const handleToggle = () => {
    onToggle(!isOpen);
  };

  const borderClassName = isOpen ? 'border-pink-60' : 'border-gray-20';
  const textClassName = value ? 'text-black' : 'text-gray-80';
  const Icon = isOpen ? ArrowUpIcon : ArrowDownIcon;

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`flex h-11.25 w-full items-center justify-between self-stretch rounded-[0.9375rem] border bg-white py-2.25 pr-2.5 pl-4.5 ${borderClassName}`}
    >
      <span className={`text-body-sm ${textClassName}`}>
        {value ?? placeholder}
      </span>

      <div className="aspect-square h-6 w-6">
        <Icon />
      </div>
    </button>
  );
}
