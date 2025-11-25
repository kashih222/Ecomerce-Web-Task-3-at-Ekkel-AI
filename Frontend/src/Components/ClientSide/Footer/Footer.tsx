import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-10">
      <div className="container mx-auto px-6">
        
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-4"><NavLink to="/">KASHIH STORE</NavLink></h2>
            <p className="text-gray-400 leading-relaxed text-center">
              Your trusted destination for premium quality products.
              Shop with confidence and enjoy the best deals everyday!
            </p>
          </div>

          
          <div className="flex flex-col items-center">
            <h3 className="text-xl text-white mb-4 ">Quick Links</h3>
            <ul className="space-y-2 text-center">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/products" className="hover:text-white">Products</a></li>
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          
          <div>
            <h3 className="text-xl text-white mb-4 text-center">Customer Support</h3>
            <ul className="space-y-2 text-center">
              <li><a href="/faq" className="hover:text-white">FAQ</a></li>
              <li><a href="/shipping" className="hover:text-white">Shipping Info</a></li>
              <li><a href="/returns" className="hover:text-white">Returns & Refunds</a></li>
              <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          
          <div>
            <h3 className="text-xl text-white mb-4 text-center">Follow Us</h3>
            <div className="flex items-center  gap-4 justify-center">
              <a href="#" className="hover:text-white text-2xl"><Facebook /></a>
              <a href="#" className="hover:text-white text-2xl"><Instagram /></a>
              <a href="#" className="hover:text-white text-2xl">  <Twitter /></a>
              <a href="#" className="hover:text-white text-2xl">  <Youtube /></a>
            </div>
          </div>

        </div>

        
        <div className="text-center text-gray-500 mt-10 border-t border-white pt-5">
          <p>© {new Date().getFullYear()} KASHIH STORE — All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
