function selectionSortAlgorithm(pillars) {
  let minimumIndex = null;
  let previousMinimumIndex = null;
  let currntIndex = null;
  const pillarsLength = pillars.length;
  const newPillars = [...pillars];
  const resultsArray = [];

  function switchPillarsPosition(outerIndex, minimumIndex, currentIndex) {
    newPillars[currentIndex].className = "pillar";
    newPillars[minimumIndex].className = "sorted";

    [newPillars[minimumIndex], newPillars[outerIndex]] = [
      newPillars[outerIndex],
      newPillars[minimumIndex],
    ];

    resultsArray.push(JSON.parse(JSON.stringify(newPillars)));
  }

  function animateIteration(
    currentIndex,
    previousIndex,
    minimumIndex,
    previousMinimumIndex
  ) {
    newPillars[currentIndex].className = "currentPillar";
    if (newPillars[previousIndex].className !== "sorted") {
      newPillars[previousIndex].className = "pillar";
    }
    newPillars[previousMinimumIndex].className = "pillar";
    newPillars[minimumIndex].className = "minimum";
    resultsArray.push(JSON.parse(JSON.stringify(newPillars)));
  }

  // Set first node as minimum
  newPillars[0].className = "minimum";
  resultsArray.push(JSON.parse(JSON.stringify(newPillars)));

  for (let outerIndex = 0; outerIndex < pillarsLength; outerIndex++) {
    minimumIndex = outerIndex;
    previousMinimumIndex = minimumIndex;
    for (
      let innerIndex = outerIndex + 1;
      innerIndex < pillarsLength;
      innerIndex++
    ) {
      currntIndex = innerIndex;
      if (newPillars[currntIndex].height < newPillars[minimumIndex].height) {
        previousMinimumIndex = minimumIndex;
        minimumIndex = currntIndex;
      }
      animateIteration(
        currntIndex,
        currntIndex - 1,
        minimumIndex,
        previousMinimumIndex
      );
    }
    switchPillarsPosition(outerIndex, minimumIndex, currntIndex);
  }

  return resultsArray;
}

export default selectionSortAlgorithm;

/* Four states of a pillar

1. minimum
2. Sorted
3. Un sorted 
4. current

*/
