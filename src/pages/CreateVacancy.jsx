import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useFormik } from 'formik';
import { CreateVacancySchema } from '../schemas/CreateVacancySchema';
import { toast } from 'react-toastify';

const CreateVacancy = () => {
  const [categories, setCategories] = useState([]);

  const onSubmit = async (values, actions) => {
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
        companyName: values.companyName,
        location: values.location,
        companyLogo: values.companyLogo,
        companyDescription: values.companyDescription,
        createdAt: Timestamp.now(),
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
      companyName: '',
      location: '',
      companyLogo: null,
      companyDescription: '',
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
      <h1 className="text-2xl font-bold mb-5 text-center">
        Разместить вакансию
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="border p-10 shadow-md">
          <div className="job-info my-5">
            <h1 className="text-red-500 text-xl mb-3">
              First, tell us about the position
            </h1>
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
                  <option value="">Select Job Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                </select>
                {errors.jobType && touched.jobType && (
                  <span className="text-red-500 text-xs">{errors.jobType}</span>
                )}
              </div>
              <div className="form-group flex flex-col gap-2 col-span-12">
                <label className="font-bold" htmlFor="jobDescription">
                  Job Description
                </label>
                <textarea
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
          <div className="company-info">
            <h1 className="text-red-500 mb-5 text-xl">
              Tell Us More About Your Company
            </h1>
            <div className="grid grid-cols-12 gap-5">
              {/* Company Name */}
              <div className="form-group flex flex-col gap-2 col-span-6">
                <label className="font-bold" htmlFor="companyName">
                  Company Name
                </label>
                <span className="text-xs text-neutral-400">
                  Enter your company or organization’s name.
                </span>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={values.companyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border h-10 outline-none px-3 text-neutral-500"
                  placeholder="Your company name"
                />
                {errors.companyName && touched.companyName && (
                  <p className="text-red-500 text-xs">{errors.companyName}</p>
                )}
              </div>

              {/* Location */}
              <div className="form-group flex flex-col gap-2 col-span-6">
                <label className="font-bold" htmlFor="location">
                  Location
                </label>
                <span className="text-xs text-neutral-400">
                  Enter your company or organization’s location.
                </span>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={values.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border h-10 outline-none px-3 text-neutral-500"
                  placeholder="Location"
                />
                {errors.location && touched.location && (
                  <p className="text-red-500 text-xs">{errors.location}</p>
                )}
              </div>

              {/* Company Logo */}
              <div className="form-group flex flex-col gap-2 col-span-12">
                <label className="font-bold" htmlFor="logo">
                  Company Logo
                </label>
                <span className="text-xs text-neutral-400">
                  It’s highly recommended to use your Twitter or Facebook
                  avatar. Optional — Your company logo will appear at the top of
                  your listing and live profile.
                </span>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-16 border px-3 py-4"
                  accept="image/*"
                />
                {errors.logo && touched.logo && (
                  <p className="text-red-500 text-xs">{errors.logo}</p>
                )}
              </div>

              {/* Company Description */}
              <div className="form-group flex flex-col gap-2 col-span-12">
                <label className="font-bold" htmlFor="companyDescription">
                  Company Description
                </label>
                <textarea
                  id="companyDescription"
                  name="companyDescription"
                  value={values.companyDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-40 border outline-none px-3 text-neutral-500"
                  placeholder="Write a brief description about your company"
                  aria-invalid={
                    errors.companyDescription && touched.companyDescription
                      ? 'true'
                      : 'false'
                  }
                />
                {errors.companyDescription && touched.companyDescription && (
                  <p className="text-red-500 text-xs">
                    {errors.companyDescription}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-40 h-11 bg-red-500 text-white rounded-sm"
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
