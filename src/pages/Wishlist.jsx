import React, { useState, useEffect } from "react";
import Styles from "./Wishlist.module.css";
import Fullcontainer from "../components/UI/Fullcontainer";
import Container from "../components/UI/Container";
import Layout from "../components/Layout/Layout";
import { HiX } from "react-icons/hi";
import {
  getWishlist,
  deleteWishList,
  addWishlist,
  postCart,
  productDetailsWithID,
  varianceDetailsWithID,
} from "../apis/api";
import { editItemToCart } from "../features/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import { toast } from "react-toastify";

// const user = JSON.parse(localStorage.getItem("user"));
// const getuserId = user._id;
// const products = [];
// const whishListget = async(id) => {
//   const response = await getWishlist(id);
//   if(response.status === 200){
//     response.data.whishList.map(async (product) => {
//       const response = await productDetailsWithID(product);
//       if (response.status === 200) {
//         products.push(response.data);
//       }
//     });
//   }
// }
// whishListget(getuserId);

const Wishlist = () => {
  const cart = useSelector((state) => state.cartlist);
  const dispatch = useDispatch();
  const [wishList, setWishList] = useState(null);
  // const [idandproductid, setIdandproductid] = useState(null)
  const [userId, setUserId] = useState(null);
  const [variance, setVariance]= useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
  
    const getWishListData = async (id) => {
      console.log(id,'userId')
      const response = await getWishlist(id);
      if (response.data) {
        const products = response.data.whishList.map(async (product) => {
          const productresponse = await varianceDetailsWithID(product.productId, product.varianceId);
          if (productresponse.status === 200) {
            return productresponse.data;
          }
        });
        const productsdata = await Promise.all(products);
        console.log(productsdata)
        console.log(productsdata,'new')
  
        // const wishListData = productsdata.map((product, index) => {
        //   if (response.data.whishList[index].varianceId) {
        //     // Find the variation based on varianceId
        //     const variation = product.variations.find(variation => variation._id === response.data.whishList[index].varianceId);
        //     return variation;
        //   } else {
        //     return product;
        //   }
        // });
        
        setWishList(productsdata);
      }
    };
  
    if (user) {
      const getuserId = user._id;
      getWishListData(getuserId);
      setUserId(getuserId);
    }
  }, []);
  
  

  const handleDelete = async (data1) => {
    try {
      let createData;
      console.log(data1)
      if(data1.mainProductId){
        createData = {
          userId: userId,
          productId: data1.mainProductId,
          varianceId: data1._id,
        }
      }else{
        createData = {
          userId: userId,
          productId: data1._id,
        };
      }
      console.log(createData);
      const response = await deleteWishList(createData);
      if (response.status === 200) {
        const updatedWishlist = wishList.filter(
          (product) => product._id !== data1._id
        );
        setWishList(updatedWishlist);
        toast.success("item removed from wishlist")
      } else {
        console.log("Error Deleting Product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleAddToCart = async (ProductId) => {
    try {
      const productDetails = wishList.find(
        (product) => product._id === ProductId
      );
      const productquantity = productDetails.minord11A;
      dispatch(editItemToCart({ productDetails, productquantity }));

      // Navigate to the cart
      navigate("/cart");

      // Use setTimeout to ensure navigation completes before deleting from wishlist
      setTimeout(() => {
        // Remove from wishlist
        handleDelete(productDetails);
      }, 0);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };


  const routechangehandler = () => {
    navigate("/allproducts/categories");
  };

  return (
    <React.Fragment>
      <Layout>
        <Fullcontainer className={Styles.fullcontainer}>
          <Container className={`${Styles.container}`}>
            <div className={`${Styles.title}`}>
              <h1>
                My Wishlist
                {/* <span>9 items</span> */}
              </h1>
            </div>
            {wishList ? (
              <>
                <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {wishList.length > 0
                    ? wishList.map((data) => (
                        <div>
                          <div
                            className={`h-[200px] w-full relative rounded-t-xl ${Styles.img_container}`}
                          >
                            <div
                              className="absolute bg-white p-2 rounded-full right-4 top-4"
                      
                              onClick={() => handleDelete(data)}
                            >
                              <HiX className={`${Styles.icons} text-xl`} />
                            </div>
                            <img
                              src={data.imgs1}
                              alt=""
                              className={`h-full w-full object-cover rounded-t-xl`}
                            />
                          </div>
                          <div
                            className={`${Styles.text_container} rounded-b-xl`}
                          >
                            <h1 className={`${Styles.productname}`}>
                              {data.productname1}
                            </h1>
                            <h1 className="font-bold">
                              ₹ {data.discountprice2B}{" "}
                              <span className="line-through font-normal text-sm">
                                ₹ {data.price2A}
                              </span>
                            </h1>
                            <Button
                              value={
                                cart.cart.findIndex(
                                  (item) => item._id === data._id
                                ) >= 0
                                  ? "Go to Cart"
                                  : "Add to Cart"
                              }
                              className="w-full"
                              onClick={() => handleAddToCart(data._id)}
                            />
                          </div>
                          <div></div>
                        </div>
                      ))
                    : ""}
                </div>
              </>
            ) : wishList === null ? (
              <>
                <h1
                  className={`text-xl border rounded flex flex-col w-full py-40 items-center justify-center`}
                >
                  Your Wishlist cart is currently empty.
                  <Button
                    value="Shop Now"
                    onClick={routechangehandler}
                  ></Button>
                </h1>
              </>
            ) : (
              <>
                <div
                  role="status"
                  className="flex h-screen col-span-6 items-center justify-center"
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
              </>
            )}
          </Container>
        </Fullcontainer>
      </Layout>
    </React.Fragment>
  );
};

export default Wishlist;
