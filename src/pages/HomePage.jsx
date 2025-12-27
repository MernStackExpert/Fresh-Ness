import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import DiscountSection from '../components/Home/DiscountSection';
import RatingSection from '../components/Home/RatingSection';
import ServiceSection from '../components/Home/ServiceSection';

const HomePage = () => {
  return (
    <div>
      <HeroSection/>
      <FeaturedProducts/>
      <DiscountSection/>
      <RatingSection/>
      <ServiceSection/>
    </div>
  );
};

export default HomePage;