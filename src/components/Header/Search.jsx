import React, { useState, useRef, useEffect, useContext } from "react";
import Styles from "./Search.module.css";
// import { getAllProducts } from "../../apis/api";
import { useNavigate } from "react-router-dom";
import { AllProductsContext } from "../../features/AllProductsContext";
import { getAllProducts } from "../../apis/api";

const Search = (props) => {
  const inputRef = useRef(null);
  const [userSearch, setUserSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  // const [allProducts, setAllProducts] = useState(null);
  // const { allProducts } = useContext(AllProductsContext);
  const navigate = useNavigate();

  const toggleInputActive = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // useEffect(() => {
  //   const fetchAllProducts = async () => {
  //     const products = await getAllProducts();
  //     setAllProducts(products.data.data);
  //   }
  //   fetchAllProducts();
  // }, []);

 useEffect(() => {
  const timer = setTimeout(async () => {
    if (userSearch.length > 2) {
      setShowResults(true);
      try {
        const response = await getAllProducts();
        const allProducts = response.data.data;

        const filterSearchResults = allProducts.filter((item) => {
          const productNameWords = item.productname1.toLowerCase().split(' ');
          return productNameWords.some((word) => word.includes(userSearch.toLowerCase()));
        });

        setSearchResults(filterSearchResults);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      }
    } else {
      setShowResults(false);
    }
  }, 500);

  return () => {
    clearTimeout(timer);
  };
}, [userSearch]);



  const inputChangeHandler = (value) => {
    setUserSearch(value);
  };

  const changeroute = async (item) => {
    setShowResults(false);
    console.log({ item });
try {
    const response = await getAllProducts(item._id, item.variations[0]._id);
    console.log(item)
    
    if (response.data) {
      navigate(`/productdetails/${item._id}/${item.variations[0]._id}`);
    } else {
      console.error("Invalid response format from getProductDetails:", response);
      // Handle the error or show a message to the user
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
    // Handle the error or show a message to the user
  }
  }; 

  return (
    <React.Fragment>
      <div className={`${Styles.input_group} ${props.className} relative`}>
        <input
          ref={inputRef}
          type="text"
          className={`${Styles.form_control}`}
          placeholder="What are you shopping for?"
          onChange={(e) => inputChangeHandler(e.target.value)}
        />
        <div className={Styles.searchicon} onClick={toggleInputActive}>
          <i className="bx bx-search-alt"></i>
        </div>
        {showResults && (
        <div className={`absolute top-9 shadow-md rounded bg-white w-full ${Styles.dropdownresults}`}>
          <ul className={Styles.search_suggestion}>
            {searchResults?.length > 0 ? (
              searchResults.map((item) => (
                <li
                  className={`${Styles.search_li} cursor-pointer`}
                  onClick={() => changeroute(item)}
                  key={item._id}
                >
                  <a href="#">{item.productname1}</a>
                </li>
              ))
            ) : (
              <li className={Styles.search_li}>
                <a href="#">No results found</a>
              </li>
            )}
          </ul>
        </div>
      )}</div>
    </React.Fragment>
  );
};

export default Search;
