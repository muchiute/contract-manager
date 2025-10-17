import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard(){
  return (
    <div>
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">Contratos ativos: —</div>
        <div className="p-4 bg-white rounded shadow">Contratos vencidos: —</div>
        <div className="p-4 bg-white rounded shadow">Valor total: —</div>
      </div>
      <div className="mt-6">
        <Link to="/kanban" className="px-4 py-2 bg-green-600 text-white rounded">Ver Kanban</Link>
      </div>
    </div>
  );
}
