import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Img, Heading, Text, Button, TextArea, Input } from "../../components";
import { Link } from "react-router-dom";
import axios from "helper/axios";
import Swal from "sweetalert2";

export default function ContactUsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });

  const handleChange = (fieldName: any, value: any) => {
    setForm((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("api/mail/", form, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        Swal.fire({
          title: "Mail Has Been Sent!",
          icon: "success",
          confirmButtonColor: "#7066E0",
          confirmButtonText: "Yes",
          customClass: {
            icon: "swal-my-icon",
          },
        }).then((result: { isConfirmed: any }) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      // console.error("Error Sending Mail", error);
      if (error || error.response.status !== 200) {
        Swal.fire({
          title: "Error Sending Mail!",
          text: `${error?.response?.data?.detail}`,
          icon: "error",
          showConfirmButton: true,
          confirmButtonColor: "red",
          customClass: {
            icon: "swal-my-icon",
          },
        }).then((result: { isConfirmed: any }) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us</title>
      </Helmet>

      <div className="flex flex-col items-center justify-start w-full mt-6 pt-7 gap-7 bg-white-A700">
        <div className="flex flex-col items-center justify-start w-full gap-[105px]">
          <div className="flex flex-col md:flex-row justify-center w-full">
            <div className="flex flex-col items-center justify-start w-full gap-[85px] sm:gap-6">
              <div className="h-[455px] sm:h-[200px] w-full relative">
                <Img
                loading="lazy"
                  src="images/img_image_56.webp"
                  alt="imagefiftysix"
                  className="justify-center h-[500px] sm:h-[200px] w-full xs:w-100 left-0 bottom-0 right-0 top-0 m-auto object-cover absolute"
                />
                <Heading
                  size="4xl"
                  as="h1"
                  className="w-max left-[2%] bottom-0 top-[45%] my-auto mx-1 absolute text-center md:text-left"
                >
                  Contact Us
                </Heading>
              </div>
              <div className="flex flex-row sm:flex-col md:flex-col gap-8 justify-between items-start w-full max-w-[1749px] py-5 px-16 sm:px-1 mb-[85px]">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col items-start justify-start md:w-[100%] gap-[31px] p-[20px] bg-teal-900 shadow-xs rounded-[20px]"
                >
                  <div className="flex flex-row justify-start w-[25%] mt-[25px] pb-[7px]">
                    <div className="flex flex-col items-center justify-start w-[86%] gap-px">
                      <div className="h-px w-full bg-orange-300" />
                      <div className="flex flex-col items-center justify-start w-full gap-0.5">
                        <Text
                          size="md"
                          as="p"
                          className="!text-white-A700 tracking-[4.05px] sm:tracking-[1px] xs:tracking-0 uppercase text-center sm:text-[13px]"
                        >
                          MAIL US
                        </Text>
                        <div className="h-px w-full bg-orange-300" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-start w-full gap-[34px]">
                    <div className="flex flex-row sm:flex-col justify-start w-full gap-7">
                      <Input
                        type="text"
                        name="name"
                        placeholder="Name*"
                        className="w-[49%] sm:w-[100%] !text-white-A700"
                        onChange={(value: any) => handleChange("name", value)}
                        required
                      />
                      <Input
                        type="email"
                        name="email"
                        placeholder="Email*"
                        className="w-[49%] sm:w-[100%] !text-white-A700"
                        onChange={(value: any) => handleChange("email", value)}
                        required
                      />
                    </div>
                    <div className="flex flex-row sm:flex-col justify-start w-full gap-7">
                      <Input
                        type="text"
                        name="subject"
                        placeholder="Subject*"
                        className="w-[49%] sm:w-[100%] !text-white-A700"
                        onChange={(value: any) =>
                          handleChange("subject", value)
                        }
                        required
                      />
                      <Input
                        type="tel"
                        maxLength={10}
                        name="phone"
                        placeholder="Phone (10 Digit)*"
                        className="w-[49%] sm:w-[100%] !text-white-A700"
                        pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                        onChange={(value: any) => handleChange("phone", value)}
                        required
                      />
                    </div>
                    <TextArea
                      name="message"
                      placeholder="Message"
                      className="w-full !text-white-A700 font-medium"
                      onChange={(value: any) => handleChange("message", value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="xl"
                    className="mb-8 ml-[3px] sm:w-full font-bold min-w-[161px] border border-deep_orange-500 hover:text-deep_orange-500 hover:bg-white-A700"
                  >
                    Send
                  </Button>
                </form>
                <div className="flex flex-col items-start justify-start md:w-full w-[45%] lg:w-[60%] sm:w-full sm:p-4 ">
                  <Heading
                    size="2xl"
                    as="h2"
                    className="!text-deep_orange-500 text-left"
                  >
                    Your Guide To Academic Excellence
                  </Heading>

                  <Heading
                    size="6xl"
                    as="h3"
                    className="mt-[13px] !text-black-900 text-center sm:text-lg lg:text-[28px]"
                  >
                    Get in Touch
                  </Heading>
                  <Text
                    size="xl"
                    as="p"
                    className="mt-3.5 !text-black-900 !font-normal leading-[126.5%] text-justify sm:text-base lg:text-[16px]"
                  >
                    We understand that embarking on an academic journey can
                    bring about questions and curiosities. That's why our
                    dedicated team is here to offer you the support and guidance
                    you need. Whether you're seeking more information about our
                    tailored tutoring programs, wish to discuss your child's
                    educational needs, or are ready to elevate your learning
                    experience, we're just a message away.
                  </Text>
                  <div className="flex flex-row justify-start items-center mt-[23px] gap-4">
                    <Img
                    loading="lazy"
                      src="images/img_vector_black_900.svg"
                      alt="vector_one"
                      className="h-[34px]"
                    />
                    <a
                      href="https://maps.app.goo.gl/WgqwBB1BrKJYSr3K8"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Text
                        size="xl"
                        as="p"
                        className="w-[95%] font-extrabold hover:underline !text-black-900 leading-[126.5%] sm:text-base lg:text-[16px]"
                      >
                        501 A Wing, 5th Floor Ganga Jamuna Sangam Building 24th
                        Road, Linking Rd, Bandra West, Mumbai, Maharashtra
                        400050
                      </Text>
                    </a>
                  </div>
                  <div className="flex flex-row justify-start mt-5 gap-4">
                    <Img
                    loading="lazy"
                      src="images/img_vector_black_900_26x29.svg"
                      alt="vector_three"
                      className="h-[26px]"
                    />
                    <a href="tel:+919702279804" className="no-underline">
                      <Text
                        size="xl"
                        as="p"
                        className="!text-black-900 font-extrabold hover:underline sm:text-base lg:text-[16px]"
                      >
                        +91 9702279804
                      </Text>
                    </a>
                  </div>
                  <div className="flex flex-row justify-start w-2/5 mt-[29px]">
                    <div className="flex flex-col items-start justify-start w-full gap-4">
                      <div className="flex flex-row justify-start items-center gap-4">
                        <Img
                        loading="lazy"
                          src="images/img_vector_black_900_24x32.svg"
                          alt="vector_five"
                          className="h-6"
                        />
                        <a href="mailto:ilatelearning@gmail.com">
                          <Text
                            size="xl"
                            as="p"
                            className="!text-black-900 font-extrabold hover:underline sm:text-base lg:text-[16px]"
                          >
                            ilatelearning@gmail.com
                          </Text>
                        </a>
                      </div>
                      <div className="h-px w-full bg-black-900" />
                    </div>
                  </div>
                  <Heading as="h4" className="mt-3 !text-black-900 text-center sm:text-3xl lg:text-[28px]">
                    Connect on Social
                  </Heading>
                  <div className="flex flex-row justify-between items-center gap-2 w-[20%] mt-[11px]">
                    <Link to="#">
                      <Img
                      loading="lazy"
                        src="images/img_vector_black_900_32x19.svg"
                        alt="vector_seven"
                        className="h-8"
                      />
                    </Link>
                    <Link to="#">
                      <Img
                      loading="lazy"
                        src="images/img_vector_black_900_30x32.svg"
                        alt="vector_nine"
                        className="h-8"
                      />
                    </Link>
                    <Link to="#">
                      <Img
                      loading="lazy"
                        src="images/img_vector_black_900_20x31.svg"
                        alt="vector_eleven"
                        className="h-6"
                      />
                    </Link>
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
