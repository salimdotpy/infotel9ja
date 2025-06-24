import { BrowserRouter, Routes, Route } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
import ReportContestant from "./pages/ReportContestant";
import { UseScrollTop, useSettings } from "./hooks";
import Compition from "./pages/Compition";
import AdminAuthRoute from "./routers/AuthRoute";
import AdminLogin from "./ui/admin/login";
import Register from "./pages/Register";
import AdminRoute from "./routers/AdminRoute";
import Dashboard from "./pages/admin/Dashboard";
import SystemSettings from "./pages/admin/SystemSettings";
import BoosterSettings from "./pages/admin/BoosterSettings";
import SponsorSettings from "./pages/admin/SponsorSettings";
import LeaderboardSettings from "./pages/admin/LeaderboardSettings";
import BonusSettings from "./pages/admin/BonusSettings";
import AddContest from "./pages/admin/AddContest";
import { hexToRgb } from "./utils";
import ContestList from "./pages/admin/ContestList";
import EditContest from "./pages/admin/EditContest";
import Vote from "./pages/Vote";
import VerifyPayment from "./pages/VerifyPayment";
import EmailSettings from "./pages/admin/EmailSettings";
import ViewContest from "./pages/admin/ViewContest";

function App() {
  const { theme } = useTheme();
  const { settings, isLoading, error } = useSettings();

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

  if (!isLoading && settings) {
    document.body.style.setProperty('--color-primary', hexToRgb(settings?.siteColor));
    // Check if an existing manifest tag is present, remove it
    let iconTag = document.querySelector("link[rel='icon']"); //rel="icon"
    if (iconTag) {
      document.head.removeChild(iconTag);
    }

    // Create a new manifest <link> tag
    iconTag = document.createElement("link");
    iconTag.rel = "icon";
    iconTag.href = settings?.favicon;

    // Append to <head>
    document.head.appendChild(iconTag);
  }

  return (
    <BrowserRouter>
      <UseScrollTop />
      <LoadingComponent />
      <Routes>
        <Route path="/" element={<PublicRoute />}>
          <Route index element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contests" element={<Compitions />} />
          <Route path="/contest/:id" element={<Compition />} />
          <Route path="/vote/:id" element={<Vote />} />
          <Route path="/verify/:ref/:id" element={<VerifyPayment />} />
          <Route path="/past-winners" element={<Winners />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/report-contestant" element={<ReportContestant />} />
          <Route path="/register/:id/:referral?" element={<Register />} />
        </Route>
        <Route path="/" element={<AdminAuthRoute />}>
          <Route path="/login/:role" element={<AdminLogin />} />
        </Route>
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="contest/add" element={<AddContest />} />
          <Route path="contest/list" element={<ContestList />} />
          <Route path="contest/edit/:id" element={<EditContest />} />
          <Route path="contest/view/:id" element={<ViewContest />} />
          <Route path="setting/system" element={<SystemSettings />} />
          <Route path="setting/booster" element={<BoosterSettings />} />
          <Route path="setting/sponsor" element={<SponsorSettings />} />
          <Route path="setting/leaderboard" element={<LeaderboardSettings />} />
          <Route path="setting/bonus" element={<BonusSettings />} />
          <Route path="setting/email" element={<EmailSettings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer theme={theme} />
    </BrowserRouter>
  )
}

export default App
