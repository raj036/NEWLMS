import axios from "axios";

export default axios.create({
  // baseURL: "http://192.168.29.82:8001/",
  // baseURL: "http://il8rigour.com:8000/",
  // baseURL: "https://ilate.onrender.com/",
  // baseURL: "https://f106-2405-201-37-21d9-311d-7880-d42b-c558.ngrok-free.app/",
  // baseURL: "https://3236-2405-201-37-21d9-a536-3d79-dce8-9d6e.ngrok-free.app/",
  // baseURL: "https://lms-5wr7.onrender.com/",
  baseURL: "https://il8lc.com/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": true,
  },
});