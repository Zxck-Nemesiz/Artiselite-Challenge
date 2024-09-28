import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import Section from './Section';
import Button from './Button';
import Modal from './Modal';
import axios from 'axios';
import background from '../images/6195005.jpg';

const Inbound = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [inboundProducts, setInboundProducts] = useState([]);

  // Fetch inbound products from backend
  const fetchInboundProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/inbound');
      setInboundProducts(response.data);
    } catch (error) {
      console.error('Error fetching inbound products:', error);
    }
  };

  // Add new inbound product
  const handleAddInboundProduct = async (e) => {
    e.preventDefault();
    const newProduct = {
      product_name: e.target.product_name.value,
      supplier: e.target.supplier.value,
      quantity: e.target.quantity.value,
    };

    try {
      await axios.post('http://localhost:8080/api/inbound', newProduct);
      fetchInboundProducts();
      setIsAddOpen(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  useEffect(() => {
    fetchInboundProducts();
  }, []);

  const data = React.useMemo(() => inboundProducts, [inboundProducts]);

  const columns = React.useMemo(() => [
    { Header: 'Product Name', accessor: 'product_sku' },
    { Header: 'Supplier', accessor: 'location' },
    { Header: 'Quantity', accessor: 'quantity' },
  ], []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <Section className="relative flex items-center justify-center pt-[10rem] -mt-[4]">
      <div className="container mx-auto text-center z-10">
        <h1 className="text-4xl font-semibold mb-6">Inbound Management</h1>
        <p className="text-lg mb-10">Track incoming products and update inventory.</p>

        <Button onClick={() => setIsAddOpen(true)} white className="px-6 py-2 bg-purple-500 text-black rounded-lg shadow hover:bg-purple-600 transition">
          Add Inbound Product
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

      {/* Add Inbound Product Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <div>
          <h2 className="text-xl font-semibold mb-3">Add Inbound Product</h2>
          <form onSubmit={handleAddInboundProduct}>
            <input type="text" name="product_name" placeholder="Product Name" className="p-2 w-full border rounded-lg mb-3" required />
            <input type="text" name="supplier" placeholder="Supplier" className="p-2 w-full border rounded-lg mb-3" required />
            <input type="number" name="quantity" placeholder="Quantity" className="p-2 w-full border rounded-lg mb-3" required />
            <Button type="submit" className="px-6 py-2 text-white rounded-lg shadow">Add</Button>
          </form>
        </div>
      </Modal>
    </Section>
  );
};

export default Inbound;
