'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import PanelHeader from '@/components/detail/PanelHeader';
import CameraFeed from '@/components/detail/CameraFeed';
import BehaviorBar from '@/components/detail/BehaviorBar';
import HistorySparklines from '@/components/detail/HistorySparklines';
import AlertFeed from '@/components/detail/AlertFeed';

export default function DetailPanel() {
  const { state, dispatch } = useApp();

  return (
    <AnimatePresence>
      {state.panelOpen && state.selectedAnimal && (
        <motion.div
          key="detail-panel"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-[35%] border-l border-border bg-white overflow-y-auto relative"
        >
          <button
            onClick={() => dispatch({ type: 'CLOSE_PANEL' })}
            className="absolute top-4 right-4 z-10 p-2 text-secondary hover:text-primary transition-colors"
            aria-label="Close panel"
          >
            <X size={16} />
          </button>

          <PanelHeader animal={state.selectedAnimal} />
          <CameraFeed animal={state.selectedAnimal} onExpand={() => {}} />
          <BehaviorBar behaviorToday={state.selectedAnimal.behaviorToday} />
          <HistorySparklines history7d={state.selectedAnimal.history7d} behaviorToday={state.selectedAnimal.behaviorToday} />
          <AlertFeed alerts={state.selectedAnimal.alerts} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
