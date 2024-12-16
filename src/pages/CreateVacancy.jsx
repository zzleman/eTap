import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useFormik } from 'formik';
import { CreateVacancySchema } from '../schemas/CreateVacancySchema';
import { toast } from 'react-toastify';
import TextEditor from '../components/Editor/TextEditor';
import { serverTimestamp } from 'firebase/firestore';

const CreateVacancy = () => {
  const [categories, setCategories] = useState([]);

  const onSubmit = async (values, actions) => {
    console.log('Form Values:', values);
    try {
      const docRef = await addDoc(collection(db, 'vacancies'), {
        title: values.title,
        category: values.category,
        salary: values.salary,
        workShift: values.workShift,
        experience: values.experience,
        education: values.education,
        jobType: values.jobType,
        jobDescription: values.jobDescription,
        createdAt: serverTimestamp(),
      });

      toast.success('Vacancy created successfully!', {
        position: 'top-center',
      });

      actions.resetForm();
    } catch (error) {
      toast.error(error.message, { position: 'bottom-center' });
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      title: '',
      category: '',
      salary: '',
      workShift: '',
      experience: '',
      education: '',
      jobType: '',
      jobDescription: '',
    },
    validationSchema: CreateVacancySchema,
    onSubmit,
  });

  const getCategories = async () => {
    const querySnapshot = await getDocs(collection(db, 'JobCategories'));
    const categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setCategories(categories);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Разместить вакансию</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <div className="job-info my-5">
            <div className="grid grid-cols-12 w-12/12 gap-5">
              <div className="form-group flex flex-col gap-2 col-span-12">
                <label className="font-bold" htmlFor="title">
                  Job Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border h-10 outline-none px-3 text-neutral-500"
                />
                {errors.title && touched.title && (
                  <span className="text-red-500 text-xs">{errors.title}</span>
                )}
              </div>
              <div className="form-group flex flex-col gap-2 col-span-6">
                <label className="font-bold" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-10 border outline-none px-3 text-neutral-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && touched.category && (
                  <span className="text-red-500 text-xs">
                    {errors.category}
                  </span>
                )}
              </div>
              <div className="form-group flex flex-col gap-2 col-span-6">
                <label className="font-bold" htmlFor="salary">
                  Salary
                </label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={values.salary}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-10 border outline-none px-3 text-neutral-500"
                />
                {errors.salary && touched.salary && (
                  <span className="text-red-500 text-xs">{errors.salary}</span>
                )}
              </div>
              <div className="form-group flex flex-col gap-2 col-span-6">
                <label className="font-bold" htmlFor="workShift">
                  Work Shift
                </label>
                <select
                  id="workShift"
                  name="workShift"
                  value={values.workShift}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-10 border outline-none px-3 text-neutral-500"
                >
                  <option value="">Select Shift</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
                {errors.workShift && touched.workShift && (
                  <span className="text-red-500 text-xs">
                    {errors.workShift}
                  </span>
                )}
              </div>
              <div className="form-group flex flex-col gap-2 col-span-6">
                <label className="font-bold" htmlFor="experience">
                  Experience
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={values.experience}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-10 border outline-none px-3 text-neutral-500"
                >
                  <option value="">Select Experience</option>
                  <option value="<1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value=">5">More than 5 years</option>
                </select>
                {errors.experience && touched.experience && (
                  <span className="text-red-500 text-xs">
                    {errors.experience}
                  </span>
                )}
              </div>
              <div className="form-group flex flex-col gap-2 col-span-6">
                <label className="font-bold" htmlFor="education">
                  Education
                </label>
                <select
                  id="education"
                  name="education"
                  value={values.education}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-10 border outline-none px-3 text-neutral-500"
                >
                  <option value="">Select Education</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="bachelor">Bachelor</option>
                  <option value="master">Master</option>
                  <option value="phd">PhD</option>
                </select>
                {errors.education && touched.education && (
                  <span className="text-red-500 text-xs">
                    {errors.education}
                  </span>
                )}
              </div>
              <div className="form-group flex flex-col gap-2 col-span-6">
                <label className="font-bold" htmlFor="jobType">
                  Job Type
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  value={values.jobType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-10 border outline-none px-3 text-neutral-500"
                >
                  <option value="">Выберите тип занятости</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
                {errors.jobType && touched.jobType && (
                  <span className="text-red-500 text-xs">{errors.jobType}</span>
                )}
              </div>
              <div className="form-group flex flex-col gap-2 col-span-12">
                <label className="font-bold" htmlFor="jobDescription">
                  Job Description
                </label>
                <TextEditor
                  id="jobDescription"
                  name="jobDescription"
                  value={values.jobDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-40 border outline-none px-3 text-neutral-500"
                />
                {errors.jobDescription && touched.jobDescription && (
                  <span className="text-red-500 text-xs">
                    {errors.jobDescription}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-40 h-11 border border-[#563D7C] rounded-sm text-xs mt-3"
            disabled={isSubmitting}
          >
            Elani paylas
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVacancy;
