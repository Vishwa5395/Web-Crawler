import React, { useState } from 'react';

export default function Signup({ onSwitchPage, darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const inputClass = darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300";
  const cardClass = darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200";

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`${cardClass} p-8 rounded-xl shadow-xl w-full max-w-md`}>
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up for WebCrawler</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          alert("Signup successful (dummy)");
          onSwitchPage("dashboard");
        }} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-3 rounded-lg border ${inputClass}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-3 rounded-lg border ${inputClass}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg">Sign Up</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <button onClick={() => onSwitchPage("login")} className="text-indigo-500 hover:underline">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
