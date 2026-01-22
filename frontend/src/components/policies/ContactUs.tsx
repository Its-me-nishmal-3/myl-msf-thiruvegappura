


const ContactUs = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-blue-400">Contact Us</h1>
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-800 text-gray-300 space-y-4">
                <p>
                    We are here to help you. If you have any queries regarding your order, payment, or our products, please reach out to us.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-400 mb-2">Address</h3>
                        <p>MYL-msf thiruvegappura panchayath Committee</p>
                        <p>Thiruvegappura, Palakkad District</p>
                        <p>Kerala, India</p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-400 mb-2">Contact Details</h3>
                        <p>Email: dev.nishmal@gmail.com</p>
                        <p>Phone: +91 9544472307</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
