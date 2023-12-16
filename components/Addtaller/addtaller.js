import React ,{useState,useEffect} from 'react';
import { db,storage  } from '@/firebase/initFirebase';
import { collection, addDoc } from "firebase/firestore"; 
import UserInfo from '../userInfo';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { useFormik } from 'formik';
import * as Yup from 'yup';


const validationSchema = Yup.object({
  nombre: Yup.string()
    .max(40, 'Debe tener 15 caracteres o menos')
    .required('El nombre es requerido'),
  descripcion: Yup.string()
    .required('La descripción es requerida'),
  foto: Yup.mixed()
    .required('La foto es requerida'),
  cupoMaximo: Yup.number()
    .required('El cupo máximo es requerido')
});


const CrearTallerForm = () => {

  const [percent, setPercent] = useState(0);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [user, setUser] = useState(null);


  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // El usuario está autenticado
        setUser(user);
      } else {
        // El usuario no está autenticado
        setUser(null);
      }
    });

    // Asegúrate de desuscribirte cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

 

  const formik = useFormik({
    initialValues: {
      nombre: '',
      descripcion: '',
      foto: '',
      cupoMaximo: '',
    },
    validationSchema: validationSchema, // Agrega el esquema de validación aquí
  

 

  onSubmit: async (values, { setSubmitting }) => {
    console.log('los valores',values)
    setIsSubmittingForm(true);
    setSubmitting(true);

    const imageFile = values.foto;

    const storageRef = ref(storage, `/files/${values.foto.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    console.log(imageFile,values.foto.name )

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
      },
      (err) => console.log('El error es', err),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        if (user) {
          // El usuario está autenticado, puedes acceder a sus datos, incluido el nombre
          const { displayName, email } = user;
       }
       console.log('el user es',user)

        const tallerData = {
          nombre: values.nombre,
          descripcion:values.descripcion,
          cupoMaximo:values.cupoMaximo,
          image: downloadURL,
          displayName:user.displayName,
          email:user.email,
          fotocreador:user.photoURL,
          cuporestante:values.cupoMaximo
         

         
       
        };

        try {
         
          const docRef = await addDoc(collection(db, "products"), tallerData);
          console.log('Producto agregado exitosamente a Firestore con ID:', docRef.id);
          setRegistrationSuccess(true);
        } catch (error) {
          console.error('Error al agregar el producto a Firestore:', error);
        } finally {
          setIsSubmittingForm(false);
          setSubmitting(false);
        }
      }
    );
  }})


 
  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
 
            <div className="wow fadeInUp mb-12 rounded-md bg-primary/[3%] py-11 px-8 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]" data-wow-delay=".15s">
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Crear Taller
              </h2>
              <p className="mb-12 text-base font-medium text-body-color">
                Ingresa la información del taller.
              </p>
              <form onSubmit={formik.handleSubmit}>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label htmlFor="nombre" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Nombre del taller
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        placeholder="Ingresa el nombre del taller"
                        className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        {...formik.getFieldProps('nombre')}
                      />
                      {formik.touched.nombre && formik.errors.nombre ? (
  <div className="text-red-500">{formik.errors.nombre}</div>
) : null}
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label htmlFor="descripcion" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Descripción del taller
                      </label>
                      <textarea
                        id="descripcion"
                        name="descripcion"
                        rows={5}
                        placeholder="Ingresa la descripción del taller"
                        className="w-full resize-none rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        {...formik.getFieldProps('descripcion')}
                      ></textarea>
                      {formik.touched.descripcion && formik.errors.descripcion ? (
  <div className="text-red-500">{formik.errors.nombre}</div>
) : null}
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label htmlFor="foto" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Foto del taller
                      </label>
                      <input
                        type="file"
                        id="foto"
                        name="foto"
                        className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        onChange={(event) => {
                          formik.setFieldValue('foto', event.currentTarget.files[0]);
                        }}
                      />
                         {percent > 0 && percent < 100 && (
            <div className="mt-2">
              <progress value={percent} max="100"></progress>
            </div>
          )}
{formik.touched.foto && formik.errors.foto ? (
  <div className="text-red-500">{formik.errors.foto}</div>
) : null}
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label htmlFor="cupoMaximo" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Cupo máximo
                      </label>
                      <input
                        type="number"
                        id="cupoMaximo"
                        name="cupoMaximo"
                        placeholder="Ingresa el cupo máximo"
                        className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        {...formik.getFieldProps('cupoMaximo')}
                      />
                    {formik.touched.cupoMaximo && formik.errors.cupoMaximo ? (
  <div className="text-red-500">{formik.errors.cupoMaximo}</div>
) : null}
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <button type="submit" className="rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                      Crear Taller
                    </button>
                    {registrationSuccess && (
        <div className="mt-4 text-green-600 font-medium">
          Registro exitoso
        </div>
      )}
        {isSubmittingForm ? 'Enviando datos...' : ''}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrearTallerForm;
