/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
  import {useToast} from "@chakra-ui/react";
  import { useState } from "react";
  import Cookies from "js-cookie";
  import { useRouter } from "next/router";
  import Link from "next/link";
  import { useMutation } from "../hooks/useMutation";
  
  export default function Register() {
    const router = useRouter();
    const toast = useToast();
    const { mutate } = useMutation();
    const [payload, setPayload] = useState({
      name: "",
      email: "",
      password: "",
      birthdate: "",
    });
  
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };
  
    const HandleSubmit = async () => {
      const { name, email, password, birthdate } = payload;

      if (!name || !email || !password || !birthdate) {
        toast({
          title: "All fields are required",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      if (!validateEmail(email)) {
        toast({
          title: "Invalid email format",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      if (password.length < 6) {
        toast({
          title: "Password must be at least 6 characters",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      const response = await mutate({
        url: "https://blood-sup.fly.dev/signup",
        payload,
      });
      console.log('response => ', response)
      if (!response?.user) {
        toast({
          title: "Register Failed",
          description: "Please repeat the registration",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "Register Success",
          description: "Please Login",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        router.push("/login");
      }
    };
  
    return (
      <div className="flex items-center justify-center h-screen bg-gray-200">
        <div className="bg-white p-8 rounded-2xl shadow-md w-96">
          <h4 className="text-2xl font-bold mb-4 text-center">Blood Supplement Reminder Register</h4>
          <div className="mb-4">
            <label htmlFor="email">Name</label>
            <input
              className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
              value={payload?.name}
              onChange={(event) => setPayload({ ...payload, name: event.target.value })}
              placeholder="Name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email">Email</label>
            <input
              className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
              value={payload?.email}
              onChange={(event) => setPayload({ ...payload, email: event.target.value })}
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
              value={payload?.password}
              onChange={(event) => setPayload({ ...payload, password: event.target.value })}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              required
            />
            <button
              className="absolute top-1/2 right-2 transform -translate-y-1/4 px-2 py-3 text-sm text-gray-500 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="birthdate">Date of Birthday</label>
            <input
              className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
              value={payload?.birthdate}
              onChange={(event) => setPayload({ ...payload, birthdate: event.target.value })}
              id="birthdate"
              type="date"
              required
            />
          </div>
          <div>
            <button
              onClick={() => HandleSubmit()}
              className="bg-blue-500 text-white w-full px-6 py-2 rounded-2xl hover:bg-blue-700 focus:outline-none"
            >
              Register
            </button>
            <div className="mt-1 pl-1 pt-1 text-sm">
              <p className="text-gray-600">already have an account? <Link className="text-blue-600 hover:text-gray-800" href="/login">Login</Link> </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  