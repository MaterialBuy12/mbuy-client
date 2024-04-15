import React, { useEffect, useState } from "react";
import Styles from "./AllProfessional.module.css";
import Fullcontainer from "../components/UI/Fullcontainer";
import Container from "../components/UI/Container";
import Layout from "../components/Layout/Layout";
import MainSide from "../components/UI/MainSide";
import { useParams } from "react-router-dom";
import { getProfessionals } from "../apis/api";
import MultiCarousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Profside from "../assests/professionalside.jpg"

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 1,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 767, min: 250 },
    items: 1,
    slidesToSlide: 1,
  },
};

const AllProfessionals = () => {
  const { category } = useParams();
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    const getallprofessionals = async () => {
      const allprofessionals = await getProfessionals();
      //   console.log(allprofessionals.data);
      const filterprofessions = allprofessionals.data.filter(
        (item) => item.cat === category
      );
      if (filterprofessions) {
        console.log(filterprofessions);
        // console.log(filterprofessions);
        setProfessionals(filterprofessions);
      }
    };
    getallprofessionals();
  }, []);
  return (
    <Layout>
      <Fullcontainer className={Styles.fullcontainer}>
        <Container className={`${Styles.container} grid grid-cols-5 gap-4`}>
          <div className={`col-span-1 ${Styles.about_side}`}>
            <MainSide image={Profside} />
          </div>
          <div className={`col-span-5 md:col-span-4 ${Styles.about_main}`}>
            <h1 className="text-3xl font-semibold" style={{ color: "#102c44" }}>
              {category}
            </h1>
            <div className={`grid grid-cols-6 lg:grid-cols-8 gap-3 mt-3`}>
              {professionals.length > 0 ? (
                professionals.map((item) => (
                  <div
                    className={`col-span-3 relative md:col-span-2 lg:col-span-2 bg-slate-200 rounded-md p-3 ${Styles.allprofessionalscard}`}
                    key={item._id}
                  >
                    <MultiCarousel
                      className=""
                      responsive={responsive}
                      autoPlay={true}
                      swipeable={true}
                      draggable={true}
                      infinite={true}
                      partialVisible={false}
                      showDots={false}
                    // showArrows={false}
                    >
                      {item.img ? (
                        <img
                          src={item.img}
                          className={`rounded-lg ${Styles.card_img}`}
                        ></img>
                      ) : (
                        ""
                      )}
                      {item.img2 ? (
                        <img
                          src={item.img2}
                          className={`rounded-lg ${Styles.card_img}`}
                        ></img>
                      ) : (
                        ""
                      )}
                      {item.img3 ? (
                        <img
                          src={item.img3}
                          className={`rounded-lg ${Styles.card_img}`}
                        ></img>
                      ) : (
                        ""
                      )}
                      {item.img4 ? (
                        <img
                          src={item.img4}
                          className={`rounded-lg ${Styles.card_img}`}
                        ></img>
                      ) : (
                        ""
                      )}
                    </MultiCarousel>
                    <button
                      className={`absolute bottom-24 mr-5 lg:bottom-20 right-0 ${Styles.contact_btn}`}
                    >
                      <a href={`mailto:contact@materialbuy.com?subject=Enquiry for ${item.cat} - ${item.name}`}>Contact</a>
                    </button>
                    <div className="flex items-center mt-2">
                      <img
                        src={item.img}
                        alt=""
                        className="w-12 h-12 rounded-full"
                      />
                      <h1 className={`font-semibold text-gray-700 ml-2`}>
                        {item.name}
                        <p className="text-sm">Experience: {item.expr} yrs</p>
                      </h1>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-screen">
                  <h1>No Professionals found</h1>
                </div>
                // ""
              )}
            </div>
          </div>
        </Container>
      </Fullcontainer>
    </Layout>
  );
};

export default AllProfessionals;
