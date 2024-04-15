import React, { useContext } from "react";
import "./CategoriesNavbar.css";
import Fullcontainer from "../UI/Fullcontainer";
import Container from "../UI/Container";
import { Link } from "react-router-dom";
import { AllProductsContext } from "../../features/AllProductsContext";


const CategoriesNavbar = (props) => {
  const categories = useContext(AllProductsContext);

  return (
    <>
      <Fullcontainer
        className={"bg-gray-800 hidden md:bg-gray-900 fullcontainer categorynavmob"}
      >
        <Container>
          <nav className="main-nav1">
            <div
              className={
                props.categories
                  ? "menu-link1 mobile-menu-link1 bg-gray-900"
                  : "menu-link1"
              }
            >
              {categories.categoriesData ? (
                <ul>
                  <li className="firstLi">
                    <Link
                      to={`/allproducts/subcategory=${categories.categoriesData[0]?.title}`}
                    >
                      {categories.categoriesData[0]?.title}
                    </Link>
                  </li>
                  {categories.categoriesData.slice(1).map((item, index) => (
                    <li key={item.title} className="icons1">
                      <Link to={`/allproducts/subcategory=${item.title}`}>
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}

              {/* {categories.categoriesData?.map((item, index) => (
                <li key={index} className="icons1">
                  <Link to={`/allproducts/subcategory=${item.title}`}>
                    {item.title}
                  </Link>
                </li>
              ))} */}
            </div>

            {/* hamburget menu start  */}
          </nav>
        </Container>
      </Fullcontainer>
    </>
  );
};

export default CategoriesNavbar;
