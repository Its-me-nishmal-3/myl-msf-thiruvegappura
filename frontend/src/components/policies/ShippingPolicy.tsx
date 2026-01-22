


const ShippingPolicy = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-blue-400">Shipping Policy</h1>
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-800 text-gray-300 space-y-4">
                <p>
                    At MYL-msf thiruvegappura panchayath, we are committed to delivering your orders promptly and efficiently.
                </p>

                <h2 className="text-xl font-semibold text-white mt-4">Shipping Information Collection</h2>
                <p>
                    For your convenience, shipping details are collected directly through your registered mobile number. Please ensure your contact information is accurate to avoid any delays.
                </p>

                <h2 className="text-xl font-semibold text-white mt-4">Delivery Timeline</h2>
                <p>
                    We strive to ship all orders as quickly as possible. Our standard shipping policy ensures that your items are processed and shipped within <strong>7 days</strong> of order confirmation.
                </p>

                <h2 className="text-xl font-semibold text-white mt-4">Contact Us</h2>
                <p>
                    If you have any questions about your order's status, please feel free to contact our support team.
                </p>
            </div>
        </div>
    );
};

export default ShippingPolicy;
