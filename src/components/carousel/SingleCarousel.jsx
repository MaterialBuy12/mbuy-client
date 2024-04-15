import React, { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Button from "../UI/Button";
import Styles from "./SingleCarousel.module.css";
import { useNavigate } from "react-router-dom";

const SingleCarousel = (props) => {
  const navigation = useNavigate();
  return (
    <React.Fragment>
      {props.mainCarouselData && (
        <Carousel
          autoPlay
          showThumbs={false}
          infiniteLoop
          interval={2000}
          showStatus={false}
          // className="h-s[70vh]"
          className={`${Styles.carouselcontainer} ${props.className}`}
        >
          {props.mainCarouselData?.map((data, index) => {
            if (data.length > 5) {
              return (
                <div className="h-full w-full" key={index}>
                  <img
                    src={data}
                    // src="	https://materialbuy-static.s3.ap-south-1.amazonaws.com/ad99a95afe0ec6e0d66384d1e47f80f2"
                    alt="carousel img"
                    className="h-full bg-center w-full object-contain object-center"
                  />
                  {props.type != "service" ? (
                    <Button
                      value="All Products"
                      className={`${Styles.all_products}`}
                      onClick={() => {
                        navigation("/allproducts/categories");
                      }}
                    ></Button>
                  ) : null}
                </div>
              );
            }
          })}
        </Carousel>
      )}
    </React.Fragment>
  );
};

export default SingleCarousel;
