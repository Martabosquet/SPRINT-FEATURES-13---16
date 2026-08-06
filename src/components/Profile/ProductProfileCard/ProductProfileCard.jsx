import { useState, useEffect } from 'react';

import { updateCinephileProfile } from '../../../api/auth';

import styles from './ProductProfileCard.module.css';



const genres = [

  'Drama',
  'Comedia',
  'Thriller',
  'Terror',
  'Ciencia ficción',
  'Acción',
  'Animación',
  'Documental',

];





export default function CineProfileCard({

  profile,

  onProfileUpdated

}) {



  const [form, setForm] = useState(profile);


  const [saved, setSaved] = useState(false);


  const [error, setError] = useState('');







  /*
    Si ProfilePage actualiza datos,
    sincronizamos el formulario
  */
  useEffect(() => {


    setForm(profile);


  }, [profile]);









  const handleChange = (event) => {


    const {name,value} = event.target;


    setForm(prev => ({


      ...prev,


      [name]: value


    }));


    setSaved(false);


  };










  const handleGenreChange = (genre) => {


    setForm(prev => ({


      ...prev,


      favoriteGenre: genre


    }));


    setSaved(false);


  };










  const handleSubmit = async(event)=>{


    event.preventDefault();


    setError('');



    try {



      const response = await updateCinephileProfile(form);



      setSaved(true);



      onProfileUpdated(
        response.data.data
      );




    } catch(error) {



      console.error(
        'Error actualizando perfil cinéfilo:',
        error
      );



      setError(
        error.response?.data?.message ||
        'No se pudo actualizar el perfil cinéfilo.'
      );


    }


  };









  return (


    <section className={styles.card}>


      <h3>
        🎬 Mi perfil cinéfilo
      </h3>





      <form

        onSubmit={handleSubmit}

        className={styles.form}

      >






        <div className={styles.field}>


          <label>
            Género favorito
          </label>





          <div className={styles.genres}>


            {genres.map((genre)=>(


              <label

                key={genre}

                className={

                  form.favoriteGenre === genre

                  ? styles.selectedGenre

                  : styles.genre

                }

              >



                <input

                  type="radio"

                  name="favoriteGenre"

                  value={genre}

                  checked={
                    form.favoriteGenre === genre
                  }

                  onChange={() =>
                    handleGenreChange(genre)
                  }

                />



                {genre}



              </label>


            ))}


          </div>


        </div>









        <div className={styles.field}>


          <label>
            Película favorita
          </label>



          <input

            type="text"

            name="favoriteMovie"

            value={form.favoriteMovie}

            onChange={handleChange}

            placeholder="Ej: Interstellar"

            className={styles.input}

          />



        </div>









        <div className={styles.field}>


          <label>
            Director favorito
          </label>




          <input

            type="text"

            name="favoriteDirector"

            value={form.favoriteDirector}

            onChange={handleChange}

            placeholder="Ej: Christopher Nolan"

            className={styles.input}

          />



        </div>









        <div className={styles.field}>


          <label>
            Sobre mis gustos
          </label>




          <textarea

            name="bio"

            value={form.bio}

            onChange={handleChange}

            placeholder="Me encanta el cine de ciencia ficción..."

            className={styles.input}

            rows="4"

          />



        </div>









        <button

          type="submit"

          className={styles.button}

        >

          Guardar perfil cinéfilo


        </button>







        {saved && (

          <p className={styles.success}>

            ✓ Perfil cinéfilo actualizado

          </p>

        )}






        {error && (

          <p className={styles.error}>

            {error}

          </p>

        )}






      </form>


    </section>


  );

}