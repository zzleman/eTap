export const addInfo = (section, formData, setFormData) => {
  setFormData(prevState => {
    const newState = { ...prevState };

    if (!Array.isArray(newState[section])) {
      newState[section] = [];
    }
    newState[section].push({
      id: new Date().getTime(),
      skills: '',
      company: '',
      position: '',
      city: '',
      dateRange: { startDate: null, endDate: null },
      stillWorks: false,
    });

    return newState;
  });
};

export const deleteInfo = (type, id, formData, setFormData) => {
  const updatedData = formData[type].filter(item => item.id !== id);
  setFormData(prev => ({
    ...prev,
    [type]: updatedData,
  }));
};
