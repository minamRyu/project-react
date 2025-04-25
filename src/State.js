import './App.css';
import { useState } from 'react';

function NumState() {
    // useState의 0번째 인덱스는 value, 1째는 함수
    // console.log(num);
    // let numState = useState(1);
    // let num = numState[0];
    // let setNum = numState[1];

    let [num, setNum] = useState(1);
    
    const fnIncrease = function(){
        setNum(++num);
    }
    return (
        <div className="App">
            {num}
            <div>
                <button onClick={fnIncrease}>숫자 증가!</button>
            </div>
        </div>
    );
}

function State() {
    let [list, setList] = useState([
        <li key="1">홍길동</li>,
        <li key="2">김철수</li>,
        <li key="3">박영희</li>
    ]);
    let name = "";
    const fnAddUser = ()=>{
        let item = <li key={list.length+1}>{name}</li>
        // list.push(item);
        // let newList = [...list, item];
        // ...은 복사하기. 즉 list를 복사해서 newList에 넣는다.
        // , 찍고 값을 입력하면 push 필요 없다
        // useState는 같은 값이면 랜더링 하지 않는다.
        // 따라서 list 복사해서 랜더링하고, useState에는 newList값을 넣어 랜더링.
        // newList.push(item);
        // setList(newList);
        setList([...list, item]);
        // 이렇게 바로 담아도 된다!! 간편하게 하자!!
        console.log(list);
    }
    return (
        <div>
            <input onChange={(e)=>{
                // console.log(e.target.value);
                name = e.target.value;
            }}></input>
            <button onClick={fnAddUser}>추가</button>
            {list}
        </div>
    )
}

export default State;
