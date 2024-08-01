import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteCustomer} from '../store/slice/customerSlice';
import EditCustomerForm from './EditCustomerForm'; 

const CustomerList = () => {
    const dispatch = useDispatch();
    const customers = useSelector(state => state.customer.customers);

    // Local state to manage editing
    const [editingCustomer, setEditingCustomer] = useState(null);

    // Function to start editing
    const startEditing = (customer) => {
        setEditingCustomer(customer);
    };

    // Function to finish editing
    const finishEditing = () => {
        setEditingCustomer(null);
    };

    return (
        <div className="customer-list py-10 bg-gray-100 min-h-screen">
            <h5 className="text-center text-2xl font-semibold mb-8">Customer List</h5>
            <div className="container mx-auto">
                {editingCustomer ? (
                    <EditCustomerForm
                        customer={editingCustomer}
                        onCancel={finishEditing}
                    />
                ) : (
                    <>
                        {customers.length > 0 ? (
                             <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-gray-800 text-white">
                                        <th className="py-3 px-4 uppercase font-semibold text-sm">PAN</th>
                                        <th className="py-3 px-4 uppercase font-semibold text-sm">Full Name</th>
                                        <th className="py-3 px-4 uppercase font-semibold text-sm">Email</th>
                                        <th className="py-3 px-4 uppercase font-semibold text-sm">Mobile</th>
                                        <th className="py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map(customer => (
                                        <tr key={customer.id} className="text-gray-700 text-center">
                                            <td className="py-3 px-4">{customer.pan}</td>
                                            <td className="py-3 px-4">{customer.fullName}</td>
                                            <td className="py-3 px-4">{customer.email}</td>
                                            <td className="py-3 px-4">{customer.mobile}</td>
                                            <td className="py-3 px-4 flex justify-around">
                                                <button
                                                    className="text-blue-500 text-sm font-medium"
                                                    onClick={() => startEditing(customer)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-500 text-sm font-medium"
                                                    onClick={() => dispatch(deleteCustomer(customer.id))}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No customers available</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomerList;
