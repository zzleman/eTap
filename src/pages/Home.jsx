import React from 'react';
import Banner from '../components/Home/Banner';
import Career from '../components/Home/Career';
import Hero from '../components/Home/Hero';
import JobInfo from '../components/Home/JobInfo';
import VacancyCategories from '../components/Home/VacancyCategories';
import VacancyList from '../components/Home/VacancyList';

const Home = () => {
  return (
    <div>
      <Hero />
      <VacancyCategories />
      <VacancyList />
      <Career />
      <Banner />
      <JobInfo />
    </div>
  );
};

export default Home;
