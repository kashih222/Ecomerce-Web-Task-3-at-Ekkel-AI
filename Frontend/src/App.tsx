import { BrowserRouter as  Router, Route, Routes } from 'react-router-dom'
import HomePage from './Components/HomePage/HomePage'
import AboutPage from './Components/AboutPage/AboutPage'
import ProductsPage from './Components/ProductsPage/ProductsPage'
import ContactPage from './Components/ContactPage/ContactPage'
import CartPage from './Components/Cart Page/CartPage'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import Toast from './Components/Toaster/Toast'
// import ErrorPage from './Components/ErrorPage/ErrorPage'

const App = () => {
  return (
    <Router>
      <Navbar />
        <Toast/>
        <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/about" element={<AboutPage/>} />
        <Route path="/products" element={<ProductsPage/>} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/cart" element={<CartPage/>} />
        {/* <Route path="*" element={<ErrorPage/>} /> */}

      </Routes>
      <Footer/>
    </Router>
  )
}

export default App