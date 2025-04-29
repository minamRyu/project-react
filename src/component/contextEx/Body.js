import RSide from "./RSide"
import LSide from "./LSide"
import Center from "./Center"

function Body(){
    return (
        <div style={{display:"flex"}}>
            <LSide></LSide>
            <Center></Center>
            <RSide></RSide>
        </div>
    )
}

export default Body