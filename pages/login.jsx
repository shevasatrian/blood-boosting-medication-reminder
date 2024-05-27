/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useMutation } from "../hooks/useMutation";
import Reminder from "./reminder";

export default function Login() {
  const router = useRouter();
  const toast = useToast();
  const { mutate } = useMutation();
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });

  const HandleSubmit = async () => {
    const response = await mutate({ url: "https://blood-sup.fly.dev/login", payload });
    console.log(response)
    if (!response?.token) {
      toast({
        title: "Login Gagal",
        description: "email dan password tidak sesuai",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      console.log("tidak dapat login")
      console.log(response.user)
    } 
    else {
      // const responseData = response.data;
      Cookies.set("user_token", response?.token, { expires: new Date(response?.data?.expires_at), path: "/" });
      // localStorage.setItem('"user_token"', responseData.token);
      router.push("/");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="container bg-white rounded-2xl shadow-md lg:mx-32 md:mx-36">
        <div className="flex flex-wrap">
          {/* layar sm - md */}
          <div className="w-full lg:w-[55%] relative lg:hidden">
            <Image 
              src='/login-fig.jpg' 
              width={700} 
              height={450} 
              layout="responsive"
              objectFit="cover"
              alt="Login Image" 
              className="lg:rounded-l-2xl lg:rounded-tr-none rounded-t-2xl" 
            />
          </div>

          {/* layar lg */}
          <div className="w-full lg:w-[55%] relative overflow-hidden hidden md:block">
            <Image 
              src='/login-fig.jpg' 
              layout="fill" 
              objectFit="cover"
              alt="Login Image" 
              className="lg:rounded-l-2xl lg:rounded-tr-none rounded-t-2xl" 
            />
          </div>

          <div className=" lg:px-12 lg:py-14 p-6 lg:w-[45%] w-full lg:my-4 ">
            <h4 className="text-2xl font-bold mb-4">Blood Supplement Reminder Login</h4>
            <div className="mb-4">
              <label htmlFor="email">Email</label>
              <input
                className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
                value={payload?.email}
                onChange={(event) => setPayload({ ...payload, email: event.target.value })}
                placeholder="Email"
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password">Password</label>
              <input
                className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
                value={payload?.password}
                onChange={(event) => setPayload({ ...payload, password: event.target.value })}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
              />
              <button
                className="absolute top-1/2 right-2 transform -translate-y-1/4 px-2 py-3 text-sm text-gray-500 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div>
              <button
                onClick={() => HandleSubmit()}
                className="bg-blue-500 text-white w-full px-6 py-2 rounded-2xl hover:bg-blue-700 focus:outline-none"
              >
                Login
              </button>
              <div className="mt-1 pl-1 pt-1 text-sm">
                <p className="text-gray-600">don't have an account? <Link className="text-blue-600 hover:text-gray-800" href="/register">Register</Link> </p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
  );
}
