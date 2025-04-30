import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, Container, Typography, Card, CardContent, Divider, Button } from "@mui/material";
import { jwtDecode } from 'jwt-decode';


function App() {
    const [feeds, setFeeds] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const sessionUser = jwtDecode(token); 
    const [listFlg, setlistFlg] = useState(false);

    const fnList = ()=> {
        let url = "http://localhost:3005/feed";
        if(listFlg){
            url += "?userId=" + sessionUser.userId;
        }
        fetch(url)
            .then(res => res.json())
            .then(data => {   
                let map = new Map();
                data.imgList.forEach(item => {
                    if(!map.has(item.id)){
                        map.set(item.id, []);
                    }
                    map.get(item.id).push(item);
                });
                data.list = data.list.map((item)=>{
                    return {...item, list : map.get(item.id) || []}
                })
                console.log(data.list);
                setFeeds(data.list);
            });
    }

    const fnDelete = (id) => {
        if(!window.confirm("삭제 하시겠습니까?")){
            return;
        }
        fetch("http://localhost:3005/feed/" + id, {
            method : "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(data => {       
                alert(data.message);
                fnList();
            });
    }

    useEffect(()=>{
        fnList();
    }, [listFlg])
   
    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>피드 목록</Typography>
            <Button variant="contained" onClick={()=>setlistFlg(!listFlg)}>{listFlg ? "전체보기" : "내꺼만"}</Button>
            {/* 최초에는 전체목록(버튼이름 : 내꺼만) */}
            {/* 버튼 클릭 시 내꺼만 나오고 버튼 이름은 전체보기 */}
            <Divider sx={{ mb: 2 }} />
            {feeds.map(feed => (
                <Card key={feed.id} sx={{ mb: 2 }}>
                <CardContent>
                    {feed.list.map((item)=>{
                        return <img key={item.imgNo} style={{width : "100px", height : "100px"}} src={"http://localhost:3005/" + item.imgPath + item.imgName}></img>
                    })}
                    <Typography variant="h6">{feed.userId}</Typography>
                    <Typography variant="body1">{feed.content}</Typography>
                    <Typography variant="caption" color="text.secondary">
                    {new Date(feed.cdatetime).toLocaleString()}
                    </Typography>
                    {sessionUser.userId == feed.userId ? <Stack spacing={2} direction="row">
                    <Button sx={{ width: 13, height: 30 }} variant="outlined" onClick={()=>{
                        navigate('/feedAdd?id=' + feed.id);
                    }}>수정</Button>
                    <Button variant="outlined" onClick={()=>{
                        fnDelete(feed.id);
                    }}>삭제</Button>
                    </Stack> : null}
                </CardContent>
                </Card>
            ))}
        </Container>
    )
}

export default App