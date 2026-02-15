import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/common/MainLayout.tsx';
import Login from '@/Login/pages/Login.tsx';
import SignUpAccount from './SignUp/pages/SignUpAccount';
import SignUpBasicInfo from './SignUp/pages/SignUpBasicInfo';
import SignUpHealth from './SignUp/pages/SignUpHealth';
import InsuranceMain from './Insurance/pages/InsuranceMain';
import Home from './Home/pages/Home';
import JobSelect from './SignUp/pages/JobSelect';
import AboutUs from './AboutUs/pages/AboutUs';
import RecommendResult from './Insurance/pages/RecommendResult';
import RecommendResultDetail from './Insurance/pages/RecommendResultDetail';
import EditProfile from './Home/pages/EditProfile';
import ExplainUpload from './Insurance/pages/ExplainUpload';
import MyInsuranceList from './Home/pages/MyInsuranceList';
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
      { path: '/jobs', element: <JobSelect /> },
      { path: '/signup/health', element: <SignUpHealth /> },
      { path: '/home', element: <Home /> },
      { path: '/MyInsurance', element: <MyInsuranceList /> },
      { path: '/profile/edit', element: <EditProfile /> },
      { path: '/insurance', element: <InsuranceMain /> },
      { path: '/insurance/recommend/result', element: <RecommendResult /> },
      {
        path: '/insurance/recommend/result/detail',
        element: <RecommendResultDetail />
      },
      { path: '/insurance/explain/upload', element: <ExplainUpload /> },

      { path: '/about', element: <AboutUs /> }
    ]
  }
]);

export default router;
