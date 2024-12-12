import { createSlice } from '@reduxjs/toolkit';
import { getUser, setUser, removeUser } from '../utils/localStorageUtils';

const initialState = {
  currentUser: getUser(),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      setUser(action.payload);
    },
    logOut: state => {
      state.currentUser = null;
      removeUser();
    },
  },
});
export const selectCurrentUser = state => state.auth.currentUser;
export const { setCurrentUser, logOut } = authSlice.actions;
export default authSlice.reducer;

const fetchResume = async () => {
  try {
    const userRef = doc(db, 'Users', userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      setFormData(userData.resume || {});
      // Populate form fields with existing data if available
      setValue('name', userData.resume?.name || 'salam');
      console.log(userData.resumes[0].name);
      setValue('surname', userData.resume?.surname || '');
      setValue('birthDay.day', userData.resume?.birthDay?.day || '');
      setValue('birthDay.month', userData.resume?.birthDay?.month || '');
      setValue('birthDay.year', userData.resume?.birthDay?.year || '');
      setValue('gender', userData.resume?.gender || '');
      setValue('city', userData.resume?.city || '');
      setValue('contact.dialCode', userData.resume?.contact?.dialCode || '');
      setValue('contact.phone', userData.resume?.contact?.phone || '');
    }
  } catch (error) {
    console.error('Error fetching resume:', error);
  }
};

const onSubmit = async data => {
  try {
    const userRef = doc(db, 'Users', userId);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      let resumes = userData.resumes || [];

      const cleanedData = removeUndefinedFields(data);

      const resumeIndex = resumes.findIndex(
        resume => resume.id === cleanedData.id
      );

      if (resumeIndex !== -1) {
        resumes[resumeIndex] = { ...resumes[resumeIndex], ...cleanedData };
      } else {
        resumes.push(cleanedData);
      }

      await updateDoc(userRef, { resumes: resumes });

      toast.success('Resume updated successfully!', {
        position: 'top-center',
      });
    }
  } catch (error) {
    console.error('Error updating resume:', error);
    toast.error('Error updating resume!', { position: 'bottom-center' });
  }
};
