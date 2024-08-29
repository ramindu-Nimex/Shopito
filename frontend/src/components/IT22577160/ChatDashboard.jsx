import { Outlet } from 'react-router-dom';
import CustomChatDashSideBar from './../IT22577160/CustomChatDashSideBar';
import DashboardChatRoom from './DashboardChatRoom';

export default function ChatDashboard() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-10">
      <div className="md:w-56">
        <CustomChatDashSideBar />
      </div>
      <div className='flex-4'>
        <Outlet />
      </div>
    </div>
  );
}
