import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Loader2, Share2 } from 'lucide-react';

const Receipt: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (!state?.payment) {
            navigate('/');
        }
    }, [state, navigate]);

    if (!state?.payment) return null;

    const { payment } = state;

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            // Original dimensions (actual image size)
            canvas.width = 1200;
            canvas.height = 1550;

            img.src = '/recipt.jpeg';

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            if (ctx) {
                // Draw background
                ctx.drawImage(img, 0, 0, 1200, 1550);

                // Configure text
                ctx.fillStyle = '#751d08';
                ctx.textBaseline = 'middle';

                // Area 1: Name - coords (201,528,802,583)
                const nameX = 201;
                const nameY = 528 + ((583 - 528) / 2); // Center vertically
                ctx.font = 'bold 30px Arial, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(payment.name.toUpperCase(), nameX, nameY);

                // Area 2: Order/Quantity - coords (774,765,1115,802) + 10px down
                const qtyX = 774; // Left edge
                const qtyY = 765 + ((802 - 765) / 2) + 10;  // Center vertically + 10px down
                ctx.font = 'bold 30px Arial, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(String(payment.quantity || 1), qtyX, qtyY);

                // Area 3: Amount - coords (754,821,1112,855) + 10px down
                const amtX = 754; // Left edge
                const amtY = 821 + ((855 - 821) / 2) + 10;  // Center vertically + 10px down
                ctx.font = 'bold 30px Arial, sans-serif';
                ctx.fillText(`₹${payment.amount || (payment.quantity * 350)}`, amtX, amtY);

                // Watermark
                const now = new Date();
                const watermark = `Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
                ctx.font = 'italic 20px Arial, sans-serif';
                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                ctx.textAlign = 'center';
                ctx.fillText(watermark, canvas.width / 2, canvas.height - 30);

                // Trigger download
                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                const link = document.createElement('a');
                link.download = `receipt - ${payment.name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Error generating receipt:', error);
            alert('Failed to generate receipt image. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="relative w-full max-w-lg shadow-2xl rounded-lg overflow-hidden">
                {/* Display Container */}
                <div className="relative w-full">
                    <img
                        src="/recipt.jpeg"
                        alt="Receipt"
                        className="w-full h-auto block"
                        useMap="#receipt-map"
                    />

                    {/* Area 1: Name - coords="201,528,802,583" */}
                    <div
                        className="absolute flex items-center overflow-hidden"
                        style={{
                            left: '16.75%',     // 201/1200 * 100
                            top: '34.06%',      // 528/1550 * 100
                            width: '50.08%',    // (802-201)/1200 * 100
                            height: '3.55%',    // (583-528)/1550 * 100
                            color: '#751d08',
                        }}
                    >
                        <span className="font-bold text-[2.5vw] sm:text-[1.8vw] md:text-sm lg:text-base uppercase tracking-wide truncate w-full text-left leading-none">
                            {payment.name}
                        </span>
                    </div>

                    {/* Area 2: Order/Quantity - coords="774,765,1115,802" */}
                    <div
                        className="absolute flex items-center overflow-hidden"
                        style={{
                            left: '64.5%',      // 774/1200 * 100
                            top: '50%',         // (765+10)/1550 * 100
                            width: '28.42%',    // (1115-774)/1200 * 100
                            height: '2.39%',    // (802-765)/1550 * 100
                            color: '#000000ff',
                        }}
                    >
                        <span className="font-bold text-[2vw] sm:text-[1.5vw] md:text-xs lg:text-sm text-left leading-none">
                            {payment.quantity || 1}
                        </span>
                    </div>

                    {/* Area 3: Amount - coords="754,821,1112,855" */}
                    <div
                        className="absolute flex items-center overflow-hidden"
                        style={{
                            left: '62.83%',     // 754/1200 * 100
                            top: '53.61%',      // (821+10)/1550 * 100
                            width: '29.83%',    // (1112-754)/1200 * 100
                            height: '2.19%',    // (855-821)/1550 * 100
                            color: '#000000ff',
                        }}
                    >
                        <span className="font-bold text-[2vw] sm:text-[1.5vw] md:text-xs lg:text-sm text-left leading-none">
                            ₹{payment.amount || (payment.quantity * 350)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-4 w-full max-w-xs justify-center">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg font-bold active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isDownloading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" /> Generating...
                        </>
                    ) : (
                        <>
                            <Download size={20} /> Download
                        </>
                    )}
                </button>
                <button
                    onClick={async () => {
                        setIsDownloading(true);
                        try {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            const img = new Image();
                            canvas.width = 1200;
                            canvas.height = 1550;
                            img.src = '/recipt.jpeg';
                            await new Promise((resolve, reject) => {
                                img.onload = resolve;
                                img.onerror = reject;
                            });
                            if (ctx) {
                                ctx.drawImage(img, 0, 0, 1200, 1550);
                                ctx.fillStyle = '#751d08';
                                ctx.textBaseline = 'middle';

                                // Area 1: Name
                                const nameX = 201;
                                const nameY = 528 + ((583 - 528) / 2);
                                ctx.font = 'bold 35px Arial, sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(payment.name.toUpperCase(), nameX, nameY);

                                // Area 2: Order/Quantity + 10px down
                                const qtyX = 774; // Left edge
                                const qtyY = 765 + ((802 - 765) / 2) + 10;
                                ctx.font = 'bold 30px Arial, sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(String(payment.quantity || 1), qtyX, qtyY);

                                // Area 3: Amount + 10px down
                                const amtX = 754; // Left edge
                                const amtY = 821 + ((855 - 821) / 2) + 10;
                                ctx.font = 'bold 30px Arial, sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(`₹${payment.amount || (payment.quantity * 350)}`, amtX, amtY);

                                // Watermark
                                const now = new Date();
                                const watermark = `Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
                                ctx.font = 'italic 20px Arial, sans-serif';
                                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                                ctx.textAlign = 'center';
                                ctx.fillText(watermark, canvas.width / 2, canvas.height - 30);

                                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                                const blob = await (await fetch(dataUrl)).blob();
                                const file = new File([blob], `receipt-${payment.name.replace(/\s+/g, '-').toLowerCase()}.jpg`, { type: 'image/jpeg' });

                                if (navigator.share) {
                                    await navigator.share({
                                        files: [file],
                                        title: 'MYL-msf thiruvegappura panchayath Receipt',
                                        text: `Payment Receipt for ${payment.name}`
                                    });
                                } else {
                                    alert("Sharing is not supported on this device.");
                                }
                            }
                        } catch (e) {
                            console.error(e);
                        } finally {
                            setIsDownloading(false);
                        }
                    }}
                    disabled={isDownloading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg font-bold active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isDownloading ? <Loader2 size={20} className="animate-spin" /> : <Share2 size={20} />} Share
                </button>
                <div className="flex gap-4 w-full">
                    <button
                        onClick={() => navigate('/gen-poster')}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                    >
                        Generate Poster
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors border border-gray-700"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Receipt;
