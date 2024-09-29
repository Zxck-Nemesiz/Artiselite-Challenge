import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Section from './Section';
import Modal from './Modal';
import Button from './Button';
import { useTable } from 'react-table';
import background from "../images/6195005.jpg";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'operator' });

    // Fetch users from backend
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Add new user
    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/users', newUser);
            fetchUsers();
            setIsAddOpen(false);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    // Update user role
    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/users/${editUser.id}`, { role: editUser.role });
            fetchUsers();
            setIsEditOpen(false);
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    // Delete user
    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // React Table setup
    const data = React.useMemo(() => users, [users]);

    const columns = React.useMemo(() => [
        { Header: 'Username', accessor: 'username' },
        { Header: 'Role', accessor: 'role' },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <>
                    <Button
                        onClick={() => {
                            setEditUser(row.original);
                            setIsEditOpen(true);
                        }}
                        className="px-4 py-2 rounded-lg shadow transition text-n-8"
                    >
                        Edit Role
                    </Button>
                    <Button
                        onClick={() => handleDeleteUser(row.original.id)}
                        className="ml-2 px-4 py-2 rounded-lg shadow transition text-n-8"
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    return (
        <Section className="pt-[10rem] -mt-[4] relative flex items-center justify-center">
            <div className="container mx-auto text-center z-10">
                <div className="mb-12">
                    <h1 className="text-4xl font-semibold mb-6">User Management</h1>
                </div>

                <div className="flex justify-center space-x-6 mb-10">
                    <Button onClick={() => setIsAddOpen(true)} white className="px-6 py-2 bg-green-500 rounded-lg shadow hover:bg-green-600 transition">
                        Add User
                    </Button>
                </div>

                {/* React Table */}
                <div className="shadow-lg rounded-lg overflow-hidden bg-white">
                    <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 border border-gray-300">
                        <thead className="bg-gray-100">
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps()}
                                            className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider"
                                        >
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
                                    <tr key={row.id} {...row.getRowProps()} className="hover:bg-gray-50"> {/* Key prop passed here */}
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

            {/* Add User Modal */}
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
                <div>
                    <h2 className="text-xl font-semibold mb-3">Add a New User</h2>
                    <form onSubmit={handleAddUser}>
                        <input
                            type="text"
                            placeholder="Username"
                            className="p-2 w-full border rounded-lg mb-3"
                            required
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="p-2 w-full border rounded-lg mb-3"
                            required
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                        <select
                            className="p-2 w-full border rounded-lg mb-3"
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="operator">Operator</option>
                            <option value="warehouse_manager">Warehouse Manager</option>
                        </select>
                        <Button type="submit" className="px-6 py-2 bg-green-500 text-white rounded-lg shadow">
                            Add
                        </Button>
                    </form>
                </div>
            </Modal>

            {/* Edit User Role Modal */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
                <div>
                    <h2 className="text-xl font-semibold mb-3">Edit User Role</h2>
                    <form onSubmit={handleEditUser}>
                        <select
                            className="p-2 w-full border rounded-lg mb-3"
                            value={editUser?.role}
                            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                        >
                            <option value="operator">Operator</option>
                            <option value="warehouse_manager">Warehouse Manager</option>
                        </select>
                        <Button type="submit" className="px-6 py-2 bg-yellow-500 text-white rounded-lg shadow">
                            Update
                        </Button>
                    </form>
                </div>
            </Modal>
        </Section>
    );
};

export default UserManagement;
