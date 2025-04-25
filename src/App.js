import './App.css';
import Header from './component/Header';
import Body from './component/Body';
import Footer from './component/Footer';

function App() {
    // db에서 조회한 값이라 예상하고 아래와 같이 작성
    let list = [
        {subId : "1", subMain : "java"},
        {subId : "2", subMain : "html"},
        {subId : "3", subMain : "oracle"},
        {subId : "4", subMain : "react"}
    ];
    let numList = [1,2,3,4];
    return (
        <div className="App">
            <Header title="헤더수정 첫번째" contents="text에 담기는 내용" fnHeader={(text)=>{
                alert(text);
            }}></Header>
            <Header title="헤더수정 두번째" fnHeader={(text)=>{}}></Header>
            <Body list={list} fnBody={(subMain)=>{
                alert(subMain);
            }}></Body>
            <div style={{color:"red", fontSize:"50px"}}>Hello world!</div>
            <Footer list={numList} fnFooter={()=>{
                alert();
            }}></Footer>
            {/* numList가 목록으로 출력 */}
            {/* 목록 클릭 시 해당 숫자 alert창에 띄우기 */}
            
        </div>
    );
}

export default App;
