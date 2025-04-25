import { useEffect, useState } from "react";

function Effect(){

    let [num, setNum] = useState(1);
    let [num2, setNum2] = useState(1);
    // useEffect는 랜더링 할때마다 실행한다.
    useEffect(()=>{
        console.log("useEffect 호출");
    }, [num])
    // num 값이 변하는 순간 랜더링
    return (
        <div>
            {num}
            <div>
                <button onClick={()=>{
                    setNum(++num);
                }}>숫자 증가!</button>
            </div>
            <hr></hr>
            {num2}
            <div>
                <button onClick={()=>{
                    setNum2(++num2);
                }}>숫자 증가222!</button>
            </div>
        </div>
    );
}

export default Effect