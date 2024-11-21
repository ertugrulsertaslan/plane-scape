import FlightInfo from "./FlightInfo";
import FlightSearch from "./FlightSearch";
import SideBar from "./SideBar";
import React, { useState, useEffect } from "react";
import axios from "axios";
// Memoizing the SideBar component to optimize performance
const MemoizedSideBar = React.memo(SideBar);

const baseUrl = "http://localhost:5000"; // Base URL for API requests

function Home() {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);

  // Function to fetch flights from the API
  const fetchFlights = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/flights`, {
        withCredentials: true, // Include credentials in the request
      });
      // Set both the original and filtered flights
      setFlights(response.data.flights);
      setFilteredFlights(response.data.flights);
    } catch (error) {
      console.error("An error occurred while fetching", error);
    }
  };
  // useEffect to fetch flights when the component mounts
  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <>
      <div className="w-full grid grid-cols-12 pt-5 px-5 h-full">
        <div className="col-span-12 xl:col-span-9">
          <FlightSearch
            flights={flights}
            setFilteredFlights={setFilteredFlights}
          />
          <FlightInfo
            filteredFlights={filteredFlights}
            setFilteredFlights={setFilteredFlights}
          />
        </div>
        <MemoizedSideBar />
      </div>
    </>
  );
}

export default Home;
