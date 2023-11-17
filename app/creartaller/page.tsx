"use client"

import Breadcrumb from "@/components/Common/Breadcrumb";
import CrearTallerForm from "@/components/Addtaller/addtaller";

const Creartaller = () => {
  return (
    <>
      <Breadcrumb
        pageName="creación  de talleres"
        description="creación  de talleres"
      />
      <CrearTallerForm/>
      
    </>
  );
};

export default Creartaller;
