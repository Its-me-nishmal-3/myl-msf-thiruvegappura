import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';

import Receipt from './components/Receipt';
import History from './components/History';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import InstallPWA from './components/InstallPWA';
import PosterGenerator from './components/PosterGenerator';
import NameWithPoster from './components/NameWithPoster';

// Policy Pages
import ShippingPolicy from './components/policies/ShippingPolicy';
import ReturnPolicy from './components/policies/ReturnPolicy';
import TermsAndConditions from './components/policies/TermsAndConditions';
import PrivacyPolicy from './components/policies/PrivacyPolicy';
import ContactUs from './components/policies/ContactUs';
import CancellationRefund from './components/policies/CancellationRefund';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-500/30 flex flex-col">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/receipt" element={<Receipt />} />
            <Route path="/history" element={<History />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/install-app" element={<InstallPWA />} />
            <Route path="/gen-poster" element={<PosterGenerator />} />
            <Route path="/namewithposter" element={<NameWithPoster />} />

            {/* Policy Routes */}
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/cancellation-refund" element={<CancellationRefund />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
