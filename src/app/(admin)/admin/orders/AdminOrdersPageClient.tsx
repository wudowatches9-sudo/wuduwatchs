"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { OrderStatusSelector } from '@/components/admin/OrderStatusSelector';
import OrderFilter from '@/components/admin/OrderFilter';
import { AdminTableSkeleton } from '@/components/skeletons/AdminTableSkeleton';
import { Eye } from 'lucide-react';
import { OrderDetailsModal } from '@/components/admin/OrderDetailsModal';
import { createClient } from '@/lib/supabase/client';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  customer_city: string;
  ordered_products: any[];
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  order_number: number;
}

function AdminOrdersPageContent() {
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status');

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const status = currentStatus || 'all';
      const supabase = createClient();

      let query = supabase.from('orders').select('*');
      if (status && status !== 'all') {
        query = query.eq('order_status', status);
      }

      const { data: orders, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(orders || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (isLoading) {
    return <div className="p-6"><AdminTableSkeleton /></div>;
  }

  if (error) {
    return <p className="text-red-500">Error loading orders: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <OrderFilter />
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        
        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <div 
                key={order.id} 
                className="p-4 active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{order.customer_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">৳&nbsp;{(order.total_amount ?? 0).toFixed(2)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Order #{order.order_number}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <div onClick={(e) => e.stopPropagation()} className="flex-1 mr-4">
                    <OrderStatusSelector 
                      orderId={order.id} 
                      currentStatus={order.order_status}
                      onStatusUpdate={fetchOrders}
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(order);
                    }}
                    className="p-2 text-muted-gold hover:text-primary transition-colors"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No orders found
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-16">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider max-w-[120px]">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider max-w-[150px]">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-16">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    #{order.order_number}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-medium">
                    {order.customer_name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-medium">
                    ৳&nbsp;{(order.total_amount ?? 0).toFixed(0)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 max-w-[120px] truncate" title={order.customer_phone}>
                    {order.customer_phone}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 max-w-[150px] truncate" title={order.customer_email}>
                    {order.customer_email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300" onClick={(e) => e.stopPropagation()}>
                    <OrderStatusSelector 
                      orderId={order.id} 
                      currentStatus={order.order_status}
                      onStatusUpdate={fetchOrders}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="p-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default function AdminOrdersPageClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminOrdersPageContent />
    </Suspense>
  );
}


