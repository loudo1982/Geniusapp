// pages/inscritos.js
"use client"

import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react';
import { db } from "@/firebase/initFirebase";
import { collection, getDocs,where,query } from "firebase/firestore";

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
    <div className='m-64'>
      <h1>Inscritos Page</h1>
      <p>Nombre del taller: {searchParams.get("taller")}</p>
      <div>
        {registros && (
          <div>
            {registros.map((registro) => (
              <div key={registro.data.email}>
                <p>{registro.data.displayname}</p>
                <p>{registro.data.email}</p>
                <p>{registro.data.nombre}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InscritosPage;