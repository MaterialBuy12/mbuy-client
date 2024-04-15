import Fullcontainer from "../UI/Fullcontainer";
import Container from "../UI/Container";
import Styles from "./Footer.module.css";
import img from "../../assests/logo2.png";
import { Link } from "react-router-dom";
import { CiTextAlignJustify } from "react-icons/ci";
import { getUser } from "../../apis/api";
import React, { useState, useEffect, useRef } from "react";


const Footer = (props) => {

  const handleLinkClick = () => {
    const scrollToTop = () => {
      const currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, currentScroll - currentScroll / 10);
      }
    };
    scrollToTop();
  }

  const [user, setUser] = useState(null);


  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    const getLastestUser = async (id) => {
      const response = await getUser(id);
      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(user);
      }
    };
    if (user) {
      getLastestUser(user?._id);
    }
  }, []);

  
  return (
    <React.Fragment>
      <Fullcontainer className={`${props.className}`}>
        <Container className={Styles.footer_parent}>
          <div className="grid grid-cols-1 md:grid-cols-3  gap-2">
            <div className={`${Styles.footer_div} mx-auto text-justify max-w-md`}>
              <img src={img} className={Styles.logo} alt="logo" />
              <p>
                Welcome to MaterialBuy.com, a world where quality meets convenience,
                and your dream projects are just a click away. MaterialBuy.com -
                Elevate Your Spaces, Effortlessly!
                Explore a diverse array of products on our online platform, ranging from Building Materials like Tiles,
                Plywood to Laminates, Sanitary ware, and Hardware. A home with everything.
                Enjoy the convenience of finding all your essential needs in a single destination.
              </p>
            </div>
            <div className={`${Styles.footer_div} ${Styles.second_div}`}>
              <h3>Information</h3>
              <ul>
                <li>
                  <Link to="/about" onClick={handleLinkClick}>
                    About us
                  </Link>
                </li>
                <li>
                  <Link to="/career" onClick={handleLinkClick}>
                    Careers
                  </Link>
                </li>
                {user && user.role == "Vendor" ? (
                <li>
                  <Link to="/vendor" onClick={handleLinkClick}>
                    Vendor Panel
                  </Link>
                </li>):<li>
                  <Link to="/vendor" onClick={handleLinkClick}>
                    Become a Vendor
                  </Link>
                </li>}
                <li>
                  <Link to="/contact" onClick={handleLinkClick}>
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>
            <div className={Styles.footer_div}>
              <h3>Legal</h3>
              <ul>
                <li>
                  <Link to="/terms" onClick={handleLinkClick}>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" onClick={handleLinkClick}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-policy" onClick={handleLinkClick}>
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link to="/return-policy" onClick={handleLinkClick}>
                    Returns, Refund & Cancellation Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={Styles.footer_socials}>
            <a href="https://www.facebook.com/people/The-Material-Buy/100078841177484/?mibextid=ZbWKwL" target="_blank">
              <i className="bx bxl-facebook"></i>
            </a>
            <a href="https://www.instagram.com/materialbuy/" target="_blank">
              <i className="bx bxl-instagram-alt"></i>
            </a>
            <a href="https://twitter.com/BuyMaterial" target="_blank">
              <i className="bx bxl-twitter"></i>
            </a>
            {/* <a href="https://www.facebook.com/people/Material-Buy/pfbid0V6FwTsLYtVA8d8ouq8r1dVBcLEFuqsjsxLiu42hbjHeH7RNh5UYcHfmb4CbBtksxl/?mibextid=ZbWKwL" target="_blank">
              <i className="bx bxl-facebook"></i>
            </a> */}


            {/* <i className="bx bxl-facebook"></i> */}
            {/* <i className="bx bxl-instagram-alt"></i>
            <i className="bx bxl-twitter"></i>
            <i className="bx bxl-linkedin-square"></i> */}
          </div>
          <div className={Styles.footer_bottom}>
            <p className="text-center text-white">
              ©2024 Material Buy All Rights Reserved
            </p>
          </div>
        </Container>
      </Fullcontainer>
    </React.Fragment>
  );
};

export default Footer;
