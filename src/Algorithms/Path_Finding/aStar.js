import PriorityQueue from 'js-priority-queue'

function insideGrid (node, rowLength, columnLength){
   
    return node.row < rowLength && node.column < columnLength
}


function heuristic(nodeA, nodeB) {
    return Math.abs(nodeA.column - nodeB.column) + Math.abs(nodeA.row - nodeB.row);
}


function A_Star(grid, start, endNode, rowLength, columnLength){
    
    /* const openList = new PriorityQueue() */
    const openListMap = new Map()   
    const closedList = new Map()
    const orderofVisitedNodes = []
    const changeInRowDirection = [0, -1, 0, 1]
    const changeInColumnDirection = [1, 0, -1, 0]
    let counter = 0

    const openList = new PriorityQueue({ comparator: (a, b) => {
        if (a.fcost === b.fcost) { // If same fcost, compare gcost
            if (a.gcost === b.gcost) { // If same gcost, compare hcost
                if (a.hcost === b.hcost) { // If same hcost, compare the order
                    return a.order - b.order;
                }
                return a.hcost - b.hcost; // Otherwise, lower hcost
            }
            return a.gcost - b.gcost; // Otherwise, lower gcost
        }
        return a.fcost - b.fcost; // Otherwise, lower fcost
    } });


    function enqueueElement(element) { 
        element.order = counter++;
        openListMap.set(element.id, element)
        openList.queue(element); 
      }

      function getCurrentNode(){
        const currentNode = openList.dequeue() // dequeue the next node from the queue
        const currentNodeDetails = grid.get(currentNode.id) // get node details from grid
        orderofVisitedNodes.push(currentNode.id) // push current node id into order of visited nodes
        closedList.set(currentNode.id, currentNode) // push the node to closed list
        return{...currentNode, row : currentNodeDetails.row, column : currentNodeDetails.column}
    }

    function getNeighbourNode(currentNode, index){
        const neighbourId = `${currentNode.row + changeInRowDirection[index]}-${currentNode.column + changeInColumnDirection[index]}`
        const neighbourDetails = grid.get(neighbourId)

        if(!neighbourDetails)return null
        if (openListMap.has(neighbourId)){
            return {...openListMap.get(neighbourId),
                    isWall : neighbourDetails.element.className === 'wall',
                    row : neighbourDetails.row, 
                    column : neighbourDetails.column}
        }
        return {id : neighbourId, 
                fcost : Infinity, 
                gcost : Infinity, 
                hcost : Infinity, 
                prevNode : null, 
                isWall : neighbourDetails.element.className === 'wall',
                row : neighbourDetails.row, 
                column : neighbourDetails.column}
    }

    function processEndNode(endNode, currentNode){
        orderofVisitedNodes.push(endNode.id)
        closedList.set(endNode.id, {
            id : endNode.id,
            gcost : currentNode.gcost + 1,
            hcost : 0,
            fcost : 0,
            prevNode : currentNode.id
        })
        return {orderOfVisitedNodes: orderofVisitedNodes, distances: closedList}
    }
    
    let startNode = {
        id : start,  
        gcost : 0,
        hcost : 0,
        fcost : 0
    }

    startNode.gcost = 0
    startNode.hcost = heuristic(startNode, endNode)
    startNode.fcost = startNode.gcost + startNode.hcost
    enqueueElement(startNode)
    

    while(openList.length > 0){

        const currentNode = getCurrentNode()

        for(let i = 0; i < 4; i++){
            
            const neighbour = getNeighbourNode(currentNode, i)
            
            if (!neighbour)continue
            if (!insideGrid(neighbour, rowLength, columnLength) || neighbour.isWall || closedList.has(neighbour.id))continue
            if (neighbour.id === endNode){
              return processEndNode(neighbour, currentNode)
            }
   
            const tentative_g_cost = currentNode.gcost + 1

            if(tentative_g_cost < neighbour.gcost){
                neighbour.gcost = tentative_g_cost
                neighbour.hcost = heuristic(neighbour, grid.get(endNode))
                neighbour.fcost = neighbour.gcost + neighbour.hcost 
                neighbour.prevNode = currentNode.id
                enqueueElement(neighbour)
            }
        }
    }

    return {orderOfVisitedNodes: orderofVisitedNodes, distances: closedList}
}

export default A_Star