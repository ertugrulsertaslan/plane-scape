import { FaPlane } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useState } from "react";
import AirplaneAnimation from "../Utils/AirlplaneAnimation";

function FlightScreenCard({ flightsData }) {
  const [data, setData] = useState(flightsData);

  // Update state when flightsData changes
  useEffect(() => {
    setData(flightsData);
  }, [flightsData]);

  return (
    <>
      {!data || !Array.isArray(data) || data.length === 0 ? (
        <div className="relative h-full w-full bg-customBodyColor flex justify-center items-center rounded-xl">
          <AirplaneAnimation /> {/* Display animation if no flights found */}
        </div>
      ) : (
        data.map((flight) => {
          // Get departure and arrival dates
          const departureDate = new Date(flight.flightData.departure);
          const arrivalDate = new Date(flight.flightData.arrival);

          // Determine AM/PM format
          const departurePeriod = departureDate.getHours() >= 12 ? "PM" : "AM";
          const arrivalPeriod = arrivalDate.getHours() >= 12 ? "PM" : "AM";

          // Format the times
          const departureTime = departureDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const arrivalTime = arrivalDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          return (
            <div
              key={flight.id}
              className="grid grid-cols-2 bg-white p-10 rounded-xl"
            >
              <div className="flex col-span-2 lg:col-span-1 mb-10 m-0">
                <FaPlane className="border text-3xl p-1 bg-purple-800 text-white rounded-full mr-5 mt-1" />
                <div className="w-full grid grid-rows-2 text-left">
                  <div className="text-2xl flex flex-wrap md:flex-nowrap md:flex-row items-center justify-center md:justify-start md:items-start mb-5 m-0">
                    <p>{departureTime}</p>
                    <span className="ml-1 mr-1">{departurePeriod} </span>
                    <span className="w-full md:w-8 flex justify-center">-</span>
                    <p>{arrivalTime}</p>
                    <span className="ml-1">{arrivalPeriod}</span>
                  </div>
                  <div className="grid grid-cols-3 w-full space-y-2 md:space-y-0">
                    <div className="col-span-3 md:col-span-1 flex flex-col items-center justify-center">
                      <strong>{flight.flightData.airline} Air Lines</strong>
                      <div className="flex items-center space-x-1 text-blue-400">
                        <p>Flight Details</p>
                        <IoIosArrowDown />
                      </div>
                    </div>
                    <div className="col-span-3 md:col-span-1 flex flex-col items-center justify-center">
                      <strong>NonStop</strong>
                      <p>{flight.flightData.duration}</p>
                    </div>
                    <div className="col-span-3 md:col-span-1 flex flex-col items-center justify-center">
                      <strong>{`${flight.flightData.airline} to ${flight.flightData.airline}`}</strong>
                      <p>{flight.flightData.flightName}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1 overflow-x-auto w-full">
                <div className="flex space-x-4">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="flex w-40 md:w-24 items-center justify-center"
                    >
                      <div className="border border-neutral space-y-2 p-4">
                        <strong>${flight.flightData.price}</strong>
                        <p className="text-neutral-400">Main</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}
    </>
  );
}

export default FlightScreenCard;
