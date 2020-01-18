import React, { useState, useEffect } from "react";
import "./Loader.scss";

const Loader = props => {
  let [cls, setCls] = useState("Polygon-1");
  let [container, setContainer] = useState(["loader-container"]);
  let [degree, setDegree] = useState(20);
  let [rotDeg, setRotDeg] = useState(1);

  const handleLoad = () => {
    let period = 170;
    let polCount = 0;
    for (let i = 1; i <= 28; i++) {
      const timer = () =>
        setTimeout(() => {
          let cl = "Polygon-" + i;
          setCls(cl);
          // console.log(cl);
        }, i * period);
      timer();
      polCount++;
      setContainer(["loader-container end"]);
    }
    let maxDegree = 95;
    let diff = maxDegree - degree;
    for (let j = 0; j <= diff; j++) {
      setTimeout(() => {
        setDegree(degree++);
        setRotDeg(rotDeg * (j + 1) * degree);
      }, j * ((polCount * period) / diff));
    }
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <div
      className={container}
      style={{
        background: `radial-gradient(50% 50% at 50% 50%, #469bff ${degree}%, rgba(255, 255, 255, 0) 100%)`,
        transform: `translate(-50%, -50%) rotate(${rotDeg / 10}deg)`
      }}
    >
      <div className={cls}></div>
    </div>
  );
};
export default Loader;
