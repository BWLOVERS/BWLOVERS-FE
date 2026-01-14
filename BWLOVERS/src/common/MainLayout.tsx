import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[375px] flex-col border border-gray-20 bg-white">
      <Outlet />
    </main>
  );
}
