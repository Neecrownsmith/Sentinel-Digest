import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import { initEnv } from './utils/env';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import Home from './pages/Home/Home.jsx';
import Article from './pages/Article/Article.jsx';
import Category from './pages/Category/Category.jsx';
import Tag from './pages/Tag/Tag.jsx';
import Trending from './pages/Trending/Trending.jsx';
import Search from './pages/Search/Search.jsx';
import Login from './pages/Auth/Login.jsx';
import Signup from './pages/Auth/Signup.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';
import Account from './pages/Account/Account.jsx';
import TwitterCallback from './pages/Auth/TwitterCallback.jsx';

// Opportunities Pages
import Opportunities from './pages/Opportunities/Opportunities.jsx';
import JobDetail from './pages/JobDetail/JobDetail.jsx';

// Legal Pages
import PrivacyPolicy from './pages/Legal/PrivacyPolicy.jsx';
import TermsOfService from './pages/Legal/TermsOfService.jsx';
import CookiesSettings from './pages/Legal/CookiesSettings.jsx';
import Accessibility from './pages/Legal/Accessibility.jsx';
import DoNotSell from './pages/Legal/DoNotSell.jsx';

// Company Pages
import About from './pages/Company/About.jsx';
import Contact from './pages/Company/Contact.jsx';
import Careers from './pages/Company/Careers.jsx';
import Advertise from './pages/Company/Advertise.jsx';

function App() {
  useEffect(() => {
    // Validate environment variables on app startup
    initEnv();
  }, []);

  return (
    <ErrorBoundary name="App">
      <Router>
        <AuthProvider>
          <div className="app">
            <Header />
            <main className="app-main">
              <ErrorBoundary name="Routes">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/article/:slug" element={<Article />} />
                  <Route path="/category/:slug" element={<Category />} />
                  <Route path="/trending" element={<Trending />} />
                  <Route path="/tag/:slug" element={<Tag />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/auth/twitter/callback" element={<TwitterCallback />} />
                  
                  {/* Opportunities Pages */}
                  <Route path="/opportunities" element={<Opportunities />} />
                  <Route path="/opportunities/:categorySlug" element={<Opportunities />} />
                  <Route path="/opportunity/:slug" element={<JobDetail />} />
                  
                  {/* Legal Pages */}
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/cookies-settings" element={<CookiesSettings />} />
                  <Route path="/accessibility" element={<Accessibility />} />
                  <Route path="/do-not-sell" element={<DoNotSell />} />
                  
                  {/* Company Pages */}
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/advertise" element={<Advertise />} />
                  
                  <Route path="*" element={<Home />} />
                </Routes>
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

