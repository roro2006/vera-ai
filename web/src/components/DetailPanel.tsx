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
          {/* Mobile back button (≤1024px) */}
          <button
            onClick={() => dispatch({ type: 'CLOSE_PANEL' })}
            className="lg:hidden absolute top-4 left-4 z-10 p-2 text-secondary hover:text-primary transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Desktop close button (>1024px) */}
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
            <div className="mx-4 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-950/30 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={14} className="text-amber-600" />
                <span className="text-xs font-bold text-amber-800 uppercase tracking-tight dark:text-amber-400">Model Feedback: Behavioral Integrity</span>
              </div>
              <p className="text-sm text-amber-700 leading-snug dark:text-amber-300">
                {animal.last_behavioral_integrity_error}
              </p>
              {animal.last_violation_time && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-500 font-medium">
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
