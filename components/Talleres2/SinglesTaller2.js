
// pagina moficicada

import { Taller } from "@/types/blog";
import { useState, useEffect } from 'react';
import { db } from "@/firebase/initFirebase";
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { addDoc, collection, getDocs, query, where,doc, updateDoc,getDoc  } from "firebase/firestore"; 
import Image from 'next/image';
import Link from 'next/link'
import UserInfo from "../userInfo";

const SingleTaller2 = ({ taller,onTallerClick ,usuario }) => {
  const { image, descripcion, displayName, email, nombre, fotocreador,cupoMaximo,cuporestante,requisito } = taller;
  

  const [inscrito, setInscrito] = useState(false);
  const [deshabilitarboton, setDeshabilitarBoton] = useState(false);
  const [deshabilitarbotonlosdemas, setDeshabilitarBotonlosdemas] = useState(false);

  
  const router = useRouter()
  const handleClick = () => {
    // Call the onTallerClick callback with the taller's name
    onTallerClick(taller.nombre);
  };

  
  useEffect(() => {


    const checkInscripcion = async () => {
      try {
        const inscritosCollection = collection(db, 'inscritos');

        // Verifica si el usuario está inscrito en este taller
        const q = query(
          inscritosCollection,
          where('usuario', '==', usuario.displayName),// no cambiar 'usuario'
          where('nombre', '==', nombre)
        );

        
        const querySnapshot = await getDocs(q);
        console.log('voir erreur 1',querySnapshot)

     
       

        if (!querySnapshot.empty) {
          setInscrito(true);
          setDeshabilitarBoton(true)

 
      
  
         
        } else {
          // Si no está inscrito en este taller, verifica si está inscrito en otro taller
          const otroTallerQ = query(inscritosCollection, where('usuario', '==', usuario.displayName));
          const otroTallerQuerySnapshot = await getDocs(otroTallerQ);
         

          if (!otroTallerQuerySnapshot.empty) {
            
         
            setInscrito(true);
        
            setDeshabilitarBotonlosdemas(true)
    
         
          } else {
            // Si no está inscrito en ningún taller, establece el estado para mostrar el botón
            
          
         
            
          }
        }
      } catch (error) {
        console.error('Error al verificar inscripción:', error);
      }
    };

    // Llama a la función de verificación al cargar el componente
    checkInscripcion();
  }, [usuario, nombre,inscrito,]);

  const handleInscripcionClick = async () => {
    try {
        const inscritosCollection = collection(db, 'inscritos');
        console.log('recherche de donnee', usuario.displayName,nombre,usuario.email,usuario.photoURL)
     
        addDoc(inscritosCollection, {
            usuario:usuario.displayName,
            nombre,
            email:usuario.email,
            avatar:usuario.photoURL
          });

       
              
            } catch (error) {
              console.log('l erreur est',error)}
            
           


            
     // window.location.reload();
      
     
   
  };

  return (
    <>
     {!inscrito && (  <div className="wow fadeInUp relative overflow-hidden rounded-md bg-white shadow-one dark:bg-dark" >
     <div
  className={`relative block h-[220px] w-full $}`}

>

<span
  onClick={async () => {
    if (!deshabilitarboton && cuporestante !== 0) {
      await handleInscripcionClick();
    }
  }}
  className={`absolute top-6 right-6 z-20 inline-flex items-center justify-center rounded-full ${
    deshabilitarboton || cuporestante < 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary cursor-pointer'
  } py-2 px-4 text-sm font-semibold capitalize text-white`}
>
  {deshabilitarboton || cuporestante < 1 ? '' : 'Me inscribo'}
</span>
  <span
   className={`absolute top-6 ml-2 z-20 inline-flex items-center justify-center rounded-full bg-dark  py-2 px-4 text-sm font-semibold capitalize text-white 
   `}
>
  {cuporestante < 1 ? 'Taller cerrado' :'Taller abierto' }
</span>
  <Image src={image} alt="image" fill />
</div>
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
          <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
           Material requerido: {requisito}
          </p>
          
          <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
          El taller tiene un cupo de {cupoMaximo} estudiantes y quedan  {cuporestante} lugares.
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
              <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">Inscritos</h4>
              <button className="text-xs text-body-color" onClick={handleClick}>Ver a los inscritos</button>
            </div>
          </div>
         
        </div>
      </div>)}

      {inscrito && (  <div className="wow fadeInUp relative overflow-hidden rounded-md bg-white shadow-one dark:bg-dark" >
     <div
  className={`relative block h-[220px] w-full $}`}
  

>

<span
  className={`absolute top-6 right-6 z-20 inline-flex items-center justify-center rounded-full bg-primary   ${
    deshabilitarboton || deshabilitarbotonlosdemas ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary cursor-pointer'
  } py-2 px-4 text-sm font-semibold capitalize text-white`}
>


  {deshabilitarboton ? 'Inscrito' : (deshabilitarbotonlosdemas ? 'Inscrito en otro taller' : '')}
</span>


  <span
   className={`absolute top-6 ml-2 z-20 inline-flex items-center justify-center rounded-full bg-dark  py-2 px-4 text-sm font-semibold capitalize text-white 
   `}
>
  {cuporestante < 1 ? 'Taller cerrado' :'Taller abierto' }
</span>

  <Image src={image} alt="image" fill />
</div>
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
          <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
            {requisito}
          </p>
          <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
            {requisito}
          </p>
          <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
          El taller tiene un cupo de {cupoMaximo} estudiantes y quedan  {cuporestante} lugares.
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
              <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">Inscritos</h4>
              <button className="text-xs text-body-color" onClick={handleClick}>Ver a los inscritos</button>
            </div>
          </div>
         
        </div>
      </div>)}
    </>
  );
};

export default SingleTaller2;