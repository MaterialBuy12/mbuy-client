import React, { useState, useEffect } from 'react';
import Styles from './AllProducts.module.css';
import ProductList from '../components/productlist/ProductList';
import {
  getCategories,
  getSubCategories,
  getSubSubCategories,
  getSubSubProduct,
  getCategoryProduct,
  getSubCategoryProduct
} from '../apis/api';
import { useParams, useNavigate } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';

const AllProducts = () => {
  const [categories, setCategories] = useState(null);
  const { category } = useParams();
  const navigation = useNavigate();
  const [pagelocation, setPagelocation] = useState(null);
  const [nodatafound, setNodatafound] = useState(false);
  const [sidetabletitle, setSidetabletitle] = useState('Browse Our Products');
  const [categoriesProduct, setCategoriesProduct] = useState(null);
  const [altProducttitle, setAltProductTitle] = useState(null);

  useEffect(() => {
    // getting all the categories
    if (category === 'categories') {
      setCategories(null);
      setCategoriesProduct(null);
      const getCategoriesData = async () => {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        // setPagelocation('> All Categories');
        setPagelocation([
          {
            title: <AiFillHome className="mr-1 text-xl" />,
            path: '/'
          },
          {
            title: '> All Categories',
            path: '/allproducts/categories'
          }
        ]);
      };
      getCategoriesData();
    } else if (category.includes('subsubcategoryp')) {
      // getting the products of subsubcategory
      setCategories(null);
      const getSubSubCategoriesData = async () => {
        const subsubcategoriesData = await getSubSubProduct(
          category.split('=')[1]
        );
        if (subsubcategoriesData.data.errors.length > 0) {
          setCategories(subsubcategoriesData.data.errors);
          // setPagelocation(
          //   `> ${subsubcategoriesData.data.errors[0].categoryid} > ${subsubcategoriesData.data.errors[0].subcategory} > ${subsubcategoriesData.data.errors[0].subsubcategory}`
          // );

          setPagelocation([
            {
              title: <AiFillHome className="mr-1 text-xl" />,
              path: '/'
            },
            {
              title: '> ${subsubcategoriesData.data.errors[0].categoryid} ',
              path: `/allproducts/subcategory=${subsubcategoriesData.data.errors[0].categoryid}`
            },
            {
              title: '> ${subsubcategoriesData.data.errors[0].subcategory} ',
              path: `allproducts/subsubcategory=${subsubcategoriesData.data.errors[0].subcategory}`
            },
            {
              title: '> ${subsubcategoriesData.data.errors[0].subsubcategory} ',
              path: `#`
            }
          ]);
          setSidetabletitle(`${category.split('=')[1]}`);
        } else {
          setCategories(null);
          setNodatafound(true);
          setPagelocation((prev) => prev + ` > ${category.split('=')[1]}`);
        }
      };
      getSubSubCategoriesData();
    } else if (category.includes('subsubcategory')) {
      // getting the subsubcategory of subcategory
      setCategories(null);
      setCategoriesProduct(null);
      const getSubSubCategoriesData = async () => {
        const subsubcategoriesData = await getSubSubCategories();
        const subsubcategories = subsubcategoriesData.data.filter(
          (item) => item.subcategoryname === category.split('=')[1]
        );
        if (subsubcategories.length > 0) {
          setCategories(subsubcategories);
          setSidetabletitle(`${category.split('=')[1]}`);
          // setPagelocation(
          //   `> ${subsubcategories[0].categoryname} > ${category.split('=')[1]}`
          // );
          setPagelocation([
            {
              title: <AiFillHome className="mr-1 text-xl" />,
              path: '/'
            },
            {
              title: `> ${subsubcategories[0].categoryname}`,
              path: `/allproducts/subcategory=${subsubcategories[0].categoryname}`
            },
            {
              title: `> ${subsubcategories[0].subcategoryname}`,
              path: `#`
            }
          ]);
        } else {
          setCategories(null);
          setNodatafound(true);
          setSidetabletitle(`${category.split('=')[1]}`);
          setPagelocation((prev) => prev + ` > ${category.split('=')[1]}`);
        }
      };
      getSubSubCategoriesData();

      // code for getting product with subcategory but without subsubcategory
      const getSubCatProduct = async () => {
        const response = await getSubCategoryProduct(category.split('=')[1]);
        const productarray = response.data.data.filter(
          (data) => !data.subsubcategory
        );
        // console.log(productarray);
        if (productarray.length > 0) {
          setCategoriesProduct(productarray);
        } else {
          setCategoriesProduct(null);
        }
      };
      getSubCatProduct();
    } else if (category.includes('subcategory')) {
      // getting the subcategory of category
      setCategories(null);
      setCategoriesProduct(null);
      const getSubCategoriesData = async () => {
        const subcategoriesData = await getSubCategories();
        const subcategories = subcategoriesData.data.filter(
          (item) => item.categoryname === category.split('=')[1]
        );
        setCategories(subcategories);
        // setPagelocation(`> ${category.split('=')[1]}`);
        setPagelocation([
          {
            title: <AiFillHome className="mr-1 text-xl" />,
            path: '/'
          },
          {
            title: `> ${category.split('=')[1]}`,
            path: `#`
          }
        ]);
        setSidetabletitle(`${category.split('=')[1]}`);
      };
      getSubCategoriesData();

      // code for getting the products without sub and subsubcategory
      const getCatProduct = async () => {
        const response = await getCategoryProduct(category.split('=')[1]);
        const productarray = response.data.data.filter(
          (data) => !data.subcategory && !data.subsubcategory
        );
        console.log(productarray);
        if (productarray.length > 0) {
          setCategoriesProduct(productarray);
        } else {
          setCategoriesProduct(null);
        }
      };
      getCatProduct();
    }

    const scrollToTop = () => {
      const currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, currentScroll - currentScroll / 10);
      }
    };
    scrollToTop();
  }, [category]);

  const changethepage = async (data) => {
    console.log(data, 'data');
    // checking what user clicked on and navigating accordingly
    if (data._id && data.imgs1) {
      navigation(`/productdetails/${data.mainProductId}/${data._id}`);
    } else if (data.subcategory) {
      navigation(`/allproducts/subsubcategory=${data.subcategory}`);
    } else if (data.subsubcategory) {
      // navigation(`/allproducts/subsubcategoryp=${data.subsubcategory}`);
      navigation(`/products/${data.subsubcategory}`);
    } else if (!data.subcategory) {
      navigation(`/allproducts/subcategory=${data.title}`);
    }
  };
  return (
    <>
      <ProductList
        categoriesArray={categories}
        pagelocation={pagelocation}
        routechangehandler={changethepage}
        nodatafound={nodatafound}
        sidetabletitle={sidetabletitle}
        productarray={categoriesProduct}
        producttitle={altProducttitle}
      />
    </>
  );
};

export default AllProducts;
