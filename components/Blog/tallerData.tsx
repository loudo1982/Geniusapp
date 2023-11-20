import { Taller } from "@/types/blog";
import { db } from "@/firebase/initFirebase";
import { collection, getDocs } from "firebase/firestore";

export const tallerData2 = async () => {
  const talleresArray = [];

  const talleres = await getDocs(collection(db, "products"));
  talleres.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    talleresArray.push({
      id: doc.id,
      data: doc.data()
    });
  });

  return talleresArray;
};



const tallerData: Taller[] = [
    {
        id: 2,
        cupoMaximo: 24,
        descripcion:"un bonito taller",
        nombre: 'taller python',
        image: 'https://firebasestorage.googleapis.com/v0/b/genius-91495.appspot.com/o/files%2Fajeter.jpeg?alt=media&token=a0506281-fb58-4f35-bdb7-2adcfe771c4c',
        displayName: 'fhfhf',
        fotocreador:'https://lh3.googleusercontent.com/a/ACg8ocLwKcNXVPsC5IBD0DRet8GmD4MkNZ37lMNZRp7rvfoI=s96-c',
        email:'ludo@fr.fr'
    
    
    
       
      
      },
  {
    id: 3,
    cupoMaximo: 24,
    descripcion:"un bonito taller",
    nombre: 'taller python',
    image: '',
    displayName: 'fhfhf',
    fotocreador:'',
    email:'ludo@fr.fr'



   
  
  },
 
];
export default tallerData;
