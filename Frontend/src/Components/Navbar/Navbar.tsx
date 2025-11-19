import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from '../../assets/Logo.png'





const Navbar = () => {
  const [open, setOpen] = useState(false);


  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">

        
        <NavLink to="/" className="">
          <img src={logo} alt="logo" className="w-[100px] hover:scale-95 duration-400 sm:w-[150px]  md:w-190px lg:w-200px xl:w-[200px]"  />
        </NavLink>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 text-lg font-medium">
          <li><NavLink to="/" className="hover:text-black  duration-200">Home</NavLink></li>
          <li><NavLink to="/products" className="hover:text-black duration-200">Products</NavLink></li>
          <li><NavLink to="/about" className="hover:text-black duration-200">About</NavLink></li>
          <li><NavLink to="/contact" className="hover:text-black duration-200">Contact</NavLink></li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-4">
          <button className="px-5 py-2 border border-black text-black rounded-full hover:bg-black hover:scale-95 hover:text-white duration-300">
            Login
          </button>
          <button className="px-5 py-2 bg-black text-white rounded-full hover:scale-95 duration-300">
            Sign Up
          </button>
        </div>

        {/* Hamburger Menu */}
        <div className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={30} /> : <Menu size={30} />}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-md py-4 px-6 space-y-6">
          <ul className="flex flex-col gap-4 text-gray-700 font-medium">
            <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
            <li><Link to="/products" onClick={() => setOpen(false)}>Products</Link></li>
            <li><Link to="/about" onClick={() => setOpen(false)}>About</Link></li>
            <li><Link to="/contact" onClick={() => setOpen(false)}>Contact</Link></li>
          </ul>

          {/* Mobile Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <button className="px-5 py-2 border border-black text-black rounded-full hover:scale-90 hover:text-white duration-300">
              Login
            </button>
            <button className="px-5 py-2 bg-black text-white rounded-full hover:scale-90 duration-300">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
