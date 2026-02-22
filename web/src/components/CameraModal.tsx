'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface CameraModalProps {
  animalName: string;
  onClose: () => void;
}

export default function CameraModal({ animalName, onClose }: CameraModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        key="camera-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      >
        <motion.div
          key="camera-modal-content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-[70vw] max-h-[80vh] bg-surface rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-black/30 text-secondary hover:text-primary transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>

          {/* Video */}
          <video
            src="/api/video"
            autoPlay
            loop
            muted
            playsInline
            controls
            className="object-contain w-full h-auto max-h-[70vh] rounded"
          />

          {/* Animal name label */}
          <div className="p-4 font-semibold text-base">{animalName}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
