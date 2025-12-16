import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../../assets/Logo.png";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import cartpng from "../../../assets/shopping-cart.gif";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../Redux Toolkit/hooks";

const API_REGISTER = "http://localhost:5000/api/auth/user/registeruser";
const API_LOGIN = "http://localhost:5000/api/login/loginuser";
const API_LOGOUT = "http://localhost:5000/api/auth/loging/logout";
const API_USER = "http://localhost:5000/api/loged-me/me";

type InputsLogin = {
  email: string;
  password: string;
};

type InputsSignup = {
  fullname: string;
  email: string;
  password: string;
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [OpenLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [user, setUser] = useState<{ fullname: string; email: string } | null>(
    null
  );
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();

  const cart = useAppSelector((state) => state.cart.items);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(API_USER, { withCredentials: true });
        setUser(response.data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // LOGIN FORM
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLogin,
    formState: { errors: loginErrors, isSubmitting: loginSubmitting },
  } = useForm<InputsLogin>();

  // SIGNUP FORM
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    reset: resetSignup,
    formState: { errors: signupErrors, isSubmitting: signupSubmitting },
  } = useForm<InputsSignup>();

  // LOGIN SUBMIT
  const onLoginSubmit: SubmitHandler<InputsLogin> = async (data) => {
    try {
      const response = await axios.post(API_LOGIN, data, {
        withCredentials: true,
      });
      console.log("Login success:", response.data);

      // Store user data
      setUser(response.data.user);
      localStorage.setItem("token", response.data.user.token);

      toast.success(`Welcome, ${response.data.user.fullname}`);
      resetLogin();
      setOpenLogin(false);

      // Role-based redirection
      if (response.data.user.role === "admin") {
        navigate("/dashboard");
      } else if (response.data.user.role === "customer") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  // SIGNUP SUBMIT
  const onSignupSubmit: SubmitHandler<InputsSignup> = async (data) => {
    try {
      await delay(2000);

      const response = await axios.post(API_REGISTER, data, {
        withCredentials: true,
      });
      console.log("User Registered:", response.data);

      setUser(response.data.user);
      resetSignup();
      setOpenSignup(false);
      toast.success("User Registered Successfully!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Something went wrong!");
      } else {
        console.log(error);
        const message = error instanceof Error ? error.message : String(error);
        toast.error(message || "Something went wrong!");
      }
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      await axios.post(API_LOGOUT, {}, { withCredentials: true });
      localStorage.removeItem("token");
      setUser(null);
      setOpenProfile(false);
      setOpen(false);
      toast.success("Logged out successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <NavLink to="/" className="">
          <img
            src={logo}
            alt="logo"
            className="w-[100px] hover:scale-95 duration-400 sm:w-[150px]  md:w-190px lg:w-200px xl:w-[200px]"
          />
        </NavLink>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 text-lg font-medium">
          <li>
            <NavLink to="/" className="hover:text-black duration-200">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className="hover:text-black duration-200">
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="hover:text-black duration-200">
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="hover:text-black duration-200">
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-4">
          <div className=" w-14 h-14 cursor-pointer">
            <NavLink to="/cart">
              <span className="text-white font-bold absolute  bg-red-400 w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>

              <img src={cartpng} alt="Cart_png" />
            </NavLink>
          </div>
          {user ? (
            <div className="relative">
              <div className="flex items-center justify-center gap-2">
                <div
                  className="rounded-full w-12 h-12 border border-gray-300 cursor-pointer flex items-center justify-center bg-black text-white font-bold hover:scale-95"
                  onClick={() => setOpenProfile(!openProfile)}
                >
                  {user?.fullname.charAt(0).toUpperCase()}
                </div>
              </div>
              {openProfile && (
                <div className="absolute right-0 mt-2 bg-black text-white shadow-lg rounded-lg p-2  text-sm ">
                  <div className="">
                    <p className=" font-bold px-2 py-1 whitespace-nowrap">
                      {user.fullname}
                    </p>
                    <p className="px-2 py-1 whitespace-nowrap">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 py-1 hover:bg-red-600 rounded hover:text-white font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                className="px-5 py-2 border border-black text-black rounded-full hover:bg-black hover:scale-95 hover:text-white duration-300"
                onClick={() => setOpenLogin(true)}
              >
                Login
              </button>
              <button
                className="px-5 py-2 bg-black text-white rounded-full hover:scale-95 duration-300"
                onClick={() => setOpenSignup(true)}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Hamburger Menu */}
        <div className="md:hidden flex items-center justify-center gap-2">
          <div className="" onClick={() => setOpen(!open)}>
            {open ? <X size={30} /> : <Menu size={30} />}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-md py-4 px-6 space-y-6">
          <ul className="flex flex-col gap-4 text-gray-700 font-medium">
            <li>
              <Link to="/" onClick={() => setOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={() => setOpen(false)}>
                Products
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>
          <div className=" w-14 h-14 cursor-pointer">
            <NavLink to="/cart">
              <span className="text-white absolute  bg-red-400 w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
              <img src={cartpng} alt="Cart_png" />
            </NavLink>
          </div>
          {/* Mobile Buttons */}

          {user ? (
            <div className="flex items-center gap-2 relative">
              <div
                className="rounded-full w-12 h-12 border border-gray-300 cursor-pointer flex items-center justify-center bg-gray-900 text-white font-bold hover:scale-95"
                onClick={() => setOpenProfile(!openProfile)}
              >
                {user?.fullname.charAt(0).toUpperCase()}
              </div>

              {openProfile && (
                <div className="  mt-2 bg-black text-white shadow-lg rounded-lg p-2  text-sm ">
                  <div className="">
                    <p className="font-bold px-2 py-1 whitespace-nowrap">
                      {user.fullname}
                    </p>
                    <p className="px-2 py-1 whitespace-nowrap">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 py-1 hover:bg-red-600 rounded hover:text-white font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2">
                <button
                  className="px-5 py-2 border border-black text-black rounded-full hover:scale-90 hover:text-white duration-300"
                  onClick={() => setOpenLogin(true)}
                >
                  Login
                </button>
                <button
                  className="px-5 py-2 bg-black text-white rounded-full hover:scale-90 duration-300"
                  onClick={() => setOpenSignup(true)}
                >
                  Sign Up
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* LOGIN MODAL */}
      {OpenLogin && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 sm:w-96 p-6 relative shadow-lg">
            <button
              onClick={() => setOpenLogin(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <form
              onSubmit={handleSubmitLogin(onLoginSubmit)}
              className="flex flex-col gap-4"
            >
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                {...registerLogin("email", {
                  required: true,
                  pattern:
                    /^[a-zA-Z0-9._%+-]{4,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                })}
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                {...registerLogin("password", {
                  required: true,
                  minLength: 6,
                  maxLength: 20,
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                })}
              />
              {(loginErrors.email || loginErrors.password) && (
                <div className="text-sm text-red-600 space-y-1 mt-1">
                  {loginErrors.email?.type === "required" && (
                    <div>Email is required.</div>
                  )}
                  {loginErrors.email?.type === "pattern" && (
                    <div>Enter a valid email.</div>
                  )}
                  {loginErrors.password?.type === "required" && (
                    <div>Password is required.</div>
                  )}
                  {loginErrors.password?.type === "minLength" && (
                    <div>Password must be at least 6 characters.</div>
                  )}
                  {loginErrors.password?.type === "maxLength" && (
                    <div>Password must be at most 20 characters.</div>
                  )}
                  {loginErrors.password?.type === "pattern" && (
                    <div>
                      Password must contain:
                      <br />– 1 uppercase letter
                      <br />– 1 lowercase letter
                      <br />– 1 number
                      <br />– 1 special character
                    </div>
                  )}
                </div>
              )}

              <input
                type="submit"
                value="Login"
                className="bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700 transition"
                disabled={loginSubmitting}
              />
            </form>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Don't have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => {
                  setOpenLogin(false);
                  setOpenSignup(true);
                }}
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}
      {openSignup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 sm:w-96 p-6 relative shadow-lg">
            <button
              onClick={() => setOpenSignup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmitSignup(onSignupSubmit)}
            >
              <input
                type="text"
                placeholder="Full Name"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                {...registerSignup("fullname", {
                  required: "Full Name is required",
                  minLength: {
                    value: 3,
                    message: "Full Name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 30,
                    message: "Full Name must be at most 30 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z ]+$/,
                    message: "Full Name can only contain letters and spaces",
                  },
                })}
              />
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                {...registerSignup("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9._%+-]{4,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message:
                      "Enter a valid email with at least 4 chars before @",
                  },
                })}
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                {...registerSignup("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Password must be at most 20 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                    message:
                      "Password must contain 1 uppercase, 1 lowercase, 1 number & 1 special char",
                  },
                })}
              />

              {(signupErrors.fullname ||
                signupErrors.email ||
                signupErrors.password) && (
                <div className="text-sm text-red-600 space-y-1 mt-1">
                  {signupErrors.fullname && (
                    <div>{signupErrors.fullname.message}</div>
                  )}
                  {signupErrors.email && (
                    <div>{signupErrors.email.message}</div>
                  )}
                  {signupErrors.password && (
                    <div>{signupErrors.password.message}</div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={signupSubmitting}
                className={`bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700 transition ${
                  signupSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {signupSubmitting ? "Submitting..." : "Sign Up"}
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => {
                  setOpenLogin(true);
                  setOpenSignup(false);
                }}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
