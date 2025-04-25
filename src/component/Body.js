
function Body(props){
    let title = <h3>과목 목록</h3>;
    // let list = [
    //     <li>JAVA</li>,
    //     <li>HTML</li>,
    //     <li>ORACLE</li>,
    //     <li>REACT</li>
    // ];

    // map 함수를 이해하자.
    // let list = [1,2,3];
    // 아래의 for를 map으로 만들 수 있다.
    // let newList = [];
    // for(let i=0; i<list.length; i++){
    //     newList.pust(list[i]*2);
    // }
    // let newList = list.map((num)=>{
    //     return num*2;
    // });

    // 첫번째 풀이
    // let list = [];
    // for(let i=0; i<props.list.length; i++){
    //     let tag = <li key={props.list[i].subId}>{props.list[i].subMain}</li>;
    //     list.push(tag);
    // }

    // 두번째 풀이
    return(
        <div>
            <ul>
                {title}
                {/* {list}  첫번째 풀이*/}
                {/* js list.map 참고 아래의 map이라는 함수를 잘 외우자 */}
                {/* map은 for문이라 생각하자. 단, 원하는 형태로 만들어서 리턴 */}
                
                {props.list.map((item)=>{
                    return <li key={item.subId}><a href="/" onClick={(e)=>{
                        e.preventDefault();
                        props.fnBody(item.subMain);
                    }}>{item.subMain}</a></li>
                })}
            </ul>
        </div>
    )
}

export default Body