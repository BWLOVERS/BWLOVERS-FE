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
import MyInsuranceDetail from './Home/pages/MyInsuranceDetail';
import NaverCallback from './Login/pages/NaverCallback';
import ExplainResult from './Insurance/pages/ExplainResult';
import ExplainLoading from './Insurance/pages/ExplainLoading';
import CoverageResult from './Insurance/pages/CoverageResult';
import CoverageUpload from './Insurance/pages/CoverageUpload';
import RecommendLoading from './Insurance/pages/RecommendLoading';
import CoverageLoading from './Insurance/pages/CoverageLoading';
const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Login /> },
      { path: '/auth/redirect/naver', element: <NaverCallback /> },
      {
        path: '/signup/account',
        element: <SignUpAccount />
      },
      { path: '/signup/info', element: <SignUpBasicInfo /> },
      { path: '/jobs', element: <JobSelect /> },
      { path: '/signup/health', element: <SignUpHealth /> },
      { path: '/home', element: <Home /> },
      { path: '/myinsurance', element: <MyInsuranceList /> },
      {
        path: '/myinsurance/select',
        element: <MyInsuranceList mode="select" />
      },
      {
        path: '/myinsurance/detail/:insuranceId',
        element: <MyInsuranceDetail />
      },
      { path: '/profile/edit', element: <EditProfile /> },
      { path: '/insurance', element: <InsuranceMain /> },
      { path: '/insurance/recommend/result', element: <RecommendResult /> },
      {
        path: '/insurance/recommend/result/detail',
        element: <RecommendResultDetail />
      },
      { path: '/insurance/recommend/loading', element: <RecommendLoading /> },
      { path: '/insurance/coverage', element: <CoverageUpload /> },
      { path: '/insurance/coverage/loading', element: <CoverageLoading /> },
      { path: '/insurance/coverage/result', element: <CoverageResult /> },
      { path: '/insurance/explain/upload', element: <ExplainUpload /> },
      { path: '/insurance/explain/result', element: <ExplainResult /> },
      { path: '/insurance/explain/loading', element: <ExplainLoading /> },
      { path: '/about', element: <AboutUs /> }
    ]
  }
]);

export default router;
