function experiment(pillars) {
  const resultsArray = [];

  [pillars[0], pillars[4]] = [pillars[4], pillars[0]];
  resultsArray.push(JSON.parse(JSON.stringify(pillars)));
  pillars[0].className = "minimum";
  resultsArray.push(JSON.parse(JSON.stringify(pillars)));
  for (let i = 1; i < pillars.length; i++) {
    pillars[i].className = "minimum";
    pillars[i - 1].className = "pillar";
    resultsArray.push(JSON.parse(JSON.stringify(pillars)));
  }

  return resultsArray;
}

export default experiment;
