import React, { useState, useEffect } from 'react';
import Section from "./Section";
import { useTable } from 'react-table';
import Button from "./Button";
import Modal from "./Modal";
import axios from 'axios';
import background from "../images/6195005.jpg";

const Inbound = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [inboundProducts, setInboundProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  // Fetch inbound products from backend
  const fetchInboundProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/inbound');
      setInboundProducts(response.data);
    } catch (error) {
      console.error('Error fetching inbound products:', error);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchInboundProducts();
  }, []);

  // Add new product 
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const newProduct = {
      product_sku: e.target.product_sku.value,
      quantity: e.target.quantity.value,
      location: e.target.location.value,
    };

    try {
      await axios.post('http://localhost:8080/api/inbound', newProduct);
      fetchInboundProducts();
      setIsAddOpen(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Edit product
  const handleEditProduct = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      product_sku: e.target.product_sku.value,
      quantity: e.target.quantity.value,
      location: e.target.location.value,
    };

    try {
      await axios.put(`http://localhost:8080/api/inbound/${editProduct.id}`, updatedProduct);
      fetchInboundProducts();
      setEditProduct(null);
      setIsEditOpen(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const data = React.useMemo(() => inboundProducts, [inboundProducts]);

  const columns = React.useMemo(() => [
    { Header: 'Product SKU', accessor: 'product_sku' },
    { Header: 'Quantity', accessor: 'quantity' },
    { Header: 'Location', accessor: 'location' },
    { Header: 'Reference', accessor: 'reference' }, 
    { Header: 'Date Received', accessor: 'date_received' }, 
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <Button
          onClick={() => {
            setEditProduct(row.original);
            setIsEditOpen(true);
          }}
          className="p-2 text-n-8"
        >
          Edit
        </Button>
      )
    }
  ], []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <Section className="pt-[10rem] -mt-[4] relative flex items-center justify-center">
      <div className="container mx-auto text-center z-10">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold mb-6">Inbound Management</h1>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-6 mb-10">
          <Button onClick={() => setIsAddOpen(true)} white className="px-6 py-2 bg-green-500 rounded-lg shadow hover:bg-green-600 transition">
            Add Product
          </Button>
        </div>

        {/* React Table */}
        <div className="shadow-lg rounded-lg overflow-x-auto overflow-y-auto bg-white max-h-[500px]">
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

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={background} className="w-full h-full object-cover opacity-30" alt="background" />
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <div>
          <h2 className="text-xl font-semibold mb-7">Add a New Product</h2>
          <form onSubmit={handleAddProduct}>
            <input type="text" name="product_sku" placeholder="Product SKU" className="p-2 w-[85%] border rounded-lg mb-3" required />
            <input type="text" name="location" placeholder="Location" className="p-2 w-[85%] border rounded-lg mb-3" required />
            <input type="number" name="quantity" placeholder="Quantity" className="p-2 w-[85%] border rounded-lg mb-3" required />
            <Button type="submit" className="px-6 py-2 rounded-lg shadow mt-3">Add</Button>
          </form>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <div>
          <h2 className="text-xl font-semibold mb-7">Edit a Product</h2>
          <form onSubmit={handleEditProduct}>
            <input type="text" name="product_sku" defaultValue={editProduct?.product_sku} placeholder="Product SKU" className="p-2 w-[85%] border rounded-lg mb-3" required />
            <input type="text" name="location" defaultValue={editProduct?.location} placeholder="Location" className="p-2 w-[85%] border rounded-lg mb-3" required />
            <input type="number" name="quantity" defaultValue={editProduct?.quantity} placeholder="Quantity" className="p-2 w-[85%] border rounded-lg mb-3" required />
            <Button type="submit" className="px-6 py-2 rounded-lg shadow mt-3">Update</Button>
          </form>
        </div>
      </Modal>
    </Section>
  );
};

export default Inbound;
