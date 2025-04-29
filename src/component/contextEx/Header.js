import { useContext } from "react"
import { DarkModeContext } from "../../menu/context/DarkModeContext";

function Header(){
    let {isDark,setDark} = useContext(DarkModeContext);
    return (
        <div style={{height:"150px", color : isDark ? "white" : "black", backgroundColor: isDark ? "#222" : "rgb(243 225 225)"}}>
            헤더
            <div>
                <button onClick={()=>{
                    setDark(!isDark);
                }}>{isDark ? "기본모드" : "다크 모드"}</button>
            </div>
        </div>
    )
}

export default Header