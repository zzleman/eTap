import React, { useState } from 'react';
import TextEditor from '../components/Editor/TextEditor';
import profilePhoto from '../assets/img/user.png';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formCities } from '../schemas/CreateResumeSchema';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/authSlice';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { ClimbingBoxLoader, ClipLoader, HashLoader } from 'react-spinners';
import Loading from '../components/Loading/Loading';

const schema = z.object({
  name: z.string().min(1, { message: 'Company name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  location: z.string().min(1, { message: 'Location is required' }),
  companyImg: z.string().min(1, { message: 'Company logo is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
});

const Company = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.uid;
  const [loading, setLoading] = useState(false);

  const [profilePic, setProfilePic] = useState('');
  const [urlPath, setUrlPath] = useState('');

  const handleUrlChange = e => {
    setUrlPath(e.target.value);
  };

  const addProfilePic = () => {
    setProfilePic(urlPath);
    setValue('companyImg', urlPath);
  };

  const onSubmit = async data => {
    if (!userId) {
      toast.error('User ID not found. Please log in again.');
      return;
    }
    setLoading(true);
    try {
      const userRef = doc(db, 'Users', userId);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        await updateDoc(userRef, {
          company: {
            name: data.name,
            email: data.email,
            location: data.location,
            companyImg: data.companyImg,
            description: data.description,
          },
        });

        toast.success('Company information updated successfully!');
      } else {
        toast.error('User document does not exist.');
      }
    } catch (error) {
      console.error('Error updating company information:', error);
      toast.error('Failed to update company information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompany = async () => {
    if (!userId) {
      return;
    }
    setLoading(true);
    try {
      const userRef = doc(db, 'Users', userId);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const companyData = userData.company;

        if (companyData) {
          setValue('name', companyData.name || '');
          setValue('email', companyData.email || '');
          setValue('location', companyData.location || '');
          setValue('companyImg', companyData.companyImg || '');
          setValue('description', companyData.description || '');

          setProfilePic(companyData.companyImg || '');
          setUrlPath(companyData.companyImg || '');
        }
      }
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [userId]);

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <div className="company-info px-10 xl:px-36 my-10">
      <h1 className="text-[#563D7C] font-bold mb-5 text-xl">
        Tell Us More About Your Company
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-5"
      >
        <div className="form-group flex flex-col gap-2 col-span-12 md:col-span-6">
          <label className="font-bold" htmlFor="companyName">
            Company Name
          </label>
          <span className="text-xs text-neutral-400">
            Enter your company or organization’s name.
          </span>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="border h-10 outline-none px-3 text-neutral-500"
            placeholder="Your company name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="form-group flex flex-col gap-2 col-span-12 md:col-span-6">
          <label className="font-bold" htmlFor="companyEmail">
            Company Email
          </label>
          <span className="text-xs text-neutral-400">
            Enter your company or organization’s email.
          </span>
          <input
            type="text"
            id="email"
            {...register('email')}
            className="border h-10 outline-none px-3 text-neutral-500"
            placeholder="Your company email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>
        <div className="form-group flex flex-col gap-2 col-span-12 md:col-span-6">
          <p className="font-bold">Company Logo</p>
          <div className="flex border items-center p-3 gap-5 w-4/4">
            <div className="profile-pic bg-[#eeeeee] size-28 rounded-md border flex items-center justify-center">
              {profilePic ? (
                <img className="size-full" src={profilePic} alt="Profile" />
              ) : (
                <img className="size-20" src={profilePhoto} alt="Profile" />
              )}
            </div>
            <div className="file-upload flex flex-col w-2/3">
              <span className="text-xs text-neutral-400 lg:text-nowrap">
                Enter your company or organization’s image URL.
              </span>
              <input
                type="text"
                className="h-8 border w-full rounded-md my-3 outline-none px-2"
                {...register('companyImg')}
                value={urlPath}
                onChange={handleUrlChange}
              />
              {errors.companyImg && (
                <div className="text-red-500">{errors.companyImg.message}</div>
              )}
              <p
                className="border h-7 w-24 rounded-md flex justify-center items-center cursor-pointer"
                onClick={addProfilePic}
              >
                Add Photo
              </p>
            </div>
          </div>
        </div>

        <div className="form-group flex flex-col gap-2 col-span-12 md:col-span-6">
          <label className="font-bold" htmlFor="location">
            Location
          </label>
          <span className="text-xs text-neutral-400">
            Enter your company or organization’s location.
          </span>
          <select
            id="location"
            {...register('location')}
            className="h-10 border outline-none px-3 text-neutral-500"
          >
            <option>Select Location</option>
            {formCities &&
              formCities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
          {errors.location && (
            <p className="text-red-500 text-xs">{errors.location.message}</p>
          )}
        </div>

        <div className="form-group flex flex-col gap-2 col-span-12">
          <label className="font-bold" htmlFor="description">
            Company Description
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextEditor
                id="description"
                {...field}
                className="h-40 border outline-none px-3 text-neutral-500"
                placeholder="Write a brief description about your company"
                aria-invalid={errors.description ? 'true' : 'false'}
              />
            )}
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        <div className="form-group col-span-12 flex justify-center">
          <button
            type="submit"
            className="bg-[#563D7C] text-white py-2 px-6 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Company;
