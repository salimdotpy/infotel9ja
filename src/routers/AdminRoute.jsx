import { Navigate, Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AdminSideBar, { AdminSideBarOverlay } from "@/ui/admin/AdminSideBar";
import AdminNavigation, { AdminFooter } from "@/ui/admin/AdminNavigation";
import useAuth from "@/store/authStore";
import { LoadingComponent } from "@/ui/sections";
import { toast } from "react-toastify";

const AdminRoute = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, token, loadUser } = useAuth();
  const isAuth = !!token && !!user;
  const role = user?.role?.name || '';
  const allowed = ['admin', 'admin-employee']

  useEffect(() => {
    const handleUser = async () => {
      try {
        await loadUser();
      } catch (error) {
        toast.error(error.response.data.msg)
      } finally {
        setLoading(false);
      }
    }

    handleUser();

    const handResize = () => {
      if (window.innerWidth >= 960) {
        setOpen(false);
      }
    }
    window.addEventListener("resize", handResize);
    return () => window.removeEventListener("resize", handResize);
  }, []);

  if (loading) return <LoadingComponent />;

  if (!isAuth || !allowed.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-screen">
      <aside className="h-screen z-[500] hidden xl:block w-[260px] shadow-xl fixed top-0 left-0">
        <AdminSideBar />
      </aside>
      <header className="fixed z-[500] top-0 h-[60px] shadow-xl bg-header w-full xl:w-[calc(100%-260px)] xl:ml-[260px]">
        <AdminNavigation open={open} onClose={setOpen} />
      </header>
      <main className="w-full !min-h-full xl:w-[calc(100%-260px)] xl:ml-[260px] p-6 pt-20 bg-back">
        <Outlet />
        <AdminFooter />
      </main>
      <AdminSideBarOverlay open={open} onClose={setOpen} />
    </div>
  );
};

export default AdminRoute;