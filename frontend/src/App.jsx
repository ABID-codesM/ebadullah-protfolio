import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import About from "./components/about/About";
import Projects from "./components/projects/Projects";
import Skills from "./components/skills/Skills";
import Services from "./components/services/Services";
import Contact from "./components/contact/Contact";
import Education from "./components/education/Education";
import Footer from "./components/footer/Footer";

import { AuthProvider } from "./admin/context/AuthContext";

import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLayout from "./admin/layouts/AdminLayout";

import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import AdminSection from "./admin/pages/AdminSection";
import Messages from "./admin/pages/Messages";
import EmailManagement from "./admin/pages/EmailManagement";

import "./admin/styles/admin.css";

function Portfolio() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Services />
        <Education />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Portfolio */}
        <Route path="/" element={<Portfolio />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="analytics" element={<AdminSection />} />
            <Route path="visitors" element={<AdminSection />} />
            <Route path="messages" element={<Messages />} />
            <Route path="emails" element={<EmailManagement />} />
            <Route path="projects" element={<AdminSection />} />
            <Route path="skills" element={<AdminSection />} />
            <Route path="profile" element={<AdminSection />} />
            <Route path="settings" element={<AdminSection />} />
            <Route path="activity" element={<AdminSection />} />
          </Route>
        </Route>

        {/* Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
