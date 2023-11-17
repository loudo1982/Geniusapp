import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const UserInfo = () => {
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

  if (user) {
    // El usuario está autenticado, puedes acceder a sus datos, incluido el nombre
    const { displayName, email } = user;

    return (
      <div>
        <p>Nombre de usuario: {displayName}</p>
        <p>Correo electrónico: {email}</p>
      </div>
    );
  } else {
    // El usuario no está autenticado
    return <div>No hay usuario autenticado</div>;
  }
};

export default UserInfo;
