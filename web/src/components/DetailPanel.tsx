'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import PanelHeader from '@/components/detail/PanelHeader';
import CameraFeed from '@/components/detail/CameraFeed';
import BehaviorBar from '@/components/detail/BehaviorBar';
import HistorySparklines from '@/components/detail/HistorySparklines';
import AlertFeed from '@/components/detail/AlertFeed';
import CameraModal from '@/components/CameraModal';
import { AlertTriangle, Clock } from 'lucide-react';

export default function DetailPanel() {
  const { state, dispatch } = useApp();
  const dark = state.theme === 'dark';
  const [modalOpen, setModalOpen] = useState(false);

  // Reset modal when selected animal changes
  useEffect(() => {
    setModalOpen(false);
  }, [state.selectedAnimal]);

  const animal = state.selectedAnimal;

  return (
    <AnimatePresence>
      {state.panelOpen && animal && (
        <motion.div
          key="detail-panel"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-30 lg:relative lg:inset-auto lg:z-auto w-full lg:w-[35%] border-l border-border bg-surface overflow-y-auto"
        >
          {/* Mobile back button */}
          <button
            onClick={() => dispatch({ type: 'CLOSE_PANEL' })}
            className="lg:hidden absolute top-4 left-4 z-10 p-2 text-secondary hover:text-primary transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Desktop close button */}
          <button
            onClick={() => dispatch({ type: 'CLOSE_PANEL' })}
            className="hidden lg:block absolute top-4 right-4 z-10 p-2 text-secondary hover:text-primary transition-colors"
            aria-label="Close panel"
          >
            <X size={16} />
          </button>

          <PanelHeader animal={animal} />

          {/* Model Feedback / Integrity Errors */}
          {animal.last_behavioral_integrity_error && (
            <div className={`mx-4 mb-4 p-3 rounded-lg border ${
              dark
                ? 'bg-[#2A2418] border-[#4A3A20]'
                : 'bg-[#FDF6E8] border-[#E8D5A8]'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={14} className="text-mild-concern" />
                <span className={`text-xs font-bold uppercase tracking-tight ${
                  dark ? 'text-[#D4982C]' : 'text-[#8B6914]'
                }`}>Model Feedback: Behavioral Integrity</span>
              </div>
              <p className={`text-sm leading-snug ${
                dark ? 'text-[#C8A840]' : 'text-[#7A5C10]'
              }`}>
                {animal.last_behavioral_integrity_error}
              </p>
              {animal.last_violation_time && (
                <div className={`mt-2 flex items-center gap-1 text-[10px] font-medium ${
                  dark ? 'text-[#9A8040]' : 'text-[#A08030]'
                }`}>
                  <Clock size={10} />
                  <span>Detected at {new Date(animal.last_violation_time).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          )}

          <CameraFeed animal={animal} onExpand={() => setModalOpen(true)} />
          <BehaviorBar
            behaviorToday={animal.behaviorToday}
            observationCounts={animal.observation_counts}
          />
          <HistorySparklines history7d={animal.history7d} behaviorToday={animal.behaviorToday} />
          <AlertFeed alerts={animal.alerts} />

          {modalOpen && (animal.cameraFrameUrl || animal.videoUrl) && (
            <CameraModal
              imageUrl={animal.cameraFrameUrl || ''}
              videoUrl={animal.videoUrl}
              animalName={animal.name}
              onClose={() => setModalOpen(false)}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
