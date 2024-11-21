import { FaPlane } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { IoTicket, IoReorderThreeOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:5000"; // Base URL for API requests

function Header() {
  const navigate = useNavigate();
  const [firstname, setFirstName] = useState();
  const [userPhoto, setUserPhoto] = useState();
  const [userId, setUserId] = useState();
  const [showMobilMenu, SetShowMobilMenu] = useState(false);

  // Function to refresh the authentication token
  const fetchToken = async () => {
    try {
      // Sending a POST request to refresh the token
      await axios.post(`${baseUrl}/refresh-token`, null, {
        withCredentials: true, // Send cookies with the request
      });
    } catch (error) {
      console.error(
        "Error fetching tasks:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Effect to set up a token refresh interval
  useEffect(() => {
    const intervalId = setInterval(fetchToken, 1 * 60 * 1000); // Refresh token every minute
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  // Effect to fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/`, {
          withCredentials: true, // Send cookies with the request
        });
        setUserPhoto(response.data.photoUrl);
        setFirstName(response.data.firstName);
        setUserId(response.data.userId);
      } catch (error) {
        navigate("/login");
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <div className="w-full flex justify-between">
        <div className="flex gap-2">
          <div
            onClick={() => navigate("/")}
            className="items-center flex space-x-2 cursor-pointer"
          >
            <FaPlane className="border text-3xl p-1 bg-purple-800 text-white rounded-full" />
            <p className="font-bold">PLANE SCAPE</p>
          </div>
          <p></p>
        </div>
        {/* Navigation links, hidden on small screens */}
        <div className="sm:flex gap-8 hidden">
          <div className="flex items-center space-x-2">
            <IoTicket className="text-purple-800" />
            <p>Details</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaEarthAmericas className="text-purple-800" />
            <p>Discover</p>
          </div>
          <div
            onClick={() => navigate("/flights", { state: { userId } })}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div>
              <img
                src={userPhoto}
                alt=""
                className="w-10 h-10 object-cover rounded-full"
              />
            </div>
            <p>{firstname}</p>
          </div>
        </div>
        {/* Icon for mobile menu, shown only on small screens */}
        <div className="flex sm:hidden cursor-pointer">
          <IoReorderThreeOutline
            onClick={() => SetShowMobilMenu(!showMobilMenu)}
            size={40}
          />
        </div>
      </div>
      {showMobilMenu && (
        <div className="absolute w-10/12 h-1/2 bg-purple-500 top-20 rounded-lg shadow-lg p-4">
          <div className="text-right">
            <button
              className="text-white font-bold"
              onClick={() => SetShowMobilMenu(false)}
            >
              <IoMdClose size={25} />
            </button>
          </div>
          <div className="flex flex-col items-center gap-4 mt-4">
            <div className="flex items-center space-x-2 w-full border-t border-white justify-center py-5">
              <IoTicket className="text-white text-2xl" />
              <p className="text-white text-lg font-semibold">Details</p>
            </div>
            <div className="flex items-center space-x-2 w-full border-t border-white justify-center py-5">
              <FaEarthAmericas className="text-white text-2xl" />
              <p className="text-white text-lg font-semibold">Discover</p>
            </div>
            <div
              onClick={() => navigate("/flights", { state: { userId } })}
              className="flex items-center space-x-2 cursor-pointer w-full justify-center py-5 border-t border-white"
            >
              <img
                src={userPhoto}
                alt="User"
                className="md:w-10 md:h-10 w-16 h-16 mr-5 md:m-0 rounded-full"
              />
              <p className="text-white text-lg font-semibold">{firstname}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
