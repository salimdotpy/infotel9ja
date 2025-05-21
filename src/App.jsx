import { BrowserRouter, Routes, Route } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { LoadingComponent, NotFound } from "./ui/sections";
import { ToastContainer } from "react-toastify";
import Index from "./pages/Index";
import About from "./pages/About";
import useTheme from "./store/themeStore";
import PublicRoute from "./routers/PublicRoute";
import Compitions from "./pages/Compitions";
import Winners from "./pages/Winners";
import Terms from "./pages/Terms";
import ContactUs from "./pages/ContactUs";

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <LoadingComponent />
      <Routes>
        <Route path="/" element={<PublicRoute />}>
          <Route index element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/competitions" element={<Compitions />} />
          <Route path="/past-winners" element={<Winners />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<ContactUs />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer theme={theme} />
    </BrowserRouter>
  )
}

export default App
