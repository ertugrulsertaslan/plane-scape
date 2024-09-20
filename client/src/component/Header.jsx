import { FaPlane } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { IoTicket, IoReorderThreeOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:3000"; // Base URL for API requests

function Header() {
  const navigate = useNavigate();
  const [firstname, setFirstName] = useState();
  const [userId, setUserId] = useState();

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
            <IoTicket className="text-purple-800" />
            <p>{firstname}</p>
          </div>
        </div>
        {/* Icon for mobile menu, shown only on small screens */}
        <div className="flex sm:hidden cursor-pointer">
          <IoReorderThreeOutline size={40} />
        </div>
      </div>
    </>
  );
}

export default Header;
