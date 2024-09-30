import Button from "./Button";
import Section from "./Section";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import background from "../images/6195005.jpg";
import profilePic from "../images/profile_pic.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Home = ({ user }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let role = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    role = decodedToken.role;
  }

  const handleNavigation = (path) => {
    if ((path === "/inventory" || path === "/users") && role !== "warehouse_manager") {
      alert("You do not have access to this page.");
    } else {
      navigate(path);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true, // Add arrows for navigation
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const data = [
    {
      name: "John Morgan",
      img: profilePic,
      review:
        "Great system to streamline our warehouse operations!",
    },
    {
      name: "Ellie Anderson",
      img: profilePic,
      review:
        "Easy to manage our warehouse inventory with real-time data.",
    },
    {
      name: "Nia Adebayo",
      img: profilePic,
      review:
        "The inbound and outbound management saves us a lot of time!",
    },
    {
      name: "Rigo Louie",
      img: profilePic,
      review:
        "Highly recommended for any warehouse operation.",
    },
    {
      name: "Mia Williams",
      img: profilePic,
      review:
        "The best tool we've added to our warehouse management toolkit.",
    },
  ];

  return (
    <Section className="pt-[10rem] -mt-[4] flex items-center justify-center relative" id="home">
      <div className="container relative text-center z-10">
        <div className="relative z-1 max-w-[60rem] mx-auto">
          {user ? (
            <>
              <h1 className="text-5xl font-semibold mb-8">Welcome back, {user.username}!</h1>
              <p className="text-xl mb-12">What would you like to manage today?</p>

              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center items-center`}>
                {role === "warehouse_manager" && (
                  <div className="flex flex-col items-center">
                    <Button
                      onClick={() => handleNavigation("/inventory")}
                      white
                      className="p-3 rounded-lg bg-green-500 hover:bg-green-600"
                    >
                      Manage Inventory
                    </Button>
                    <p className="mt-2 text-sm text-gray-500">
                      Add, view, and update products in your warehouse.
                    </p>
                  </div>
                )}

                <div className="flex flex-col items-center">
                  <Button
                    onClick={() => handleNavigation("/inbound")}
                    white
                    className="p-3 rounded-lg bg-blue-500 hover:bg-blue-600"
                  >
                    Inbound Management
                  </Button>
                  <p className="mt-2 text-sm text-gray-500">
                    Track incoming products and update supplier details.
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <Button
                    onClick={() => handleNavigation("/outbound")}
                    white
                    className="p-3 rounded-lg bg-yellow-500 hover:bg-yellow-600"
                  >
                    Outbound Management
                  </Button>
                  <p className="mt-2 text-sm text-gray-500">
                    Track outgoing products and manage customer information.
                  </p>
                </div>

                {role === "warehouse_manager" && (
                  <div className="flex flex-col items-center">
                    <Button
                      onClick={() => handleNavigation("/users")}
                      white
                      className="p-3 rounded-lg bg-red-500 hover:bg-red-600"
                    >
                      Manage Users
                    </Button>
                    <p className="mt-2 text-sm text-gray-500">View and manage warehouse users.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-7xl font-semibold my-10">
                One-stop for all your warehouse management needs
              </h1>
              <p className="text-xl mb-10 text-gray-600">
                Streamline your warehouse operations with ease.
              </p>
              <Button
                onClick={() => handleNavigation("/signin")}
                white
                className="p-3 mb-5 rounded-lg bg-blue-500 hover:bg-blue-600"
              >
                Sign In
              </Button>

              {/* Updated Slider Section */}

              <div className="w-full mt-15 px-6">
                <Slider {...settings}>
                  {data.map((d) => (
                    <div key={d.name} className="bg-white text-black mx-5 rounded-xl p-4 shadow-md">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <img src={d.img} alt={d.name} className="h-20 w-20 rounded-full mb-4" />
                        <p className="text-xl font-semibold">{d.name}</p>
                        <p className="text-center">{d.review}</p>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={background}
          className="w-full h-full object-cover opacity-30"
          alt="background"
        />
      </div>
    </Section>
  );
};

export default Home;
