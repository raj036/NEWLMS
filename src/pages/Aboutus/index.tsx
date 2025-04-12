import React from "react";
import { Helmet } from "react-helmet";
import { Text, Img, Button, Heading, Slider } from "../../components";
import AliceCarousel, { EventObject, DotsItem } from "react-alice-carousel";
import { Link } from "react-router-dom";

export default function AboutusPage() {
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);

  return (
    <>
      <Helmet>
        <title>About Us</title>
      </Helmet>

      <div className="flex flex-col items-center justify-start w-full pt-6 gap-7 bg-white-A700">
        <div className="flex flex-col items-center justify-start w-full">
          <div className="flex flex-col items-center justify-start w-full mt-7 gap-[115px]">
            <div className="flex flex-col items-center justify-start w-full">
              <div className="h-[500px] sm:h-[200px] w-full relative">
                <Img
                  src="images/img_image_41.webp"
                  loading="lazy"
                  alt="imagefortyone"
                  className="justify-center h-[500px] sm:h-[200px] w-full left-0 bottom-0 right-0 top-0 m-auto object-cover absolute"
                />
                <Heading
                  size="5xl"
                  as="h1"
                  className="w-max left-[2%] bottom-0 top-[50%] my-auto mx-16 sm:mx-1 absolute"
                >
                  About Us
                </Heading>
              </div>
              <div className="flex flex-row justify-center w-full mt-12 sm:mt-0">
                <div className="flex flex-row sm:flex-col justify-between items-center px-28 lg:px-4 sm:p-0 mt-12 sm:mt-0">
                  <div className="flex sm:p-[15px] flex-col items-start justify-start w-[60%] sm:w-[100%]">
                    {/* <Heading
                      size="xs"
                      as="h2"
                      className="!text-light_blue-900_01"
                    >
                      About us
                    </Heading> */}
                    <Heading
                      as="h3"
                      className="mt-[18px] !text-black-900 xs:text-xl xs:w-100% md:text-[25px]"
                    >
                      Professional And Highly Qualified Tutors
                    </Heading>
                    <Text
                      size="xl"
                      as="p"
                      className="mt-5 !text-black-900 !font-medium sm:text-base sm:text-left md:text-[16px]"
                    >
                      At ILATE, we are a community of passionate educators and
                      innovators, committed to redefining academic excellence in
                      the 21st century. Situated at the intersection of
                      tradition and innovation, our centre provides an
                      unparalleled learning experience that prepares students
                      for the challenges and opportunities of a rapidly changing
                      world. It’s about the right mix of knowledge and
                      adaptability that allows individuals to succeed in future
                      endeavours.
                    </Text>
                    <div className="flex flex-col text-justify gap-4 w-[90%]">
                      <div className="flex flex-row justify-start items-center mt-[17px] gap-4">
                        <Img
                          src="images/img_vector.svg"
                          loading="lazy"
                          alt="vector_one"
                          className="h-[15px] mt-1.5"
                        />
                        <Text
                          size="xl"
                          as="p"
                          className="!text-black-900 sm:mt-[20px] sm:text-[14px] sm:leading-4 md:leading-5 md:text-[16px]"
                        >
                          Our team consists of subject matter experts with
                          extensive experience in international curricula who
                          are dedicated to nurturing each student's potential.
                        </Text>
                      </div>
                      <div className="flex flex-row justify-start items-center mt-[9px] gap-4 ">
                        <Img
                          src="images/img_vector.svg"
                          loading="lazy"
                          alt="vector_three"
                          className="h-[15px] mt-1.5"
                        />
                        <Text
                          size="xl"
                          as="p"
                          className="!text-black-900 sm:text-[14px] sm:leading-4 md:text-[16px] md:leading-5"
                        >
                          We believe in a tailored approach to education and
                          developing personalized learning plans that adapt to
                          the individual needs and goals of our students.
                        </Text>
                      </div>
                      <div className="flex flex-row justify-start items-center mt-1.5 gap-4 ">
                        <Img
                        loading="lazy"
                          src="images/img_vector.svg"
                          alt="vector_five"
                          className="h-[15px]"
                        />
                        <Text
                          size="xl"
                          as="p"
                          className="!text-black-900 sm:text-[14px] sm:leading-4 md:text-[16px] md:leading-5"
                        >
                          Beyond academics, we emphasize the importance of
                          critical thinking, creativity, and emotional
                          intelligence, preparing students for success both
                          inside and outside the classroom.
                        </Text>
                      </div>
                      <div className="flex flex-row justify-start items-center mt-[9px] gap-4">
                        <Img
                        loading="lazy"
                          src="images/img_vector.svg"
                          alt="vector_seven"
                          className="h-[15px]"
                        />
                        <Text
                          size="xl"
                          as="p"
                          className="!text-black-900 sm:text-[14px] sm:leading-4 md:text-[16px] md:leading-5"
                        >
                          Utilising the latest educational technology and
                          methodologies, we offer an engaging and effective
                          learning environment that fosters innovation and
                          curiosity.
                        </Text>
                      </div>
                    </div>
                    <Link to="/getadmission">
                      <Button
                        size="xl"
                        className="mt-[53px] tracking-[0.20px] font-bold min-w-[100px] text-white-A700 bg-deep_orange-500 rounded-lg focus:ring-2 focus:ring-deep_orange-500 transition border border-deep_orange-500 hover:bg-white-A700 hover:text-deep_orange-500"
                      >
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                  <div className="h-[690px]  w-[34%] sm:w-[100%]  relative sm:mt-14">
                    <Img
                    loading="lazy"
                      src="images/Group_798.webp"
                      alt="imagefortytwo"
                      className="h-[447px] sm:h-[430px] w-[84%] sm:px-4 lg:w-full sm:w-[100%] right-0 top-0 m-auto object-cover absolute rounded-[20px] "
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-start w-full mt-[100px] sm:mt-[-160px] sm:py-[50px] bg-orange-50">
                <div className="flex flex-row justify-start items-start w-[90%] gap-[42px] mx-auto sm:flex-col">
                  <div className="h-[500px] sm:w-full w-2/5 lg:w-[70%] relative">
                    <Img
                      src="images/img_image_44.webp"
                      alt="imagefortyfour"
                      className="justify-center h-[501px] w-full left-0 bottom-0 right-0 top-0 m-auto rounded-[20px] object-cover absolute"
                    />
                    <div className="flex flex-col items-start justify-start w-[88%] top-[11%] right-0 left-0 m-auto absolute">
                      <Heading size="2xl" as="h2">
                        World Class
                      </Heading>
                      <Heading
                        size="4xl"
                        as="h6"
                        className="mt-8 !text-gray-50_01  sm:text-2xl lg:text-[27px]"
                      >
                        Clear Study Materials
                      </Heading>
                      <Text
                        size="xl"
                        as="p"
                        className="mt-[17px] !text-gray-50_01 sm:text-base lg:text-[16px]"
                      >
                        Practice questions and exams are exercises or
                        assessments designed to test students&#39; understanding
                        and application of course material. They help students
                        identify areas of strength and weakness and provide
                        opportunities for self-assessment and improvement.
                      </Text>
                      <Button
                        size="2xl"
                        className="mt-6 tracking-[0.20px] font-bold min-w-[198px] text-white-A700 bg-deep_orange-500 rounded-lg focus:ring-2 focus:ring-deep_orange-500 transition border border-deep_orange-500 hover:bg-white-A700 hover:text-deep_orange-500 lg:text-[16px] md:h-[50px] "
                      >
                        Know More
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-start sm:w-[100%] w-[60%] mt-10 sm:mt-0 gap-9 px-14">
                    <ul className="w-full flex flex-col justify-center items-start gap-14 sm:gap-4 mt-10">
                      <li className="flex justify-start items-center">
                        <Img
                          src="images/img_vector.svg"
                          alt="vector_three"
                          className="h-[15px] mt-1.5"
                        />
                        <Heading
                          size="4xl"
                          as="h2"
                          className="text-black-900 ml-4 sm:text-xl sm:text-left lg:text-[27px] md:text-[20px]"
                        >
                          Hand Written Notes
                        </Heading>
                      </li>
                      <li className="flex justify-start items-center">
                        <Img
                          src="images/img_vector.svg"
                          alt="vector_three"
                          className="h-[15px] mt-1.5"
                        />
                        <Heading
                          size="4xl"
                          as="h2"
                          className="text-black-900 ml-4 sm:text-xl lg:text-[27px] md:text-[20px]"
                        >
                          Extensive Worksheets
                        </Heading>
                      </li>
                      <li className="flex justify-start items-center">
                        <Img
                          src="images/img_vector.svg"
                          alt="vector_three"
                          className="h-[15px] mt-1.5"
                        />
                        <Heading
                          size="4xl"
                          as="h2"
                          className="text-black-900 ml-4 sm:text-xl lg:text-[27px] md:text-[20px]"
                        >
                          Question Banks
                        </Heading>
                      </li>
                      <li className="flex justify-start items-center ">
                        <Img
                          src="images/img_vector.svg"
                          alt="vector_three"
                          className="h-[15px] mt-1.5"
                        />
                        <Heading
                          size="4xl"
                          as="h2"
                          className="text-black-900 ml-4 sm:text-xl lg:text-[27px] md:text-[20px]"
                        >
                          Test Series
                        </Heading>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="h-[700px] sm:h-[630px] w-[90%] mt-[70px] relative lg:mt-[50px]">
                <div className="flex flex-col items-start justify-start w-full gap-[35px] bottom-0 sm:top-10 right-0 left-0 p-[35px] m-auto bg-teal-900 absolute rounded-[20px] ">
                  <Heading
                    size="xl"
                    as="h6"
                    className="mt-5 ml-[27px] sm:text-2xl sm:ml-[0px] xs:text-[20px]"
                  >
                    Flexible
                  </Heading>
                  <Heading
                    as="h2"
                    className="ml-[27px] sm:text-3xl sm:ml-[0px] md:text-[25px] xs:text-[22px]"
                  >
                    For Slowly Grasp Students
                  </Heading>
                  <div className="flex flex-row justify-start w-[65%] lg:w-[60%] sm:w-[100%] ml-[27px] sm:ml-[0px] md:w-[51%]">
                    <div className="flex flex-col items-start justify-start w-full gap-[60px] sm:gap-[5px]">
                      <Text
                        size="xl"
                        as="p"
                        className="!font-medium text-justify sm:text-lg sm:text-left md:text-[15px] xs:text-[15px]"
                      >
                        Provide instruction that caters to the diverse needs of
                        students by offering multiple ways to access and engage
                        with the material. Differentiate instruction based on
                        students&#39; learning styles, interests, abilities, and
                        pace of learning.
                      </Text>
                      <div className="flex flex-row justify-between items-start w-[70%] sm:mt-[15px]">
                        {/* <div className="flex flex-row justify-center items-center w-[29%] gap-[60px]"> */}
                        <Heading as="h2" className="w-[100%]">
                          <span className="text-5xl sm:text-xl md:text-[22px]">
                            1500+
                          </span>
                          <br />
                          <span className="text-xl sm:text-xs md:text-[18px]">
                            Students
                          </span>
                        </Heading>
                        <div className="" />
                        {/* <div className="flex flex-row justify-center items-center w-[63%]"> */}
                        {/* </div> */}
                        <Heading
                          as="h2"
                          className="w-[100%] mx-[50px] sm:mx-[10px] "
                        >
                          <span className="text-5xl sm:text-xl sm:text-center md:text-[22px]">
                            200+
                          </span>
                          <br />
                          <span className="text-xl sm:text-xs md:text-[18px]">
                            Beneficiaries
                          </span>
                        </Heading>
                        <div className="" />
                        <Heading
                          as="h2"
                          className="w-[100%] mx-[px] sm:mx-[10px]"
                        >
                          <span className="text-5xl sm:text-xl md:text-[22px]">
                            10+
                          </span>
                          <br />
                          <span className="text-xl sm:text-xs md:text-[18px]">
                            Tutors
                          </span>
                        </Heading>
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                </div>
                <Img
                  src="images/img_image_54.webp"
                  alt="imagefiftyfour"
                  className="h-[545px] w-1/4 sm:w-[90%] right-[4%] top-0 m-auto object-cover absolute rounded-[20px] sm:hidden lg:h-[450px] lg:w-[30%] lg:top-[6%] md:w-[38%]"
                />
              </div>

              <div className="h-[600px] sm:h-[100vh] xs:h-[93vh] w-full mt-[105px] sm:mt-[55px] relative">
                <Slider
                  autoPlay
                  autoPlayInterval={2000}
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
                  className="justify-center w-full left-0 bottom-0 right-0 top-0 m-auto absolute"
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
                            hands-on projects and internships provided valuable
                            real-world experience that prepared me for my
                            career.
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
