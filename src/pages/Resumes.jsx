import React, { useState, useEffect } from 'react';
import verifiedIcon from '../assets/icon/verified.png';
import dislikeIcon from '../assets/icon/dislike.png';
import shareIcon from '../assets/icon/share.png';
import starIcon from '../assets/icon/star.png';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading/Loading';
import NoData from './NoData';

const Resumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { search } = useLocation();
  const navigate = useNavigate();

  const getQueryParams = queryName => {
    const params = new URLSearchParams(search);
    return params.get(queryName);
  };

  const categoryId = getQueryParams('category');
  const cityName = getQueryParams('city');
  const salaryQuantity = getQueryParams('salary');
  const experienceTotal = getQueryParams('experience');
  const jobType = getQueryParams('jobType');
  const searchQuery = getQueryParams('query');

  const getResumes = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'resumes'));
      const allResumes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      let filteredResumes = allResumes;

      if (categoryId) {
        filteredResumes = filteredResumes.filter(
          resume =>
            resume.jobCategory &&
            resume.jobCategory.toLowerCase() === categoryId.toLowerCase()
        );
      }
      if (cityName) {
        filteredResumes = filteredResumes.filter(
          resume =>
            resume.city && resume.city.toLowerCase() === cityName.toLowerCase()
        );
      }
      if (salaryQuantity) {
        filteredResumes = filteredResumes.filter(
          resume =>
            resume.salaryRange &&
            resume.salaryRange.toLowerCase() === salaryQuantity.toLowerCase()
        );
      }
      if (experienceTotal) {
        filteredResumes = filteredResumes.filter(
          resume => resume.experience && resume.experience === experienceTotal
        );
      }
      if (jobType) {
        filteredResumes = filteredResumes.filter(
          resume => resume.jobType && resume.jobType === jobType
        );
      }

      if (searchQuery) {
        filteredResumes = filteredResumes.filter(resume =>
          resume.position.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setResumes(filteredResumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = id => {
    navigate(`/resumes/${id}`);
  };

  useEffect(() => {
    getResumes();
  }, [search]);

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <div className="px-36 py-5">
      <h1 className="text-2xl my-5">Резюме пользователя</h1>
      <div>
        {resumes.length > 0 ? (
          resumes.map(resume => (
            <div
              key={resume.id}
              className="flex w-10/12 justify-between border-b border-t py-5"
            >
              <div className="left flex flex-col gap-2 w-40">
                <span className="w-28 h-10 bg-yellow-200 flex justify-center items-center">
                  {resume.salaryRange} AZN
                </span>
                <div className="flex gap-3 mb-5 text-green-500">
                  <img src={verifiedIcon} alt="" />
                  <p>Проверенно</p>
                </div>
                <div className="flex gap-3">
                  <img src={dislikeIcon} alt="" />
                  <p>Пожаловаться</p>
                </div>
                <div className="flex gap-3">
                  <img src={shareIcon} alt="" />
                  <p>Поделиться</p>
                </div>
                <div className="flex gap-3">
                  <img src={starIcon} alt="" />
                  <p>В избранное</p>
                </div>
              </div>
              <div
                className="middle flex flex-col gap-3 w-[385px] cursor-pointer"
                onClick={() => handleNavigate(resume.id)}
              >
                <div className="middle-top flex gap-3">
                  <h3 className="font-bold text-base capitalize">
                    {resume.position}
                  </h3>
                  <p className="bg-red-300 w-24 h-6 flex justify-center items-center ">
                    Срочно
                  </p>
                </div>
                <div className="middle-center flex flex-col gap-1 text-sm">
                  <p>
                    <span className="font-bold text-neutral-500">Пол: </span>
                    <span>{resume.gender}</span>
                  </p>
                  <p>
                    <span className="font-bold text-neutral-500">
                      Возраст:{' '}
                    </span>
                    <span>
                      {resume.birthDay &&
                      resume.birthDay.day &&
                      resume.birthDay.month &&
                      resume.birthDay.year
                        ? `${resume.birthDay.day} ${resume.birthDay.month} ${resume.birthDay.year}`
                        : 'No birth date available'}
                    </span>
                  </p>
                  <p>
                    <span className="font-bold text-neutral-500">
                      Опыт работы:{' '}
                    </span>
                    <span>{resume.experience}</span>
                  </p>
                  <p className="flex gap-1">
                    <span className="font-bold text-neutral-500">
                      Знание языков:{' '}
                    </span>
                    <span className="flex gap-2">
                      {Array.isArray(resume.language) &&
                      resume.language.length > 0
                        ? resume.language.map((lang, index) => (
                            <div key={index}>{lang.langChoice}</div>
                          ))
                        : 'No languages listed'}
                    </span>
                  </p>
                  <p>
                    <span className="font-bold text-neutral-500">City: </span>
                    <span>{resume.city}</span>
                  </p>
                </div>
              </div>
              <div className="right w-56 mr-9 flex flex-col items-center gap-5">
                <img
                  className="size-28 rounded-full"
                  src={resume.profilePicture}
                  alt=""
                />
                <p className="font-semibold">
                  {resume.name} {resume.surname}
                </p>
              </div>
            </div>
          ))
        ) : (
          <NoData />
        )}
      </div>
    </div>
  );
};

export default Resumes;
