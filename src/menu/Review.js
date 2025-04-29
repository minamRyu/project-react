import { useState, useEffect } from "react";
import { useFetcher } from "react-router-dom";

// function Header(props){
//     // props 파라미터안에 함수로 fnInfo를 받아서 타이틀 클릭 시 실행
//     return (
//         <>
//             <h2><a href="/" onClick={(e)=>{
//                 // 클릭 시 경로 이동 방지
//                 e.preventDefault();
//                 props.fnInfo(props.title);
//                 // props.fnInfo(e.target.title); 이렇게 해도 됨!!
//             }}>{props.title}</a></h2>
//         </>
//     )
// }
// 아래처럼 props 말고 맵으로 받아도 된다!!!!
function Header({title, fnInfo}){
    return (
        <>
            <h2><a href="/" onClick={(e)=>{
                e.preventDefault();
                fnInfo(title);
                // props.fnInfo(e.target.title); 이렇게 해도 됨!!
            }}>{title}</a></h2>
        </>
    )
}

function Body(props){
    return (
        <>
            {props.count}
            <button onClick={()=>{
                props.fnCount(props.count+1);

            }}>증가!</button>
        </>
    )
}

function Footer(props){
    // console.log(props.list);
    let [student, setStu] = useState({
        stuNo : "", 
        stuName : "", 
        stuDept : ""
    });
    const fnStuInfo = (e)=>{
        setStu({...student, [e.target.id] : e.target.value});
    }
    return (
        <>
            <div><input placeholder="학번" value={student.stuNo} onChange={fnStuInfo} id="stuNo"></input></div>
            <div><input placeholder="이름" value={student.stuName} onChange={fnStuInfo} id="stuName"></input></div>
            <div><input placeholder="학과" value={student.stuDept} onChange={fnStuInfo} id="stuDept"></input></div>
            <div><button onClick={()=>{
                props.fnSetList([...props.list, student]);
                setStu({
                    stuNo : "", 
                    stuName : "", 
                    stuDept : ""
                });
                // 여기서 setStu는 저장 후 빈 값으로 초기화
            }}>추가</button></div>
            <hr></hr>

            {props.list.map((item)=>{
                return <li key={item.stuNo}>학번 : {item.stuNo}, 이름 : {item.stuName}, 학과 : {item.stuDept}</li>
            })}                   
        </>
    )
}

function Review(){
    let [count, setCount]  = useState(0);
    // setCount는 함수다
    let [number, setNumber] = useState(0);
    let [list, setList] = useState([
        {stuNo : "1234", stuName : "홍길동", stuDept : "컴퓨터"},
        {stuNo : "1212", stuName : "김철수", stuDept : "전기"},
        {stuNo : "4321", stuName : "박영희", stuDept : "전자"}
    ]);
    

    useEffect(()=>{
        // alert("안녕");

        return ()=>{
            // alert("클린 업 함수!!");
        }

    }, [count]);
    // 2번째 변수로 [] 빈값을 넣으면 최초 랜더링 될때만 실행. 아니면 랜더링 될때마다 실행.
    // 2번째 변수는 의존성. 즉 count를 넣으면 count가 변할때 마다 실행
    // [] 안에 여러개의 변수를 넣을 수 있다.
    // useEffect의 리턴은 Review의 컴포넌트가 화면에서 사라질때 실행
    return (
        <>
            <Header title="Hello React!" fnInfo={(txt)=>{ alert(txt); }}></Header>
            <Header title="React Nozam!" fnInfo={(txt)=>{ alert(txt + " 진짜로! "); }}></Header>
            <Header title="React Good!" fnInfo={(txt)=>{ alert("사실은 구라 : " + txt); }}></Header>
            <hr></hr>
            <Body count={count} fnCount={setCount}></Body>
            <hr></hr>
            <Body count={number} fnCount={setNumber}></Body>
            <hr></hr>
            <Footer list={list} fnSetList={setList}></Footer>
        </>
    )
}

export default Review