import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function Layout() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/services"        element={<Services />} />
          <Route path="/booking"         element={<Booking />} />
          <Route path="/gallery"         element={<Gallery />} />
          <Route path="/contact"         element={<Contact />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/admin/login"     element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  );
}
