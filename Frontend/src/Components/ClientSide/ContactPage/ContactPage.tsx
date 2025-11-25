const ContactPage = () => {
  return (
    <div className="flex items-center justify-center mt-60">
      <div className="container min-h-screen w-full flex items-center justify-center px-4">
      <div className="container mx-auto">
        {/* GRID (same layout as HomePage) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="hero-content flex flex-col gap-6 md:gap-10 text-center md:text-left">
            <p className="text-3xl md:text-4xl chango-regular">Get in Touch</p>

            <h1 className="text-4xl md:text-6xl font-bold tracking-widest">
              CONTACT US
            </h1>

            <hr className="w-[50%] md:w-[40%] mx-auto md:mx-0 border-gray-500" />

            <p className="text-xl md:text-2xl major-mono leading-relaxed chango-regular">
              Have questions, feedback, or need support? Our team is always here
              to help. Reach out to us anytime!
            </p>

            {/* Contact Info */}
            <div className="mt-4 space-y-3 text-lg md:text-xl chango-regular">
              <p>
                <strong>Email:</strong> support@kashihstore.com
              </p>
              <p>
                <strong>Phone:</strong> +92 311 7747393
              </p>
              <p>
                <strong>Address:</strong>EkkelAI, Gulberg III, Lahore, Pakistan
              </p>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hero-img relative flex justify-center md:justify-end">
            {/* BG Square (same style as homepage) */}
            <div
              className="
              absolute bg-gray-300 rounded-lg shadow-2xl z-0
              w-[200px] h-[200px]
              sm:w-[260px] sm:h-[260px]
              md:w-[330px] md:h-[330px]
              lg:w-[500px] lg:h-[500px]
              xl:w-[600px] xl:h-[600px]
              -top-6 md:-top-10 right-6 md:right-20
            "
            ></div>

            {/* Contact Image */}
            <figure className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=800&auto=format&fit=crop&q=60"
                alt="Contact"
                className="
                  rounded-lg shadow-2xl object-cover
                  w-[250px]
                  sm:w-[290px]
                  md:w-[390px]
                  lg:w-[590px]
                  xl:w-[690px]
                "
              />
            </figure>
          </div>
        </div>
        <div className="conatiner h-2 w-full bg-black mt-20 md:mt-30 lg:mt-60"></div>
        <div className="py-20 ">
          <form className="w-full max-w-xl mx-auto bg-gray-100 p-8 rounded-2xl shadow-xl text-black space-y-6 ">
            {/* Full Name */}
            <div>
              <label className="font-semibold text-lg">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full mt-2 p-3 rounded-lg border border-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-semibold text-lg">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mt-2 p-3 rounded-lg border border-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="font-semibold text-lg">Subject</label>
              <input
                type="text"
                placeholder="Enter subject"
                className="w-full mt-2 p-3 rounded-lg border border-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
              />
            </div>

            {/* Message */}
            <div>
              <label className="font-semibold text-lg">Message</label>
              <textarea
                placeholder="Write your message..."
                rows={5}
                className="w-full mt-2 p-3 rounded-lg border border-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-gray-800 transition resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-black text-white text-lg rounded-lg 
               hover:bg-gray-800 hover:scale-95 transition-all font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ContactPage;
