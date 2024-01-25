import React from 'react';
import Slick from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { SlickWrapper } from './SlickSlider.style';

export default function SlickCarousel({ data }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  console.log(data ? data : null);

  return (
    <SlickWrapper>
      <Slick {...settings}>
        {!!data?.length &&
          data?.map((image, key) => (
            <img
              className="post-gallery-image"
              src={image}
              alt={'post'}
              key={`post-slick-slider-img-${key}`}
            />
          ))}
      </Slick>
    </SlickWrapper>
  );
}
