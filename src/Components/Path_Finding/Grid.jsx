import { useState, useEffect, useMemo, useRef } from "react";
import Node from "./Node.jsx";
import dijkstras from "../../Algorithms/Path_Finding/dijkstra's.js";
import A_Star from "../../Algorithms/Path_Finding/aStar.js";
import { Link } from "react-router-dom";

function Grid() {
  /* State to control width and height of grid width and height*/
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [makeWall, setMakeWall] = useState(false);
  const [algorithm, setAlgorithm] = useState("");
  const [startorFinish, setStartorFinish] = useState({
    active: false,
    type: "",
    startNode: "",
    finishNode: "",
  });
  const [clear, setClear] = useState(true);
  /* Holds reference to the all cell Components */
  const cellElementsRef = useRef(new Map());
  const isAnimating = useRef(false);

  /* I will update width and height states making a re rendering, So the grid produce cells according to the height and width */
  function handleResize() {
    if (isAnimating.current) return;
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  /* I will update make wall state to create walls */
  function handleWall(e) {
    if (isAnimating.current) return;
    setMakeWall(true);
  }

  /*  I will work when mouseup event happens and set the below states false , 
    So it won't make unnecssary walls or make start or finish node move */
  function handleMouseUp() {
    if (isAnimating.current) return;
    setMakeWall(false);
    setStartorFinish({ ...startorFinish, active: false, type: "" });
  }

  /* I will update the startorFinish state to move start of finish Cell */
  function handleStartorFinish(e, cellType) {
    if (isAnimating.current) return;
    setStartorFinish({ ...startorFinish, active: true, type: cellType });
  }

  const screenHeight = useMemo(() => Math.trunc((height * 0.7) / 25), [height]);
  const screenWidth = useMemo(() => Math.trunc((width * 0.85) / 25), [width]);

  const xAxisStart = useMemo(
    () => Math.floor(Math.random() * screenWidth),
    [screenWidth]
  );
  const yAxisStart = useMemo(
    () => Math.floor(Math.random() * screenHeight),
    [screenHeight]
  );

  const xAxisFinish = useMemo(
    () => Math.floor(Math.random() * screenWidth),
    [screenWidth]
  );
  const yAxisFinish = useMemo(
    () => Math.floor(Math.random() * screenHeight),
    [screenHeight]
  );

  /* An array of Cell components represents each row in grid */
  const gridColumns = Array.from({ length: screenHeight }, (_, rowIndex) =>
    Array.from({ length: screenWidth }, (_, columnIndex) => (
      <Node
        ref={(el) =>
          cellElementsRef.current.set(`${rowIndex}-${columnIndex}`, {
            element: el,
            distance: Infinity,
            prevNode: null,
            row: rowIndex,
            column: columnIndex,
          })
        }
        createWall={handleWall} // Functions to update state variables
        moveStartFinish={handleStartorFinish}
        startOrFinish={startorFinish} // State variables passed down to child components
        wall={makeWall}
        key={clear ? columnIndex : columnIndex + 1000} // Unique key and Id for each child component
        id={`${rowIndex}-${columnIndex}`}
        updateStartorFinish={updateStartorFinish}
        isAnimating={isAnimating.current}
      />
    ))
  );

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [width, height, startorFinish]);

  useEffect(() => {
    // Update the start and finish node initially
    setStartorFinish({
      ...startorFinish,
      startNode: `${yAxisStart}-${xAxisStart}`,
      finishNode: `${yAxisFinish}-${xAxisFinish}`,
    });
  }, [width, height]);

  function animateorderofvisitedNodes() {
    let orderOfVisitedNodes,
      distances = null;
    if (isAnimating.current) return;
    isAnimating.current = true;
    cellElementsRef.current.forEach((value, key) => {
      if (value.element) {
        value.element.className =
          value.element.className === "path" ||
          value.element.className === "find"
            ? ""
            : value.element.className;
      }
    });
    if (algorithm === "Dijkstras") {
      ({ orderOfVisitedNodes, distances } = dijkstras(
        cellElementsRef.current,
        startorFinish.startNode,
        startorFinish.finishNode,
        screenHeight,
        screenWidth
      ));
    } else if (algorithm === "A Star") {
      ({ orderOfVisitedNodes, distances } = A_Star(
        cellElementsRef.current,
        startorFinish.startNode,
        startorFinish.finishNode,
        screenHeight,
        screenWidth
      ));
    } else {
      alert("Choose an algorithm");
      isAnimating.current = false;
      return;
    }

    let index = 1;
    const interval = setInterval(() => {
      cellElementsRef.current.get(
        orderOfVisitedNodes[index]
      ).element.className = "find";
      index++;
      if (index >= orderOfVisitedNodes.length - 1) {
        clearInterval(interval);
        animatePath(distances);
      }
    }, 10);
  }

  function animatePath(distances) {
    let node = startorFinish.finishNode;
    console.log(distances.get(node));

    if(!distances.has(node)){ // this checking for a star because we didn't intialize an map in the start like dijkstra
      // If we didn't found the end node || if start or finish node inside a fully closed wall
      isAnimating.current = false;
      return;
    }

    if (distances.get(node).prevNode === null || undefined) {
      // If we didn't found the end node || if start or finish node inside a fully closed wall
      isAnimating.current = false;
      return;
    }
    const interval = setInterval(() => {
      let previousNode = distances.get(node).prevNode;
      if (previousNode === startorFinish.startNode) {
        // Check if previous node is start node if true return and clear interval
        clearInterval(interval);
        isAnimating.current = false;
        return;
      }
      cellElementsRef.current.get(previousNode).element.className = "path";
      node = previousNode;
    }, 20);
    isAnimating.current = false;
  }

  function updateStartorFinish(node) {
    if (isAnimating.current) return;
    if (startorFinish.type === "start") {
      setStartorFinish({ ...startorFinish, startNode: node });
    } else if (startorFinish.type === "finish") {
      setStartorFinish({ ...startorFinish, finishNode: node });
    }
  }

  return (
    <div>
      <div className="gridNavBar">
        <Link to={'/'}>
          <button className="gridButton">
            Home
          </button>
        </Link>
      
        <button
          className="gridButton"
          onClick={() => (!isAnimating.current ? setClear(!clear) : null)}
        >
          clear
        </button>
        <select
          className="gridButton"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="choose"> Algorithm</option>
          <option value="Dijkstras">Dijkstras</option>
          <option value="A Star">A Star</option>
        </select>
        <button
          className="gridButton"
          onClick={() => animateorderofvisitedNodes()}
        >
          {algorithm === "Dijkstras" || algorithm === "A Star"
            ? "Find Path"
            : "Choose an Algorithm"}
        </button>
      </div>
      <table id="grid">
        <tbody>
          {gridColumns.map((row, rowIndex) => {
            return <tr key={clear ? rowIndex : rowIndex + 1000}>{row}</tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Grid;
