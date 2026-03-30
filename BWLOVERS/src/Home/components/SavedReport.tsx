import { useNavigate } from 'react-router-dom';

type Props = {
  simulationId: number;
  createdAt: string; // ISO string
};

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yyyy}.${mm}.${dd}`;
}

export default function SavedReport({ simulationId, createdAt }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/myreport/${simulationId}`)}
      className="flex h-26.25 w-26.5 shrink-0 cursor-pointer flex-col gap-[1.19rem] rounded-20 bg-pink-40 p-2.5 hover:bg-pink-60"
    >
      <div className="flex h-full flex-col justify-between">
        <div className="mt-0.5 text-body-sm text-black">
          {`시뮬레이션(${simulationId})`}
        </div>

        <div className="text-caption-sm text-black">
          {formatDate(createdAt)}
        </div>
      </div>
    </div>
  );
}
