'use client';

import { updateOrderStatus } from '@/actions/adminActions';

interface OrderStatusSelectorProps {
  orderId: string;
  currentStatus: string;
  onStatusUpdate?: () => void;
}

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-muted-gold text-primary-foreground'; // Muted Gold
    case 'shipped':
      return 'bg-shipped-bg text-foreground'; // Neutral Dark Gray
    case 'delivered':
      return 'bg-primary text-primary-foreground'; // Emerald Green
    case 'cancelled':
      return 'bg-transparent text-muted-foreground/60'; // Faded Out
    default:
      return 'bg-card text-foreground'; // Default neutral
  }
};

export function OrderStatusSelector({ orderId, currentStatus, onStatusUpdate }: OrderStatusSelectorProps) {
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('status', newStatus);
    
    const result = await updateOrderStatus(formData);
    
    if (result.success && onStatusUpdate) {
      // Trigger refetch after successful status update
      onStatusUpdate();
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={handleStatusChange}
      className={`p-2 rounded-md ${getStatusClasses(currentStatus)}`}
    >
      <option value="pending">Pending</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}
