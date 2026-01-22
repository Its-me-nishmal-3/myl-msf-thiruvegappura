


const CancellationRefund = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-blue-400">Cancellation & Refund Policy</h1>
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-800 text-gray-300 space-y-4">

                <h2 className="text-xl font-semibold text-white mt-4">Cancellation Policy</h2>
                <p>
                    You can cancel your order before it has been shipped. To cancel your order, please contact our support team immediately with your order details.
                </p>

                <h2 className="text-xl font-semibold text-white mt-4">Refund Policy</h2>
                <p>
                    Once your return is received and inspected, we will notify you of the approval or rejection of your refund.
                </p>
                <p>
                    If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.
                </p>
            </div>
        </div>
    );
};

export default CancellationRefund;
