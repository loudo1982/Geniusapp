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
  

  const registrostalleres = async () => {
    const talleresArray = [];
    const talleresinscritos = await getDocs(query(collection(db, "inscritos"), where("nombre", "==", searchParams.get("taller"))));
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

  return (
    <div className='m-8 sm:m-16 md:m-32'>
    <h1 className="text-2xl font-bold mb-4">Inscritos Page</h1>
    <p className="mb-2">Nombre del taller: {searchParams.get("taller")}</p>
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
              </tr>
            </thead>
            <tbody>
              {registros.map((registro, index) => (
                <tr key={registro.id}>
                  <td className="px-4 py-2 border border-gray-400">{index + 1}</td>
                  <td className="px-4 py-2 border border-gray-400 "><Image className='overflow-hidden rounded-full' src={registro.data.avatar} alt="image" width={30} height={30}  /></td>
                  <td className="px-4 py-2 border border-gray-400">{registro.data.usuario}</td>
                 
                  <td className="px-4 py-2 border border-gray-400">{registro.data.email}</td>
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