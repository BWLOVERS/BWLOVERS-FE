type ActionButtonVariant = 'primary' | 'secondary';

type ActionButtonFreesizeProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ActionButtonVariant;
  width?: string;
};

export default function ActionButtonFreesize({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
  width
}: ActionButtonFreesizeProps) {
  const baseClassName = `rounded-[6.25rem] flex h-10 ${width} items-center justify-center gap-2.5 px-[0.4375rem] text-body-sm text-white transition-colors`;

  const variantClassName =
    variant === 'primary'
      ? ` ${disabled ? 'bg-gray-40' : 'bg-pink-100 hover:bg-[#CA1D46]'}`
      : `${disabled ? 'bg-gray-40' : 'bg-pink-60 hover:bg-pink-80'}`;

  return (
    <button
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={`${baseClassName} ${variantClassName}`}
    >
      {label}
    </button>
  );
}
