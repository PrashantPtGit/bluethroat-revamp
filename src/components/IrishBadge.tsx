'use client'

import { motion } from 'framer-motion'

export default function IrishBadge() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 40,
        background: 'rgba(37,99,235,0.15)',
        border: '1px solid rgba(37,99,235,0.3)',
        borderRadius: '20px',
        padding: '4px 10px',
        fontSize: '11px',
        color: '#F8FAFC',
        userSelect: 'none',
      }}
    >
      🇮🇪 .ie
    </motion.div>
  )
}
