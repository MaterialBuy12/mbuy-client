import React from 'react';
// import MultiCarousel from 'react-multi-carousel';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';
import Styles from './MultiCarousel.module.css';
import ProductDetails from '../productDetails/ProductDetails';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SingleProductDetails from '../../pages/SingleProductDetails';
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 1
  },
  mobile: {
    breakpoint: { max: 767, min: 250 },
    items: 2,
    slidesToSlide: 1
  }
};

const MultiCarousels = (props) => {
  const navigation = useNavigate();
  const showProductHandler = async (data) => {
    console.log('Product Details: ', data);
    if (!data.title) {
      navigation(`/productdetails/${data.mainProductId}/${data._id}`);
    } else {
      navigation(`/allproducts/subcategory=${data.title}`);
    }
  };
  return (
    <React.Fragment>
      {props.multiCarouselData && (
        <div className={`px-2 mt-3`}>
          <div className={`flex items-center justify-between`}>
            <h1 className={`text-2xl tracking-tight font-semibold`}>
              {props.titleof}
            </h1>
            {props.datatype != 'Frequently' && (
              <Link
                to={
                  props.datatype != 'categories'
                    ? `/products/${props.datatype}`
                    : `/allproducts/categories`
                }
                className=""
              >
                <p>
                  See everything
                  <span aria-hidden="true"> &rarr;</span>
                </p>
              </Link>
            )}
          </div>
          <Carousel
            // containerClass={`w-full`}
            responsive={responsive}
            autoPlay={true}
            infinite={true}
            // showDots={false}
            // swipeable={false}
            // draggable={false}
            // focusOnSelect={false}
            arrows
            // customRightArrow={<CustomRightArrow />}
            // customLeftArrow={<CustomLeftArrow />}
          >
            {props.multiCarouselData?.map((product, index) => (
              <div>
                <li
                  key={product.id || index}
                  className="inline-flex items-center justify-center flex-col text-center lg:w-auto m-3"
                  onClick={() => {
                    showProductHandler(product);
                  }}
                >
                  <div className="group relative">
                    <div className="aspect-w-1 shadow-md aspect-h-1 w-full overflow-hidden rounded-t-md bg-gray-200">
                      {product.imgs1 ? (
                        <img
                          src={product.imgs1}
                          alt={product.imgs1}
                          className="h-full w-full object-cover aspect-square object-center group-hover:opacity-75"
                        />
                      ) : (
                        <img
                          src={product.img}
                          className="h-full w-full object-cover aspect-square object-center group-hover:opacity-75"
                        />
                      )}
                    </div>
                    <div
                      className={`${Styles.dod_card_bottoM} rounded-b-md ${
                        props.datatype !== 'categories' ? 'min-h-[60px]' : ''
                      } flex flex-col items-center justify-center`}
                    >
                      {product.productname1 ? (
                        <h3
                          className={`font-semibold text-white p-2 ${Styles.overflowname}`}
                        >
                          {product.productname1}
                        </h3>
                      ) : (
                        <h3 className=" font-semibold text-white p-2">
                          <span
                            className={`absolute inset-0 ${Styles.overflowname}`}
                          />
                          {product.title}
                        </h3>
                      )}
                    </div>
                    {props.datatype === 'dealsoftheday' && (
                      <>
                        <h1 className="absolute top-5 text-sm font-semibold text-white bg-red-600 px-1 rounded-r-full ">
                          - {product.discount}%
                        </h1>
                      </>
                    )}
                  </div>
                </li>
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </React.Fragment>
  );
};

export default MultiCarousels;

const CustomRightArrow = ({ onClick, ...rest }) => {
  const {
    onMove,
    carouselState: { currentSlide, deviceType }
  } = rest;
  // onMove means if dragging or swiping in progress.
  return <button onClick={() => onClick()} />;
};
