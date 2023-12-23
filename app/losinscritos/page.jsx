// pages/inscritos.js
"use client"

import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react';
import { db } from "@/firebase/initFirebase";
import { collection, getDocs,where,query } from "firebase/firestore";
import Image from 'next/image';

const InscritosPage = () => {
  const searchParams = useSearchParams();
  console.log(searchParams.get("taller"));

  const [registros, setRegistros] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const registrostalleres = async () => {
    const talleresArray = [];
    const talleresinscritos = await getDocs(query(collection(db, "inscritos")));
    talleresinscritos.forEach((doc) => {
      talleresArray.push({
        id: doc.id,
        data: doc.data()
      });
    });
    return talleresArray;
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await registrostalleres();
      setRegistros(data);
      console.log('los datasson',data)
    };
    fetchData();

  }, []);
  const handleBusqueda = (event) => {
    setBusqueda(event.target.value);
  };

  const filtrarRegistros = (registros) => {
    return registros.filter((registro) => {
      return (
        registro.data.email.toLowerCase().includes(busqueda.toLowerCase()) ||
        registro.data.usuario.toLowerCase().includes(busqueda.toLowerCase())
      );
    });
  };
  return (
    <div className='m-4 sm:m-8 md:m-16'>
    <h1 className="text-2xl font-bold mb-4">Inscritos Page</h1>
    <p className="mb-2">Nombre del taller: {searchParams.get("taller")}</p>
    <div className="mb-4">
      <input
        type="text"
        placeholder="Buscar por email o displayname"
        className="px-4 py-2 border border-gray-400 rounded-lg w-full"
        value={busqueda}
        onChange={handleBusqueda}
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg w-full"
        onClick={() => setRegistros(filtrarRegistros(registros))}
      >
        Buscar
      </button>
    </div>
    <div className="overflow-x-auto">
      {registros && (
        <div className="sm:overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-400 w-full sm:w-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-400">#</th>
                <th className="px-4 py-2 border border-gray-400"></th>
                <th className="px-4 py-2 border border-gray-400">Nombre</th>
                <th className="px-4 py-2 border border-gray-400">Correo electrónico</th>
                <th className="px-4 py-2 border border-gray-400">Nombre del taller</th>
              </tr>
            </thead>
            <tbody>
              {filtrarRegistros(registros).map((registro, index) => (
                <tr key={registro.id}>
                  <td className="px-4 py-2 border border-gray-400">{index + 1}</td>
                  <td className="p-1"><Image className='overflow-hidden rounded-full' src={registro.data.avatar} alt="image" width={30} height={30}  /></td>
                  <td className="px-4 py-2 border border-gray-400">{registro.data.usuario}</td>
                  <td className="px-4 py-2 border border-gray-400">{registro.data.email}</td>
                  <td className="px-4 py-2 border border-gray-400">{registro.data.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
  
  );
};

export default InscritosPage;