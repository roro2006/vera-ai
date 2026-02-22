'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

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
            className="absolute top-4 right-4 p-2 text-secondary hover:text-primary transition-colors"
            aria-label="Close panel"
          >
            <X size={16} />
          </button>

          <div className="p-6 pt-12">
            <h2 className="text-lg font-semibold text-primary">
              {state.selectedAnimal.name}
            </h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
