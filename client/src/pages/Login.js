import React, { useState } from "react";
import axios from "axios";

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  async function submit(e){
    e.preventDefault();
    try{
      const res = await axios.post((process.env.REACT_APP_API_URL||'http://localhost:5000') + "/auth/login", { email, password });
      alert('Login success (token returned) — integrate storage yourself');
      console.log(res.data);
    }catch(err){
      alert('Login failed');
    }
  }
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={submit}>
        <input className="w-full p-2 border mb-2" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border mb-2" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
      </form>
    </div>
  );
}
