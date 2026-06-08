import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog({ isOpen, message, onConfirm, onCancel, title = 'Confirm Action' }) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-600 dark:text-red-400" />
        </div>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{message}</p>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </Modal>
  )
}
