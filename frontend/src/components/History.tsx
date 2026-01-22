import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentRecord {
    _id?: string;
    name: string;
    ward: string;
    amount: number;
    paymentId: string;
    createdAt: string;
    local?: boolean;
}

const History: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const unitFilter = searchParams.get('unit');

    const [history, setHistory] = useState<PaymentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const fetchHistory = async (pageNum: number, isLoadMore = false) => {
        try {
            if (isLoadMore) setIsFetchingMore(true);

            // Fetch from backend with optional unit filter
            const url = unitFilter
                ? `https://myl-muthuthala.onrender.com/api/payment/history?page=${pageNum}&limit=10&ward=${encodeURIComponent(unitFilter)}`
                : `https://myl-muthuthala.onrender.com/api/payment/history?page=${pageNum}&limit=10`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.payments) {
                setHistory(prev => isLoadMore ? [...prev, ...data.payments] : data.payments);
                setHasMore(data.hasMore);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    useEffect(() => {
        // Reset when filter changes
        setHistory([]);
        setPage(1);
        setHasMore(true);
        fetchHistory(1);
    }, [unitFilter]);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 100 ||
            isFetchingMore ||
            !hasMore
        ) {
            return;
        }
        setPage(prev => {
            const nextPage = prev + 1;
            fetchHistory(nextPage, true);
            return nextPage;
        });
    };

    useEffect(() => {
        // Use page to avoid lint warning about unused variable if necessary, or just ignore. 
        // Actually, let's just log it for debugging or similar to use it.
        // console.log('Current page:', page); 
    }, [page]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, isFetchingMore]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 text-gray-900 p-6 max-w-3xl mx-auto pb-24">
            <header className="flex items-center gap-4 mb-6 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-teal-100 shadow-lg">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-full hover:bg-teal-50 transition-colors text-gray-700"
                >
                    <ChevronLeft />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
                    {unitFilter && (
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-gray-600">Showing payments for:</span>
                            <div className="flex items-center gap-2 bg-teal-100 border border-teal-300 px-3 py-1 rounded-full">
                                <span className="text-sm font-semibold text-teal-700">{unitFilter}</span>
                                <button
                                    onClick={() => setSearchParams({})}
                                    className="hover:bg-teal-200 rounded-full p-0.5 transition-colors text-teal-700"
                                    title="Clear filter"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {loading ? (
                <div className="text-center text-gray-500 mt-20 bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-teal-100">Loading...</div>
            ) : (
                <div className="space-y-4">
                    {history.length === 0 ? (
                        <div className="text-center text-gray-500 mt-20 bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-teal-100">No payments found</div>
                    ) : (
                        <>
                            {history.map((item, i) => (
                                <motion.div
                                    key={item._id || i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 }}
                                    className="bg-white/90 backdrop-blur-xl border border-teal-100 p-4 rounded-2xl flex justify-between items-center shadow-lg hover:shadow-xl transition-all"
                                >
                                    <div>
                                        <h3 className="font-bold text-gray-800">{item.name}</h3>
                                        <p className="text-sm text-gray-600">{item.ward} • {new Date(item.createdAt).toLocaleDateString()}</p>
                                        <p className="text-xs text-gray-500 font-mono mt-1">{item.paymentId}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-teal-600 font-bold text-lg">₹{item.amount}</p>
                                        <button
                                            onClick={() => navigate('/receipt', { state: { payment: item } })}
                                            className="text-xs text-blue-600 hover:text-blue-700 mt-1 flex items-center justify-end gap-1 font-medium"
                                        >
                                            View Receipt
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            {isFetchingMore && (
                                <div className="text-center text-gray-500 py-4 bg-white/60 rounded-xl">Loading more...</div>
                            )}

                            {!hasMore && history.length > 0 && (
                                <div className="text-center text-gray-500 py-4 text-sm bg-white/60 rounded-xl">No more payments to load</div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default History;
