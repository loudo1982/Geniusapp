"use client"
import SingleBlog from "@/components/Blog/SingleBlog";
import SingleTaller from "@/components/Talleres/SingleTaller";
import blogData from "@/components/Blog/blogData";
import tallerData from "@/components/Blog/tallerData";
import Breadcrumb from "@/components/Common/Breadcrumb";
import checkAuth from 'app/checkauth'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserInfo from '../../components/userInfo'
import { tallerData2 } from "@/components/Blog/tallerData";

import { getAuth, onAuthStateChanged } from 'firebase/auth';

const MostrarTaller = () => {

 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [dataTalleres, setdataTalleres] = useState([]);
 const [usuario, setUsuario] = useState(null);
  const router = useRouter();
  






  useEffect(() => {
    const UserInfo = async() => {

      const auth = getAuth();
  
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // El usuario está autenticado
        setUsuario(user);
        
         
        } else {
          // El usuario no está autenticado
          setUsuario(user);
        }
      });
  
      // Asegúrate de desuscribirte cuando el componente se desmonte
      return () => unsubscribe()
   ;

  };
    
    const fetchData = async () => {
      checkAuth(async (authenticated) => {
        setIsAuthenticated(authenticated);
  
        if (!authenticated) {
          router.push("/login");
        } else {
          const talleresData = await tallerData2();
          console.log("Los datos de los talleres son:", talleresData);
          setdataTalleres(talleresData)
      
        }
      });
    };
  
    fetchData();UserInfo()
  }, []);
  const LoadingComponent = () => (
    <div>
      <div className="loading">
        Cargando...
      </div>
    </div>
  );

  if (!isAuthenticated) {
   
    return <LoadingComponent />; // O un componente de carga
  }

  // Resto del contenido de la página "taller"
  const handleTallerClick = (tallerName) => {
    console.log(`Clicked on taller: ${tallerName}`);
    // Do something with the clicked taller's name

    router.push(`/inscritos?taller=${encodeURIComponent(tallerName)}`);
  };
  




  
  return (
    <>
      <Breadcrumb
        pageName="Talleres Genius"
        description="¡Descubre la variedad de taleres que tenemos preparados para ti, para que puedas aprender nuevas habilidades!"
      />
      {/*<UserInfo/>*/}

      <section className="pt-[120px] pb-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {dataTalleres.map((taller) => (
              <div
                key={taller.id}
                className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3 mb-5"
              >
                <SingleTaller taller={taller.data} onTallerClick={handleTallerClick}
               usuario={usuario}
                
                />
              </div>
            ))}
          </div>

          <div
            className="wow fadeInUp -mx-4 flex flex-wrap"
            data-wow-delay=".15s"
          >
            <div className="w-full px-4">
              <ul className="flex items-center justify-center pt-8">
                <li className="mx-1">
                  <a
                    href="#0"
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                  >
                    Prev
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                  >
                    1
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                  >
                    2
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                  >
                    3
                  </a>
                </li>
                <li className="mx-1">
                  <a className="flex h-9 min-w-[36px] cursor-not-allowed items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color">
                    ...
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                  >
                    12
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                  >
                    Next
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MostrarTaller;
