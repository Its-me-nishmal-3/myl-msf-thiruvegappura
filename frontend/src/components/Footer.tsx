

import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-blue-100 text-gray-700 py-8 mt-12 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

                    <div>
                        <h3 className="text-gray-900 text-lg font-bold mb-4">MYL-msf thiruvegappura panchayath</h3>
                        <p className="text-sm mb-2">
                            Empowering the community with quality products and services.
                        </p>
                        <div className="text-sm text-gray-600">
                            <p>Email: dev.nishmal@gmail.com</p>
                            <p>Phone: +91 9544472307</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-gray-900 text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
                            <li><Link to="/contact-us" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-gray-900 text-lg font-bold mb-4">Policies</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms-and-conditions" className="hover:text-blue-600 transition-colors">Terms & Conditions</Link></li>
                            <li><Link to="/shipping-policy" className="hover:text-blue-600 transition-colors">Shipping Policy</Link></li>
                            <li><Link to="/return-policy" className="hover:text-blue-600 transition-colors">Return Policy</Link></li>
                            <li><Link to="/cancellation-refund" className="hover:text-blue-600 transition-colors">Cancellation & Refund</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-blue-100 mt-8 pt-8 text-center text-xs">
                    <p>&copy; {new Date().getFullYear()} MYL-msf thiruvegappura panchayath. All rights reserved.</p>
                </div>
            </div>
        </footer >
    );
};

export default Footer;
