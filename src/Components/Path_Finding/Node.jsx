import {  useState, useRef, forwardRef} from "react";

const Node = forwardRef(({createWall, moveStartFinish, startOrFinish, wall, id, updateStartorFinish, isAnimating}, ref) =>{

   
    const [myClassName, setMyClassName] = useState('') 
    const touchMap = useRef(new Map())


    /* Mouse is down and when i mouse over make wall */
    const handleMouseOver = (e) => {
        
        if(isAnimating)return;

        const target = e.target
        if (wall){
            if(target.className == 'wall'){
                setMyClassName('')
            }
            else if(target.className == ''){
                setMyClassName('wall')
            }
        }
    };

    

    /* Function to set states for wall and startorFinish */
    const handleMouseDown = (e) => {

        if(isAnimating)return;

        e.preventDefault()
        const target = e.target
        if(target.className === 'start' || target.className === 'finish'){
            moveStartFinish(e, target.className)
        }
        else {
            createWall(e)
            /* For that initial cell */
            setMyClassName(myClassName === 'wall'? '': 'wall')
        }
    }

    /* This is the equilant of mousedown but fro touch devices */
    function handleTouchStart(e){
        if(isAnimating)return;
        const target = e.target
        if(target.className === 'start' || target.className === 'finish'){
            moveStartFinish(e, target.className)
            console.log('startorFinish')
        }
        else {
            createWall(e)
            /* For that initial cell */
            setMyClassName(myClassName === 'wall'? '': 'wall')
            console.log('wall')
        }
    }

    /* function to make changes to the component when touch move on touch devices */
    function handleTouchMove(e){
        if(isAnimating)return;
        const touch = e.touches[0]
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        if (wall){
            if(touchMap.current.has(element.id)){
                return
            } else {
                touchMap.current.set(element.id, element.id)
                if(element.tagName === 'TD'){
                    if(element.className === 'wall'){
                        element.className = ''
                    } else if (element.className === ''){
                        element.className = 'wall'
                    }
                }
               
            }
        } else if (startOrFinish.type === 'start' || startOrFinish.type === 'finish'){
            if(startOrFinish.active){
                if(element.tagName === 'TD'){
                    updateStartorFinish(element.id)
                }
                
                console.log(element.tagName)
            }
        }
    }



        const handleMouseEnter = (e) => {
            if(isAnimating)return;
            const target = e.target
            if(startOrFinish.active){
                updateStartorFinish(target.id)
            }
        }


        /* const handleMouseLeave = (e) => {
            const target = e.target
            if(startOrFinish.active){
                setPreviousClassName('')
                setMyClassName(previousClassName)   
            }
            
        } */


        let NodeclassName = ''

        if(startOrFinish.startNode === id){
            NodeclassName = 'start'
        } else if (startOrFinish.finishNode === id){
            NodeclassName = 'finish'
        }
        else if (isAnimating){
            NodeclassName = ''
        }
        else{
            NodeclassName = myClassName
        }


        /* switch (NodeclassName) {
            case startOrFinish.startNode === id:
                NodeclassName = 'start'
                break;
            case startOrFinish.finishNode === id:
                NodeclassName = 'finish'
                break;
            case isAnimating:
                break
            default:
                NodeclassName = myClassName
        } */

    return(
        <td 
            ref={ref}
            className={NodeclassName}
            onMouseOver={handleMouseOver}  
            /* onClick={handleClick}  */
            onMouseDown={handleMouseDown} 
            onTouchStart = {handleTouchStart}
            onTouchMove = {handleTouchMove}
            id={id} 
            onPointerEnter={handleMouseEnter} 
            >   
        </td>
    )

})

export default Node
