import { useState, useMemo } from "react";

function returnNumber(num){
    for(let i=0; i<10000000000; i++){}
    return 1000+num;
}

function Memo(){
    const [num, setNum] = useState(1);
    const [toggle, setToggle] = useState(false);
    let value = useMemo(()=>{
        return returnNumber(num);
    }, [num]);

    return (
        <div>
            <div>
                <button onClick={()=>setNum(num+1)}>증가!</button>
                <button onClick={()=>setToggle(!toggle)}>{toggle ? "왔다" : "갔다"}</button>
            </div>
            <div>{value}</div>
        </div>
    )
}

export default Memo