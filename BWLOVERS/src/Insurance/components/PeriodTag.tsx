type PeriodTagProps = {
  label: string;
};
export default function PeriodTag({ label }: PeriodTagProps) {
  return (
    <div className="flex shrink-0 rounded-full bg-white px-2 py-[0.2rem] text-body-sm text-black">
      {label}
    </div>
  );
}
