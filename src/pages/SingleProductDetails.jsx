import React, { useState, useEffect } from "react";
import ProductDetails from "../components/productDetails/ProductDetails";
import Layout from "../components/Layout/Layout";
import { productDetailsWithID, getProdVariant } from "../apis/api";
import { useParams } from "react-router-dom";
import Fullcontainer from "../components/UI/Fullcontainer";
import Container from "../components/UI/Container";

const SingleProductDetails = () => {
  const [productsDetails, setProductsDetails] = useState(null);
  const [prodId, setProdId] = useState(null);
  const { productid, varianceid } = useParams();
  const [activevariant, setActiveVariant] = useState(null);
  const [mainproduct, setMainProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if (varianceid.includes("=")) {
    //   const distparam = varianceid.split("=");
    //   setProdId(distparam[0]);
    //   if (!mainproduct) {
    //     const getProductDetails = async () => {
    //       const productdetails = await productDetailsWithID(distparam[0]);
    //       setMainProduct(productdetails.data);
    //       setProductsDetails(
    //         productdetails.data.variations[parseInt(distparam[1])]
    //       );
    //       setActiveVariant(parseInt(distparam[1]));
    //     };
    //     getProductDetails();
    //   } else {
    //     setProductsDetails(mainproduct.variations[parseInt(distparam[1])]);
    //   }
    // } else {
      // if (!mainproduct) {
      setLoading(true);
      const getProductDetails = async () => {
        const productdetails = await getProdVariant(productid, varianceid);
        console.log("Productdetails: ", productdetails.data.data);
        const filterVariant = productdetails.data.data.variations.filter((item)=>item._id === varianceid);
        setProductsDetails(filterVariant[0]);
        setMainProduct(productdetails.data.data);
        setActiveVariant(0);
      };
      getProductDetails();
      setProdId(productid);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    // }

    // setLoading(false);

    const scrollToTop = () => {
      const currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, currentScroll - currentScroll / 10);
      }
    };
    scrollToTop();
  // }
}, [varianceid, productid]);

  if (loading) {
    return (
      <Layout>
        {/* <Fullcontainer> */}
        {/* <Container> */}

        <div className="w-screen py-2 w-max-[1200px] h-[70vh] flex justify-center items-center bg-[#f3f3f3]">
          <div
            role="status"
            className="flex w-screen md:w-[80%]  w-max-[1200px] h-full items-center justify-center border bg-white"
          >
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-100 animate-spin dark:text-gray-600 fill-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
            <h1>Loading...</h1>
          </div>
        </div>
        {/* </Container> */}
        {/* </Fullcontainer> */}
      </Layout>
    );
  } else {
    return (
      <Layout key={prodId}>
        <ProductDetails
          productData={productsDetails}
          productId={prodId ? prodId : ""}
          mainproduct={mainproduct}
          // activevariant={activevariant}
        />
      </Layout>
    );
  }
};

export default SingleProductDetails;
