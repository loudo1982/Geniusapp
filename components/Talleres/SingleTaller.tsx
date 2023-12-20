import { Taller } from "@/types/blog";
import { useState, useEffect } from 'react';
import { db } from "@/firebase/initFirebase";
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { addDoc, collection, getDocs, query, where,doc, updateDoc,getDoc  } from '@firebase/firestore';
import Image from 'next/image';
import Link from 'next/link'
import UserInfo from "../userInfo";

const SingleTaller = ({ taller,onTallerClick ,usuario }) => {
  const { image, descripcion, displayName, email, nombre, fotocreador,cupoMaximo,cuporestante } = taller;
  
console.log('el taller es',taller)
  const [inscrito, setInscrito] = useState(false);
  const [deshabilitarboton, setDeshabilitarBoton] = useState(false);
  const [deshabilitarbotonlosdemas, setDeshabilitarBotonlosdemas] = useState(false);

  
  const router = useRouter()
  const handleClick = () => {
    // Call the onTallerClick callback with the taller's name
    onTallerClick(taller.nombre);
  };

  const restarcupo = async () => {
    try {
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("nombre", "==", taller.nombre));
      const querySnapshot = await getDocs(q);
  
      let docID = "";
      querySnapshot.forEach((doc) => {
        docID = doc.id;
      });
  
      const productRef = doc(db, "products", docID);
  
      // Obtén la información actual del documento
      const productSnapshot = await getDoc(productRef);
      const currentCuporestante = productSnapshot.data().cuporestante;
  
      // Resta 1 al valor actual de cuporestante
      const newCuporestante = currentCuporestante - 1;
  
      // Actualiza el documento en la base de datos
      await updateDoc(productRef, { cuporestante: newCuporestante });
  
      console.log('Cupo restado correctamente');
    } catch (error) {
      console.error('Error al restar cupo:', error);
    }
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
     
      

        //window.location.reload();
       

        Swal.fire({
          title: "¿Seguro quieres inscribirte en este taller?",
          text: "Una vez inscrito , no podrás cambiar!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "¡Sí, seguro!"
        }).then((result) => {
          if (result.isConfirmed) {
            const inscritosCollection = collection(db, 'inscritos');
            restarcupo()
            if (!inscrito ) {
             addDoc(inscritosCollection, {
                usuario:usuario.displayName,
                nombre,
                email:usuario.email,
                avatar:usuario.photoURL
              });
      
              // Actualiza el estado para indicar que el usuario está inscrito en este taller
             
    
         
          
             
            } 


            
            Swal.fire({
              title: "FELICIDADES!",
              text: "estas inscrito.",
              icon: "success"
              
            });window.location.reload();
          }else if (result.isDismissed) {
            // Hacer algo si se da clic en "Cancelar"
            return; // para no ejecutar nada más
          }
        });
     
       
      
    } catch (error) {
      console.error('Error al inscribirse:', error);
    }
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
    deshabilitarboton || cuporestante === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary cursor-pointer'
  } py-2 px-4 text-sm font-semibold capitalize text-white`}
>
  {deshabilitarboton || cuporestante === 0 ? '' : 'Me inscribo'}
</span>
  <span
   className={`absolute top-6 ml-2 z-20 inline-flex items-center justify-center rounded-full bg-dark  py-2 px-4 text-sm font-semibold capitalize text-white 
   `}
>
  {cuporestante === 0 ? 'Taller cerrado' :'Taller abierto' }
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
  {cuporestante === 0 ? 'Taller cerrado' :'Taller abierto' }
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

export default SingleTaller;