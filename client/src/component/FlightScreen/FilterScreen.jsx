import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
function FilterScreen() {
  return (
    <>
      <div className="col-span-12 md:col-span-6 flex flex-wrap  space-x-1 md:space-x-3 space-y-1">
        <button className="border py-1 px-4 ml-1 mt-1">Times</button>
        <button className="border py-1 px-4">Stops</button>
        <button className="border py-1 px-4">Airlines</button>
        <button className="border py-1 px-4">Airports</button>
        <button className="border py-1 px-4">Amenities</button>
        <div className="flex items-center text-blue-400">
          <button className="py-1 px-2">Edit Search</button>
          <IoIosArrowDown />
        </div>
      </div>
      <div className="col-span-12 md:col-span-6 flex flex-wrap md:space-x-3 items-center justify-center mt-5 md:mt-0 space-x-1  md:space-y-0 space-y-4">
        <div className="border-r pr-5 ml-4 mt-4 md:m-0">
          <div className="flex">
            <MdOutlineStar />
            <MdOutlineStar />
            <MdOutlineStarBorder />
          </div>
          <div className="flex">
            <MdOutlineStarBorder />
            <MdOutlineStarBorder />
            <MdOutlineStarBorder />
          </div>
        </div>
        <div className="border-r pr-5">
          <div className="flex">
            <MdOutlineStar />
            <MdOutlineStar />
            <MdOutlineStar />
          </div>
          <div className="flex">
            <MdOutlineStarBorder />
            <MdOutlineStarBorder />
            <MdOutlineStarBorder />
          </div>
        </div>
        <div className="border-r pr-5">
          <div className="flex">
            <MdOutlineStar />
            <MdOutlineStar />
            <MdOutlineStar />
          </div>
          <div className="flex">
            <MdOutlineStar />
            <MdOutlineStarBorder />
            <MdOutlineStarBorder />
          </div>
        </div>
        <div className="border-r pr-5">
          <div className="flex">
            <MdOutlineStar />
            <MdOutlineStar />
            <MdOutlineStar />
          </div>
          <div className="flex">
            <MdOutlineStar />
            <MdOutlineStar />
            <MdOutlineStarBorder />
          </div>
        </div>
        <div className="border-r pr-5 md:pr-0 md:border-0">
          <div className="flex">
            <MdOutlineStar />
            <MdOutlineStar />
            <MdOutlineStar />
          </div>
          <div className="flex">
            <MdOutlineStar />
            <MdOutlineStar />
            <MdOutlineStar />
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterScreen;
