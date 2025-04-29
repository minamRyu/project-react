import { useReducer, useState } from "react";

function reducer(state, action){
    switch(action.type){
        case "increment" :
            return {number : state.number + 1}
        case "decrement" :
            return {number : state.number - 1}
        case "reset" :
            return {number : 0}
        default :
            throw new Error("에러");
    }
}
let initialValue = {number : 0};

function ReducerEx (){
    let [count, setCount] = useState(0);
    let [state, dispatch] = useReducer(reducer, initialValue);
    // state에는 초기화 즉, initialValue값이 들어간다.
    // dispatch에는 함수 즉, reducer 함수가 들어간다.
    const fnCount = (type)=>{
        switch(type){
            case "increment" :
                setCount(count+1);
                break;
            case "decrement" :
                setCount(count-1);
                break;
            case "reset" :
                setCount(0);
                break;
            default :
                throw new Error("에러");
        }
    }
    return (
        <>
            <h2>useState(익명함수)로 만들기</h2>
            <h3>{count}</h3>
            <div><button onClick={()=>{
                setCount(count + 1);
            }}>증가</button></div><br></br>
            <div><button onClick={()=>{
                setCount(prev => prev-1);
            }}>감소</button></div><br></br>
            <div><button onClick={()=>{
                setCount(0);
            }}>초기화</button></div>
            <hr></hr>
            <h2>useState(함수)로 만들기</h2>
            <h3>{count}</h3>
            <div><button onClick={()=>{fnCount('increment')}}>증가</button></div><br></br>
            <div><button onClick={()=>{fnCount('decrement')}}>감소</button></div><br></br>
            <div><button onClick={()=>{fnCount('reset')}}>초기화</button></div>
            <hr></hr>
            <h2>useReducer로 만들기</h2>
            <h3>{state.number}</h3>
            <div><button onClick={()=>{dispatch({type : 'increment'})}}>증가</button></div><br></br>
            <div><button onClick={()=>{dispatch({type : 'decrement'})}}>감소</button></div><br></br>
            <div><button onClick={()=>{dispatch({type : 'reset'})}}>초기화</button></div>
        </>
    )
}

export default ReducerEx