import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faMagnifyingGlass,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [catId, setCatId] = useState('');
  const [cityName, setCityName] = useState('');
  const [salary, setSalary] = useState('');
  const [experience, setExperience] = useState('');
  const [jobType, setJobType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const loc = useLocation();
  const currentPath = loc.pathname;

  const toggleNav = () => {
    setOpen(!open);
  };

  const updateQueryParams = params => {
    const searchParams = new URLSearchParams();

    Object.keys(params).forEach(key => {
      if (params[key]) {
        searchParams.append(key, params[key]);
      }
    });

    if (currentPath == '/') {
      const updatedPath = `/vacancies?${searchParams.toString()}`;
      navigate(updatedPath);
    } else {
      const updatedPath = `${currentPath}?${searchParams.toString()}`;
      navigate(updatedPath);
    }
  };

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
    updateQueryParams({
      query: event.target.value,
      category: catId,
      city: cityName,
      salary: salary,
      experience: experience,
      jobType: jobType,
    });
  };

  const handleCategoryChange = event => {
    const selectedCategoryId = event.target.value;
    setCatId(selectedCategoryId);
    updateQueryParams({
      category: selectedCategoryId,
      city: cityName,
      salary: salary,
      experience: experience,
      jobType: jobType,
      query: searchQuery,
    });
  };

  const handleCityChange = event => {
    const selectedCity = event.target.value;
    setCityName(selectedCity);
    updateQueryParams({
      category: catId,
      city: selectedCity,
      salary: salary,
      experience: experience,
      jobType: jobType,
      query: searchQuery,
    });
  };

  const handleSalaryChange = event => {
    const selectedSalary = event.target.value;
    setSalary(selectedSalary);
    updateQueryParams({
      category: catId,
      city: cityName,
      salary: selectedSalary,
      experience: experience,
      jobType: jobType,
      query: searchQuery,
    });
  };

  const handleExperienceChange = event => {
    const selectedExperience = event.target.value;
    setExperience(selectedExperience);
    updateQueryParams({
      category: catId,
      city: cityName,
      salary: salary,
      experience: selectedExperience,
      jobType: jobType,
      query: searchQuery,
    });
  };

  const handleJobTypeChange = event => {
    const selectedJobType = event.target.value;
    setJobType(selectedJobType);
    updateQueryParams({
      category: catId,
      city: cityName,
      salary: salary,
      experience: experience,
      jobType: selectedJobType,
      query: searchQuery,
    });
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'JobCategories'));
        const categoriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    getCategories();
  }, []);

  return (
    <div className="flex flex-col gap-5 my-5 lg:my-0">
      <div className="relative grid grid-cols-2 lg:flex  gap-7 lg:items-center text-white text-sm">
        <select
          name="category"
          id="category"
          className="lg:w-[350px] h-10 text-neutral-400 px-5"
          value={catId}
          onChange={handleCategoryChange}
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          name="city"
          id="city"
          className="lg:w-40 h-10 text-neutral-400 px-5"
          value={cityName}
          onChange={handleCityChange}
        >
          <option value="">Город</option>
          <option value="baku">Baku</option>
          <option value="sumgayit">Sumqayit</option>
          <option value="ganja">Ganja</option>
          <option value="nakchivan">Nakhcivan</option>
        </select>

        <select
          name="salary"
          id="salary"
          className="lg:w-40 h-10 text-neutral-400 px-5"
          value={salary}
          onChange={handleSalaryChange}
        >
          <option value="">Зарплата</option>
          <option value="0-500">0-500</option>
          <option value="500-1000">500-1000</option>
          <option value="1000-2000">1000-2000</option>
          <option value="2000-5000">2000-5000</option>
          <option value="5000+">5000+</option>
        </select>

        <div className="relative">
          <FontAwesomeIcon
            className="text-white absolute top-2.5 px-5"
            icon={faMagnifyingGlass}
          />
          <input
            className="w-40 h-10 bg-transparent border px-11 text-white"
            type="text"
            placeholder="Найти"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div>
          <button onClick={toggleNav}>
            Расширенный поиск
            <span className="mx-2">
              <FontAwesomeIcon
                className="text-white text-sm"
                icon={open ? faChevronUp : faChevronDown}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="hidden-nav relative gap-7 text-sm flex">
          <select
            name="advanced-city"
            id="advanced-city"
            className="w-40 h-10 text-neutral-400 px-5"
            value={experience}
            onChange={handleExperienceChange}
          >
            <option value="">Опыт</option>
            <option value="<1">Менее 1 года</option>
            <option value="1-3">1-3 года</option>
            <option value="3-5">3-5 года</option>
            <option value=">5">Более 5 лет</option>
          </select>
          <select
            name="advanced-salary"
            id="advanced-salary"
            className="w-40 h-10 text-neutral-400 px-5"
            value={jobType}
            onChange={handleJobTypeChange}
          >
            <option value="">тип занятости</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default Navbar;
