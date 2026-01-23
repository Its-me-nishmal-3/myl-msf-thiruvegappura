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

            // Original dimensions (new image size)
            canvas.width = 1937;
            canvas.height = 2560;

            img.src = '/recipt.jpeg';

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            if (ctx) {
                // Draw background
                ctx.drawImage(img, 0, 0, 1937, 2560);

                // Configure text
                ctx.textBaseline = 'middle';

                // Area 1: Amount - coords (306,333,812,427)
                const amtX = 306;
                const amtY = 333 + ((427 - 333) / 2); // Center vertically
                ctx.font = 'bold 40px Arial, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillStyle = '#000000';
                ctx.fillText(`₹${payment.amount || (payment.quantity * 350)}`, amtX, amtY);

                // Area 2: Name - coords (241,633,1178,719)
                const nameX = 241;
                const nameY = 633 + ((719 - 633) / 2); // Center vertically
                ctx.font = 'bold 50px Arial, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillStyle = '#751d08';
                ctx.fillText(payment.name.toUpperCase(), nameX, nameY);

                // Quantity hidden

                // Watermark
                const now = new Date();
                const watermark = `Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
                ctx.font = 'italic 30px Arial, sans-serif';
                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                ctx.textAlign = 'center';
                ctx.fillText(watermark, canvas.width / 2, canvas.height - 50);

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

                    {/* Area 1: Amount - coords="306,333,812,427"
                        Width: 1937, Height: 2560
                        Left: 306/1937 = 15.8%
                        Top: 333/2560 = 13.0%
                        Width: (812-306)/1937 = 26.1%
                        Height: (427-333)/2560 = 3.67%
                     */}
                    <div
                        className="absolute flex items-center overflow-hidden"
                        style={{
                            left: '15.9%',
                            top: '13.0%',
                            width: '26.1%',
                            height: '3.67%',
                            color: '#000000ff',
                        }}
                    >
                        <span className="font-bold text-[2vw] sm:text-[1.5vw] md:text-xs lg:text-sm text-left leading-none">
                            {payment.amount || (payment.quantity * 350)}
                        </span>
                    </div>

                    {/* Area 2: Name - coords="241,633,1178,719"
                        Left: 241/1937 = 12.44%
                        Top: 633/2560 = 24.72%
                        Width: (1178-241)/1937 = 48.37%
                        Height: (719-633)/2560 = 3.36%
                     */}
                    <div
                        className="absolute flex items-center overflow-hidden"
                        style={{
                            left: '12.44%',
                            top: '24.72%',
                            width: '48.37%',
                            height: '3.36%',
                            color: '#000000ff',
                        }}
                    >
                        <span className="font-bold text-[2.5vw] sm:text-[1.8vw] md:text-sm lg:text-base uppercase tracking-wide truncate w-full text-left leading-none">
                            {payment.name}
                        </span>
                    </div>

                    {/* Quantity Hidden as per new requirement */}
                </div>
            </div>

            <div className="mt-8 flex gap-4 w-full max-w-xs justify-center">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg font-bold active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
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
                            canvas.width = 1937;
                            canvas.height = 2560;
                            img.src = '/recipt.jpeg';
                            await new Promise((resolve, reject) => {
                                img.onload = resolve;
                                img.onerror = reject;
                            });
                            if (ctx) {
                                ctx.drawImage(img, 0, 0, 1937, 2560);
                                ctx.fillStyle = '#751d08';
                                ctx.textBaseline = 'middle';

                                // Area 1: Amount - coords="306,333,812,427"
                                // Center Y: 333 + (427-333)/2 = 380
                                const amtX = 306;
                                const amtY = 380;
                                ctx.font = 'bold 40px Arial, sans-serif';
                                ctx.textAlign = 'left';
                                //                                 ctx.fillText(`₹${payment.amount || (payment.quantity * 350)}`, amtX, amtY);
                                // Using Black for Amount based on component styles
                                ctx.fillStyle = '#000000';
                                ctx.fillText(`₹${payment.amount || (payment.quantity * 350)}`, amtX, amtY);


                                // Area 2: Name - coords="241,633,1178,719"
                                // Center Y: 633 + (719-633)/2 = 676
                                const nameX = 241;
                                const nameY = 676;
                                ctx.font = 'bold 50px Arial, sans-serif';
                                ctx.fillStyle = '#751d08';
                                ctx.textAlign = 'left';
                                ctx.fillText(payment.name.toUpperCase(), nameX, nameY);

                                // Watermark
                                const now = new Date();
                                const watermark = `Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
                                ctx.font = 'italic 30px Arial, sans-serif';
                                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                                ctx.textAlign = 'center';
                                ctx.fillText(watermark, canvas.width / 2, canvas.height - 50);

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
