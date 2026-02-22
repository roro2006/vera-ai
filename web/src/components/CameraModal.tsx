'use client';

import { useRef, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface CameraModalProps {
  animalName: string;
  videoUrl: string;
  onClose: () => void;
}

function toApiUrl(cameraFrameUrl: string): string {
  const filename = cameraFrameUrl.split('/').pop()!;
  return `/api/video?file=${encodeURIComponent(filename)}`;
}

export default function CameraModal({
  animalName,
  videoUrl,
  onClose,
}: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);

  // Close on ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Load video into element
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    setLoading(true);
    el.src = toApiUrl(videoUrl);
    el.load();

    const onCanPlay = () => {
      setLoading(false);
      el.play().catch(() => {});
    };
    const onError = () => setLoading(false);

    el.addEventListener('canplay', onCanPlay);
    el.addEventListener('error', onError);

    return () => {
      el.removeEventListener('canplay', onCanPlay);
      el.removeEventListener('error', onError);
      el.pause();
      el.removeAttribute('src');
      el.load();
    };
  }, [videoUrl]);

  const now = new Date();
  const timestamp = now.toLocaleString();

  return (
    <AnimatePresence>
      <motion.div
        key="camera-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          key="camera-modal-content"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.25 }}
          className="relative w-[95vw] h-[92vh] max-w-[1600px] bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Video wrapper */}
          <div className="relative flex-1 flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-full object-contain"
            />

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* LIVE indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold text-white tracking-wide">
                LIVE
              </span>
            </div>

            {/* Timestamp overlay */}
            <div className="absolute bottom-14 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded">
              {timestamp}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 bg-black/90 border-t border-white/10 flex justify-between items-center">
            <span className="font-semibold text-base text-white">
              {animalName}
            </span>
            <span className="text-xs text-white/50">
              Enclosure Monitoring Feed
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
