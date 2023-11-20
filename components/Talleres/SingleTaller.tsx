import { Taller } from "@/types/blog";
import { useState, useEffect } from 'react';
import { db } from "@/firebase/initFirebase";

import { addDoc, collection, getDocs, query, where } from '@firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';

const SingleTaller = ({ taller }: { taller: Taller }) => {
  const { image, descripcion, displayName, email, nombre, fotocreador } = taller;

  const [inscrito, setInscrito] = useState(false);
  const [otroTallerInscrito, setOtroTallerInscrito] = useState(false);
  const [desaparecer, setDesaparecer] = useState(false);

  useEffect(() => {
    const checkInscripcion = async () => {
      try {
        const inscritosCollection = collection(db, 'inscritos');

        // Verifica si el usuario está inscrito en este taller
        const q = query(
          inscritosCollection,
          where('displayName', '==', displayName),
          where('nombre', '==', nombre)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setInscrito(true);
          setOtroTallerInscrito(false);
        } else {
          // Si no está inscrito en este taller, verifica si está inscrito en otro taller
          const otroTallerQ = query(inscritosCollection, where('displayName', '==', displayName));
          const otroTallerQuerySnapshot = await getDocs(otroTallerQ);

          if (!otroTallerQuerySnapshot.empty) {
            setOtroTallerInscrito(true);
            setInscrito(false);
          } else {
            // Si no está inscrito en ningún taller, establece el estado para mostrar el botón
            setInscrito(false);
            setOtroTallerInscrito(false);
          }
        }
      } catch (error) {
        console.error('Error al verificar inscripción:', error);
      }
    };

    // Llama a la función de verificación al cargar el componente
    checkInscripcion();
  }, [displayName, nombre]);

  const handleInscripcionClick = async () => {
    try {
      const inscritosCollection = collection(db, 'inscritos');
      if (!inscrito && !otroTallerInscrito) {
        await addDoc(inscritosCollection, {
          displayName,
          nombre,
          email,
        });

        // Actualiza el estado para indicar que el usuario está inscrito en este taller
        setInscrito(true);
        setOtroTallerInscrito(false);
        setDesaparecer(true)
        window.location.reload();
       

        alert('¡Te has inscrito correctamente!');
        console.log('inscrito:', displayName, email, nombre, fotocreador);
      }
    } catch (error) {
      console.error('Error al inscribirse:', error);
    }
  };

  return (
    <>
      <div className="wow fadeInUp relative overflow-hidden rounded-md bg-white shadow-one dark:bg-dark">
        <button
          className={`relative block h-[220px] w-full ${inscrito || otroTallerInscrito || desaparecer ? 'cursor-not-allowed' : ''}`}
        >
          <span
            onClick={async () => {
              await handleInscripcionClick();
              // Después de hacer clic en "Me inscribo", actualiza el estado para que los demás botones se deshabiliten
              setInscrito(true);
              setOtroTallerInscrito(false);
            }}
            className={`absolute top-6 right-6 z-20 inline-flex items-center justify-center rounded-full bg-primary py-2 px-4 text-sm font-semibold capitalize text-white ${
              inscrito ? 'bg-gray-500' : ''
            }`}
          > 
            {inscrito
              ? 'Inscrito'
              : otroTallerInscrito
              ? 'Inscrito en otros talleres'
              : '¡Me inscribo!'}
          </span>
          <Image src={image} alt="image" fill />
        </button>
        <div className="p-6 sm:p-8 md:py-8 md:px-6 lg:p-8 xl:py-8 xl:px-5 2xl:p-8">
          <h3>
            <Link
              href="/"
              className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
            >
              {nombre}
            </Link>
          </h3>
          <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
            {descripcion}
          </p>
          <div className="flex items-center">
            <div className="mr-5 flex items-center border-r border-body-color border-opacity-10 pr-5 dark:border-white dark:border-opacity-10 xl:mr-3 xl:pr-3 2xl:mr-5 2xl:pr-5">
              <div className="mr-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src={fotocreador} alt="author" fill />
                </div>
              </div>
              <div className="w-full">
                <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">By {displayName}</h4>
                <p className="text-xs text-body-color">{email}</p>
              </div>
            </div>
            <div className="inline-block">
              <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">Date</h4>
              <p className="text-xs text-body-color">fecha publicacion</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleTaller;
