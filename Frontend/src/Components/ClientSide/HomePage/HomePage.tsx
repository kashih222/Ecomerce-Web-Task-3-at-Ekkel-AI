import FeatureProducts from "../Feature Products/FeatureProducts";
const HomePage = () => {
  return (
    <>
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="hero-content flex flex-col gap-6 md:gap-10 text-center md:text-left">
            <p className="text-3xl md:text-4xl chango-regular">Welcome to</p>

            <h1 className="text-4xl md:text-6xl font-bold tracking-widest">
              KASHIH STORE
            </h1>

            <hr className="w-[50%] md:w-[40%] mx-auto md:mx-0 border-gray-500" />

            <p className="text-xl md:text-2xl major-mono leading-relaxed">
              Where style meets comfort. Our mission is to deliver high-quality products that inspire confidence and bring joy to your everyday life. Explore our curated selections made with passion and care.
            </p>
          </div>

          <div className="hero-img relative flex justify-center md:justify-end">
            <div
              className="
              absolute bg-gray-300 rounded-lg shadow-2xl z-0
              w-[200px] h-[200px]
              sm:w-[260px] sm:h-[260px]
              md:w-[330px] md:h-[330px]
              lg:w-[500px] lg:h-[500px]
              xl:w-[560px] xl:h-[460px]
              -top-6 md:-top-10 right-6 md:right-20
            "
            ></div>

            <figure className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&auto=format&fit=crop&q=60"
                alt="Hero_Img"
                className="
                  rounded-lg shadow-2xl object-cover
                  w-[250px]
                  sm:w-[290px]
                  md:w-[390px]
                  lg:w-[590px]
                  xl:w-[610px]
                "
              />
            </figure>
          </div>
        </div>
      </div>
      
    </div>
    <FeatureProducts/>
    </>
  );
};

export default HomePage;
