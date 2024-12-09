export const addInfo = (section, formData, setFormData) => {
  const newItem = {
    id: Date.now(),
    ...(section === 'work' && {
      skills: '',
      company: '',
      profession: '',
      city: '',
      startDate: '',
      endDate: '',
      ongoing: false,
      achievements: '',
    }),
    ...(section === 'education' && {
      eduCenter: '',
      eduLevel: '',
      department: '',
      city: '',
      startDate: '',
      endDate: '',
      ongoing: false,
    }),
    ...(section === 'language' && {
      lang: '',
      langLevel: '',
    }),
  };

  setFormData(prevState => ({
    ...prevState,
    [section]: [...prevState[section], newItem],
  }));
};

export const deleteInfo = (section, id, formData, setFormData) => {
  setFormData(prevState => ({
    ...prevState,
    [section]: prevState[section].filter(item => item.id !== id),
  }));
};
