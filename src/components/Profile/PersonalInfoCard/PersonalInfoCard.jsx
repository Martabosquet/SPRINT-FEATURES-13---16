import { useState } from 'react';
import { updateProfile } from '../../../api/auth';
import { authStorage } from '../../../utils/authStorage';

import styles from './PersonalInfoCard.module.css';

export default function PersonalInfoCard({
  name,
  email,
  profileImage,
  onProfileUpdated,
}) {

  const [formName, setFormName] = useState(name);
  const [formEmail, setFormEmail] = useState(email);

  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');



  const handleSubmit = async (event) => {

    event.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');


    try {

      const formData = new FormData();

      formData.append(
        'name',
        formName
      );

      formData.append(
        'email',
        formEmail
      );


      if(imageFile){
        formData.append(
          'profileImage',
          imageFile
        );
      }



      const response = await updateProfile(formData);


      const updatedUser = response.data;



      authStorage.userName = updatedUser.name;

      if (updatedUser.profileImage) {
        authStorage.userProfileImage = updatedUser.profileImage;
      } else {
        authStorage.userProfileImage = '';
      }



      window.dispatchEvent(
        new Event('authChange')
      );



      setSuccess(
        'Perfil actualizado correctamente.'
      );


      if(onProfileUpdated){

        onProfileUpdated(updatedUser);

      }



    } catch(error){

      console.error(
        'Error actualizando perfil:',
        error
      );


      setError(
        error.response?.data?.message ||
        'No se pudo actualizar el perfil.'
      );


    } finally {

      setLoading(false);

    }

  };



  return (

    <section className={styles.card}>

      <h3>
        Información personal
      </h3>



      <div className={styles.avatarContainer}>

        <img
          src={
            profileImage ||
            'https://placehold.co/150?text=Sin+Foto'
          }
          alt="Avatar usuario"
          className={styles.avatar}
        />

      </div>




      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >


        <div className={styles.field}>

          <label>
            Nombre
          </label>


          <input
            type="text"
            value={formName}
            onChange={(event)=>
              setFormName(event.target.value)
            }
            className={styles.input}
            required
          />

        </div>




        <div className={styles.field}>

          <label>
            Correo electrónico
          </label>


          <input
            type="email"
            value={formEmail}
            onChange={(event)=>
              setFormEmail(event.target.value)
            }
            className={styles.input}
            required
          />

        </div>





        <div className={styles.field}>

          <label>
            Nueva foto de perfil
          </label>


          <input
            type="file"
            accept="image/*"
            onChange={(event)=>
              setImageFile(
                event.target.files[0]
              )
            }
            className={styles.input}
          />

        </div>





        {error && (

          <p className={styles.error}>
            {error}
          </p>

        )}



        {success && (

          <p className={styles.success}>
            {success}
          </p>

        )}




        <button
          type="submit"
          className={styles.button}
          disabled={loading}
        >

          {
            loading
            ? 'Guardando...'
            : 'Guardar cambios'
          }

        </button>


      </form>


    </section>

  );

}