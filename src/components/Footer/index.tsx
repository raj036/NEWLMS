import React, { useState } from "react";
import { Text, Img, Heading, Button, Input } from "./..";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "helper/axios";

interface Props {
  className?: string;
}

export default function Footer({ ...props }: Props) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
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
      const response = await axios.post("api/inquiries/", form, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        Swal.fire({
          title: "Admission Enquiry Submitted!",
          text: "Kindly Wait for Confirmation from the Admission Office.",
          icon: "success",
          customClass: {
            icon: "swal-my-icon",
          },
          confirmButtonColor: "#7066E0",
          confirmButtonText: "Yes",
        }).then((result: { isConfirmed: any }) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      // console.error("Error Submitting Query", error);
      if (error || error.response.status !== 200) {
        Swal.fire({
          title: "Technical Issue",
          text: `Error Occured While Submitting Admission Enquiry!`,
          icon: "error",
          customClass: {
            icon: "swal-my-icon",
          },
          showConfirmButton: true,
          confirmButtonColor: "red",
        }).then((result: { isConfirmed: any }) => {
          if (result.isConfirmed) {
            navigate("/");
            window.scrollTo(0, 0);
          }
        });
      }
    }
  };

  return (
    <footer {...props}>
      <div className="flex flex-row justify-center items-center w-full mx-auto">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-row md:flex-col justify-between items-start w-full gap-8">
            <div className="flex flex-col justify-start w-[30%] md:w-[40%] sm:w-[70%] xs:w-full gap-8">
              <Img
                src="images/footerLogo.webp"
                alt="whatsappimage"
                loading="lazy"
                className="w-[75%] object-cover"
                width="600"
                height="400"
              />
            </div>
            <div className="flex flex-col items-start justify-start w-[70%] md:w-full gap-10">
              <div className="flex flex-row sm:flex-col justify-start items-start h-full">
                <div className="flex w-full md:w-6/12 justify-around sm:w-full">
                  <div className="flex flex-col items-start justify-start w-3/12 sm:w-full mb-8">
                    <Heading
                      size="xl"
                      as="h6"
                      className="mb-4 tracking-[0.20px]"
                    >
                      Courses
                    </Heading>
                    <ul className="flex flex-col items-start justify-start w-full">
                      <li>
                        <Link to="#">
                          <Text as="p" className="hover:underline sm:leading-7">
                            IBDP
                          </Text>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <Text as="p" className="hover:underline sm:leading-7">
                            IGCSE
                          </Text>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <Text as="p" className="hover:underline sm:leading-7">
                            MYP
                          </Text>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <Text as="p" className="hover:underline sm:leading-7">
                            A Level
                          </Text>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <Text as="p" className="hover:underline sm:leading-7">
                            SAT/ACT
                          </Text>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <Text as="p" className="hover:underline sm:leading-7">
                            AI/ML
                          </Text>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col items-start justify-start w-3/12 sm:w-full mb-8">
                    <Heading
                      size="xl"
                      as="h6"
                      className="mb-4 tracking-[0.20px]"
                    >
                      Centers
                    </Heading>
                    <ul className="flex flex-col items-start justify-start w-full">
                      <li>
                        <a
                          href="https://maps.app.goo.gl/WgqwBB1BrKJYSr3K8"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Text as="p" className="hover:underline sm:leading-7">
                            Bandra
                          </Text>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://maps.app.goo.gl/f5X4Hf93k7tjn2Ct9"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Text as="p" className="hover:underline sm:leading-7">
                            Kemps Corner
                          </Text>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://maps.app.goo.gl/WgqwBB1BrKJYSr3K8"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Text as="p" className="hover:underline sm:leading-7">
                            Juhu
                          </Text>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* </div> */}
                <div className="flex flex-col items-start justify-start w-[70%] lg:w-[80%] md:w-[60%] sm:w-full mb-8">
                  <div>
                    <Heading
                      size="xl"
                      as="h6"
                      className="mb-4 tracking-[0.20px]"
                    >
                      Admission Enquiry
                    </Heading>
                    <Heading
                      size="s"
                      as="p"
                      className="w-[90%] tracking-[0.20px] text-justify"
                    >
                      For any queries regarding the admission process, please
                      fill up the form below and we will get back to you as soon
                      as possible.
                    </Heading>
                    <form
                      onSubmit={handleSubmit}
                      className="w-full mt-5 xs:block grid grid-cols-2 gap-x-10 gap-y-6 text-white-A700"
                    >
                      <div className="border-b-2">
                        <Input
                          size="xs"
                          variant="fill"
                          className="!p-0 tracking-[0.20px] text-white-A700"
                          placeholder="Name*"
                          name="name"
                          id="name"
                          type="text"
                          onChange={(value: any) => handleChange("name", value)}
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.target.value = e.target.value.replace(
                              /[^a-zA-Z]/g,
                              ""
                            ); // Remove non-alphabetic characters
                          }}
                          required
                        />
                      </div>
                      <div className="border-b-2">
                        <Input
                          size="xs"
                          variant="fill"
                          className="!p-0 tracking-[0.20px] text-white-A700"
                          placeholder="Email*"
                          name="email"
                          id="email"
                          type="email"
                          onChange={(value: any) =>
                            handleChange("email", value)
                          }
                          required
                        />
                      </div>
                      <div className="border-b-2">
                        <Input
                          size="xs"
                          variant="fill"
                          className="!p-0 tracking-[0.20px] text-white-A700"
                          placeholder="Phone (10 Digit)*"
                          minLength={10}
                          maxLength={10}
                          name="phone"
                          id="phone"
                          type="text"
                          pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                          onChange={(value: any) =>
                            handleChange("phone", value)
                          }
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.target.value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                          }}
                          required
                        />
                      </div>
                      <div className="border-b-2">
                        <Input
                          size="xs"
                          variant="fill"
                          className="!p-0 tracking-[0.20px] text-white-A700"
                          placeholder="Message"
                          name="message"
                          id="message"
                          type="text"
                          onChange={(value: any) =>
                            handleChange("message", value)
                          }
                        />
                      </div>
                      <div className="w-full">
                        <Button
                          type="submit"
                          color="white_A700"
                          className="border-b-2 mt-4 tracking-[0.20px] font-bold max-w-sm rounded-[15px] hover:bg-white-A700 hover:text-black-900"
                        >
                          Submit
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row md:flex-col-reverse justify-between items-center w-[86%] sm:text-[12px] sm:w-full m-4">
            <Text size="s" as="p" className="sm:text-[12px]">
              Copyright 2024 ILATE. All rights reserved.
            </Text>
            <div className="flex flex-row justify-between items-center w-auto gap-[90px]">
              <Text size="s" as="p" className="!font-raleway sm:text-[12px]">
                <Link to="/privacy_policy" className="inline mx-1 hover:underline">
                  Privacy Policy
                </Link>{" "}
                |{" "}
                <Link to="/data_security" className="inline mx-1 hover:underline">
                  Data & Security
                </Link>{" "}
                |{" "}
                <Link to="terms_service" className="inline mx-1 hover:underline">
                  Terms of Service
                </Link>{" "}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
