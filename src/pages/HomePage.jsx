import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import DiscountSection from '../components/Home/DiscountSection';

const HomePage = () => {
  return (
    <div>
      <HeroSection/>
      <FeaturedProducts/>
      <DiscountSection/>
    </div>
  );
};

export default HomePage;