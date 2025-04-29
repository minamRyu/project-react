import { useContext } from "react";
import { MyContext } from "../menu/context/MyContext";


function Child1(){
    return (
        <>
            <div>자식1</div>
            <Child2></Child2>
        </>
    )
}

function Child2(){
    const value = useContext(MyContext);
    console.log("context ==>" , value);

    return (
        <>
            <div>자식2</div>
        </>
    )
}


function HeaderContext(props){
    // console.log(props);
    return (
        <div>
            <Child1>
                
            </Child1>
            <h2 style={{color:"blue", fontWeight:"revert-layer"}}>
                {/* a href="/" 현재루트 갱신 */}
                <a href="/" onClick={(e)=>{
                    e.preventDefault();
                    // 위의 함수는 기본 이벤트 방지. 많이 쓰인다.
                    props.fnHeader(props.contents);
                }}>{props.title}</a>
            </h2>
        </div>
    )
}

export default HeaderContext