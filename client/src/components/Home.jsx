import Button from "./Button";
import Section from "./Section";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import background from "../images/6195005.jpg";

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

  return (
    <Section className="pt-[10rem] -mt-[4] flex items-center justify-center relative" id="home">
      <div className="container relative text-center z-10">
        <div className="relative z-1 max-w-[60rem] mx-auto mb-[3rem] md:mb-15 lg:mb-[5rem]">
          {user ? (
            <>
              <h1 className="text-5xl font-semibold mb-8">Welcome back, {user.username}!</h1>
              <p className="text-xl mb-12">What would you like to manage today?</p>

              {/* Responsive grid for buttons */}
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center`}
              >
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
              <h1 className="text-7xl font-semibold mb-10">
                One-stop for all your warehouse management needs
              </h1>
              <p className="text-xl mb-10 text-gray-600">
                Streamline your warehouse operations with ease.
              </p>
              <Button
                onClick={() => handleNavigation("/signin")}
                white
                className="p-3 rounded-lg bg-blue-500 hover:bg-blue-600"
              >
                Sign In
              </Button>
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
