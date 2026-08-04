import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, updatePassword, deleteAccount } from '../../api/auth'; // <-- Ajusta la ruta si es necesario
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await getProfile();
        setName(res.data.name || '');
        setEmail(res.data.email || '');
        setProfileImage(res.data.profileImage || '');
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los datos del perfil.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const res = await updateProfile(formData);
      setSuccessMessage('¡Perfil actualizado con éxito!');
      
      if (res.data.profileImage) {
        setProfileImage(res.data.profileImage);
        // 🟢 Guardamos la nueva foto en localStorage para actualizar el Header
        localStorage.setItem('userProfileImage', res.data.profileImage);
      }
      
      localStorage.setItem('userName', res.data.name);
      window.dispatchEvent(new Event('authChange'));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      await updatePassword({ currentPassword, newPassword });
      setSuccessMessage('¡Contraseña actualizada con éxito!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al cambiar la contraseña.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.')) {
      return;
    }

    try {
      await deleteAccount();
      localStorage.clear();
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar la cuenta.');
    }
  };

  if (loading) return <div className={styles.container}><p>Cargando perfil...</p></div>;

  return (
    <div className={styles.container}>
      <h2>Mi Perfil</h2>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {successMessage && <div className={styles.successAlert}>{successMessage}</div>}

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Información Personal</h3>
          <div className={styles.avatarContainer}>
            <img 
              src={profileImage || 'https://placehold.co/150?text=Sin+Foto'} 
              alt="Avatar" 
              className={styles.avatar} 
            />
          </div>

          <form onSubmit={handleProfileSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Nombre</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label>Nueva foto de perfil</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImageFile(e.target.files[0])} 
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.primaryButton}>Guardar Cambios</button>
          </form>
        </div>

        <div className={styles.card}>
          <h3>Seguridad</h3>
          <form onSubmit={handlePasswordSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Contraseña Actual</label>
              <input 
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                required 
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label>Nueva Contraseña</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.secondaryButton}>Cambiar Contraseña</button>
          </form>

          <hr className={styles.divider} />

          <div className={styles.dangerZone}>
            <h4>Zona de peligro</h4>
            <p>Una vez que elimines tu cuenta, no hay vuelta atrás.</p>
            <button onClick={handleDeleteAccount} className={styles.dangerButton}>
              Eliminar Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}