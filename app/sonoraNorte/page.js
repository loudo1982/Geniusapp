"use client"


import React, { useState, useEffect } from 'react';
import datosSonora from './json/csn';

const Tarjetas = () => {
  const [datos, setDatos] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    // Seteamos los datos obtenidos de datosSonora
    setDatos(datosSonora);
  }, []); // Solo se ejecuta una vez al montar el componente

  const filtrarDatos = () => {
    return datos.filter(tarjeta =>
      tarjeta.Nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      tarjeta.Apellido1.toLowerCase().includes(filtro.toLowerCase()) ||
      tarjeta.Apellido2.toLowerCase().includes(filtro.toLowerCase()) ||
      
     
      tarjeta.Matricula.toLowerCase().includes(filtro.toLowerCase()) ||
      tarjeta['mail tutor'].toLowerCase().includes(filtro.toLowerCase()) ||
      tarjeta.celtutor.toString().includes(filtro)
    );
  };

  return (
    <div className='mt-8'>
      <h1 className='text-2xl font-bold mb-4 text-black'>Tarjetas</h1>
      <input
        type="text"
        placeholder="Buscar por nombre, apellido, matrícula, correo o teléfono"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="mt-4 p-2 rounded-md border border-gray-300"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtrarDatos().map((tarjeta, index) => (
          <div key={index} className="bg-white p-4 rounded-md shadow-md text-black">
            <h2 className="text-xl font-bold mb-2">{tarjeta.Nombre} {tarjeta.Apellido1} {tarjeta.Apellido2}</h2>
            <p>Matrícula: {tarjeta.Matricula}</p>
            <p>Clave: {tarjeta.clave}</p>
            <p>Tutor: {tarjeta['nombre tutor']} {tarjeta['apellido tutor']} {tarjeta['apellido tutor 2']}</p>
            <p>
              <a href={`mailto:${tarjeta['mail tutor']}`} className="text-blue-500 hover:underline">
                Email: {tarjeta['mail tutor']}
              </a>
            </p>
            <p>
              <a href={`https://wa.me/${tarjeta.celtutor}`} className="text-green-500 hover:underline">
                Teléfono Tutor: {tarjeta.celtutor}
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tarjetas;
