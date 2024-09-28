import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import Section from './Section';
import Button from './Button';
import Modal from './Modal';
import axios from 'axios';
import background from '../images/6195005.jpg';

const Outbound = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [outboundProducts, setOutboundProducts] = useState([]);

  // Fetch outbound products from backend
  const fetchOutboundProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/outbound');
      setOutboundProducts(response.data);
    } catch (error) {
      console.error('Error fetching outbound products:', error);
    }
  };

  // Add new outbound product
  const handleAddOutboundProduct = async (e) => {
    e.preventDefault();
    const newProduct = {
      product_name: e.target.product_name.value,
      customer: e.target.customer.value,
      quantity: e.target.quantity.value,
    };

    try {
      await axios.post('http://localhost:8080/api/outbound', newProduct);
      fetchOutboundProducts(); // Refresh product list
      setIsAddOpen(false); // Close modal
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Fetch outbound products on component mount
  useEffect(() => {
    fetchOutboundProducts();
  }, []);

  // React Table setup
  const data = React.useMemo(() => outboundProducts, [outboundProducts]);

  const columns = React.useMemo(() => [
    { Header: 'Product Name', accessor: 'product_sku' },
    { Header: 'Customer', accessor: 'destination' },
    { Header: 'Quantity', accessor: 'quantity' },
  ], []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <Section className="relative flex items-center justify-center pt-[10rem] -mt-[4]">
      <div className="container mx-auto text-center z-10">
        <h1 className="text-4xl font-semibold mb-6">Outbound Management</h1>
        <p className="text-lg mb-10">Track outgoing products and update inventory.</p>

        <Button onClick={() => setIsAddOpen(true)} white className="px-6 py-2 bg-pink-500 text-black rounded-lg shadow hover:bg-pink-600 transition">
          Add Outbound Product
        </Button>

        {/* React Table */}
        <div className="mt-10 shadow-lg rounded-lg overflow-hidden bg-white">
          <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-100">
              {headerGroups.map(headerGroup => (
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th key={column.id} {...column.getHeaderProps()} className="px-6 py-3 text-center text-sm font-semibold text-gray-700 tracking-wider">
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr key={row.id} {...row.getRowProps()} className="hover:bg-gray-50">
                    {row.cells.map(cell => (
                      <td key={cell.column.id} {...cell.getCellProps()} className="px-6 py-4 text-sm text-gray-900 text-center">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={background} className="w-full h-full object-cover opacity-30" alt="background" />
      </div>

      {/* Add Outbound Product Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <div>
          <h2 className="text-xl font-semibold mb-3">Add Outbound Product</h2>
          <form onSubmit={handleAddOutboundProduct}>
            <input type="text" name="product_name" placeholder="Product Name" className="p-2 w-full border rounded-lg mb-3" required />
            <input type="text" name="customer" placeholder="Customer" className="p-2 w-full border rounded-lg mb-3" required />
            <input type="number" name="quantity" placeholder="Quantity" className="p-2 w-full border rounded-lg mb-3" required />
            <Button type="submit" className="px-6 py-2 text-white rounded-lg shadow">Add</Button>
          </form>
        </div>
      </Modal>
    </Section>
  );
};

export default Outbound;
