import styled from 'styled-components';

export const SlickWrapper = styled.div`
  height: 100%;

  .slick-slider {
    height: 100%;
    background-color: #ff2233;

    .slick-list {
      height: 100%;
      .slick-track {
        height: 100%;

        .slick-slide {
          height: 100%;
          & > div {
            height: 100%;
          }
        }
      }
    }

    .slick-arrow.slick-prev {
      left: 20px !important;
      z-index: 99;
      transform: scale(1.2);
      top: 48%;
    }
    .slick-arrow.slick-next {
      right: 20px !important;
      transform: scale(1.2);
      top: 48%;
    }
    .slick-dots {
      bottom: 10px;

      li {
        margin: 0 -3px;
        button:before {
          color: rgba(255, 255, 255, 0.7) !important;
          transition: 0.3s;
        }
      }
      li.slick-active {
        button:before {
          color: #fff !important;
        }
      }
    }

    .post-gallery-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;
