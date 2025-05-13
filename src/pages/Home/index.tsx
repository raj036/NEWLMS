import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Img,
  Text,
  Heading,
  RatingBar,
  Button,
  Slider,
} from "../../components";
import { Link, useNavigate } from "react-router-dom";
import AliceCarousel, { EventObject, DotsItem } from "react-alice-carousel";
import { useAuthContext } from "hooks/useAuthContext";
import Swal from "sweetalert2";
import axios from "helper/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/swiper-bundle.css";
import "swiper/css/autoplay";
import Chat from "/images/chat.png"

export default function HomePage() {
  const { user }: any = useAuthContext();
  const navigate = useNavigate();
  const [myData, setMyData] = useState<any>([]);
  const [sliderState, setSliderState] = useState(0);
  const [reviewData, setReviewData] = useState([]);
  const sliderRef = React.useRef<AliceCarousel>(null);

  useEffect(() => {
    if (user) getMyData();
  }, [user]);

  useEffect(() => {
    getApiReview();
  }, []);

  const getMyData = async () => {
    try {
      const response = await axios.get(`api/get_my_profile`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setMyData(response?.data?.data);
    } catch (error) {
      // console.error("Error getting Profile", error);
    }
  };

  const getApiReview = async () => {
    try {
      const response = await axios.get(`/api/reviews/`);
      setReviewData(response.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const handleGetAdmissionClick = () => {
    if (myData.is_formsubmited) {
      if (myData.is_payment_done) {
        Swal.fire({
          title: "Access Restricted",
          text: "You have already completed the form submission and payment. Check Dashboard for more information",
          icon: "info",
          customClass: {
            icon: "swal-my-icon",
          },
          confirmButtonColor: "#7066E0",
          confirmButtonText: "OK",
        });
      } else {
        navigate("/payments");
      }
    } else {
      navigate("/getadmission");
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isReviewSwiper, setIsReviewSwiper] = useState(window.innerWidth < 769);
  const [showMoreStates, setShowMoreStates] = useState(
    reviewData.map(() => false)
  );

  const toggleShowMore = (index: any) => {
    setShowMoreStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsReviewSwiper(window.innerWidth < 769);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>ILATE</title>
      </Helmet>

      <div className="relative flex flex-col items-center justify-between w-full pt-[25px] bg-white-A700">
        <div className="fixed z-50 right-4 bottom-4">
          <a href="https://api.maitriai.com/ilate_chatbot/">
            <img src={Chat} alt="chat icon" className="w-[60px] h-[60px] transform transition-transform duration-300 hover:scale-110"/>
          </a>
        </div>
        <div className="flex flex-col items-center justify-start w-full">
          <div className="flex flex-col items-center justify-start w-full">
            <div className="flex flex-col items-center justify-start w-full">
              <div className="flex flex-col items-center justify-start w-full overflow-hidden">
                <div className="flex flex-row justify-start w-full">
                  <div className="flex flex-col items-center justify-start w-full">
                    <div className="h-[675px] sm:h-[500px] w-full relative">
                      <Img
                        loading="eager"
                        src="images/img_rectangle_93.png"
                        alt="image"
                        className="justify-center h-[675px] sm:h-[500px] w-full left-0 bottom-0 right-0 top-0 m-auto object-cover absolute"
                      />
                      <div className="justify-center h-[675px] sm:h-[500px] w-full left-0 bottom-0 right-0 top-0 m-auto absolute">
                        <Img
                          loading="eager"
                          src="images/img_image_39.webp"
                          alt="imagethirtynine"
                          className="justify-center z-5 h-[675px] sm:h-[500px] w-full left-0 bottom-0 right-0 top-0 m-auto object-cover absolute"
                        />
                        <Text
                          size="lg"
                          as="p"
                          className=" sm:w-[75%] w-[35%] sm:top-[32%] xs:text-[14px] lg:top-[42%] xs:w-[75%] xs:top-[34%] 3xl:top-[26%] top-[32%] right-0 left-0 m-auto text-center leading-[22px] absolute"
                        >
                          Unleash Your Academic Brilliance: Customized Learning
                          Paths with Expert Educators for Global Curricula
                          Success
                        </Text>
                        <Heading
                          as="h1"
                          className="w-[65%] sm:w-[75%] sm:text-[22px] top-[18%] 3xl:top-[6%] xs:text-[18px] sm:top-[6%] right-0 left-0 m-auto text-center absolute"
                        >
                          Elevating Excellence: Premier Tutoring for IB, IGCSE,
                          <br />
                          AS/A Levels, and the ACT
                        </Heading>
                        {user && user.user_type === "teacher" || user && user.user_type === "parent"  ? (
                          ""
                        ) : (
                          <>
                            <Link to="/requestdemo">
                              <Button
                                size="lg"
                                className="sm:top-[58%] lg:top-[59%] xs:h-[40px] sm:w-full xs:top-[65%] md:top-[63%] 3xl:top-[37%] 2xl:top-[45%]  lg:right-[52%] right-[52%] sm:right-[50%] sm:translate-x-[50%] font-bold max-w-[250px] absolute z-10 transition hover:bg-white-A700 border hover:text-deep_orange-500 border-deep_orange-500"
                              >
                                Request a Demo
                              </Button>
                            </Link>
                            <Button
                              size="lg"
                              className="sm:top-[70%] lg:top-[59%] md:top-[63%] xs:h-[40px] sm:w-full xs:top-[75%] 3xl:top-[37%] 2xl:top-[45%] lg:left-[52%] left-[52%] sm:left-[50%] sm:translate-x-[-50%] font-bold max-w-[250px] absolute z-10 transition hover:bg-white-A700 border hover:text-deep_orange-500 border-deep_orange-500"
                              onClick={handleGetAdmissionClick}
                            >
                              Get Admission
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <Img
                      loading="lazy"
                      src="images/img_mask_group(1).webp"
                      alt="image_one"
                      className="2xl:w-4/5 3xl:w-[50%] xs:w-[90%] mt-[-210px] sm:mt-[-57px] md:mt-[-117px] lg:mt-[-147px] 3xl:mt-[-297px] z-[11] object-cover"
                    />
                  </div>
                </div>
                <div className="min-h-[600px] w-full mt-[105px] sm:mt-[55px] relative">
                  <Slider
                    autoPlay
                    autoPlayInterval={1000}
                    responsive={{
                      "0": { items: 1 },
                      "550": { items: 1 },
                      "1050": { items: 1 },
                    }}
                    renderDotsItem={(props: DotsItem) => {
                      return props?.isActive ? (
                        <div className="w-[5%] mr-5 bg-deep_orange-500 rounded" />
                      ) : (
                        <div className="w-[2%] mr-5 bg-white-A700 rounded" />
                      );
                    }}
                    disableButtonsControls={false}
                    activeIndex={sliderState}
                    onSlideChanged={(e: EventObject) => {
                      setSliderState(e?.item);
                    }}
                    ref={sliderRef}
                    className="absolute top-0 bottom-0 left-0 right-0 justify-center w-full m-auto"
                    items={[...Array(3)].map(() => (
                      <React.Fragment key={Math.random()}>
                        <div className="flex sm:block flex-row justify-around items-center sm:p-[45px] xs:p-[32px] p-[85px] mx-auto bg-cyan-900 select-none">
                          <div className="sm:h-[380px] xs:h-[320px] h-[430px] sm:w-[100%] w-[30%] md:w-[50%] relative">
                            <div className="flex flex-row justify-center items-start w-full sm:left-[14%] h-full left-0 bottom-0 right-0 top-0 md:top-[15%] m-auto absolute">
                              <div className="h-32 w-32 lg:w-[5rem] lg:h-[6rem] md:h-[4rem] md:w-[3rem] absolute left-[-20px] z-[1] bg-white-A700 rounded-full text-center">
                                <Text
                                  size="3xl"
                                  as="p"
                                  className="text-[140px] lg:text-[100px] md:text-[60px] top-0 mx-auto !text-black-900 !font-oswald"
                                >
                                  ”
                                </Text>
                              </div>
                              <Img
                                src="images/img_image_55.webp"
                                alt="imagefiftyfive"
                                className="sm:h-[306px] xs:h-[256px] xs:w-[256px] sm:w-[306px] h-[426px] w-[426px] md:h-[346px] ml-[-88px] rounded-[50%]"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col items-start justify-start sm:w-[100%] w-[40%]">
                            <Heading
                              size="xl"
                              as="h5"
                              className="text-[16px] md:text-[14px]"
                            >
                              Students Testimonials
                            </Heading>
                            <Heading
                              as="h2"
                              className="mt-[27px] md:text-[21px] sm:text-[20px]"
                            >
                              People Says Courses
                              <br />
                            </Heading>
                            <Text
                              size="xl"
                              as="p"
                              className="mt-[39px] text-[16px] md:text-[14px] xs:leading-6 !font-medium text-justify"
                            >
                              I thoroughly enjoyed my experience in the
                              engineering program at XYZ University. The
                              curriculum was rigorous yet engaging, and the
                              professors were knowledgeable and supportive. The
                              hands-on projects and internships provided
                              valuable real-world experience that prepared me
                              for my career.
                            </Text>
                            <Text
                              size="xl"
                              as="p"
                              className="mt-0.5 !font-medium text-[16px] md:text-[14px]"
                            >
                              Sheraldin Beny
                              <br /> - Manager
                            </Text>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  />
                </div>

                <div className="flex sm:block flex-row justify-start items-center w-full xs:mt-[230px] sm:mt-[300px] mt-[132px] md:mt-[100px] gap-[35px] max-w-[1400px]">
                  <Img
                    loading="lazy"
                    src="images/img_placeholder_image(1).webp"
                    alt="placeholder_one"
                    className="w-[51%] sm:w-[90%] my-0 mx-auto object-cover rounded-[20px]"
                  />
                  <div className="flex flex-col items-start justify-start sm:w-[90%] w-[48%] my-0 mx-auto sm:gap-[39px] gap-[79px]">
                    <div className="flex flex-row justify-start w-full">
                      <div className="flex flex-col items-start justify-start w-full gap-[23px]">
                        <Heading
                          as="h2"
                          className="!text-black-900 leading-[120%] sm:mt-5 sm:text-[25px]"
                        >
                          Join ILATE to Get Higher Grades
                        </Heading>
                        <Text
                          size="xl"
                          as="p"
                          className="!text-black-900 leading-[150%] text-base sm:text-[14px]"
                        >
                          Experience top-tier tutoring for IB, IGCSE, AS/A
                          Levels, and the ACT. Let us guide you towards academic
                          success with personalized support and expert
                          instruction.
                        </Text>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      className="border border-deep_orange-500 sm:my-0 sm:mx-auto hover:bg-white-A700 hover:text-deep_orange-500 font-semibold min-w-[129px] rounded-[5px]"
                    >
                      Learn more
                    </Button>
                  </div>
                </div>
                <Heading
                  as="h3"
                  className="mt-[142px] md:mt-[100px] sm:mt-[52px] !text-black-900 text-center !font-semibold"
                >
                  Programmes We offer
                </Heading>
                <Heading
                  size="xl"
                  as="p"
                  className="w-[70%] sm:w-[78%] sm:text-left mt-4 sm:text-[14px] !text-black-900 text-center font-light text-base"
                >
                  At ILATE, we are keenly aware that the landscape of education
                  is continually evolving. Recognizing the dynamic and diverse
                  needs of new-age education, we've meticulously designed a
                  suite of programs that cater not only to the academic rigour
                  expected by global curricula but also to the holistic
                  development of our students.
                </Heading>

                {/* first card */}
                {isMobile ? (
                  <div className="justify-center w-[90%] mt-[33px] gap-[13px] min-h-[auto] max-w-[1157px]">
                    <Swiper
                      // autoplay={{
                      //   delay: 2000,
                      //   disableOnInteraction: false,
                      // }}
                      // modules={[Autoplay]}
                      spaceBetween={10}
                      slidesPerView={1}
                      breakpoints={{
                        550: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                      }}
                    >
                      <SwiperSlide className="h-auto">
                        <div className="flex flex-col items-start justify-start w-full gap-[19px] p-[35px] bg-teal-900 shadow-sm rounded-[10px]">
                          <Button
                            color="red_50"
                            size="3xl"
                            shape="circle"
                            className="w-[72px] ml-[5px]"
                          >
                            <Img loading="lazy" src="images/IBDP.svg" />
                          </Button>
                          <Heading
                            size="xl"
                            as="h5"
                            className="ml-1 tracking-[0.10px] !font-montserrat"
                          >
                            IBDP
                          </Heading>
                          <div className="h-0.5 w-[17%] ml-[5px] bg-red-600" />
                          <Text
                            as="p"
                            className="w-[83%] ml-[5px] tracking-[0.20px] !font-montserrat !font-normal !leading-5 text-left"
                          >
                            Rigorous, comprehensive, globally recognized
                            curriculum.
                          </Text>
                        </div>
                      </SwiperSlide>
                      {/* second card */}
                      <SwiperSlide className="h-auto">
                        <div className="flex flex-col items-start justify-start w-full gap-[19px] p-[35px] bg-teal-900 shadow-sm rounded-[10px]">
                          <Button
                            color="red_50"
                            size="3xl"
                            shape="circle"
                            className="w-[72px] ml-[5px]"
                          >
                            <Img loading="lazy" src="images/IGCSE.svg" />
                          </Button>
                          <Heading
                            size="xl"
                            as="h6"
                            className="ml-[5px] tracking-[0.10px] !font-montserrat"
                          >
                            IGCSE
                          </Heading>
                          <div className="h-0.5 w-[17%] ml-[5px] bg-red-600" />
                          <Text
                            as="p"
                            className="w-[83%] ml-[5px] tracking-[0.20px] !font-montserrat !font-normal !leading-5 text-left"
                          >
                            Internationally benchmarked, academic excellence.
                          </Text>
                        </div>
                      </SwiperSlide>
                      {/* third card */}
                      <SwiperSlide className="h-auto">
                        <div className="flex flex-col items-start justify-start w-full gap-[19px] p-[35px] bg-teal-900 shadow-sm rounded-[10px]">
                          <Button
                            color="red_50"
                            size="3xl"
                            shape="circle"
                            className="w-[72px] ml-[5px]"
                          >
                            <Img loading="lazy" src="images/MYP.svg" />
                          </Button>
                          <Heading
                            size="xl"
                            as="h5"
                            className="ml-[5px] tracking-[0.10px] !font-montserrat"
                          >
                            MYP
                          </Heading>
                          <div className="h-0.5 w-[17%] ml-[5px] bg-red-600" />
                          <Text
                            as="p"
                            className="w-[83%] ml-[5px] tracking-[0.20px] !font-montserrat !font-normal !leading-5 text-left"
                          >
                            Holistic, inquiry-based, fostering critical thinking
                            skills.
                          </Text>
                        </div>
                      </SwiperSlide>
                      {/* fourth card */}
                      <SwiperSlide className="h-auto">
                        <div className="flex flex-col items-start justify-start w-full gap-[19px] p-[35px] bg-teal-900 shadow-sm rounded-[10px]">
                          <Button
                            color="red_50"
                            size="3xl"
                            shape="circle"
                            className="w-[72px] ml-[5px]"
                          >
                            <Img loading="lazy" src="images/Alevels.svg" />
                          </Button>
                          <Heading
                            size="xl"
                            as="h5"
                            className="ml-[5px] tracking-[0.10px] !font-montserrat"
                          >
                            A Levels
                          </Heading>
                          <div className="h-0.5 w-[17%] ml-[5px] bg-red-600" />
                          <Text
                            as="p"
                            className="w-[83%] ml-[5px] tracking-[0.20px] !font-montserrat !font-normal !leading-5 text-left"
                          >
                            Advanced, in-depth, paving the path to top
                            universities.
                          </Text>
                        </div>
                      </SwiperSlide>
                      {/* fifth card */}
                      <SwiperSlide className="h-auto">
                        <div className="flex flex-col items-start justify-start w-full gap-[19px] p-[35px] bg-teal-900 shadow-sm rounded-[10px]">
                          <Button
                            color="red_50"
                            size="3xl"
                            shape="circle"
                            className="w-[72px] ml-[5px]"
                          >
                            <Img loading="lazy" src="images/SAT.svg" />
                          </Button>
                          <Heading
                            size="xl"
                            as="h5"
                            className="ml-[5px] tracking-[0.10px] !font-montserrat"
                          >
                            SAT/ACT
                          </Heading>
                          <div className="h-0.5 w-[17%] ml-[5px] bg-red-600" />
                          <Text
                            as="p"
                            className="w-[83%] ml-[5px] tracking-[0.20px] !font-montserrat !font-normal !leading-5 text-left"
                          >
                            Strategic, focused, essential for college
                            admissions.
                          </Text>
                        </div>
                      </SwiperSlide>
                      {/* sixth card */}
                      <SwiperSlide className="h-auto">
                        <div className="flex flex-col items-start justify-center w-full gap-[19px] p-3 sm:px-[35px] sm:pt-[35px] sm:pb-[35px] bg-teal-900 shadow-sm rounded-[10px]">
                          <Button
                            color="red_50"
                            size="3xl"
                            shape="circle"
                            className="w-[72px] mt-[23px] ml-[26px] sm:mt-0 sm:ml-0"
                          >
                            <Img loading="lazy" src="images/AI.svg" />
                          </Button>
                          <Heading
                            size="xl"
                            as="h5"
                            className=" tracking-[0.10px] !font-montserrat"
                          >
                            AI/ML
                          </Heading>
                          <div className="h-0.5 w-[15%] ml-[26px] sm:ml-0 bg-red-600" />
                          <Text
                            as="p"
                            className="w-[72%] ml-[26px] sm:ml-0 tracking-[0.20px] !font-montserrat !font-normal !leading-5 text-left"
                          >
                            Cutting-edge, innovative, shaping the future of
                            technology.
                          </Text>
                        </div>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                ) : (
                  <div className="justify-center w-full mt-[33px] px-3 py-3 gap-[13px] grid-cols-3 grid min-h-[auto] max-w-[1157px]">
                    <SwiperSlide>
                      <div className="flex flex-col items-start justify-start w-full gap-[19px] p-[35px] bg-teal-900 shadow-sm rounded-[10px]">
                        <Button
                          color="red_50"
                          size="3xl"
                          shape="circle"
                          className="w-[72px] ml-[5px]"
                        >
                          <Img src="images/IBDP.svg" />
                        </Button>
                        <Link to="/ibdp_course">
                                 <Heading
                          size="xl"
                          as="h5"
                          className="ml-1 tracking-[0.10px] !font-montserrat"
                        >
                          IBDP
                        </Heading>
                        </Link>
                       
                        <div className="h-0.5 w-[17%] ml-[5px] bg-red-600" />
                        <Text
                          as="p"
                          className="w-[83%] ml-[5px] tracking-[0.20px] !font-montserrat !font-normal !leading-5 text-left"
                        >
                          Rigorous, comprehensive, globally recognized
                          curriculum.
                        </Text>
                      </div>
                    </SwiperSlide>
                    {/* second card */}
                    <SwiperSlide>
                      <div className="flex flex-col items-start justify-start w-full gap-[19px] p-[35px] bg-teal-900 shadow-sm rounded-[10px]">
                        <Button
                          color="red_50"
                          size="3xl"
                          shape="circle"
                          className="w-[72px] ml-[5px]"
                        >
                          <Img src="images/IGCSE.svg" />
                        </Button>
                        <Link to="/igcse_course">
                         <Heading
                          size="xl"
                          as="h6"
                          className="ml-[5px] tracking-[0.10px] !font-montserrat"
                        >
                          IGCSE
                        </Heading>
                        </Link>

                        
                        <div className="h-0.5 w-[17%] ml-[5px] bg-red-600" />
                        <Text
                          as="p"
                          className="w-[83%] ml-[5px] tracking-[0.20px] !font-montserrat !font-normal !leading-5 text-left"
                        >
                          Internationally benchmarked, academic excellence.
                        </Text>
                      </div>
                    </SwiperSlide>
                    {/* third card */}
                    <SwiperSlide>
                      <div className="flex flex-col items-start justify-start w-full gap-[19px] p-[35px] bg-teal-900 shadow-sm rounded-[10px]">
                        <Button
                          color="red_50"
                          size="3xl"
                          shape="circle"
                          className="w-[72px] ml-[5px]"
                        >
                          <Img src="images/MYP.svg" />
                        </Button>
                        <Link to="/myp_course">
                            <Heading
                          size="xl"
                          as="h5"
                          className="ml-[5px] tracking-[0.10px] !font-montserrat"
                        >
                          MYP
                        </Heading>
                        </Link>
                       
                        <div className="h-0.5 w-[17%] ml-[5px] bg-red-600" />
                        <Text
                          as="p"
                          className="w-[83%] ml-[5px] tracking-[0.20px] !font-montserrat !font-normal !leading-5 text-left"
                        >
                          Holistic, inquiry-based, fostering critical thinking
                          skills.
                        </Text>
                      </div>
                    </SwiperSlide>
                    {/* fourth card */}
                    <SwiperSlide>
                      <div className="flex flex-col items-start justify-start w-full gap-[19px] p-[35px] bg-teal-900 shadow-sm rounded-[10px]">
                        <Button
                          color="red_50"
                          size="3xl"
                          shape="circle"
                          className="w-[72px] ml-[5px]"
                        >
                          <Img src="images/Alevels.svg" />
                        </Button>
                        <Link to="/alevel_course">
                          <Heading
                          size="xl"
                          as="h5"
                          className="ml-[5px] tracking-[0.10px] !font-montserrat"
                        >
                          A Levels
                        </Heading>

                        </Link>
                        
                        <div className="h-0.5 w-[17%] ml-[5px] bg-red-600" />
                        <Text
                          as="p"
                          className="w-[83%] ml-[5px] tracking-[0.20px] !font-montserrat !font-normal !leading-5 text-left"
                        >
                          Advanced, in-depth, paving the path to top
                          universities.
                        </Text>
                      </div>
                    </SwiperSlide>
                    {/* fifth card */}
                    <SwiperSlide>
                      <div className="flex flex-col items-start justify-start w-full gap-[19px] p-[35px] bg-teal-900 shadow-sm rounded-[10px]">
                        <Button
                          color="red_50"
                          size="3xl"
                          shape="circle"
                          className="w-[72px] ml-[5px]"
                        >
                          <Img src="images/SAT.svg" />
                        </Button>
                        <Link to="/satact_course">
                        <Heading
                          size="xl"
                          as="h5"
                          className="ml-[5px] tracking-[0.10px] !font-montserrat"
                        >
                          SAT/ACT
                        </Heading>
                        </Link>
                        
                        <div className="h-0.5 w-[17%] ml-[5px] bg-red-600" />
                        <Text
                          as="p"
                          className="w-[83%] ml-[5px] tracking-[0.20px] !font-montserrat !font-normal !leading-5 text-left"
                        >
                          Strategic, focused, essential for college admissions.
                        </Text>
                      </div>
                    </SwiperSlide>
                    {/* sixth card */}
                    <SwiperSlide>
                      <div className="flex flex-col items-start justify-center w-full gap-[19px] p-3 bg-teal-900 shadow-sm rounded-[10px]">
                        <Button
                          color="red_50"
                          size="3xl"
                          shape="circle"
                          className="w-[72px] mt-[23px] ml-[26px]"
                        >
                          <Img src="images/AI.svg" />
                        </Button>
                        <Link to="/bridge_course">
                          <Heading
                          size="xl"
                          as="h5"
                          className="ml-[26px] tracking-[0.10px] !font-montserrat"
                        >
                          BRIDGE COURSE
                        </Heading>
                        </Link>
                        
                        <div className="h-0.5 w-[15%] ml-[26px] bg-red-600" />
                        <Text
                          as="p"
                          className="w-[72%] mb-[23px] ml-[26px] tracking-[0.20px] !font-montserrat !font-normal !leading-5 text-left"
                        >
                          Cutting-edge, innovative, shaping the future of
                          technology.
                        </Text>
                      </div>
                    </SwiperSlide>
                  </div>
                )}

                <div className="flex flex-row justify-center w-full mt-[141px] sm:mt-[166px] xs:mt-[86px] attch-img">
                  <div className="flex flex-col items-center justify-start w-full">
                    <div className="h-[227px] w-full z-[1] relative max-w-[1424px]">
                      <div className="justify-center items-center h-[226px] xs:h-[170px] xs:top-[-50%] w-full left-0 bottom-0 right-0 top-[-100%] m-auto bg-teal-900 absolute rounded-[25px]">
                        <Heading
                          size="3xl"
                          as="h4"
                          className="md:text-[22px] sm:text-[13px] w-[90%] xs:bottom-6 bottom-16 right-0 left-0 m-auto !text-white text-center absolute lg:leading-[27px] sm:leading-[21px]"
                        >
                          “Our holistic approach has been paramount to the
                          success of our students in finding the right path for
                          their academic journey. We are proud to have the
                          opportunity to nurture a diverse set of talented
                          students that will brighten our future.”
                        </Heading>
                      </div>
                    </div>
                    <div className="h-[50vh] sm:h-[1080px]  xs:h-[1080px] 2xl:h-[500px] w-full mt-[-64px] relative">
                      <div className="absolute bottom-0 m-auto flex-row w-full flex sm:gap-16 translate-x-[50%] translate-y-[-50%] sm:flex-col sm:top-[40%] sm:right-[9%] right-[50%] top-[50%] justify-around">
                        <div className="flex flex-row justify-center items-start w-[16%] h-max right-[77%]  ">
                          <div className="flex flex-col items-center justify-center h-[102px] w-[103px] lg:h-[72px] lg:w-[73px] mt-[13px] gap-[7px] p-3.5 z-[1] bg-white-A700 rounded-full">
                            <Text
                              size="xl"
                              as="p"
                              className="lg:text-[16px] mb-1 font-extrabold !text-indigo-900"
                            >
                              2800+
                            </Text>
                          </div>
                          <div className="flex flex-col items-center justify-start h-[243px] w-[243px] lg:h-[163px] lg:w-[163px] ml-[-51px] p-3 bg-teal-900 rounded-full">
                            <div className="h-[218px] w-[218px] lg:h-[138px] lg:w-[138px] bg-white-A700 rounded-[50%]">
                              <div className="flex items-center justify-center w-full h-full">
                                <Img
                                  src="images/university_offers.svg"
                                  className="w-[50%]"
                                />
                              </div>
                            </div>
                            <div className="absolute sm:bottom-[70%] sm:text-center sm:w-full -bottom-14 lg:bottom-6">
                              <Heading
                                size="xl"
                                as="h4"
                                className="lg:text-[17px] tracking-[0.20px]"
                              >
                                University offers
                              </Heading>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row justify-center items-start w-[16%] h-max right-[55%]  ">
                          <div className="flex flex-col items-center justify-center h-[102px] w-[103px] lg:h-[72px] lg:w-[73px] mt-[13px] gap-[7px] p-3.5 z-[1] bg-white-A700 rounded-full">
                            <Text
                              size="xl"
                              as="p"
                              className="mb-1 lg:text-[16px] font-extrabold !text-indigo-900"
                            >
                              1000+
                            </Text>
                          </div>
                          <div className="flex flex-col items-center justify-start h-[243px] w-[243px] lg:h-[163px] lg:w-[163px] ml-[-51px] p-3 bg-teal-900 rounded-full">
                            <div className="h-[218px] w-[218px] lg:h-[138px] lg:w-[138px] bg-white-A700 rounded-[50%]">
                              <div className="flex items-center justify-center w-full h-full">
                                <Img
                                  src="images/alumni.svg"
                                  className="w-[50%]"
                                />
                              </div>
                            </div>
                            <div className="absolute sm:bottom-[35%] xs:bottom-[35%] sm:text-center sm:w-full -bottom-14 lg:bottom-6">
                              <Heading
                                size="xl"
                                as="h4"
                                className="lg:text-[17px] tracking-[0.20px]"
                              >
                                Alumni
                              </Heading>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row justify-center items-start w-[16%] h-max right-[33%]  ">
                          <div className="flex flex-col items-center justify-center h-[102px] w-[103px] lg:h-[72px] lg:w-[73px] mt-[13px] gap-[7px] p-3.5 md:p-6 z-[1] bg-white-A700 rounded-full">
                            <Text
                              size="xl"
                              as="p"
                              className="mb-1 lg:text-[16px] font-extrabold !text-indigo-900"
                            >
                              6:1
                            </Text>
                          </div>
                          <div className="flex flex-col items-center justify-start h-[243px] w-[243px] lg:h-[163px] lg:w-[163px] ml-[-51px] p-3 bg-teal-900 rounded-full">
                            <div className="h-[218px] w-[218px] lg:h-[138px] lg:w-[138px] bg-white-A700 rounded-[50%]">
                              <div className="flex items-center justify-center w-full h-full">
                                <Img
                                  src="images/student-teacher.svg"
                                  className="w-[50%]"
                                />
                              </div>
                            </div>
                            <div className="absolute sm:bottom-[0%] sm:text-center sm:w-full -bottom-14 lg:bottom-6">
                              <Heading
                                size="xl"
                                as="h4"
                                className="lg:text-[17px] tracking-[0.20px]"
                              >
                                Student-Teacher Ratio
                              </Heading>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row justify-center items-start w-[16%] h-max right-[11%]  ">
                          <div className="flex flex-col items-center justify-center h-[102px] w-[103px] lg:h-[72px] lg:w-[73px] mt-[13px] gap-[7px] p-3.5 md:p-6 z-[1]  bg-white-A700 rounded-full">
                            {/* <Text size="2xl" as="p" className="!text-indigo-900">
                            Over
                          </Text> */}
                            <Text
                              size="xl"
                              as="p"
                              className="mb-1 lg:text-[16px] font-extrabold !text-indigo-900"
                            >
                              14+
                            </Text>
                          </div>
                          <div className="flex flex-col items-center justify-start h-[243px] w-[243px] lg:h-[163px] lg:w-[163px] ml-[-51px] p-3 bg-teal-900 rounded-full">
                            <div className="h-[218px] w-[218px] lg:h-[138px] lg:w-[138px] bg-white-A700 rounded-[50%]">
                              <div className="flex items-center justify-center w-full h-full">
                                <Img
                                  src="images/Experience.svg"
                                  className="w-[50%]"
                                />
                              </div>
                            </div>
                            <div className="absolute sm:bottom-[-35%] xs:bottom-[-35%] sm:text-center sm:w-full -bottom-14 lg:bottom-6">
                              <Heading
                                size="xl"
                                as="h4"
                                className="lg:text-[17px] tracking-[0.20px]"
                              >
                                Experience
                              </Heading>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pl-5 flex  justify-end w-full mt-[99px] bg-white-A700">
                  <div className="flex flex-row sm:flex-col-reverse justify-end items-center w-full mx-auto max-w-[1697px]">
                    <div className="flex flex-col items-center justify-start w-[35%] sm:w-full gap-[20px]">
                      <div className="flex flex-row justify-center w-full">
                        <div className="flex flex-row items-center justify-start w-full">
                          <Heading
                            as="h2"
                            className="md:text-[27px] sm:text-[25px] !text-black-900 tracking-[1.28px] !font-poppins capitalize mb-[50px]"
                          >
                            <span className="font-normal text-black-900 font-plusjakartasans">
                              Explore How ILATE Students
                              <br />
                            </span>
                            <span className="text-black-900 font-plusjakartasans">
                              Propel Change and Achieve Academic Excellence
                            </span>
                          </Heading>
                        </div>
                      </div>
                      <Text
                        // size="2xl"
                        as="p"
                        className="md:text-[16px] sm:text-[15px] mt-[-54px] text-lg  !text-black-900 !font-normal leading-[146.18%]"
                      >
                        At ILATE, we witness firsthand the transformative power
                        of student-driven impact. Through our distinctive
                        educational methodology, students aren't just passive
                        learners; they are dynamic catalysts for change, shaping
                        their futures and making indelible contributions to
                        society.
                      </Text>
                      <Text
                        // size="2xl"
                        as="p"
                        className="md:text-[16px] sm:text-[15px] text-lg !text-black-900 !font-normal leading-[146.18%]"
                      >
                        By fostering critical thinking, nurturing creativity,
                        and promoting emotional intelligence, we equip our
                        students with the essential tools for success, both
                        academically and beyond. With tailored learning
                        strategies and cutting-edge educational technologies, we
                        empower them to excel academically and secure placements
                        in renowned Ivy League and top-tier universities
                        worldwide.
                      </Text>
                    </div>
                    <div className="h-[800px] sm:h-[424px] w-[65%] sm:mt-[10%] sm:w-full relative">
                      <Img
                        src="images/img_rectangle_8.png"
                        alt="image_three"
                        className="h-[800px] sm:h-[474px] w-[66%] right-0 bottom-0 top-0 sm:top-[-90px] sm:m-0 m-auto object-cover absolute"
                      />
                      <div className="h-[700px] sm:h-[444px] w-full top-0 sm:top-[-27%] right-0 left-0 m-auto absolute">
                        <Img
                          src="images/img_group_72.png"
                          alt="image_four"
                          className="justify-center h-[700px] sm:h-[444px] w-full left-0 bottom-0 right-0 -sm:top-[-25%] top-0 m-auto object-cover absolute"
                        />
                        <Img
                          src="images/img_rectangle_7.webp"
                          alt="image_five"
                          className="h-[600px] w-[60%] sm:h-[350px] bottom-0 left-[15%] m-auto object-cover absolute rounded-[20px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Heading
                  size="5xl"
                  as="h1"
                  className="mt-[77px] !text-black-900 text-center"
                >
                  Bulletin Board
                </Heading>
                <Heading
                  size="s"
                  as="p"
                  className="mt-[13px]  !text-black-900 text-center"
                >
                  Relevant Blog posts regarding Student development,
                  International curricula, Parent Involvement, etc
                </Heading>
                <div className="3xl:h-[800px] 3xl:mt-[8%] 2xl:h-[664px] h-[664px] sm:h-[1640px] xs:h-[1800px] md:h-[545px] md:mt-[20%] w-full 2xl:mt-[20%]  relative card-img-atch">
                  <div className="flex gap-4 absolute sm:flex-col 3xl:top-[-39%] top-[-54%] 2xl:top-[-45%] lg:top-[-29%] sm:top-[-33%] xs:top-[-28%] w-full h-full">
                    <div className="sm:w-[90%] w-[30%] right-[7%] m-auto shadow-lg -absolute sm:h-[20%] xs:h-[21%] 2xl:h-[66%] 3xl:h-[43%] lg:h-[76%] md:h-[86%] sm:mb-[-270px]">
                      <div className="top-0 left-0 right-0 flex flex-col items-start justify-start w-full m-auto -absolute">
                        <Img
                          src="images/img_rectangle_47.webp"
                          alt="image_seven"
                          className="w-full z-[1] object-cover rounded"
                        />
                      </div>
                      <div className="flex flex-col items-start justify-between w-full h-full gap-[34px] left-0 bottom-0 right-0 top-0 p-7 md:p-4 m-auto bg-white-A700 shadow-md -absolute rounded">
                        <Heading
                          size="2xl"
                          as="h4"
                          className=" ml-[9px] !text-black-900 md:text-[17px]"
                        >
                          Beach Clean Up
                        </Heading>
                        <Text
                          size="lg"
                          as="p"
                          className="md:text-[14px] sm:text-[14px] md:leading-[20px] w-[94%] ml-[9px] !text-black-900 leading-[22px] text-justify"
                        >
                          Once the bulk of the bleach has been absorbed, use
                          water to dilute any remaining bleach residue.
                          Thoroughly rinse the affected area with water to flush
                          out the bleach and reduce its concentration. Use a
                          mop, sponge, or clean cloth dampened with water to
                          wipe down surfaces and remove any remaining traces of
                          bleach.
                        </Text>
                        <Button className="ml-[9px] font-bold min-w-[114px] border border-deep_orange-500 hover:bg-white-A700 hover:text-deep_orange-500">
                          Read more
                        </Button>
                      </div>
                    </div>
                    <div className="sm:w-[90%] w-[30%] right-0 left-0 m-auto shadow-lg -absolute sm:h-[21%] xs:h-[23%] 2xl:h-[66%] 3xl:h-[43%] md:h-[86%] lg:h-[76%] sm:mb-[-270px]">
                      <div className="top-0 left-0 right-0 flex flex-col items-start justify-start w-full m-auto -absolute">
                        <Img
                          src="images/img_rectangle_46.webp"
                          alt="image_seven"
                          className="w-full z-[1] object-cover rounded"
                        />
                      </div>
                      <div className="flex flex-col items-start justify-between w-full h-full gap-[34px] left-0 bottom-0 right-0 top-0 p-7 md:p-4 m-auto bg-white-A700 shadow-md -absolute rounded">
                        <Heading
                          size="2xl"
                          as="h4"
                          className=" ml-[9px] !text-black-900 md:text-[17px]"
                        >
                          Field Trips and Their Importance
                        </Heading>
                        <Text
                          size="lg"
                          as="p"
                          className="md:text-[14px] sm:text-[14px] md:leading-[20px] w-[94%] ml-[9px] !text-black-900 leading-[22px] text-justify"
                        >
                          Field trips are designed with specific educational
                          objectives in mind, aligning with the curriculum and
                          learning goals of the students. These objectives may
                          include gaining a deeper understanding of a particular
                          subject, exploring cultural or historical sites,
                          conducting scientific investigations, experiencing
                          different ecosystems.
                        </Text>
                        <Button className="ml-[9px] font-bold min-w-[114px] border border-deep_orange-500 hover:bg-white-A700 hover:text-deep_orange-500">
                          Read more
                        </Button>
                      </div>
                    </div>
                    <div className="sm:w-[90%] w-[30%] left-[8%] m-auto shadow-lg -absolute sm:h-[20%] 2xl:h-[66%] 3xl:h-[43%] xs:h-[21%] lg:h-[76%] md:h-[86%] sm:mb-[-270px]">
                      <div className="top-0 left-0 right-0 flex flex-col items-start justify-start w-full m-auto -absolute">
                        <Img
                          src="images/img_rectangle_45.webp"
                          alt="image_seven"
                          className="w-full z-[1] object-cover rounded"
                        />
                      </div>
                      <div className="flex flex-col items-start justify-between w-full h-full gap-[34px] left-0 bottom-0 right-0 top-0 p-7 md:p-4 m-auto bg-white-A700 shadow-md -absolute rounded">
                        <Heading
                          size="2xl"
                          as="h4"
                          className=" ml-[9px] !text-black-900 md:text-[17px]"
                        >
                          Open House
                        </Heading>
                        <Text
                          size="lg"
                          as="p"
                          className="w-[94%] ml-[9px] sm:text-[14px] md:text-[14px] md:leading-[20px] !text-black-900 leading-[22px] text-justify"
                        >
                          OAttendees are given the opportunity to tour the
                          school facilities, including classrooms, libraries,
                          science labs, gymnasiums, auditoriums, and any other
                          relevant spaces. Student guides or staff members may
                          lead the tours and answer questions about the
                          facilities and resources available.
                        </Text>
                        <Button className="ml-[9px] font-bold min-w-[114px] border border-deep_orange-500 hover:bg-white-A700 hover:text-deep_orange-500">
                          Read more
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-end items-start h-[1000px] 3xl:h-[900px] sm:h-[800px] md:h-[850px] w-full p-[47px] sm:p-0 bg-black-900_33 bg-[url(/images/matters.jpg)] bg-blend-overlay bg-cover bg-no-repeat">
                  <div className="flex flex-row justify-end w-[99%] mb-[73px]">
                    <div className="flex flex-col items-start justify-start w-full gap-[84px]">
                      <div className="flex flex-col items-start justify-start ml-[92px] md:ml-[42px] sm:ml-[22px] p-3 pt-0.5">
                        <Heading
                          size="4xl"
                          as="h1"
                          className="mt-[18px] tracking-[0.20px] !font-montserrat"
                        >
                          Every Student Matters
                        </Heading>
                        <Text
                          as="p"
                          className="w-[95%] mt-2.5 tracking-[0.20px] !font-montserrat !font-normal !leading-5"
                        >
                          Problems trying to resolve the conflict between <br />
                          the two major realms of Classical physics: Newtonian
                          mechanics{" "}
                        </Text>
                      </div>
                      <div className="flex flex-row justify-center items-center w-full gap-[45px]">
                        <div className=" justify-center items-center w-[85%] gap-40">
                          <div className="flex flex-row justify-between gap-10">
                            <Swiper
                              // autoplay
                              spaceBetween={10}
                              slidesPerView={1}
                              breakpoints={{
                                2500: {
                                  slidesPerView: 4,
                                  spaceBetween: 20,
                                },
                                1400: {
                                  slidesPerView: 3,
                                  spaceBetween: 20,
                                },
                                1024: {
                                  slidesPerView: 2,
                                  spaceBetween: 20,
                                },
                                600: {
                                  slidesPerView: 2,
                                  spaceBetween: 20,
                                },
                              }}
                              autoplay={{
                                delay: 1000,
                                disableOnInteraction: false,
                              }}
                              modules={[Autoplay]}
                            >
                              {reviewData.map((ele, index) => {
                                if (!ele.text) return null; // Skip if there's no text

                                const isLongText = ele.text.length > 400;
                                const displayText =
                                  isLongText && !showMoreStates[index]
                                    ? `${ele.text.substring(0, 400)}...`
                                    : ele.text;
                                return (
                                  <div key={index}>
                                    {ele.text ? (
                                      <SwiperSlide
                                        className="h-[650px] sm:h-[450px] 2xl:h-[500px] 3xl:h-[480px] md:h-[500px] rounded-[10px]"
                                        key={index}
                                      >
                                        <div className="flex flex-col items-center justify-between w-[100%] p-[25px] rounded-lg bg-white-A700 overflow-y-scroll">
                                          <div className="flex flex-col items-center justify-end w-full gap-5 p-1.5">
                                            <RatingBar
                                              value={ele.stars}
                                              isEditable={false}
                                              size={22}
                                              className="flex justify-between w-[130px] mt-6"
                                            />
                                            <Text
                                              as="p"
                                              className="w-[94%] mb-[18px] !text-black-900 tracking-[0.20px] text-center !font-normal !leading-5"
                                            >
                                              {displayText}
                                              {isLongText && (
                                                <span
                                                  onClick={() =>
                                                    toggleShowMore(index)
                                                  }
                                                  className="ml-4 font-bold cursor-pointer"
                                                >
                                                  {showMoreStates[index]
                                                    ? "show less"
                                                    : "show more"}
                                                </span>
                                              )}
                                            </Text>
                                          </div>
                                          <div className="flex flex-row justify-around items-center w-[60%] md:w-full">
                                            <div className="flex flex-col items-start justify-start w-3/5 pt-[3px] gap-[3px]">
                                              <Heading
                                                size="xs"
                                                as="p"
                                                className="!text-yellow-400 tracking-[0.20px] !font-montserrat"
                                              >
                                                {ele.name}
                                              </Heading>
                                            </div>
                                          </div>
                                        </div>
                                      </SwiperSlide>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                );
                              })}
                            </Swiper>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
