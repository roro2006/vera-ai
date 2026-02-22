'use client';

import { motion } from 'framer-motion';
import type { Alert } from '@/types';

interface AlertFeedProps {
  alerts: Alert[];
}

export default function AlertFeed({ alerts }: AlertFeedProps) {
  return (
    <div>
      <h3 className="font-semibold text-sm px-4 pt-4 pb-2">Alerts</h3>

      {alerts.length === 0 ? (
        <p className="text-sm text-secondary px-4 py-6 text-center">
          No behavioral anomalies detected today.
        </p>
      ) : (
        <div className="px-4 pb-4 max-h-48 overflow-y-auto flex flex-col gap-2">
          {alerts.map((alert, index) => (
            <motion.div
              key={`${alert.timestamp}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.15 }}
              className={
                alert.active
                  ? 'flex border-l-[3px] border-alert pl-3'
                  : 'flex pl-[15px]'
              }
            >
              <span className="font-medium text-xs text-secondary">
                {alert.timestamp}
              </span>
              <span>&nbsp;&mdash;&nbsp;</span>
              <span className="text-sm text-primary">{alert.message}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
