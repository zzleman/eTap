import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema } from '../schemas/CreateVacancySchema';
import { toast } from 'react-toastify';
import TextEditor from '../components/Editor/TextEditor';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const CreateVacancy = () => {
  const [categories, setCategories] = useState([]);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.uid;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const getCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'JobCategories'));
      const categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCompanyData = async () => {
    if (!userId) return;

    try {
      const userRef = doc(db, 'Users', userId);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const company = userData.company;

        if (company) {
          setCompanyData(company);
          setLoading(false);
        } else {
          toast.error('Please create your company details first.', {
            position: 'top-center',
          });
          navigate('/company');
        }
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      setLoading(false);
    }
  };

  const onSubmit = async data => {
    try {
      await addDoc(collection(db, 'vacancies'), {
        ...data,
        companyName: companyData.name,
        companyId: userId,
        createdAt: new Date(),
      });
      toast.success('Job vacancy created successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to create job vacancy.');
      console.error('Error adding vacancy:', error);
    }
  };

  useEffect(() => {
    getCategories();
    fetchCompanyData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Разместить вакансию</h1>
      <div className="company-info mb-5 p-5 border rounded-md flex justify-between">
        <div>
          <h3 className="font-bold text-lg mb-3 text-[#563D7C]">
            Your Company
          </h3>
          <div>
            <p>
              <strong>Company Name:</strong> {companyData.name}
            </p>
            <p>
              <strong>Email:</strong> {companyData.email}
            </p>
            <p>
              <strong>Location:</strong> {companyData.location}
            </p>
          </div>
        </div>
        <div>
          <img className="size-20" src={companyData.companyImg} alt="" />
        </div>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="job-info my-5">
          <div className="grid grid-cols-12 w-12/12 gap-5">
            <div className="form-group flex flex-col gap-2 col-span-12">
              <label className="font-bold" htmlFor="title">
                Job Title
              </label>
              <input
                {...register('title')}
                type="text"
                id="title"
                className="border h-10 outline-none px-3 text-neutral-500"
              />
              {errors.title && (
                <span className="text-red-500 text-xs">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="form-group flex flex-col gap-2 col-span-6">
              <label className="font-bold" htmlFor="category">
                Category
              </label>
              <select
                {...register('category')}
                id="category"
                className="h-10 border outline-none px-3 text-neutral-500"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="text-red-500 text-xs">
                  {errors.category.message}
                </span>
              )}
            </div>

            <div className="form-group flex flex-col gap-2 col-span-6">
              <label className="font-bold" htmlFor="salary">
                Salary
              </label>
              <input
                {...register('salary')}
                type="text"
                id="salary"
                className="h-10 border outline-none px-3 text-neutral-500"
              />
              {errors.salary && (
                <span className="text-red-500 text-xs">
                  {errors.salary.message}
                </span>
              )}
            </div>

            <div className="form-group flex flex-col gap-2 col-span-6">
              <label className="font-bold" htmlFor="workShift">
                Work Shift
              </label>
              <select
                {...register('workShift')}
                id="workShift"
                className="h-10 border outline-none px-3 text-neutral-500"
              >
                <option value="">Select Shift</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
              {errors.workShift && (
                <span className="text-red-500 text-xs">
                  {errors.workShift.message}
                </span>
              )}
            </div>

            <div className="form-group flex flex-col gap-2 col-span-6">
              <label className="font-bold" htmlFor="experience">
                Experience
              </label>
              <select
                {...register('experience')}
                id="experience"
                className="h-10 border outline-none px-3 text-neutral-500"
              >
                <option value="">Select Experience</option>
                <option value="<1">Less than 1 year</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value=">5">More than 5 years</option>
              </select>
              {errors.experience && (
                <span className="text-red-500 text-xs">
                  {errors.experience.message}
                </span>
              )}
            </div>

            <div className="form-group flex flex-col gap-2 col-span-6">
              <label className="font-bold" htmlFor="education">
                Education
              </label>
              <select
                {...register('education')}
                id="education"
                className="h-10 border outline-none px-3 text-neutral-500"
              >
                <option value="">Select Education</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="bachelor">Bachelor</option>
                <option value="master">Master</option>
                <option value="phd">PhD</option>
              </select>
              {errors.education && (
                <span className="text-red-500 text-xs">
                  {errors.education.message}
                </span>
              )}
            </div>

            <div className="form-group flex flex-col gap-2 col-span-6">
              <label className="font-bold" htmlFor="jobType">
                Job Type
              </label>
              <select
                {...register('jobType')}
                id="jobType"
                className="h-10 border outline-none px-3 text-neutral-500"
              >
                <option value="">Select Job Type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
              {errors.jobType && (
                <span className="text-red-500 text-xs">
                  {errors.jobType.message}
                </span>
              )}
            </div>

            <div className="form-group flex flex-col gap-2 col-span-12">
              <label className="font-bold" htmlFor="jobDescription">
                Job Description
              </label>
              <Controller
                control={control}
                name="jobDescription"
                render={({ field }) => (
                  <TextEditor
                    {...field}
                    id="jobDescription"
                    className="h-40 border outline-none px-3 text-neutral-500"
                  />
                )}
              />
              {errors.jobDescription && (
                <span className="text-red-500 text-xs">
                  {errors.jobDescription.message}
                </span>
              )}
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
