"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Reset specific field error when user modifies the input
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }

    // Reset general error
    if (generalError) {
      setGeneralError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null); // Reset error sebelum permintaan baru

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/register`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: true,
        }
      );

      // Jika berhasil, arahkan ke halaman login
      router.push('/auth/login');
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors || {});
        setGeneralError(error.response.data.message || 'Terjadi kesalahan yang tidak terduga.');
      } else {
        setGeneralError('Terjadi kesalahan yang tidak terduga.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      {generalError && <p className="text-red-500 text-sm mb-4 text-center">{generalError}</p>}
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className={`text-black w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={`text-black w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className={`text-black w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
            required
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Password Confirmation Field */}
        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="password_confirmation">Confirm Password</label>
          <input
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            className={`text-black w-full p-2 border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} rounded`}
            required
          />
          {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
