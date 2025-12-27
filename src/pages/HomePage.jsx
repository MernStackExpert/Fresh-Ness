import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import DiscountSection from '../components/Home/DiscountSection';
import RatingSection from '../components/Home/RatingSection';
import ServiceSection from '../components/Home/ServiceSection';
import FAQSection from '../components/Home/FAQSection';

const HomePage = () => {
  return (
    <div>
      <HeroSection/>
      <FeaturedProducts/>
      <DiscountSection/>
      <RatingSection/>
      <ServiceSection/>
      <FAQSection/>
    </div>
  );
};

export default HomePage;