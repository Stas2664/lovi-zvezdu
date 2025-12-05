"use client";

import { useEffect, useState } from "react";
import { Phone, User, ShieldCheck, ChevronRight, Zap, Star, Lock, Share2, Gift, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  
  // New State for Gift Modal
  const [giftModal, setGiftModal] = useState<{open: boolean, amount: number} | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#000000');
      tg.setBackgroundColor('#000000');
      
      // Check for startapp parameters (receiving a gift)
      const startParam = tg.initDataUnsafe?.start_param;
      if (startParam && startParam.startsWith('gift_')) {
         const parts = startParam.split('_');
         // format: gift_ID_AMOUNT
         if (parts[2]) {
            setGiftModal({ open: true, amount: parseInt(parts[2]) });
         }
      }
    }
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 200) { 
       handleAuth();
    }
  };

  const handleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1000);
  };

  return (
    <div className="w-full h-full min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* === GIFT RECEIVED MODAL === */}
      <AnimatePresence>
        {giftModal && giftModal.open && (
          <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
             <motion.div 
               initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
               className="w-full max-w-sm bg-[#1c1c1e] border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center relative shadow-2xl"
             >
                {/* Close Button */}
                <button 
                  onClick={() => setGiftModal(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-white/50 hover:text-white"
                >
                   <X className="w-4 h-4" />
                </button>

                <div className="w-24 h-24 mb-6 relative">
                   <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                   <Star className="w-24 h-24 text-green-400 fill-green-400 drop-shadow-lg relative z-10" />
                </div>
                
                <h2 className="text-2xl font-bold mb-2">Вам подарок!</h2>
                <p className="text-white/60 mb-8">Вы получили чек на <span className="text-white font-bold">{giftModal.amount} звезд</span>.</p>
                
                <button 
                   onClick={() => {
                      setGiftModal(null);
                      // If not authorized, go to auth, else go to dashboard
                      if (step !== 3) {
                         // Just close modal, user sees auth screen
                      }
                   }}
                   className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-2xl transition-colors"
                >
                   Забрать звезды
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === BACKGROUND AMBIENCE (Global) === */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
        {/* Stars */}
        <div className="absolute top-20 right-10 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute top-40 left-10 w-1 h-1 bg-white/50 rounded-full" />
        <div className="absolute bottom-40 right-20 w-1 h-1 bg-white/30 rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* === AUTH SCREEN === */}
        {step === 1 && (
          <motion.div 
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 flex flex-col min-h-screen p-6"
          >
            {/* Top Badge */}
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full flex justify-center mt-4"
            >
              <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                <span className="text-[10px] font-medium tracking-widest uppercase text-white/60">Secure Connection</span>
              </div>
            </motion.div>

            {/* Main Center Content */}
            <div className="flex-1 flex flex-col items-center justify-center -mt-10">
              
              {/* 3D Shield Effect */}
              <div className="relative mb-10 group">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-purple-600 rounded-[30px] blur-[30px] opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="w-32 h-32 bg-gradient-to-b from-[#1a1a1a] to-[#000] border border-white/10 rounded-[30px] flex items-center justify-center relative z-10 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-yellow-500/10 blur-xl animate-pulse" />
                  <Star className="w-16 h-16 text-[#FFD700] fill-[#FFD700] drop-shadow-[0_0_25px_rgba(255,215,0,0.6)] relative z-10" />
                </div>
                {/* Floating Elements around shield */}
                <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -right-6 top-0 bg-black/50 backdrop-blur border border-white/10 p-2 rounded-xl">
                  <Lock className="w-4 h-4 text-green-400" />
                </motion.div>
                <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -left-6 bottom-0 bg-black/50 backdrop-blur border border-white/10 p-2 rounded-xl">
                  <Zap className="w-4 h-4 text-yellow-400" />
                </motion.div>
              </div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50 uppercase tracking-wide"
              >
                ЛОВИ ЗВЕЗДУ
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center text-white/40 text-sm max-w-[260px] leading-relaxed"
              >
                Подключите ваш Telegram профиль для доступа к платформе вознаграждений.
              </motion.p>

            </div>

            {/* Bottom Swipe Action */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8 relative w-full max-w-[320px] mx-auto"
            >
               {/* Swipe Track */}
               <div className="h-16 w-full bg-white/5 border border-white/10 rounded-full relative flex items-center px-1.5 overflow-hidden">
                 
                 {/* Shimmer Text */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <span className="text-white/30 font-medium text-sm tracking-wider shimmer-text animate-pulse">
                       Свайпните вправо
                    </span>
                 </div>
                 
                 {/* Draggable Knob */}
                 <motion.div 
                   drag="x"
                   dragConstraints={{ left: 0, right: 250 }}
                   dragElastic={0.1}
                   onDragEnd={handleDragEnd}
                   whileDrag={{ scale: 1.1 }}
                   className="h-12 w-12 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20 z-10 cursor-grab active:cursor-grabbing touch-none"
                 >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-white" />
                    )}
                 </motion.div>
               </div>
               
               <p className="text-center text-white/20 text-[10px] mt-4">
                 Свайпая, вы принимаете условия сервиса
               </p>
            </motion.div>
          </motion.div>
        )}

        {/* === DASHBOARD === */}
        {step === 3 && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            className="relative z-10 min-h-screen flex flex-col"
          >
             {/* Header */}
             <div className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[1px]">
                      <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                         <span className="font-bold text-sm">S</span>
                      </div>
                   </div>
                   <div>
                      <p className="text-xs text-white/40">Добро пожаловать</p>
                      <p className="text-sm font-semibold">ЛОВИ ЗВЕЗДУ</p>
                   </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                   <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
             </div>

             {/* Balance Card */}
             <div className="px-6 mb-8">
                <div className="w-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] pointer-events-none" />
                   
                   <p className="text-white/40 text-sm font-medium mb-2">Общий баланс</p>
                   <h2 className="text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                      0.00
                   </h2>
                   
                   <div className="flex gap-3">
                      <button className="flex-1 bg-white text-black font-semibold py-3 rounded-xl text-sm active:scale-95 transition-transform">
                         Пополнить
                      </button>
                      <button className="flex-1 bg-white/10 text-white font-semibold py-3 rounded-xl text-sm hover:bg-white/20 active:scale-95 transition-transform border border-white/5">
                         Вывести
                      </button>
                   </div>
                </div>
             </div>

             {/* Features Grid */}
             <div className="px-6 grid grid-cols-2 gap-4">
                <div 
                  onClick={() => {
                     const input = prompt("Введите количество звезд для подарка:", "100");
                     const amount = parseInt(input || "0");
                     
                     if (amount > 0) {
                        // Generate unique ID
                        const uniqueId = Math.random().toString(36).substring(2, 8);
                        
                        // Direct Mini App Link with startapp parameter
                        // IMPORTANT: Use the correct app Short Name here ('app' is default if you didn't change it)
                        const appLink = `https://t.me/LoviZbot/app?startapp=gift_${uniqueId}_${amount}`;
                        
                        const message = encodeURIComponent(`Лови чек на ${amount} звезд! ⭐`);
                        const tgShareUrl = `https://t.me/share/url?url=${appLink}&text=${message}`;
                        
                        if (typeof window !== "undefined" && window.Telegram?.WebApp) {
                           window.Telegram.WebApp.openTelegramLink(tgShareUrl);
                        } else {
                           window.open(tgShareUrl, '_blank');
                        }
                     }
                  }}
                  className="aspect-square bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
                >
                   <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-purple-400" />
                   </div>
                   <div>
                      <p className="text-white font-medium">Подарить</p>
                      <p className="text-white/40 text-xs">Создать чек</p>
                   </div>
                </div>
                <div className="aspect-square bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors cursor-pointer">
                   <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-purple-400" />
                   </div>
                   <div>
                      <p className="text-white font-medium">Безопасность</p>
                      <p className="text-white/40 text-xs">Активна</p>
                   </div>
                </div>
             </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
