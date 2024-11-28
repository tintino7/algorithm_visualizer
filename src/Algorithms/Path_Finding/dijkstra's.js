import PriorityQueue from 'js-priority-queue'

function insideGrid (node, rowLength, columnLength){
    return node.row < rowLength && node.column < columnLength
}

function dijkstras (grid, startNode, endNode, rowLength, columnLength){ // grid--> hashmap, startNode---> string '0-0', endNode---> string '20-20'

    let visitedNodes = new Map()      // All the visited Nodes
    let unvisitedNodes = new Map()    // All the unvisited Nodes
    let distances = new Map()         // All the nodes and their previous nodes and distances {element : el, distance : Infinity, prevNode : null}
    let orderOfVisitedNodes = []      // The order which the nodes are visited
    let foundEndNode = false          // To stop the loop when the path to endNode is found
    let counter = 0;

    const priorityQueue = new PriorityQueue({
        comparator: function(a, b) {
            // First, prioritize by distance
            if (a.distance === b.distance) {
              // If distances are equal, prioritize by the order of insertion
              return a.order - b.order;
            }
            return a.distance - b.distance;
          }
      });


      function enqueueElement(element) { // Because the PQ doesn't guarantee the elements with same weight get dequeued in the order they are queued.
        element.order = counter++;  // Global counter to compare and prioritize the order they are queued for elements with same weight 
        priorityQueue.queue(element); 
      }

    grid.forEach((value, key) => {
        if(value.element){
            unvisitedNodes.set(key, {row : value.row, column : value.column, id : key, className : value.element.className || ''})
            distances.set(key, {prevNode : null, distance : Infinity})
        }
    });

    enqueueElement({ id: startNode, distance: 0 })
    distances.set(startNode, { prevNode: null, distance: 0 });

    /* 
                y
               |
               |
               |
               |
    -x _____________________ x
               |
               |
               |
               |          
                -y

     */


    const changeInRowDirection = [0, -1, 0, 1]
    const changeInColumnDirection = [1, 0, -1, 0]

    
      

    while(!foundEndNode && priorityQueue.length > 0){

        const currentNodeId = priorityQueue.dequeue().id
        const currentNode = unvisitedNodes.get(currentNodeId)
        
        unvisitedNodes.delete(startNode)

        orderOfVisitedNodes.push(currentNode.id)

        

        // Mark node as visited and remove from unvisited
        visitedNodes.set(currentNode.id, currentNode);
        unvisitedNodes.delete(currentNode.id);

        for (let i = 0; i < changeInRowDirection.length; i++){
            
            // Get neighbor coordinates
            const neighbourID = `${currentNode.row + changeInRowDirection[i]}-${currentNode.column + changeInColumnDirection[i]}`;
            const neighbour = unvisitedNodes.get(neighbourID);
            
            if(!neighbour)continue; // Skip if no neighbor exists

            const isWall = neighbour.className === 'wall'
            const isEndNode = neighbour.id === endNode
           

            // If wall or not inside grid or it is visited
            if(!insideGrid(neighbour, rowLength, columnLength) || isWall ||  visitedNodes.has(neighbour.id))continue; 
                
            
            if (isEndNode){
                foundEndNode = true
                
                orderOfVisitedNodes.push(neighbourID)
                distances.set(neighbourID, {prevNode : currentNode.id, distance : 1})
                
                return {orderOfVisitedNodes, distances}
            } 

            let dist = distances.get(currentNodeId).distance + 1
            

            if (dist < distances.get(neighbourID).distance){
                let neighbourDistance = distances.get(neighbourID)
                neighbourDistance = { ...neighbourDistance, prevNode: currentNode.id, distance: dist };
                distances.set(neighbourID, neighbourDistance)
                enqueueElement({ id: neighbourID, distance: dist })
               
            }  
        }
    }


    
    return {orderOfVisitedNodes, distances}
   
}

export default dijkstras