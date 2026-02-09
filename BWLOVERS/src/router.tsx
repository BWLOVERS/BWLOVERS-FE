import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/common/MainLayout.tsx';
import Login from '@/Login/pages/Login.tsx';
import SignUpAccount from './SignUp/pages/SignUpAccount';
import SignUpBasicInfo from './SignUp/pages/SignUpBasicInfo';
import SignUpHealth from './SignUp/pages/SignUpHealth';
import InsuranceMain from './Insurance/pages/InsuranceMain';
import Home from './Home/pages/Home';
import JobSelect from './SignUp/pages/JobSelect';
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
      { path: '/signup/info/job', element: <JobSelect /> },
      { path: '/signup/health', element: <SignUpHealth /> },
      { path: '/home', element: <Home /> },
      { path: '/insurance', element: <InsuranceMain /> }
    ]
  }
]);

export default router;
