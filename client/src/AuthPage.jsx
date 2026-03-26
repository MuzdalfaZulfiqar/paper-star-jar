import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { login } = useAuth();
const handleSubmit = async (e) => {
  e.preventDefault();
  const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
  
  try {
    const res = await fetch(`https://paper-star-jar.onrender.com:${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json(); // This will work now because we fixed the backend to send JSON

    if (res.ok && data.token) {
      login(data.token);
    } else {
      alert(data.msg || "Authentication failed");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Check if your server is running on port 5000");
  }
};

  return (
    <div className="min-h-screen bg-[#dfd3c3] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#f5ead3] p-12 shadow-[30px_30px_0px_#2c1810] border-2 border-[#8d7e6c]"
      >
        <h2 className="font-display text-4xl mb-8 text-[#2c1810] text-center uppercase tracking-tighter">
          {isLogin ? "Access Vault" : "Request Entry"}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-display text-[10px] uppercase opacity-50 tracking-widest">Username</label>
            <input 
              type="text" 
              placeholder="Username"
              className="bg-[#dfd3c3] p-4 font-body border-none outline-none shadow-inner"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-display text-[10px] uppercase opacity-50 tracking-widest">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="bg-[#dfd3c3] p-4 font-body border-none outline-none shadow-inner"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="mt-4 bg-[#5e2e15] text-[#f5ead3] p-5 font-display uppercase tracking-widest hover:bg-black transition-all">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-8 font-body text-xs italic opacity-40 hover:opacity-100"
        >
          {isLogin ? "Don't have an archive yet? Sign up" : "Already established? Sign in"}
        </button>
      </motion.div>
    </div>
  );
}