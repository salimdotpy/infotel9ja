// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { useEffect } from 'react';
// import { LoadingComponent, NotFound } from "./ui/sections";
// import { ToastContainer } from "react-toastify";
// import useTheme from "./store/themeStore";
// import LoginAdmin from "./pages/auth/AdminLogin";
// import AdminRoute from "./routers/AdminRoute";
// import AdminLogin from "./ui/auth/admin";
// import AdminAuthRoute from "./routers/AdminAuthRoute";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import Module from "./ui/admin/module";
// import Zone from "./ui/admin/zone";

// function App() {
//   const { theme } = useTheme();

//   useEffect(() => {
//     AOS.init({
//       duration: 1000,
//       easing: 'ease-in-out',
//       once: true,
//       mirror: false
//     });
//   }, []);

//   useEffect(() => {
//     if (theme === 'dark') {
//       document.body.classList.add('dark');
//     } else {
//       document.body.classList.remove('dark');
//     }
//   }, [theme]);

//   return (
//     <BrowserRouter>
//       <LoadingComponent />
//       <Routes>
//         <Route path="/" element={<LoginAdmin />} />
//         <Route path="/login/" element={<AdminAuthRoute />}>
//           <Route path=":role" element={<AdminLogin />} />
//         </Route>
//         <Route path="/admin" element={<AdminRoute />}>
//           <Route index element={<AdminDashboard />} />
//           <Route path="module" element={<Module />} />
//           <Route path="zone" element={<Zone />} />
//         </Route>
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//       <Routes>
//       </Routes>

//       <ToastContainer theme={theme} />
//     </BrowserRouter>
//   )
// }

// export default App
