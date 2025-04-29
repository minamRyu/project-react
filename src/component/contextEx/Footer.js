import { useContext } from "react"
import { DarkModeContext } from "../../menu/context/DarkModeContext";

function Footer(){
    let {isDark,setDark} = useContext(DarkModeContext);
    return (
        <div style={{height:"150px", color : isDark ? "white" : "black", backgroundColor: isDark ? "#222" : "rgb(243 225 225)"}}>
            푸터
        </div>
    )
}

export default Footer