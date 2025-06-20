import { Link, Navigate, Outlet, useParams } from "react-router-dom";
import React from "react";
import { Card } from "@material-tailwind/react";

const AdminAuthRoute = () => {
  const { role } = useParams();

  if (role !== 'admin' ) {
    return <Navigate to="/" replace />
  }
  return (
    <main role='main'>
      <section id='' className='flex flex-wrap w-full'>
        <div className='hidden w-0 lg:flex grow justify-center items-center bg-no-repeat' style={{ backgroundImage: `url('/images/img3.jpeg')`, backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'top center' }}>
          <div className='md:ml-20 lg:ml-32 ml-44'>
            <Link to={'/'}>
              <img src={'/images/logoIcon/logo.png'} className="mb-5 size-10 lg:size-14 p-1 bg-white rounded shadow" alt={`Company Logo`} />
            </Link>
            <h2 className='text-[40px] text-white font-thin 2xl:text-4xl font-sans  [text-shadow:_0_0_8px_rgb(var(--color-primary))_,_0_10px_8px_rgb(var(--color-primary))_,_10px_0_8px_rgb(var(--color-primary))]'>
            Login now, manage 
            all the services... 
            </h2>
          </div>
        </div>
        <div className='w-full bg-header lg:w-[660px] py-5 px-6 min-h-screen flex flex-wrap justify-center items-center'>
          <Card color="transparent" shadow={false} className='w-full max-w-[500px] text-fore'>
            <Link to={'/'}>
              <img src={'/images/logoIcon/logo.png'} className="mb-20 size-14 lg:hidden p-1 bg-white rounded shadow" alt={`Company Logo`} />
            </Link>
            <Outlet />
          </Card>
        </div>
      </section>
    </main>
  );
};

export default AdminAuthRoute;