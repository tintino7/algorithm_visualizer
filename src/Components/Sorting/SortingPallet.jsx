import { useState, useEffect } from "react";
import selectionSortAlgorithm from "../../Algorithms/Sorting/selectionSort";


import Pillar from "./Pillar";
import { Link } from "react-router-dom";

function SortingPallet() {
  const maxSize = Math.floor(
    window.innerWidth > 700 ? window.innerWidth / 40 : window.innerWidth / 30
  );
  const minSize = maxSize * 0.25;
  const screenHeight =
    window.innerWidth > 700
      ? window.innerHeight * 0.7
      : window.innerHeight * 0.6;

  const [arraySize, setArraySize] = useState(maxSize / 2);
  const [randomize, setRandomize] = useState(true);
  const [algorithm, setAlgorithm] = useState("");
  const [animating, setAnimating] = useState(false);
  const [speed, setSpeed] = useState(250);

  // To start the animating algorithm
  function animateSortingAlgorithm() {
    setAnimating(true);
  }

  function handleArraySizeChange(e) {
    setArraySize((prevarraySize) => e.target.value);
  }

  function handleSpeedChange(e) {
    setSpeed((prevSpeed) => e.target.value);
  }

  // Array of pillars
  const [pillars, setPillars] = useState(() => {
    return Array.from({ length: arraySize }, (_, index) => {
      const height = Math.floor(Math.random() * (screenHeight - 50 + 1) + 50);
      return { id: index, height: height, className: "pillar" };
    });
  });

  // Whenever arraySize or randomize changes Recalculate Pillars
  useEffect(() => {
    if (arraySize && !animating) {
      const newPillars = Array.from({ length: arraySize }, (_, index) => {
        const height = Math.floor(Math.random() * (screenHeight - 50 + 1) + 50);
        return { id: index, height: height, className: "pillar" };
      });
      setPillars(newPillars);
    }
  }, [arraySize, randomize]); // Update pillars whenever arraySize or randomize changes

  // Use effect to animate the algorithm
  useEffect(() => {
    let index = 0;
    if (animating) {
      const results = selectionSortAlgorithm(pillars);
      const interval = setInterval(() => {
        if (index >= results.length) {
          clearInterval(interval); // Stop when all results are processed
          setAnimating(false); // Optionally, stop the animation
        } else {
          setPillars(results[index]);
          index++;
        }
      }, 500 - speed + 100); // Maxvalue - SlideValue + MinValue
    }
  }, [animating]);

  return (
    <div>
      <div className="sortDiv">
        <button className="sortButton" onClick={() => setRandomize(!randomize)}>
          Randomize
        </button>

        <select
          className="sortButton"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          
          <option value="selectionsort">Selection Sort</option>
          
        </select>

        <div className="arrayControl">
          <p className="arrayControlText">Array Size</p>
          <input
            type="range"
            disabled={animating}
            name="arraySize"
            min={minSize}
            max={maxSize}
            value={arraySize}
            onChange={(e) => handleArraySizeChange(e)}
          />
        </div>

        <div className="arrayControl">
          <p className="arrayControlText">Speed</p>
          <input
            className="speedSlider"
            type="range"
            name="speed"
            disabled={animating}
            min={100} // 500 - 100
            max={500}
            value={speed}
            onChange={(e) => handleSpeedChange(e)}
          />
        </div>

        <button
          disabled={animating}
          className="sortButton"
          onClick={animateSortingAlgorithm}
        >
          Sort
        </button>
        <Link to={'/'}>
        <button className="sortButton">
          Home
        </button>
        </Link>
      </div>

      <div className="sortingpallet">
        {pillars.map(({ id, height, className }) => (
          <Pillar id={id} className={className} key={id} height={height} />
        ))}
      </div>
    </div>
  );
}
export default SortingPallet;
