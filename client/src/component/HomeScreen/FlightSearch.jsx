import { IoAirplaneSharp } from "react-icons/io5";
import { BiSolidPlaneTakeOff, BiSolidPlaneLand } from "react-icons/bi";
import { MdDateRange } from "react-icons/md";
import { useSnackbar } from "notistack";
import { React, useState, useCallback } from "react";

function FlightSearch({ flights, setFilteredFlights }) {
  const { enqueueSnackbar } = useSnackbar();
  // State to hold user inputs
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [oneWay, setOneWay] = useState(true); // State to toggle between one-way and round-trip

  // Function to handle flight filtering based on user input
  const handleFilter = useCallback(
    (e) => {
      e.preventDefault();

      const isDepartureFilled = !!departure;
      const isArrivalFilled = !!arrival;

      // Ensure both departure and arrival are filled
      if (isDepartureFilled !== isArrivalFilled) {
        enqueueSnackbar("Must fill in both the departure and return fields!", {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        });
        return;
      }

      // Ensure both date fields are filled
      if (!departureDate || !arrivalDate) {
        enqueueSnackbar("Please fill in all date fields", {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        });
        return;
      }
      // Filter flights based on criteria
      const result = flights.filter((flights) => {
        const flightDate = new Date(flights.scheduleDate);
        // For example, if flightDate is "2023-09-20 14:30:00", after this operation it becomes "2023-09-20 00:00:00".
        flightDate.setHours(0, 0, 0, 0);

        let dateMatch;

        if (!oneWay) {
          // For round trips
          const departureDateTime = new Date(departureDate);
          departureDateTime.setHours(0, 0, 0, 0);
          dateMatch = flightDate.getTime() === departureDateTime.getTime();
        } else {
          // For one-way trips
          const arrivalDateTime = new Date(arrivalDate);
          const departureDateTime = new Date(departureDate);
          arrivalDateTime.setHours(0, 0, 0, 0);
          departureDateTime.setHours(0, 0, 0, 0);
          dateMatch =
            flightDate.getTime() <= arrivalDateTime.getTime() &&
            flightDate.getTime() >= departureDateTime.getTime();
        }

        // Get flight destinations for matching
        const flightDestinations = flights.route.destinations.map((dest) =>
          dest.toLowerCase()
        );
        // If destinations are one take route eu
        const flightDestinationsEu = flights.route.eu[0].toLowerCase();

        // Match origin and destination
        const originMatch =
          !departure ||
          (typeof departure === "string" && // Ensure departure is a string
            flightDestinations.includes(departure.toLowerCase())); // Check if the flight's destinations include the departure location (case insensitive)
        const destinationMatch =
          !arrival ||
          (typeof arrival === "string" && // Ensure arrival is a string
          flightDestinations === 2 // If destinations are two check if there is a destination among the targets
            ? flightDestinations.includes(arrival.toLowerCase())
            : flightDestinationsEu === arrival.toLowerCase());

        // Check if the flight's destinations include the arrival location (case insensitive)
        // Return true if all criteria are met
        return dateMatch && originMatch && destinationMatch;
      });
      setFilteredFlights(result); // Update filtered flights state
    },
    [
      flights,
      departure,
      arrival,
      oneWay,
      departureDate,
      arrivalDate,
      enqueueSnackbar,
    ]
  );
  // Validate selected date
  const validateDate = (selectedDate) => {
    const date = new Date(selectedDate);
    date.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today; // Date should not be in the past
  };
  // Handle departure date change
  const handleDepartureChange = (e) => {
    const dateValue = e.target.value;

    // Date should not be in the past
    if (!validateDate(dateValue)) {
      enqueueSnackbar("Departure date cannot be before today.", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "left",
        },
      });
      setDepartureDate("");
      return;
    }
    setDepartureDate(dateValue);
  };

  // Handle arrival date change
  const handleArrivalChange = (e) => {
    const dateValue = e.target.value;
    // Date should not be in the past
    if (!validateDate(dateValue)) {
      enqueueSnackbar("Arrival date cannot be before today.", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "left",
        },
      });
      setArrivalDate("");
      return;
    }
    setArrivalDate(dateValue);
  };
  return (
    <div className="grid grid-rows-6 md:grid-rows-3 md:space-y-3 bg-white p-5 rounded-xl">
      <div className="grid md:grid-cols-4 row-span-2  md:row-span-1">
        <div className="flex items-center space-x-2 col-span-4 md:col-span-2">
          <p>
            <IoAirplaneSharp size={20} />
          </p>
          <p className="font-bold">BOOK YOUR FLIGHT</p>
        </div>
        <div className="col-span-4 md:col-span-2 text-center sm:text-right">
          <button
            onClick={() => setOneWay(!oneWay)}
            className={`p-3 rounded-l-3xl ${
              oneWay == false
                ? "bg-neutral-300 text-purple-800"
                : "text-white bg-purple-800"
            }  text-sm font-bold`}
          >
            Round trip
          </button>
          <button
            onClick={() => setOneWay(!oneWay)}
            className={`p-3 rounded-r-3xl ${
              oneWay == false
                ? "text-white bg-purple-800"
                : "bg-neutral-300 text-purple-800"
            }  text-sm font-bold`}
          >
            OneWay
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 p-2 row-span-2 lg:row-span-1 gap-4">
        <div className="flex flex-col md:flex-row md:space-x-2 col-span-2 lg:col-span-1 space-y-2  md:space-y-0">
          <div className="flex space-x-2 border-2 border-neutral-400 md:rounded-l-xl p-1 items-center w-full">
            <BiSolidPlaneTakeOff size={20} className="text-purple-800" />
            <input
              type="text"
              value={departure}
              className="w-full"
              placeholder="Departure"
              onChange={(e) => setDeparture(e.target.value)}
              required
            />
          </div>
          <div className="flex space-x-2 border-2 border-neutral-400 md:rounded-r-xl p-1 items-center w-full">
            <BiSolidPlaneLand size={20} className="text-purple-800" />
            <input
              type="text"
              value={arrival}
              className="w-full"
              placeholder="Arrival"
              onChange={(e) => setArrival(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-2 col-span-2 lg:col-span-1 space-y-2 md:space-y-0">
          <div className="flex space-x-2 border-2 border-neutral-400 md:rounded-l-xl p-1 items-center w-full">
            <MdDateRange size={20} className="text-purple-800" />
            <input
              type="date"
              value={departureDate}
              className="w-full"
              placeholder="Departure Date"
              onChange={handleDepartureChange}
              required
            />
          </div>
          {oneWay && (
            <div className="flex space-x-2 border-2 border-neutral-400 md:rounded-r-xl p-1 items-center w-full">
              <MdDateRange size={20} className="text-purple-800" />
              <input
                type="date"
                value={arrivalDate}
                className="w-full"
                placeholder="Arrival Date"
                onChange={handleArrivalChange}
                required
              />
            </div>
          )}
        </div>
      </div>
      <div className="text-sm text-white font-bold md:row-span-1 row-span-2 items-center flex justify-center md:justify-start">
        <button
          onClick={handleFilter}
          className="bg-purple-800 py-4 w-32 rounded-lg"
        >
          Show flights
        </button>
      </div>
    </div>
  );
}

export default FlightSearch;
