type TabItem<T extends string> = { key: T; label: string };

type TabSelectorProps<T extends string> = {
  activeTab: T;
  onChange: (tab: T) => void;
  tabs: readonly TabItem<T>[]; // ✅ 화면마다 탭 이름 바꿀 수 있게
};

export default function TabSelector<T extends string>({
  activeTab,
  onChange,
  tabs
}: TabSelectorProps<T>) {
  return (
    <div className="inline-grid w-full grid-cols-3 bg-white px-8.75">
      {tabs.map((item) => {
        const isActive = activeTab === item.key;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`row-start-1 row-end-2 inline-flex items-center justify-center gap-2.5 justify-self-center px-1.75 py-2.75 ${
              isActive
                ? 'border-b-2 border-black'
                : 'border-b-2 border-transparent'
            } `}
          >
            <span
              className={`font-pretendard text-center text-[1rem] leading-150 font-bold ${
                isActive ? 'text-black' : 'text-gray-40'
              } `}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
