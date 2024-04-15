import React, { useEffect, useMemo, useState } from "react";
import Styles from "./Cart_card.module.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementcart,
  incrementcart,
  updateprice,
  userinputquantity,
  postcart,
} from "../../features/cartSlice";
import { getCssDeals, postCart, productDetailsWithID } from "../../apis/api";
import { useNavigate } from "react-router-dom";
import { FaArrowDown, FaChevronDown } from "react-icons/fa";

let product = null;

const Cart_card = (props) => {
  const variance = useVariance(props.product);
  const [userinput, setUserInput] = useState(parseInt(props.product.quantity));
  // const cart = useSelector((state) => state.cartlist);
  const navigation = useNavigate();

  const dispatch = useDispatch();
  const minusitemhandler = () => {
    if (userinput > parseInt(props.product.minord11A)) {
      dispatch(decrementcart(props.product._id));
      dispatch(updateprice(props.product._id));
      setUserInput((prev) => parseInt(prev) - 1);
      props.onBtnValueChange("Calculate Cart");
    }
  };

  const plusitemhandler = () => {
    if (userinput < parseInt(props.product.maxord11B)) {
      dispatch(incrementcart(props.product._id));
      dispatch(updateprice(props.product._id));
      setUserInput((prev) => parseInt(prev) + 1);
      props.onBtnValueChange("Calculate Cart");
    }
  };

  const removecartitemhandler = () => {
    props.removeitem(props.product._id);
  };

  const setthequantity = async () => {
    if (
      userinput !== "" &&
      userinput >= parseInt(props.product.minord11A) &&
      userinput <= parseInt(props.product.maxord11B)
    ) {
      // console.log("valid user input", userinput);
      dispatch(
        userinputquantity({ id: props.product._id, quantity: userinput })
      );
    } else if (
      userinput === "" ||
      userinput < parseInt(props.product.minord11A)
    ) {
      // console.log("Invalid user input", userinput);
      dispatch(
        userinputquantity({
          id: props.product._id,
          quantity: props.product.minord11A,
        })
      );
      setUserInput(props.product.minord11A);
    } else if (userinput > parseInt(props.product.maxord11B)) {
      // console.log("Invalid user input", userinput);
      dispatch(
        userinputquantity({
          id: props.product._id,
          quantity: props.product.maxord11B,
        })
      );
      setUserInput(props.product.maxord11B);
    }
  };

  const routetoproduct = (product) => {
    if (product.mainProductId) {
      const getProductDetails = async (id) => {
        const productdetails = await productDetailsWithID(id);
        console.log({ productdetails });
        console.log(product._id)
        const productsvariation = productdetails.data.variations.findIndex(
          (item) => item._id === product._id
        );
        const variation = productdetails.data.variations[productsvariation]._id
        console.log(variation)
        navigation(
          `/productdetails/${product.mainProductId}/${variation}`
        );
      };
      getProductDetails(product.mainProductId);
    } else {
      navigation(`/productdetails/${product._id}`);
    }
  };
  return (
    <React.Fragment>
      <div
        className={`${Styles.cart_card_img} ${props.className} col-span-7 flex flex-col md:flex-row break-words py-2 md:mr-2`}
        key={props.product._id}
      >
        <div className={`flex w-full`}>
          <div className={`h-32 ${Styles.productimgdiv}`}>
            <img
              src={props.product.imgs1}
              alt=""
              className={`object-cover h-full ${Styles.productimg}`}
            />
          </div>
          <div className={`px-2 ${Styles.producttitle}`}>
            <p
              className={` lg:text-lg  font-semibold capitalize cursor-pointer`}
              onClick={() => routetoproduct(props.product)}
            >
              {props.product.productname1}
            </p>
            <p className={`text-xs`}>
              (₹{props.product.cartvalue / props.product.quantity}/unit)
            </p>
            <AppliedDiscount
              product={props.product}
              variance={variance}
              updateTotalDiscount={props.updateTotalDiscount}
            />
          </div>
        </div>
        <div
          className={`${Styles.cart_card_content} ml-1 flex flex-col mt-2 md:mt-0 items-center md:items-end`}
        >
          <div className={`flex ${Styles.edit_cart_quantity} rounded`}>
            <button
              className={`px-2 text-2xl hover:bg-slate-100`}
              onClick={minusitemhandler}
            >
              -
            </button>
            <input
              type="number"
              className={`w-12 text-center`}
              value={userinput}
              min={props.product.minord11A}
              onChange={(e) => setUserInput(e.target.value)}
              onBlur={() => setthequantity()}
            />
            <button
              className={`px-2 text-2xl hover:bg-slate-100`}
              onClick={plusitemhandler}
            >
              +
            </button>
          </div>
          <p
            className={`cursor-pointer md:mr-5`}
            onClick={removecartitemhandler}
          >
            Remove
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Cart_card;

const useVariance = ({ mainProductId, _id, categoryid }) => {
  const [variance, setVariance] = useState({});
  const getProductDetails = async (id) => {
    const productdetails = await productDetailsWithID(id);
    const productsvariation = productdetails.data.variations.find((item) => {
      console.log({ "item._id": item._id, _id, mainProductId });
      return item._id === _id;
    });
    // console.log({ productdetails, productsvariation, id: categoryid });
    setVariance(productsvariation);
  };
  useEffect(() => {
    getProductDetails(mainProductId);
  }, [mainProductId]);
  return variance;
};

const AppliedDiscount = ({ product, updateTotalDiscount, variance }) => {
  const [discount, setDiscount] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState("");
  // console.log({ product });

  const checkCssDeals = async (product) => {
    console.log({ product });
    try {
      const response = await getCssDeals(`category=${product.categoryid}`);
      const data = response.data;
      // console.log({ data });
      const isSubsubCategory = data.find(
        (item) => item.subsubcategory === product.subsubcategory
      );
      if (isSubsubCategory) return setDiscount(+isSubsubCategory.percentage);
      const isSubCategory = data.find(
        (item) => item.subcategory === product.subcategory
      );
      // console.log({ isSubCategory, product: product });
      if (isSubCategory) return setDiscount(+isSubCategory.percentage);
      const category = data.find(
        (item) => item.category === product.categoryid
      );
      if (category) return setDiscount(+category.percentage);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // console.log(product, { variance });
    if (variance?.dod) {
      setDiscount(+variance.discount);
      setAppliedDiscount("Deal of the day");
    } else {
      checkCssDeals(variance);
      setAppliedDiscount("CSS Deal");
    }
  }, [variance]);

  useEffect(() => {
    if (discount) {
      const discount_price = (+product.cartvalue * discount) / 100;
      updateTotalDiscount({ [product._id]: discount_price });
    }
  }, [discount, product.quantity]);

  if (discount) {
    const discounted_price = (+product.cartvalue * (100 - discount)) / 100;
    // const discounted_cart_value = discounted_price * product.quantity;
    return (
      <div>
        <p className={`font-bold text-xl`}>
          <span className="line-through text-gray-600 text-lg mr-2">
            ₹{product.cartvalue}
          </span>
          <span>₹{discounted_price}</span>
          /-
        </p>
        <p className="text-base text-green-500 font-semibold">
          <span>{appliedDiscount} Applied </span>
          <span className="ml-2">{discount}%</span>
        </p>
        <p className="text-base text-red-500 font-semibold">
          <span>GST -</span>
          <span className="ml-2">{variance.taxpercent3}%</span>
        </p>
      </div>
    );
  }

  return <p className={`font-bold text-xl`}>₹{product.cartvalue} /-</p>;
};
