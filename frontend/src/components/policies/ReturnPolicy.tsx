


const ReturnPolicy = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-blue-400">Return Policy</h1>
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-800 text-gray-300 space-y-4">
                <p>
                    We want you to be completely satisfied with your purchase. If you are not happy with your order, we are here to help.
                </p>

                <h2 className="text-xl font-semibold text-white mt-4">Return Window</h2>
                <p>
                    Our return policy lasts for <strong>7 days</strong>. If 7 days have gone by since your purchase, unfortunately, we cannot offer you a refund or exchange.
                </p>

                <h2 className="text-xl font-semibold text-white mt-4">Eligibility for Returns</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>To be eligible for a return, your item must be unused and in the same condition that you received it.</li>
                    <li>It must also be in the original packaging.</li>
                    <li>Perishable goods such as Dates cannot be returned unless they are defective or damaged upon arrival.</li>
                </ul>

                <h2 className="text-xl font-semibold text-white mt-4">Process</h2>
                <p>
                    To initiate a return, please contact us with your order details and reason for return.
                </p>
            </div>
        </div>
    );
};

export default ReturnPolicy;
