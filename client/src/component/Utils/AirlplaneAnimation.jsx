import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";

const AirplaneAnimation = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="animate-fly">
        <FontAwesomeIcon icon={faPlane} size="3x" className="text-white" />
      </div>
      <div className="text-white text-xl mt-4">No Flights Available</div>
    </div>
  );
};

export default AirplaneAnimation;
