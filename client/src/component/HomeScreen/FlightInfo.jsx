import FilterCard from "./FilterCard";
import FlightCard from "./FlightCard";

function FlightInfo({ filteredFlights, setFilteredFlights }) {
  return (
    <>
      <div className="grid grid-cols-12 mt-5">
        <div className="col-span-12 md:col-span-9 overflow-y-auto h-[540px] scrollbar-hide space-y-4">
          <FlightCard flights={filteredFlights} />
        </div>
        <div className="col-span-12 md:col-span-3 h-[530px] overflow-hidden text-left relative">
          <div className="overflow-y-auto scrollbar-hide h-[520px] space-y-6 p-5 mt-10 md:m-0">
            <FilterCard
              flights={filteredFlights}
              setFilteredFlights={setFilteredFlights}
            />
          </div>
          <div className="absolute w-full bottom-0 bg-gradient-to-t from-customBgColor  via-white to-transparent   opacity-80 z-0 h-14"></div>
        </div>
      </div>
    </>
  );
}

export default FlightInfo;
