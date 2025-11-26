
const AboutPage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 mt-20 major-mono">
      {/* Header Section */}
      <div className="w-full  text-black py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-widest">
          About Us
        </h1>
        <p className="mt-4 text-black md:text-xl max-w-2xl mx-auto">
          Learn more about KASHIH STORE, our mission, values, and how we bring
          the best products to your doorstep.
        </p>
      </div>

      <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12 ">
        {/* Image */}
        <div className="md:w-1/2">
          <img
            src="https://plus.unsplash.com/premium_photo-1661286649736-c1d7a822781a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="About Us"
            className="rounded-xl shadow-lg w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="md:w-1/2 ">
          <h2 className="text-3xl font-bold mb-4 chango-regular">Our Mission</h2>
          <p className="text-gray-700 mb-6 chango-regular">
            At KASHIH STORE, our mission is to provide high-quality products that
            cater to every need and lifestyle. We aim to make shopping
            convenient, enjoyable, and reliable for all our customers.
          </p>

          <h2 className="text-3xl font-bold mb-4 chango-regular">Our Values</h2>
          <ul className="list-disc list-inside text-black space-y-2 chango-regular">
            <li>Customer satisfaction is our top priority.</li>
            <li>We ensure quality and authenticity in every product.</li>
            <li>Innovation and continuous improvement drive our service.</li>
            <li>Sustainability and ethical practices guide our business.</li>
          </ul>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="w-full  text-black py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Join Our Community
        </h2>
        <p className="mb-6 text-gray-950 md:text-lg max-w-2xl mx-auto">
          Stay updated with our latest products, offers, and updates by
          subscribing to our newsletter.
        </p>
        <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:scale-90 duration-300 transition">
          Subscribe Now
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
