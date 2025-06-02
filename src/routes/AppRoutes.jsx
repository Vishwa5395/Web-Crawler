// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
// import Home from "../pages/Home";
// import About from "../pages/About";
// import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
