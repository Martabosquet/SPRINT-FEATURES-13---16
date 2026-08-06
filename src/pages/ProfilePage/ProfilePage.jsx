import { useState, useEffect } from 'react';

import { getProfile } from '../../api/auth';

import ProfileHeader from '../../components/Profile/ProfileHeader/ProfileHeader';
import ProductProfileCard from '../../components/Profile/ProductProfileCard/ProductProfileCard';
import PersonalInfoCard from '../../components/Profile/PersonalInfoCard/PersonalInfoCard';
import SecurityCard from '../../components/Profile/SecurityCard/SecurityCard';

import styles from './ProfilePage.module.css';



export default function ProfilePage() {


  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');





  useEffect(() => {


    const fetchProfile = async () => {


      try {


        const response = await getProfile();


        setProfile(response.data);



      } catch(error) {


        console.error(
          'Error cargando perfil:',
          error
        );


        setError(
          'No se pudieron cargar los datos del perfil.'
        );



      } finally {


        setLoading(false);


      }


    };



    fetchProfile();



  }, []);








  const handleProfileUpdated = (updatedProfile) => {


    setProfile(prev => ({

      ...prev,

      ...updatedProfile

    }));


  };








  if(loading){


    return (

      <div className={styles.container}>

        <p>
          Cargando perfil...
        </p>


      </div>

    );

  }







  if(!profile){


    return (

      <div className={styles.container}>

        <p>
          No se encontró información del usuario.
        </p>


      </div>

    );

  }








  return (

    <main className={styles.container}>


      <h2>
        Mi Perfil
      </h2>





      {error && (

        <div className={styles.errorAlert}>

          {error}

        </div>

      )}








  <ProfileHeader
      name={profile.name}
      email={profile.email}
      profileImage={profile.profileImage}

      favoriteGenre={profile.favoriteGenre}
      favoriteMovie={profile.favoriteMovie}
      favoriteDirector={profile.favoriteDirector}
  />







      <div className={styles.grid}>


        <PersonalInfoCard

          name={profile.name}

          email={profile.email}

          profileImage={profile.profileImage}

          onProfileUpdated={handleProfileUpdated}

        />



        <SecurityCard />


      </div>








      <ProductProfileCard

        profile={{

          favoriteGenre: profile.favoriteGenre || '',

          favoriteMovie: profile.favoriteMovie || '',

          favoriteDirector: profile.favoriteDirector || '',

          bio: profile.bio || '',

        }}

        onProfileUpdated={handleProfileUpdated}

      />

    </main>

  );

}