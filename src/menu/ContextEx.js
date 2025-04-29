import { useContext, useState } from 'react'
import HeaderContext from '../component/HeaderContext'
import { MyContext } from './context/MyContext'
import { red } from '@mui/material/colors';

// function Context(){
//     let sharedValue = {id:"test", name:"hong"}
//     return (
//         <>
//             <MyContext.Provider value={sharedValue}>
//                 <HeaderContext></HeaderContext>
//             </MyContext.Provider>            
//         </>
//     )
// }

function Child1(){
    let {isDark, setDark} = useContext(MyContext);
    return (
        <div>
            <span style={{color : isDark ? 'red' : 'black'}}>
                자식 컴포넌트 111                
            </span>
            <Child2></Child2>
        </div>
        
    )
}

function Child2(){
    let {isDark, setDark} = useContext(MyContext);
    return (
        <div>
            자식 컴포넌트 222
            <button onClick={()=>{
                setDark(!isDark);
            }}>검은색/빨간색</button>
            {/* 위 버튼 클릭 시 isDark 값이 true<=>false */}
            {/* chile1의 텍스트가 isDark가 true면 검정, false면 빨간색 */}
            <Child3></Child3>
        </div>
    )
}

function Child3(){
    let map = useContext(MyContext);
    // console.log(map);
    let {isDark} = useContext(MyContext);
    // console.log(isDark);
    return (
        <div>
            자식 컴포넌트 333
        </div>
    )
}

function Context(){
    let [isDark, setDark] = useState(false); 
    return (
        <>
            <MyContext.Provider value={{isDark, setDark}}>
                <Child1></Child1>
            </MyContext.Provider>
        </>
    )
}

export default Context