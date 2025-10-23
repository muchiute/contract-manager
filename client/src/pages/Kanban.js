import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Kanban.css";

// Configuração da API dinâmica
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

const STATUSES = [
  { key: "NEGOTIATION", label: "Negociação" },
  { key: "SIGNING", label: "Assinatura" },
  { key: "ACTIVE", label: "Execução" },
  { key: "COMPLETED", label: "Concluído" },
];

export default function Kanban() {
  const [contracts, setContracts] = useState([]);
  const [newContract, setNewContract] = useState({
    title: "",
    clientName: "",
    value: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Buscar contratos da API
  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const { data } = await api.get("/contracts");
      setContracts(data);
    } catch (error) {
      console.error("Erro ao carregar contratos:", error);
      setErrorMessage("Falha ao carregar contratos. Verifique a conexão com o servidor.");
    }
  };

  const handleCreateContract = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!newContract.title || !newContract.clientName) {
      setErrorMessage("Título e Cliente são obrigatórios!");
      return;
    }

    try {
      setLoading(true);
      await api.post("/contracts", newContract);
      setNewContract({ title: "", clientName: "", value: "", description: "" });
      fetchContracts(); // Atualiza o quadro
    } catch (error) {
      console.error("Erro ao criar contrato:", error);
      setErrorMessage("Erro ao criar contrato. Verifique o backend e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("contractId", id);
  };

  const handleDrop = async (e, newStatus) => {
    const contractId = e.dataTransfer.getData("contractId");
    try {
      await api.patch(`/contracts/${contractId}`, { status: newStatus });
      fetchContracts();
    } catch (error) {
      console.error("Erro ao mover contrato:", error);
      setErrorMessage("Erro ao atualizar o status do contrato.");
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="kanban-container">
      <h2>Gestão de Contratos</h2>

      {/* Mensagem de erro */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Formulário de criação */}
      <form className="kanban-form" onSubmit={handleCreateContract}>
        <input
          type="text"
          placeholder="Título"
          value={newContract.title}
          onChange={(e) => setNewContract({ ...newContract, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Cliente"
          value={newContract.clientName}
          onChange={(e) => setNewContract({ ...newContract, clientName: e.target.value })}
        />
        <input
          type="number"
          placeholder="Valor"
          value={newContract.value}
          onChange={(e) => setNewContract({ ...newContract, value: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descrição"
          value={newContract.description}
          onChange={(e) => setNewContract({ ...newContract, description: e.target.value })}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar"}
        </button>
      </form>

      {/* Quadro Kanban */}
      <div className="kanban-board">
        {STATUSES.map((status) => (
          <div
            key={status.key}
            className="kanban-column"
            onDrop={(e) => handleDrop(e, status.key)}
            onDragOver={handleDragOver}
          >
            <h3>{status.label}</h3>
            <div className="kanban-cards">
              {contracts
                .filter((c) => c.status === status.key)
                .map((contract) => (
                  <div
                    key={contract.id}
                    className="kanban-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, contract.id)}
                  >
                    <h4>{contract.title}</h4>
                    <p><b>Cliente:</b> {contract.clientName}</p>
                    {contract.value && <p><b>Valor:</b> R$ {Number(contract.value).toLocaleString()}</p>}
                    {contract.description && <p>{contract.description}</p>}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
