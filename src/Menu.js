import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function Menu() {
    useEffect(()=>{
        const timer = setInterval(()=>{
            console.log("실행중");
        }, 1000);

        return ()=>{
            clearInterval(timer);
            console.log("타이머 종료!(일명 클린업)");
        }
    }, []);
    return (
        <nav style={{ margin: "30px", fontSize: "40px" }}>
            <ul>
                <li><Link to="/app">App.js</Link></li>
                <li><Link to="/state">State.js</Link></li>
                <li><Link to="/effect">Effect.js</Link></li>
                <li><Link to="/product">ProductMain.js</Link></li>
            </ul>
        </nav>
    );
}

export default Menu;