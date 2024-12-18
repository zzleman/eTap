import React, { useState, useEffect } from 'react';
import col from '../assets/icon/col.png';
import row from '../assets/icon/row.png';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import VacancyListSingle from '../components/Vacancy/VacancyListSingle';
import Loading from '../components/Loading/Loading';

const VacancySingle = () => {
  const { id: productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedVacancies, setRelatedVacancies] = useState([]);

  const fetchAllVacancies = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'vacancies'));
      const vacanciesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVacancies(vacanciesData);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
      toast.error('Error fetching vacancies');
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'vacancies', productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProductData(data);

        if (data.category) {
          const categoryDocRef = doc(db, 'JobCategories', data.category);
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
    } finally {
      setLoading(false);
    }
  };

  const getRelatedVacancies = () => {
    setLoading(true);
    try {
      const filteredVacancies = vacancies.filter(
        vacancy =>
          vacancy.category === productData?.category && vacancy.id != productId
      );
      setRelatedVacancies(filteredVacancies);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchAllVacancies();
  }, [productId]);

  useEffect(() => {
    if (productData && vacancies.length > 0) {
      getRelatedVacancies();
    }
  }, [productData, vacancies]);

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <div className="px-36">
      <div className="top">
        <div className="pre-detail mt-3">
          <div>
            {categoryName && (
              <Breadcrumb path={`/Главнная/Вакансии/${categoryName}`} />
            )}
          </div>
        </div>

        <div className="job py-8">
          <div className="main flex justify-between mb-7">
            <h1 className="text-3xl font-bold">
              {productData.title || 'Job Title'}
            </h1>
            <div className="flex">
              <img className="size-6" src={col} alt="" />
              <img className="size-6" src={row} alt="" />
            </div>
          </div>

          <div className="top flex gap-16">
            <div className="left w-9/12 text-neutral-500 text-sm">
              <div className="general-info">
                <p className="w-[104px] h-10 bg-yellow-200 flex justify-center items-center text-black font-bold">
                  {productData.salary || 'Salary'} AZN
                </p>
                <div className="place-time text-xs py-7 flex flex-col gap-3">
                  <h5>{productData.location || 'Location'}</h5>
                  <p>
                    Обновлено:{' '}
                    {new Date(
                      productData.createdAt?.toDate()
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="details w-96 flex flex-col gap-3 mb-10 capitalize">
                <p className="flex">
                  <span className="text-black font-bold w-2/4">
                    График работы:
                  </span>
                  <span>{productData.workShift || 'Schedule'}</span>
                </p>
                <p className="flex">
                  <span className="text-black font-bold w-2/4">Опыт:</span>
                  <span>{productData.experience || 'Experience'} years</span>
                </p>
                <p className="flex">
                  <span className="text-black font-bold w-2/4">
                    Образование:
                  </span>
                  <span>{productData.education || 'Education'}</span>
                </p>
                <p className="flex">
                  <span className="text-black font-bold w-2/4">Занятость:</span>
                  <span>{productData.jobType || 'Employment type'}</span>
                </p>
              </div>

              <div className="job-requirements flex flex-col gap-6">
                <p className="font-bold text-black text-base">
                  Должностные объязанности:
                </p>
                <div
                  className="job-description"
                  dangerouslySetInnerHTML={{
                    __html: productData.jobDescription,
                  }}
                />
              </div>

              <div className="company-desc flex flex-col gap-6 my-6">
                <p className="font-bold text-black text-base">About Company:</p>
                <div
                  className="job-description "
                  dangerouslySetInnerHTML={{
                    __html: productData.description,
                  }}
                />
              </div>
            </div>

            <div className="right border border-b-0 h-96 p-8 text-xs text-neutral-500 w-[485px]">
              <h1 className="uppercase font-bold text-base">Компания</h1>
              <div className="middle flex gap-8 items-center my-7">
                <img
                  className="h-14 w-14"
                  src={productData.companyImg || 'default-logo-url'}
                  alt="Company Logo"
                />
                <div>
                  <p className="font-bold pl-1 text-black">
                    {productData.companyName || 'Company Name'}
                  </p>
                  <div className="flex items-center gap-3 text-green-600">
                    <VerifiedUserOutlinedIcon style={{ fontSize: 'large' }} />
                    <p>Проверенно</p>
                  </div>
                </div>
              </div>

              <div className="bottom flex flex-col gap-5">
                <h3 className="uppercase font-bold text-base">Contact</h3>
                <p>
                  Войдите в личный кабинет или зарегистрируйтесь для просмотра
                  контактов работодателя.
                </p>
                <button className="text-green-500 border border-green-500 h-10 w-[88px]">
                  Войти
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="utils flex justify-center gap-14 text-xs text-neutral-500 mb-7">
          <div className="flex gap-3 items-center">
            <StarOutlineOutlinedIcon style={{ fontSize: 'large' }} />
            <p>В избранное</p>
          </div>
          <div className="flex gap-3 items-center">
            <ThumbDownOutlinedIcon style={{ fontSize: 'large' }} />
            <p>Пожаловаться</p>
          </div>
          <div className="flex gap-3 items-center">
            <ShareOutlinedIcon style={{ fontSize: 'large' }} />
            <p>Поделиться</p>
          </div>
        </div>
      </div>

      <div className="related-vacancies ">
        <p className="bg-yellow-100 h-10 flex items-center px-5 text-sm font-bold border-b">
          Похожие вакансии
        </p>
        {relatedVacancies && relatedVacancies.length > 0 ? (
          relatedVacancies.map(vacancy => (
            <VacancyListSingle {...vacancy} key={vacancy.id} />
          ))
        ) : (
          <p className="m-4 text-sm">No related vacancies found...</p>
        )}
        <div className="flex justify-center my-10">
          <button className="h-10 w-44 text-xs border">
            Все новости и статьи
          </button>
        </div>
      </div>
    </div>
  );
};

export default VacancySingle;
