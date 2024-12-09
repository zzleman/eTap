import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import verifiedIcon from '../assets/icon/verified.png';
import dislikeIcon from '../assets/icon/dislike.png';
import shareIcon from '../assets/icon/share.png';
import starIcon from '../assets/icon/star.png';
import SiteParsingIcon from '@rsuite/icons/SiteParsing';
import PhoneIcon from '@rsuite/icons/Phone';
import EmailIcon from '@rsuite/icons/Email';

import { db } from '../firebase';
const ResumeSingle = () => {
  const { id: productId } = useParams();

  const [productData, setProductData] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [relatedResumes, setRelatedResumes] = useState([]);

  const fetchAllResumes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'resumes'));
      const resumesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResumes(resumesData);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Error fetching resumes');
    }
  };

  const fetchProduct = async () => {
    try {
      const docRef = doc(db, 'resumes', productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProductData(data);

        if (data.jobCategory) {
          const categoryDocRef = doc(db, 'JobCategories', data.jobCategory);
          const categoryDocSnap = await getDoc(categoryDocRef);

          if (categoryDocSnap.exists()) {
            const categoryData = categoryDocSnap.data();
            setCategoryName(categoryData.name);
          } else {
            toast.error('Category not found');
          }
        } else {
          toast.error('No category field found in product');
        }
      } else {
        toast.error('Vacancy not found');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error fetching product data');
    }
  };

  const getRelatedResumes = () => {
    const filteredResumes = resumes.filter(
      resume =>
        resume.category === productData?.category && resume.id !== productId
    );
    setRelatedResumes(filteredResumes);
  };

  useEffect(() => {
    fetchProduct();
    fetchAllResumes();
  }, [productId]);

  if (!productData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-36 py-7">
      <h1 className="text-2xl">{productData.position}</h1>
      <div className="top flex gap-16">
        <div className="left w-9/12 text-neutral-500 text-sm">
          <div className="general-info">
            <p className="w-[134px] h-10 bg-yellow-200 flex justify-center items-center text-black font-bold my-2">
              {productData.salaryRange || 'Salary'} AZN
            </p>
            <div className="place-time text-xs py-7 flex flex-col gap-3">
              <h5 className="text-xs">{productData.city || 'Location'}</h5>
              <h5 className="text-xs">
                {productData.createdAt
                  ? new Date(
                      productData.createdAt.seconds * 1000
                    ).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </h5>

              {/* <p>
                Обновлено
                {new Date(productData.updatedAt?.toDate()).toLocaleDateString()}
              </p> */}
            </div>
          </div>

          <div className="details w-96 flex flex-col gap-3 mb-7 capitalize">
            {/* <h4 className="flex">
              <span className="text-black font-bold w-2/4">График работы:</span>
              <span>{productData.workShift || 'Schedule'}</span>
            </h4> */}
            <h4 className="text-sm flex items-center">
              <span className="text-black font-bold w-2/4">Опыт:</span>
              <span className="lowercase">
                {productData.experience || 'Experience'} years
              </span>
            </h4>
            <h4 className="text-sm flex items-center">
              <span className="text-black font-bold w-2/4">
                Willing to relocate:
              </span>
              <span className="lowercase">
                {productData.willingToRelocate ? 'yes' : 'no'}
              </span>
            </h4>
            {/* <h4 className="flex">
              <span className="text-black font-bold w-2/4">Образование:</span>
              <span>{productData.education || 'Education'}</span>
            </h4>
            <h4 className="flex">
              <span className="text-black font-bold w-2/4">Занятость:</span>
              <span>{productData.jobType || 'Employment type'}</span>
            </h4> */}
          </div>

          <div className="job-requirements flex flex-col gap-6">
            <div className="work-area">
              <p className="font-bold text-black pb-3">
                История трудоустройства:
              </p>
              <div className="work-history flex flex-col gap-5 p-5 border">
                {productData.work &&
                  productData.work.map((work, index) => {
                    const startDate = work.dateRange.startDate
                      ? new Date(
                          work.dateRange.startDate.seconds * 1000
                        ).toLocaleDateString()
                      : 'N/A';
                    const endDate = work.stillWorks
                      ? 'Present'
                      : work.dateRange.endDate
                        ? new Date(
                            work.dateRange.endDate.seconds * 1000
                          ).toLocaleDateString()
                        : 'N/A';

                    return (
                      <div
                        className="work flex flex-col gap-2 border-b border-neutral-400 pb-2"
                        key={index}
                      >
                        <p className="flex gap-3">
                          <span>City:</span>
                          {work.city}
                        </p>
                        <p className="flex gap-3">
                          <span>Company:</span>
                          {work.company}
                        </p>
                        <p className="flex gap-3">
                          <span>Position:</span>
                          {work.position}
                        </p>
                        <p className="flex gap-3">
                          <span>Skills:</span>
                          {work.skills}
                        </p>
                        <p className="flex gap-3">
                          <span>Date:</span>
                          {startDate} - {endDate}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="edu-area">
              <p className="font-bold text-black pb-3">История образования:</p>
              <div className="edu-history flex flex-col gap-5 p-5 border">
                {productData.education &&
                  productData.education.map((education, index) => {
                    const startDate = education.dateRange.startDate
                      ? new Date(
                          education.dateRange.startDate.seconds * 1000
                        ).toLocaleDateString()
                      : 'N/A';
                    const endDate = education.stillStudy
                      ? 'Present'
                      : education.dateRange.endDate
                        ? new Date(
                            education.dateRange.endDate.seconds * 1000
                          ).toLocaleDateString()
                        : 'N/A';

                    return (
                      <div
                        className="education flex flex-col gap-2 border-b border-neutral-400 pb-2 capitalize"
                        key={index}
                      >
                        <p className="flex gap-3">
                          <span>City:</span>
                          {education.city}
                        </p>
                        <p className="flex gap-3">
                          <span>University:</span>
                          {education.university}
                        </p>
                        <p className="flex gap-3">
                          <span>Degree:</span>
                          {education.degree}
                        </p>
                        <p className="flex gap-3">
                          <span>Faculty:</span>
                          {education.faculty}
                        </p>
                        <p className="flex gap-3">
                          <span>Date:</span>
                          {startDate} - {endDate}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="edu-area">
              <p className="font-bold text-black pb-3">Языки:</p>
              <div className="edu-history flex flex-col gap-5 p-5 border">
                {productData.language &&
                  productData.language.map((language, index) => {
                    return (
                      <div
                        className="language flex flex-col gap-2 border-b border-neutral-400 pb-2 capitalize"
                        key={index}
                      >
                        <p className="flex gap-3">
                          {language.langChoice} - {language.langLevel}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          {/* 
          <div className="company-desc flex flex-col gap-6 my-6">
            <h3 className="font-bold text-black">About Company:</h3>
            <div
              className="job-description "
              dangerouslySetInnerHTML={{
                __html: productData.companyDescription,
              }}
            />
          </div> */}
        </div>

        <div className="right border border-b-0 h-96 p-7 text-xs text-neutral-500 w-[485px]">
          <h1 className="uppercase font-bold text-base">
            Персональная информация
          </h1>
          <div className="middle flex gap-8 items-center my-3">
            <img
              className="size-28 rounded-full"
              src={productData.profilePicture || 'default-logo-url'}
              alt="Company Logo"
            />
            <div className="flex flex-col gap-2">
              <h5 className="font-bold pl-1 text-black">
                {productData.name} {productData.surname}
              </h5>
              <h5 className="text-xs pl-1">
                {productData.birthDay.day} {productData.birthDay.month}{' '}
                {productData.birthDay.year}
              </h5>
              <div className="flex items-center gap-3">
                <img className="w-6 h-6" src={verifiedIcon} alt="Verified" />
                <p className="text-green-600">Проверенно</p>
              </div>
            </div>
          </div>

          <div className="bottom flex flex-col gap-2">
            <div className="flex w-2/3 h-16 items-center gap-3 px-3">
              <div className="bg-neutral-300 size-8 flex items-center justify-center rounded-lg">
                <PhoneIcon className="size-5" />
              </div>

              <div>
                <p className="font-semibold">Phone number:</p>
                <span>
                  {productData.contact.dialCode}
                  {productData.contact.phone}
                </span>
              </div>
            </div>
            <div className="flex w-2/3 h-16 items-center gap-3 px-3">
              <div className="bg-neutral-300 size-8 flex items-center justify-center rounded-lg">
                <EmailIcon className="size-5" />
              </div>

              <div>
                <p className="font-semibold">Email:</p>
                <span>{productData.email}</span>
              </div>
            </div>
            <div className="flex w-2/3 items-center gap-3 px-3">
              <a
                href={productData.portfolio}
                target="_blank"
                className="text-neutral-500 border border-neutral-300 h-10 w-40 flex items-center justify-center gap-2
            hover:bg-neutral-300 hover:text-black rounded-lg"
              >
                <SiteParsingIcon className="size-5" />
                <span> check portfolio site</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeSingle;
