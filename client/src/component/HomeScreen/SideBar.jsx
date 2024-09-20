import { MdOutlineDirectionsCarFilled, MdDateRange } from "react-icons/md";
import { FaHotel, FaUmbrellaBeach } from "react-icons/fa6";
function SideBar() {
  return (
    <div className="col-span-12 sm:grid-rows-1 xl:col-span-3 xl:grid-rows-3 px-5 flex flex-col sm:flex-row xl:flex-col">
      <div className="w-full h-full flex justify-center items-center p-2 relative">
        <img
          src="/src/assets/carHoliday.jpg"
          className="object-cover w-full h-full rounded-xl"
          alt=""
        />
        <div className="absolute left-5 bottom-5 space-y-2 text-white  text-3xl sm:text-2xl md:text-3xl">
          <MdOutlineDirectionsCarFilled />
          <p className="text-2xl sm:text-sm md:text-xl font-bold">
            CAR RENTALS
          </p>
        </div>
      </div>
      <div className="w-full h-full flex justify-center items-center p-2 relative">
        <img
          src="/src/assets/hotel.jpg"
          className="object-cover w-full h-full rounded-xl"
          alt=""
        />
        <div className="absolute left-5 bottom-5 space-y-2 text-white  text-3xlsm:text-2xl md:text-3xl">
          <FaHotel />
          <p className="text-2xl sm:text-sm md:text-xl font-bold">HOTELS</p>
        </div>
      </div>
      <div className="w-full h-full flex justify-center items-center p-2 relative">
        <img
          src="/src/assets/travelpackage.jpg"
          className="object-cover w-full h-full rounded-xl"
          alt=""
        />
        <div className="absolute left-5 bottom-5 space-y-2 text-white  text-3xl sm:text-2xl md:text-3xl">
          <FaUmbrellaBeach />
          <p className="text-2xl sm:text-sm md:text-xl font-bold">
            TRAVEL PACKAGES
          </p>
        </div>
      </div>
    </div>
  );
}
export default SideBar;
