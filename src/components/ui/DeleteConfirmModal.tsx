import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Дали сте сигурни?",
  message = "Оваа акција е трајна и објавата не може да се врати откако ќе биде избришана.",
  isDeleting = false
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/10 blur-[80px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center border border-yellow-400/20">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                >
                  <X className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                </button>
              </div>

              <h2 className="text-2xl font-black text-white mb-3 tracking-tight uppercase italic">
                {title}
              </h2>
              <p className="text-zinc-400 mb-8 leading-relaxed font-medium">
                {message}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="px-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-black uppercase tracking-wider text-xs transition-all disabled:opacity-50 active:scale-95"
                >
                  Откажи
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="px-6 py-4 bg-yellow-400 hover:bg-yellow-300 text-black rounded-2xl font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Избриши
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
