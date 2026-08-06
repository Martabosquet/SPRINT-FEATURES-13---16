import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  updatePassword,
  deleteAccount,
} from '../../../api/auth';

import styles from './SecurityCard.module.css';


export default function SecurityCard() {

  const navigate = useNavigate();


  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);



  const handlePasswordSubmit = async (event) => {

    event.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);


    try {

      await updatePassword({
        currentPassword,
        newPassword,
      });


      setCurrentPassword('');
      setNewPassword('');


      setMessage(
        'Contraseña actualizada correctamente.'
      );


    } catch(error) {

      console.error(
        'Error cambiando contraseña:',
        error
      );


      setError(
        error.response?.data?.message ||
        'No se pudo cambiar la contraseña.'
      );


    } finally {

      setLoading(false);

    }

  };




  const handleDeleteAccount = async () => {


    const confirmed = window.confirm(
      '¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.'
    );


    if(!confirmed){
      return;
    }



    try {


      await deleteAccount();


      localStorage.clear();


      window.dispatchEvent(
        new Event('authChange')
      );


      navigate('/');



    } catch(error){


      console.error(
        'Error eliminando cuenta:',
        error
      );


      setError(
        'No se pudo eliminar la cuenta.'
      );


    }

  };





  return (

    <section className={styles.card}>


      <h3>
        Seguridad
      </h3>




      <form
        onSubmit={handlePasswordSubmit}
        className={styles.form}
      >


        <div className={styles.field}>

          <label>
            Contraseña actual
          </label>


          <input

            type="password"

            value={currentPassword}

            onChange={(event)=>
              setCurrentPassword(
                event.target.value
              )
            }

            className={styles.input}

            required

          />

        </div>





        <div className={styles.field}>

          <label>
            Nueva contraseña
          </label>


          <input

            type="password"

            value={newPassword}

            onChange={(event)=>
              setNewPassword(
                event.target.value
              )
            }

            className={styles.input}

            required

          />

        </div>





        {message && (

          <p className={styles.success}>
            {message}
          </p>

        )}



        {error && (

          <p className={styles.error}>
            {error}
          </p>

        )}






        <button

          type="submit"

          className={styles.button}

          disabled={loading}

        >

          {
            loading
            ? 'Actualizando...'
            : 'Cambiar contraseña'
          }

        </button>


      </form>





      <hr className={styles.divider}/>





      <div className={styles.dangerZone}>


        <h4>
          Zona de peligro
        </h4>


        <p>
          La eliminación de la cuenta es permanente.
        </p>



        <button

          onClick={handleDeleteAccount}

          className={styles.deleteButton}

        >
          Eliminar cuenta
        </button>



      </div>



    </section>

  );

}