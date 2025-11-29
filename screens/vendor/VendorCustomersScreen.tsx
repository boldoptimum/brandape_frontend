

import React from 'react';
import { Order } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useAppContext } from '../../hooks/useAppContext';

const VendorCustomersScreen: React.FC = () => {
  const { orders } = useAppContext();

  const customers = Array.from(new Set(orders.map(o => o.customer)))
    .map(customerName => {
        const customerOrders = orders.filter(o => o.customer === customerName);
        const lastOrder = customerOrders.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        return {
            name: customerName,
            totalOrders: customerOrders.length,
            totalSpent: customerOrders.reduce((sum, o) => sum + o.total, 0),
            lastOrderDate: lastOrder ? lastOrder.date : 'N/A'
        }
    });

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Customers</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">Customer Name</th>
                <th scope="col" className="px-6 py-3">Total Orders</th>
                <th scope="col" className="px-6 py-3">Total Spent</th>
                <th scope="col" className="px-6 py-3">Last Order Date</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.name} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{customer.name}</td>
                  <td className="px-6 py-4">{customer.totalOrders}</td>
                  <td className="px-6 py-4 font-semibold">N {customer.totalSpent.toLocaleString()}</td>
                  <td className="px-6 py-4">{customer.lastOrderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorCustomersScreen;