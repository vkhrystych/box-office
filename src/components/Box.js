import { useState } from "react";

import boxImg from "./box.svg";

const Box = ({ createBox }) => {
  const [wobble, setWobble] = useState(0);

  const onBoxClick = () => {
    setWobble(1);
    createBox();
  };

  const clearWobble = () => {
    setWobble(0);
  };

  return (
    <img
      src={boxImg}
      alt="box"
      className="box"
      onClick={onBoxClick}
      wobble={wobble}
      onAnimationEnd={clearWobble}
    />
  );
};

export default Box;
