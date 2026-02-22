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

export default function DetailPanel() {
  const { state, dispatch } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  // Reset modal when selected animal changes
  useEffect(() => {
    setModalOpen(false);
  }, [state.selectedAnimal]);

  return (
    <AnimatePresence>
      {state.panelOpen && state.selectedAnimal && (
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

          <PanelHeader animal={state.selectedAnimal} />
          <CameraFeed animal={state.selectedAnimal} onExpand={() => setModalOpen(true)} />
          <BehaviorBar behaviorToday={state.selectedAnimal.behaviorToday} />
          <HistorySparklines history7d={state.selectedAnimal.history7d} behaviorToday={state.selectedAnimal.behaviorToday} />
          <AlertFeed alerts={state.selectedAnimal.alerts} />

          {modalOpen && (
            <CameraModal
              animalName={state.selectedAnimal.name}
              onClose={() => setModalOpen(false)}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
