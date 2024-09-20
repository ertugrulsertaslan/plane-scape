import FlightScreenCard from "./FlightScreenCard";
import FilterScreen from "./FilterScreen";
import { CiCircleInfo } from "react-icons/ci";
import { useEffect, useState } from "react";

import axios from "axios";

const baseUrl = "http://localhost:3000"; // Base URL for API requests

function FlightsScreen() {
  //console.log("Location state:", location.state);
  const [flightsData, setFlightsData] = useState([]);
  const [sortOption, setSortOption] = useState("recommended");

  // Make an API request to fetch user reservations
  const fetchUserReservation = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/user/reservation`, {
        withCredentials: true, // Include credentials (like cookies) with the request
      });
      if (response.status === 200) {
        // Update the state with the retrieved flight data
        setFlightsData(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserReservation();
  }, []);

  // Sort flights based on selected option
  const sortFlights = (data, option) => {
    switch (option) {
      case "currentToFuture":
        return data.sort(
          (a, b) =>
            new Date(a.flightData.departure) - new Date(b.flightData.departure)
        );
      case "futureToCurrent":
        return data.sort(
          (a, b) =>
            new Date(b.flightData.departure) - new Date(a.flightData.departure)
        );
      default:
        return data; // Default to original data if no sort option is selected
    }
  };

  // Sort flights whenever sortOption changes
  useEffect(() => {
    setFlightsData((prevData) => sortFlights([...prevData], sortOption));
  }, [sortOption]);

  return (
    <>
      <div className="grid grid-cols-12 max-h-screen mt-5 bg-white p-4 font-semibold rounded-xl">
        <FilterScreen />
      </div>
      {/* Sorting display */}
      <div className="space-y-8 w-full mt-5 p-4">
        <div className="grid grid-cols-2 space-y-2 md:space-y-0">
          <div className="flex space-x-1 items-center col-span-2 md:col-span-1 justify-center md:justify-start">
            <p>Sort by:</p>
            <select
              className="px-2 py-1 ml-1"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="recommended" disabled>
                Recommended
              </option>
              <option value="currentToFuture">From Present to Future</option>
              <option value="futureToCurrent">From Future to Present</option>
            </select>
          </div>
          <div className="flex space-x-2 items-center col-span-2 md:col-span-1 justify-center md:justify-end">
            <CiCircleInfo size={25} />
            <p>
              Avg Fare : <strong>$225</strong>
            </p>
          </div>
        </div>
        {/* Display flight cards */}
        <div className="overflow-y-auto h-screen max-h-[615px] space-y-4">
          <FlightScreenCard flightsData={flightsData} />
        </div>
      </div>
    </>
  );
}

export default FlightsScreen;
