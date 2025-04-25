function Header(props){
    // console.log(props);
    return (
        <div>
            <h2 style={{color:"blue", fontWeight:"revert-layer"}}>
                {/* a href="/" 현재루트 갱신 */}
                <a href="/" onClick={(e)=>{
                    e.preventDefault();
                    // 위의 함수는 기본 이벤트 방지. 많이 쓰인다.
                    props.fnHeader(props.contents);
                }}>{props.title}</a>
            </h2>
        </div>
    )
}

export default Header