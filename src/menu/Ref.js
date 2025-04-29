import { useState, useRef, useEffect } from "react";
// Ref : 랜더링 하지 않고 값만 유지. dom 즉 html에 접근
// 단, useState로 새로 랜더링 하면 초기화 됨.
import Button from '@mui/material/Button';
import DialogSample from "./DialogSample";


function Ref(){
    let [numState, setNum] = useState(1);
    let numVar = 1;
    let numRef = useRef(1);
    // console.log(numRef);

    let [value, setValue] = useState("");

    let inputRef = useRef();
    useEffect(()=>{
        inputRef.current.focus();
        console.log(inputRef);
    }, [])

    return (
        <>
            <DialogSample></DialogSample>
            <hr></hr>
            <div>{numState} <button onClick={()=>{
                setNum(numState +1)}}>state</button></div><br></br>
            <div>{numVar} <button onClick={()=>{
                numVar += 1;
                console.log("numVar => " + numVar);
            }}>var 증가</button></div><br></br>
            <div>{numRef.current}<button onClick={()=>{
                numRef.current += 1;
                console.log("ref => " + numRef.current);
            }}>Ref 증가</button></div>

            <input ref={inputRef} value={value} onChange={(e)=>{setValue(e.target.value)}}></input>
            <Button size="small" variant="contained" onClick={()=>{                
                setNum(numState + parseInt(value));
                setValue("");
                inputRef.current.focus();
            }}>추가</Button>
        </>
    )
}

export default Ref