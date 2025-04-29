import HeaderContext from '../component/HeaderContext'
import { MyContext } from './context/MyContext'

function Context(){
    let sharedValue = {id:"test", name:"hong"}
    return (
        <>
            <MyContext.Provider value={sharedValue}>
                <HeaderContext></HeaderContext>
            </MyContext.Provider>            
        </>
    )
}

export default Context