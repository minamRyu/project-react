import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function Menu() {
    // useEffect(()=>{
    //     const timer = setInterval(()=>{
    //         console.log("실행중");
    //     }, 1000);

    //     return ()=>{
    //         clearInterval(timer);
    //         console.log("타이머 종료!(일명 클린업)");
    //     }
    // }, []);
    return (
        <nav style={{ margin: "30px", fontSize: "40px" }}>
            <ul>
                <li><Link to="/app">App.js</Link></li>
                {/* <li><Link to="/feedList">FeedList.js</Link></li>
                <li><Link to="/feedEdit">FeedEdit.js</Link></li> */}
                <li><Link to="/state">State.js</Link></li>
                <li><Link to="/effect">Effect.js</Link></li>
                <li><Link to="/product">ProductMain.js</Link></li>
                <li><Link to="/review">Review.js</Link></li>
                <li><Link to="/ref">Ref.js</Link></li>
                <li><Link to="/signIn2">SignIn2.js</Link></li>
                <li><Link to="/signInSide">SignInSide.js</Link></li>
                <li><Link to="/contextEx">ContextEx.js</Link></li>
                <li><Link to="/main">Context222.js</Link></li>
                <li><Link to="/reducerEx">ReducerEx.js</Link></li>
                <li><Link to="/reducerEx2">ReducerEx2.js</Link></li>
            </ul>
        </nav>
    );
}

export default Menu;