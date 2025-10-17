import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const initialColumns = {
  'col1': { id: 'NEGOTIATION', title: 'Negociação', items: [{id:'c1', content:'Contrato A'},{id:'c2', content:'Contrato B'}]},
  'col2': { id: 'SIGNING', title: 'Assinatura', items: []},
  'col3': { id: 'ACTIVE', title: 'Execução', items: []},
  'col4': { id: 'COMPLETED', title: 'Concluído', items: []},
};

export default function Kanban() {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // Copiar colunas
    const newColumns = { ...columns };
    const sourceCol = newColumns[source.droppableId];
    const destCol = newColumns[destination.droppableId];

    // Remover item da coluna de origem
    const [movedItem] = sourceCol.items.splice(source.index, 1);
    // Adicionar item na coluna de destino
    destCol.items.splice(destination.index, 0, movedItem);

    setColumns(newColumns);

    // Aqui você pode fazer a chamada à API para salvar no backend
    // axios.post(`${process.env.REACT_APP_API_URL}/contracts/${draggableId}/status`, {
    //   status: destCol.id
    // });
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Quadro Kanban</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          {Object.entries(columns).map(([key, col]) => (
            <div key={key} className="w-1/4 bg-gray-50 p-2 rounded">
              <h3 className="font-bold mb-2">{col.title}</h3>
              <Droppable droppableId={key}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: 200 }}>
                    {col.items.map((item, index) => (
                      <Draggable draggableId={item.id} index={index} key={item.id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-3 mb-2 bg-white rounded shadow"
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
