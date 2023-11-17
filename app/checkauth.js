// Por ejemplo, si estás utilizando Firebase para la autenticación:
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from './../firebase/initFirebase'


const checkAuth = (callback) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Usuario autenticado
      callback(true);
    } else {
      // Usuario no autenticado
      callback(false);
    }
  });
};

export default checkAuth;
