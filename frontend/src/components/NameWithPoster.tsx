import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Loader2, Share2 } from 'lucide-react';

const NameWithPoster: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [amount, setAmount] = useState(0);
    const [generated, setGenerated] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const nameParam = searchParams.get('name');
    const quantityParam = searchParams.get('quantity');
    const amountParam = searchParams.get('amount');
    const typeParam = searchParams.get('type');

    useEffect(() => {
        if (nameParam) {
            setName(nameParam);
            setQuantity(quantityParam ? parseInt(quantityParam) : 1);
            setAmount(amountParam ? parseInt(amountParam) : 350);
            setGenerated(true);

            // If type=image, generate and return image only
            if (typeParam === 'image') {
                generateImageOnly(nameParam, quantityParam ? parseInt(quantityParam) : 1, amountParam ? parseInt(amountParam) : 350);
            }
        }
    }, [nameParam, quantityParam, amountParam, typeParam]);

    const generateImageOnly = async (userName: string, qty: number, amt: number) => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            // Original dimensions (same as Receipt.tsx)
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
                ctx.font = 'bold 30px Arial, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(userName.toUpperCase(), nameX, nameY);

                // Area 2: Quantity
                const qtyX = 774;
                const qtyY = 765 + ((802 - 765) / 2) + 10;
                ctx.font = 'bold 30px Arial, sans-serif';
                ctx.fillText(String(qty), qtyX, qtyY);

                // Area 3: Amount
                const amtX = 754;
                const amtY = 821 + ((855 - 821) / 2) + 10;
                ctx.fillText(`₹${amt}`, amtX, amtY);

                // Convert to blob and replace document
                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        window.location.href = url;
                    }
                }, 'image/jpeg', 0.9);
            }
        } catch (error) {
            console.error('Error generating image:', error);
        }
    };

    const handleGenerate = () => {
        if (name.trim()) {
            setGenerated(true);
        }
    };

    const handleDownload = async () => {
        setIsProcessing(true);
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            // Original dimensions (same as Receipt.tsx)
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
                ctx.font = 'bold 28px Arial, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(name.toUpperCase(), nameX, nameY);

                // Area 2: Quantity
                const qtyX = 774;
                const qtyY = 765 + ((802 - 765) / 2) + 10;
                ctx.font = 'bold 30px Arial, sans-serif';
                ctx.fillText(String(quantity), qtyX, qtyY);

                // Area 3: Amount
                const amtX = 754;
                const amtY = 821 + ((855 - 821) / 2) + 10;
                ctx.font = 'bold 30px Arial, sans-serif';
                ctx.fillText(`₹${amount}`, amtX, amtY);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                const link = document.createElement('a');
                link.download = `poster-${name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Error generating poster:', error);
            alert('Failed to generate poster. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleShare = async () => {
        setIsProcessing(true);
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            // Original dimensions (same as Receipt.tsx)
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
                ctx.font = 'bold 28px Arial, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(name.toUpperCase(), nameX, nameY);

                // Area 2: Quantity
                const qtyX = 774;
                const qtyY = 765 + ((802 - 765) / 2) + 10;
                ctx.font = 'bold 24px Arial, sans-serif';
                ctx.fillText(String(quantity), qtyX, qtyY);

                // Area 3: Amount
                const amtX = 754;
                const amtY = 821 + ((855 - 821) / 2) + 10;
                ctx.fillText(`₹${amount}`, amtX, amtY);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], `poster-${name.replace(/\s+/g, '-').toLowerCase()}.jpg`, { type: 'image/jpeg' });

                if (navigator.share) {
                    await navigator.share({
                        files: [file],
                        title: 'MYL-msf thiruvegappura panchayath Poster',
                        text: `Poster for ${name}`
                    });
                } else {
                    alert("Sharing is not supported on this device.");
                }
            }
        } catch (error) {
            console.error('Error sharing poster:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Return nothing if type=image (image generation happens in useEffect)
    if (typeParam === 'image') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 size={40} className="animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            {!generated ? (
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                        Generate Your Poster
                    </h1>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name-input" className="block text-sm font-medium text-gray-700 mb-2">
                                Enter Your Name
                            </label>
                            <input
                                id="name-input"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                                placeholder="e.g., John Doe"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
                            />
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={!name.trim()}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        >
                            Generate Poster
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="relative w-full max-w-lg shadow-2xl rounded-lg overflow-hidden">
                        <div className="relative w-full">
                            <img
                                src="/recipt.jpeg"
                                alt="Poster"
                                className="w-full h-auto block"
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
                                    {name}
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
                                    {quantity}
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
                                    ₹{amount}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4 w-full max-w-xs justify-center">
                        <button
                            onClick={handleDownload}
                            disabled={isProcessing}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg font-bold active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> Processing...
                                </>
                            ) : (
                                <>
                                    <Download size={20} /> Download
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleShare}
                            disabled={isProcessing}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg font-bold active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Share2 size={20} />} Share
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            setGenerated(false);
                            setName('');
                        }}
                        className="mt-4 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                    >
                        Generate Another
                    </button>
                </>
            )}
        </div>
    );
};

export default NameWithPoster;
