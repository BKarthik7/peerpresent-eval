
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { AdminLoginForm } from '@/components/forms/AdminLoginForm';

const AdminLogin = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8 text-gradient">Admin Access</h1>
        <AdminLoginForm />
      </main>
    </div>
  );
};

export default AdminLogin;
