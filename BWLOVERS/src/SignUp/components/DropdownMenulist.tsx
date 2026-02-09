type DropdownMenuListProps = {
  options: string[];
  selectedValue?: string;
  onSelect: (value: string) => void;
};

export default function DropdownMenuList({
  options,
  selectedValue,
  onSelect
}: DropdownMenuListProps) {
  return (
    <div className="flex w-full flex-col items-start overflow-hidden rounded-[0.9375rem] bg-white shadow-[0_4px_10px_0_rgba(0,0,0,0.10)]">
      {options.map((opt) => {
        const isSelected = opt === selectedValue;

        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={`flex w-full items-center gap-2.5 self-stretch border-b border-gray-20 px-6 py-3.75 text-body-sm text-black ${
              isSelected ? 'bg-gray-10' : 'bg-white'
            } last:border-b-0 hover:bg-gray-10`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
