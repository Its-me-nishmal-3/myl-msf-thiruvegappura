
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Share, Download, Monitor, ArrowDownSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InstallPWA: React.FC = () => {
    const navigate = useNavigate();
    const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Platform detection
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setPlatform('ios');
        } else if (/android/.test(userAgent)) {
            setPlatform('android');
        } else {
            setPlatform('desktop');
        }

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        // Capture install prompt
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 text-gray-900 p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-md w-full relative z-10">
                <button
                    onClick={() => navigate('/')}
                    className="mb-8 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
                >
                    &larr; Back to Home
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-xl border border-sky-100 rounded-3xl p-8 text-center shadow-2xl"
                >
                    <div className="w-24 h-24 bg-gray-100 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-inner overflow-hidden">
                        <img src="/pwa-192x192.png" alt="App Icon" className="w-full h-full object-cover" />
                    </div>

                    <h1 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        Install App
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Get the best experience by installing the MYL-msf thiruvegappura panchayath app on your device.
                    </p>

                    {isInstalled ? (
                        <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-4 text-sky-400">
                            <p className="font-semibold">App is already installed!</p>
                            <p className="text-sm mt-1 opacity-80">You can open it from your home screen.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Android Install */}
                            {platform === 'android' && (
                                <div className="space-y-4">
                                    {deferredPrompt ? (
                                        <button
                                            onClick={handleInstallClick}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                                        >
                                            <Download className="w-5 h-5" />
                                            Install App
                                        </button>
                                    ) : (
                                        <div className="bg-gray-50 rounded-xl p-4 text-sm text-left border border-gray-200">
                                            <p className="flex items-start gap-3 mb-3">
                                                <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                                                Tap the browser menu (three dots)
                                            </p>
                                            <p className="flex items-start gap-3">
                                                <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                                                Select "Install App" or "Add to Home Screen"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* iOS Install */}
                            {platform === 'ios' && (
                                <div className="bg-gray-50 rounded-xl p-4 text-sm text-left border border-gray-200 space-y-4">
                                    <p className="flex items-start gap-3">
                                        <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                                        <span>Tap the <strong>Share</strong> button <Share className="w-4 h-4 inline mx-1" /> in the menu bar</span>
                                    </p>
                                    <p className="flex items-start gap-3">
                                        <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                                        <span>Scroll down and select <strong>"Add to Home Screen"</strong> <ArrowDownSquare className="w-4 h-4 inline mx-1" /></span>
                                    </p>
                                    <p className="flex items-start gap-3">
                                        <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                                        <span>Tap <strong>Add</strong> in the top right corner</span>
                                    </p>
                                </div>
                            )}

                            {/* Desktop Install */}
                            {platform === 'desktop' && (
                                <div className="bg-gray-50 rounded-xl p-4 text-sm text-center border border-gray-200">
                                    <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                                    <p>To install on desktop:</p>
                                    <p className="text-gray-500 mt-2">Look for the install icon <Download className="w-4 h-4 inline" /> in the address bar</p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default InstallPWA;
