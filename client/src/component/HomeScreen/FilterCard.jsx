import React, { useState, useEffect } from "react";
function FilterCard({ setFilteredFlights, flights }) {
  const [allFlights, setAllFlights] = useState(flights); /*
  Since you changed the current one when you applied your filter,
   keep the flights so that you can show all the flights again 
   when you remove the filter.
  */
  const [visibleFlights, setVisibleFlights] = useState(flights); // Flights currently displayed
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedArrivalTime, setSelectedArrivalTime] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false); // Track if component is initialized
  // Initial stops options
  const [stops, setStops] = useState([
    { value: "1", label: "Nonstop", price: "$200" },
    { value: "2", label: "1 Stop", price: "$300" },
    { value: "3", label: "2 + Stop", price: "$400" },
  ]);

  // Initial arrival times options
  const [arrivalTimes, setArrivalTimes] = useState([
    { value: "morning", label: " 5:00 AM - 11.59AM" },
    { value: "afternoon", label: "12:00 PM - 5.59 PM" },
    { value: "night", label: "6:00 PM - 4:59 AM" },
  ]);

  useEffect(() => {
    /*
    Since I couldn't get all the flights in the first render and
    I could get the filtered version of the flights in the first filtering,
    I did something like this as a solution.
    */
    if (!isInitialized && flights.length > 0) {
      setAllFlights(flights);
      setIsInitialized(true);
    }
    setVisibleFlights(flights); //Airports are shown and filtered in the visible flight object
  }, [flights, isInitialized]);

  // Effect to filter flights based on selected criteria
  useEffect(() => {
    const filteredFlights = flights.filter((flight) => {
      const matchesDestination =
        !selectedDestination ||
        flight.route?.destinations?.includes(selectedDestination);
      const matchedArrivalTime =
        !selectedArrivalTime || checkArrivalTime(flight, selectedArrivalTime);

      const matchesStops =
        !selectedStop ||
        checkStops(flight?.route?.destinations?.length, selectedStop);

      // Return filtered flights
      return matchesDestination && matchedArrivalTime && matchesStops;
    });

    setVisibleFlights(filteredFlights);
    /*
    I take the filtered flight objects as props from the parent components and
    update the flight cards where the flights are listed.
    */
    setFilteredFlights(filteredFlights);
  }, [selectedDestination, selectedArrivalTime, selectedStop]);

  // Clear selected stops
  const handleClearStops = () => {
    const initialStops = [
      { value: "1", label: "Nonstop", price: "$200" },
      { value: "2", label: "1 Stop", price: "$300" },
      { value: "3", label: "2 + Stop", price: "$400" },
    ];
    setStops(initialStops); // Reset stops to initial state
    setSelectedStop(null); // Clear selected stop
    setVisibleFlights(allFlights); // Show all flights
    setFilteredFlights(allFlights); // Reset filtered flights
  };

  // Clear selected arrival time
  const handleClearArrivalTime = () => {
    const initialArrivalTimes = [
      { value: "morning", label: "5:00 AM - 11:59 AM" },
      { value: "afternoon", label: "12:00 PM - 5:59 PM" },
      { value: "night", label: "6:00 PM - 4:59 AM" },
    ];
    setArrivalTimes(initialArrivalTimes); // Reset  arrival times to initial state
    setSelectedArrivalTime(null); // Clear selected arrival time
    setVisibleFlights(allFlights);
    setFilteredFlights(allFlights);
  };

  const handleClearSelection = () => {
    setSelectedDestination(null); // Clear selected destination
    setVisibleFlights(allFlights);
    setFilteredFlights(allFlights);
  };

  // Check if the flight matches the selected stops
  const checkStops = (fligtStop, stop) => {
    switch (stop) {
      case "1":
        return fligtStop === 1; // Nonstop
      case "2":
        return fligtStop === 2; // 1 Stop
      case "3":
        return fligtStop > 2; //2 or more Stops
      default:
        return true;
    }
  };
  // Check if flight matches the selected arrival time
  const checkArrivalTime = (flight, time) => {
    const arrivalTime = new Date(flight.estimatedLandingTime);
    if (isNaN(arrivalTime)) {
      //console.error("Invalid Date:", flight.estimatedLandingTime);
      return false;
    }
    const hours = arrivalTime.getHours(); // Get hours of arrival time

    switch (time) {
      case "morning":
        return hours >= 5 && hours < 12; // Morning filter
      case "afternoon":
        return hours >= 12 && hours < 18; // Afternoon filter
      case "night":
        return hours >= 18 || hours < 5; // Night filter
      default:
        return true;
    }
  };

  // Handle stop selection change
  const handleStopChange = (event) => {
    const value = event.target.value;
    setSelectedStop(value);
    setStops((prev) => prev.filter((stop) => stop.value === value)); // Filter stops based on selection
  };

  // Handle arrival time selection change
  const handleArrivalTimeChange = (event) => {
    const value = event.target.value;
    setSelectedArrivalTime(value);
    setArrivalTimes((prev) => prev.filter((time) => time.value === value)); // Filter arrival time based on selection
  };

  // Get unique destinations from visible flights
  const uniqueDestinations = [
    ...new Set(
      visibleFlights
        .map((flight) => flight.route?.destinations?.[0])
        .filter(Boolean)
    ),
  ];
  return (
    <>
      {/* Sorting options */}
      <div className="font-bold">
        <p>Sort By</p>
        <select className="w-10/12 ml-4 mt-2 font-normal" id="mySelect">
          <option value="low">Lowest Price</option>
          <option value="high">Highest Price</option>
        </select>
      </div>
      {/* Arrival Time Filter */}
      <div className="space-y-2">
        <p className="font-bold">Arrival Time</p>
        {selectedArrivalTime && (
          <p
            onClick={handleClearArrivalTime}
            className="text-center cursor-pointer mt-4 bg-red-500 text-white rounded"
          >
            Clear Selection
          </p>
        )}
        <div className="flex flex-col">
          {arrivalTimes.map((arrival, index) => (
            <div key={index} className="mb-1">
              <input
                type="radio"
                id="am"
                name="arrival-time"
                value={arrival.value}
                checked={selectedArrivalTime === arrival.value}
                onChange={handleArrivalTimeChange}
              />
              <label className="ml-2" htmlFor="am">
                {arrival.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      {/* Stops Filter */}
      <div className="space-y-2">
        <p className="font-bold">Stops</p>
        {selectedStop && (
          <p
            onClick={handleClearStops}
            className="text-center cursor-pointer mt-4 bg-red-500 text-white rounded"
          >
            Clear Selection
          </p>
        )}
        <div className="flex flex-col">
          {stops.map((stop, index) => (
            <div key={index} className="flex justify-between mb-1">
              <div>
                <input
                  type="radio"
                  id="pm"
                  name="fly-time"
                  value={stop.value}
                  checked={selectedStop === stop.value}
                  onChange={handleStopChange}
                />
                <label className="ml-2" htmlFor="pm">
                  {stop.label}
                </label>
              </div>
              <p>{stop.price}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Airlines Filter */}
      <div className="space-y-2">
        <p className="font-bold">Airlines Included</p>
        {selectedDestination && visibleFlights.length > 0 && (
          <p
            onClick={handleClearSelection}
            className="text-center cursor-pointer mt-4 bg-red-500 text-white rounded"
          >
            Clear Selection
          </p>
        )}
        <div className="flex flex-col">
          {visibleFlights &&
            uniqueDestinations.map((destination, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <input
                    type="radio"
                    id={destination}
                    name="destination"
                    value={destination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    checked={selectedDestination === destination}
                  />
                  <label className="ml-2" htmlFor={destination}>
                    {destination || "Undefined"}
                  </label>
                </div>
                <p>230$</p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default FilterCard;
