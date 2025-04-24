import './App.css';

function Header(){
    return (
        <div>
            <div>헤더 공간!!</div>
        </div>
    )
}

function Footer(){
    return (
        <div>
            <div>여기는 푸터 공간!!</div>
        </div>
    )
}

function App() {
    return (
        <div className="App">
            <Header></Header>
            <Header></Header>
            <Header></Header>
            <div style={{color:"red", fontSize:"50px"}}>Hello world!</div>
            <Footer></Footer>
        </div>
    );
}

export default App;
