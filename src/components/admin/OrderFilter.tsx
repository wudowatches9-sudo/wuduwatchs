"use client";

import { useRouter, useSearchParams } from 'next/navigation';

const OrderFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all'; // Default to 'all' if not present

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === 'all') {
      router.push('/admin/orders');
    } else {
      router.push(`/admin/orders?status=${newStatus}`);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Filter by status:
      </label>
      <select
        id="status-filter"
        name="status-filter"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        onChange={handleFilterChange}
        value={currentStatus}
      >
        <option value="all">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  );
};

export default OrderFilter;
