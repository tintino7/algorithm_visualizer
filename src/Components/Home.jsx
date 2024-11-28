import TSParticles from "./Particles"
import sorting from '../assets/Sorting.svg'
import pathFind from'../assets/pathFind.svg'
import github from '../assets/github.svg'
import linkedIn from '../assets/linkedin.svg'
import { Link } from "react-router-dom"

function Home(){
    return(
        <div id="home">
            <div className="particlesDiv">
                <TSParticles/>
            </div>
            <div className="infoBar">
                <a href="https://github.com/tintino7" target="_blank" rel="noopener noreferrer">
                    <img className="linkImg" src={github} alt="My Icon" width="30" height="30" />
                </a>
                <a href="https://www.linkedin.com/in/tharmarajan/" target="_blank" rel="noopener noreferrer">
                    <img className="linkImg" src={linkedIn} alt="My Icon" width="30" height="30" />
                </a>
            </div>
            <div className="middleDiv">
                <div className="introText">
                    <h1>Algorithm Visualizer</h1>
                    <br />
                    Algorithm Visualizer is an interactive tool designed to bring algorithms to life. 
                    It allows users to visually explore how different algorithms work, step by step. 
                    Currently it has Path Finding (A star & Dijkstra's) and Sorting (Selection Sort).
                </div>
                <div className="navBar">
                    <div>
                        <Link to={'sorting'}>
                            <img src={sorting} alt="My Icon" width="250" height="250" />
                            <h1 className="navBarText">Sorting</h1>
                        </Link>
                        
                    </div>
                    <div>
                        <Link to={'pathfinding'}>
                            <img src={pathFind} alt="My Icon" width="250" height="250" />
                            <h1 className="navBarText">Path Finding</h1>
                        </Link>
                        
                    </div> 
                </div>
            </div>
        </div>
    )
}

export default Home