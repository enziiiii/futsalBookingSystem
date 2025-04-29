// Handles adding and editing users, with role fixed for new users.

import React from 'react'
import { useForm } from 'react-hook-form';

const UserFormModal = ({ user, role, onSave, onClose }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: user || { role },
    });

    const isNew = !user;
    console.log('From UserFormMoal, isNew:', isNew, 'user:', user);

    const handleFormSubmit = (data) => {
        onSave(data);  // Passes form data to handleSaveUser
        onClose();
    } ;


  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded shadow p-4">
                <h2 className="text-2xl mb-1">{isNew ? `Add New ${role === 'customer' ? 'Customer' : 'Staff'}` : 'Edit User'}</h2>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-gray-700" >Username</label>
                        <input 
                            type="text"
                            id="username"
                            {...register('username', {required: 'Username is required' })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                        {errors.username && <span className="text-red-500">{errors.username.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="fullName" className="block text-gray-700" >Full Name</label>
                        <input 
                            type="text"
                            id="fullName"
                            {...register('fullName', {required: 'Full Name is required' })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                        {errors.fullName && <span className="text-red-500">{errors.fullName.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700" >Email</label>
                        <input 
                            type="email"
                            id="email"
                            {...register('email', {required: 'Email is required' })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-gray-700" >Role</label>
                        <select 
                            id="role"
                            {...register('role', {required: 'Role is required' })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            disabled={isNew}
                        >
                            <option value="customer">Customer</option>
                            <option value="staff">Staff</option>
                        </select>
                        {errors.username && <span className="text-red-500">{errors.username.message}</span>}
                    </div>
                    {/* {isNew && (    // Add password for new users
                        <div>
                            {console.log('Rendering password field for new user')}
                            <label htmlFor="password" className="block text-gray-700">Password</label>
                            <input 
                                type="password"
                                id="password"
                                {...register('password', { required: 'Passwor is required' })}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                            {errors.passwordHash && <span className="text-gray-500">{errors.passwordHash.message}</span>}
                        </div>
                    )}
                    {!isNew && (
                        <div>
                            <label htmlFor="password" className="block text-gray-700">Password</label>
                            <input 
                                type="password"
                                id="password"
                                {...register('password')}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                            <small className="text-gray-500">Leave blank to keep the current password.</small>
                        </div>
                    )} */}
                    <div>
                        <label htmlFor="phoneNumber" className="block text-gray-700" >Phone Number</label>
                        <input 
                            type="Number"
                            id="phoneNumber"
                            {...register('phoneNumber', {required: 'Phone Number is required' })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                        {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber.message}</span>}
                    </div>
                    <div className="flex justify-end">
                        <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={onClose}>Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default UserFormModal