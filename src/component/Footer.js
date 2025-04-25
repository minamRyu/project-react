function Footer(props){
    return (
        <div>
            <ul>
                {props.list.map(()=>{
                    return <li key={props.list}><a href="/" onClick={(e)=>{
                        e.preventDefault();
                        // props.fnFooter(props.list.value);
                        console.log(props.list);
                    }}>{props.list}</a></li>
                })}
            </ul>
        </div>
    )
}

export default Footer