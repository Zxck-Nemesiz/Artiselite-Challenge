import React, { useState, useEffect } from 'react';
import Section from "./Section";
import { useTable } from 'react-table';
import Button from "./Button";
import Modal from "./Modal";
import axios from 'axios';
import background from "../images/6195005.jpg";

const Inventory = () => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [selectedEditProductId, setSelectedEditProductId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch products from backend
    const fetchProducts = async (query = "") => {
        try {
            const response = await axios.get('http://localhost:8080/api/inventory', {
                params: { search: query },
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Add new product
    const handleAddProduct = async (e) => {
        e.preventDefault();
        const newProduct = {
            product_name: e.target.name.value,
            quantity: e.target.quantity.value,
            category: e.target.category.value,
            supplier: e.target.supplier.value,
        };

        try {
            await axios.post('http://localhost:8080/api/inventory', newProduct);
            fetchProducts(); // Refresh product list
            setIsAddOpen(false); // Close modal
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };


    // Edit product
    const handleEditProduct = async (e) => {
        e.preventDefault();
        const updatedProduct = {
            product_name: e.target.name.value,
            quantity: e.target.quantity.value,
            category: e.target.category.value,
            supplier: e.target.supplier.value,
        };

        try {
            await axios.put(`http://localhost:8080/api/inventory/${editProduct.id}`, updatedProduct);
            fetchProducts(); // Refresh product list
            setEditProduct(null);
            setIsEditOpen(false); // Close modal
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    // Select a product to edit from dropdown
    const handleSelectEditProduct = (e) => {
        const selectedProductId = e.target.value;
        const product = products.find((p) => p.id === parseInt(selectedProductId));
        setSelectedEditProductId(selectedProductId);
        setEditProduct(product);
    };

    // Search products
    const handleSearchProduct = async (e) => {
        e.preventDefault();
        fetchProducts(searchTerm); // Update product list based on search
        setIsSearchOpen(false); // Close modal after searching
    };

    // Reset product list
    const handleResetSearch = () => {
        setSearchTerm(""); // Clear search input
        fetchProducts(); // Fetch all products again
    };

    const data = React.useMemo(() => products, [products]);

    const columns = React.useMemo(() => [
        { Header: 'Product Name', accessor: 'name' },
        { Header: 'Quantity', accessor: 'quantity' },
        { Header: 'Tags', accessor: 'tags' },
    ], []);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return (
        <Section className="pt-[10rem] -mt-[4] relative flex items-center justify-center">
            <div className="container mx-auto text-center z-10">
                <div className="mb-12">
                    <h1 className="text-4xl font-semibold mb-6">Inventory Management</h1>
                </div>

                {/* Buttons */}
                <div className="flex justify-center space-x-6 mb-10">
                    <Button onClick={() => setIsAddOpen(true)} white className="px-6 py-2 bg-green-500 rounded-lg shadow hover:bg-green-600 transition">
                        Add Product
                    </Button>
                    <Button onClick={() => setIsEditOpen(true)} white className="px-6 py-2 bg-yellow-500 rounded-lg shadow hover:bg-yellow-600 transition">
                        Edit Product
                    </Button>
                    <Button onClick={() => setIsSearchOpen(true)} white className="px-6 py-2 bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition">
                        Search Product
                    </Button>
                </div>

                {/* React Table */}
                <div className="shadow-lg rounded-lg overflow-hidden bg-white">
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

            {/* Add and Edit Product Modal */}
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
                <div>
                    <h2 className="text-xl font-semibold mb-3">Add a New Product</h2>
                    <form onSubmit={handleAddProduct}>
                        <input type="text" name="name" placeholder="Product Name" className="p-2 w-full border rounded-lg mb-3" required />
                        <input type="number" name="quantity" placeholder="Quantity" className="p-2 w-full border rounded-lg mb-3" required />
                        <input type="text" name="category" placeholder="Category" className="p-2 w-full border rounded-lg mb-3" />
                        <input type="text" name="supplier" placeholder="Supplier" className="p-2 w-full border rounded-lg mb-3" />
                        <Button type="submit" className="px-6 py-2 rounded-lg shadow">Add</Button>
                    </form>
                </div>
            </Modal>

            {/* Edit Product Modal */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
                <div>
                    <h2 className="text-xl font-semibold mb-3">Edit a Product</h2>
                    <form onSubmit={handleEditProduct}>
                        {/* Dropdown to select a product */}
                        <select onChange={handleSelectEditProduct} className="p-2 w-full border rounded-lg mb-3" value={selectedEditProductId || ''}>
                            <option value="">Select a product to edit</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                        {editProduct && (
                            <>
                                <input type="text" name="name" defaultValue={editProduct.product_name} placeholder="Product Name" className="p-2 w-full border rounded-lg mb-3" required />
                                <input type="number" name="quantity" defaultValue={editProduct.quantity} placeholder="Quantity" className="p-2 w-full border rounded-lg mb-3" required />
                                <input type="text" name="category" defaultValue={editProduct.category} placeholder="Category" className="p-2 w-full border rounded-lg mb-3" />
                                <input type="text" name="supplier" defaultValue={editProduct.supplier} placeholder="Supplier" className="p-2 w-full border rounded-lg mb-3" />
                            </>
                        )}
                        <Button type="submit" className="px-6 py-2 rounded-lg shadow">Update</Button>
                    </form>
                </div>
            </Modal>


            {/* Search Product Modal */}
            <Modal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)}>
                <div>
                    <h2 className="text-xl font-semibold mb-3">Search for a Product</h2>
                    <form onSubmit={handleSearchProduct}>
                        <input
                            type="text"
                            placeholder="Search by name, category, or supplier"
                            className="p-2 w-full border rounded-lg mb-3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button type="submit" className="px-6 py-2 rounded-lg shadow">Search</Button>
                        <Button onClick={handleResetSearch} className="px-6 py-2 mt-3 ml-5 rounded-lg">Reset</Button>
                    </form>
                </div>
            </Modal>

        </Section>
    );
};

export default Inventory;
