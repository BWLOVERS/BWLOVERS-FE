import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/common/MainLayout.tsx';
import Login from '@/Login/pages/Login.tsx';
const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [{ path: '/', element: <Login /> }]
  }
]);

export default router;
