// frontend/src/pages/Clientes.tsx
import React, { useEffect, useState } from "react";
import { getJSON } from "../services/config";

type Pedido = {
  id: string;
  fecha: string;
  total: number;
  estado: string;
};

type Cliente = {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  pedidos?: Pedido[];
};

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const controller = new AbortController();
        const data = await getJSON<Cliente[]>("/clientes", { signal: controller.signal });
        setClientes(data);
      } catch (err: any) {
        setError(err.message || "Error cargando clientes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Cargando clientes...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        Error: {error}
      </div>
    );

  return (
    <section className="page container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Clientes Registrados
      </h1>

      {clientes.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay clientes registrados aún.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Correo</th>
                <th className="py-3 px-4 text-left">Teléfono</th>
                <th className="py-3 px-4 text-left">Pedidos</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{c.nombre}</td>
                  <td className="py-3 px-4">{c.email}</td>
                  <td className="py-3 px-4">{c.telefono || "—"}</td>
                  <td className="py-3 px-4">
                    {c.pedidos && c.pedidos.length > 0 ? (
                      <details>
                        <summary className="cursor-pointer text-blue-600">
                          {c.pedidos.length} pedidos
                        </summary>
                        <ul className="ml-4 mt-2 text-sm text-gray-700 list-disc">
                          {c.pedidos.map((p) => (
                            <li key={p.id}>
                              <span className="font-medium">#{p.id}</span> — {p.fecha} —{" "}
                              <span className="text-green-600 font-semibold">
                                ${p.total.toLocaleString()}
                              </span>{" "}
                              ({p.estado})
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <span className="text-gray-400">Sin pedidos</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
