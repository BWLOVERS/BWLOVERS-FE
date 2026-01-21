import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/common/MainLayout.tsx';
import Login from '@/Login/pages/Login.tsx';
import SignUpAccount from './SignUpAccount/pages/SignUpAccount';
import SignUpBasicInfo from './SignUpBasicInfo/pages/SignUpBasicInfo';
import SignUpHealth from './SignUpHealth/pages/SignUpHealth';
const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Login /> },
      {
        path: '/signup/account',
        element: <SignUpAccount />
      },
      { path: '/signup/info', element: <SignUpBasicInfo /> },
      { path: 'signup/health', element: <SignUpHealth /> }
    ]
  }
]);

export default router;
