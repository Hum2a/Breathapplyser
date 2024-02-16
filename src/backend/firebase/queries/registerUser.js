import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export const registerUser = (username, email, password, confirmPassword, onSuccess, onFailure) => {
    if (password !== confirmPassword) {
      onFailure({ message: 'Passwords do not match' });
      return;
    }
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Update the username
        return updateProfile(userCredential.user, {
          displayName: username
        });
      })
      .then(() => {
        onSuccess();
      })
      .catch((error) => {
        onFailure(error);
      });
  };