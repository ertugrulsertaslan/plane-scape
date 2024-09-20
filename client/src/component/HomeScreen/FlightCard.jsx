import { useEffect, useState } from "react";
import { LuPlaneTakeoff, LuPlaneLanding } from "react-icons/lu";
import { IoAirplaneSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AirplaneAnimation from "../Utils/AirlplaneAnimation";
import { useSnackbar } from "notistack";
import axios from "axios";

const baseUrl = "http://localhost:3000"; // Base URL for API requests

function FlightCard({ flights = [] }) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Effect to check if flights are loaded
  useEffect(() => {
    if (Array.isArray(flights) && flights.length > 0) {
      setLoading(false); // Set loading to false if flights are available
    }
  }, [flights]);

  // Function to handle flight booking
  const handleClick = async (flightId) => {
    // Filter selected flight in flights
    const selectedFlight = flights.find((flights) => flights.id === flightId);

    if (!selectedFlight) {
      console.error("Flight not found");
      return;
    }
    try {
      // Create reservation object to send to the backend
      const response = await axios.post(
        `${baseUrl}/api/reservation`,
        {
          numberOfPassengers: 1,
          status: "ticket",
          flightDetails: {
            flightName: selectedFlight.flightName,
            departure: selectedFlight.scheduleDateTime,
            arrival: selectedFlight.estimatedLandingTime,
            airline: selectedFlight.prefixIATA,
            duration: calculateDuration(
              selectedFlight.scheduleDateTime,
              selectedFlight.estimatedLandingTime
            ),
            price: 200,
          },
        },
        { withCredentials: true }
      );
      // If reservation success, display an success notification
      if (response.status === 200) {
        enqueueSnackbar(
          "Your reservation has been successfully made! Thank you for choosing us.",
          {
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "left",
            },
          }
        );
        navigate("/flights"); // Navigate to flights page on success
        return;
      }
      // If reservation fails, display an error notification
    } catch (error) {
      enqueueSnackbar(
        "We're sorry, but there was an error processing your reservation. Please try again later or contact support.",
        {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        }
      );
      navigate("/");
      console.error("Error fetching user data:", error);
    }
  };

  // Function to calculate flight duration
  const calculateDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);

    if (isNaN(startTime) || isNaN(endTime)) {
      return "Invalid date";
    }
    // Handle case where start time is not before end time
    if (startTime >= endTime) {
      return "Invalid flight times";
    }

    // Calculate duration in milliseconds
    const durationInMilliseconds = endTime - startTime;
    const durationInMinutes = Math.floor(durationInMilliseconds / 60000);
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    // Don't show on screen if hours is equal to 0
    if (hours === 0) {
      return `${String(minutes).padStart(2, "0")} m`;
    }

    return `${String(hours).padStart(2, "0")} h ${String(minutes).padStart(
      2,
      "0"
    )} m`;
  };

  return (
    <>
      {loading ? (
        <div className="relative h-full w-full bg-customBodyColor flex justify-center items-center rounded-xl">
          <p>Loading Flights...</p> {/* Display loading message */}
        </div>
      ) : flights.length === 0 ? (
        <div className="relative h-full w-full bg-customBodyColor flex justify-center items-center rounded-xl">
          <AirplaneAnimation /> {/* Display animation if no flights found */}
        </div>
      ) : (
        flights.map((flight) => {
          {
            /* Calculate the fligt duration */
          }
          const flightDuration = calculateDuration(
            flight.scheduleDateTime,
            flight.estimatedLandingTime
          );

          return (
            <div key={flight.id}>
              <div className="bg-white rounded-tl-lg rounded-tr-lg rounded-br-lg p-5 relative">
                <div className="space-y-3">
                  <div className="text-left font-bold">
                    <p>
                      {/* If the destination exists, it shows it
                       otherwise, it shows the first element of the eu array.  */}
                      {flight.route.destinations[0]} -
                      {flight.route.destinations[1]
                        ? flight.route.destinations[1]
                        : flight.route.eu[0]}
                    </p>
                  </div>
                  <div className="md:flex justify-center md:justify-between items-center grid grid-rows-3 md:grid-rows-1 text-center md:text-left">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 justify-center">
                        <LuPlaneTakeoff />
                        <p>Departure</p>
                      </div>
                      <p className="font-bold">
                        {new Date(flight.scheduleDateTime).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" } // Display hour and minute as two digits
                        )}
                      </p>
                      <p>Airport: {flight.route.destinations[0]}</p>
                    </div>
                    <div className="border-t-2 w-20 border-black my-5 mx-10 md:0"></div>
                    <div className="flex flex-col items-center space-y-1">
                      <p>{flight.prefixIATA} Airlines</p>
                      <IoAirplaneSharp size={20} />
                      <p>{flightDuration}</p>
                    </div>
                    <div className="border-t-2 w-20 border-black my-5 mx-10 m-0"></div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 justify-center md:justify-start">
                        <LuPlaneLanding />
                        <p>Arrival</p>
                      </div>
                      <p className="font-bold">
                        {new Date(
                          flight.estimatedLandingTime
                        ).toLocaleTimeString([], {
                          hour: "2-digit", // Display hour and minute as two digits
                          minute: "2-digit",
                        })}
                      </p>
                      <p>
                        Airport:
                        {flight.route.destinations[1]
                          ? flight.route.destinations[1]
                          : flight.route.eu[0]}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-left">
                      <div className="flex font-bold space-x-1">
                        <p>Price:</p>
                        <p>${200}</p>
                      </div>
                      <p>Round trip</p>
                    </div>
                    <button
                      onClick={() => handleClick(flight.id)}
                      className="bg-purple-800 py-2 px-6 md:py-5 md:px-12 text-white absolute right-0 bottom-0 rounded-tl-lg rounded-br-lg"
                    >
                      Book flight
                    </button>
                  </div>
                </div>
              </div>
              <button className="flex justify-start text-left mb-4 bg-purple-200 p-3 rounded-b-xl text-sm text-purple-500 font-bold">
                Check the details
              </button>
            </div>
          );
        })
      )}
    </>
  );
}

export default FlightCard;
