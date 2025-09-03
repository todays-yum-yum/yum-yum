import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

export default function SimpleLayout() {
  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <Outlet />
    </>
  );
}
