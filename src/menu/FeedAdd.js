import React, { useEffect, useState } from "react";
import {Container, TextField, Button, Typography, Box, Divider } from "@mui/material";
import { useNavigate, useSearchParams  } from "react-router-dom";

// 1. 업로드 버튼 검포넌트 생성
function UploadButton(props) {
    const imgSelect = (event) => {
        const files = event.target.files;
        props.setFile(files);
    };

    return (
        <div>
        <label>
            <input
            multiple
            accept="image/*"
            type="file"
            style={{ display: "none" }}
            onChange={imgSelect}
            />    
            <Button variant="contained" component="span">
            파일 선택
            </Button>
        </label>
        </div>
    );
}


function FeedAdd() {
    const [userId, setUserId] = useState("");
    const [content, setContent] = useState("");
    const [searchParams] = useSearchParams();
    // 2. 선택한 파일 저장할 공간 할당
    const [files, setFile] = useState();
    const id = searchParams.get("id");
    const navigate = useNavigate();

    // 5. pk값 받아서 업로드 api 호출
    const fnUploadFile = (feedId)=>{
        const formData = new FormData();
        for(let i=0; i<files.length; i++){
            formData.append("file", files[i]); 
        }
        formData.append("feedId", feedId);
        fetch("http://localhost:3005/feed/upload", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            navigate("/feedList"); // 원하는 경로
        })
        .catch(err => {
            console.error(err);
        });
    }

    useEffect(()=>{
        if(id){
            fetch("http://localhost:3005/feed/"+id)
            .then(res => res.json())
            .then(data => {
                setUserId(data.feed.userId);
                setContent(data.feed.content);
            });
        }
    },[])

    const handleSubmit = () => {
        if (!userId || !content) return alert("모든 항목을 입력해주세요.");

        fetch("http://localhost:3005/feed", {
            method : "POST",
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify({userId, content})
        })
        .then(res => res.json())
        .then(data => {
            alert("등록 완료");
            // console.log(data);
            // 4. 피드 등록 후 선택한 파일이 있으면 insert할때의 pk값을 담아서
            // 파일 업로드 함수 호출
            if(files) {
                fnUploadFile(data.result.insertId);
            } else {
                navigate("/feedList"); // 원하는 경로
            }
        })
    };

    const handleEdit = () => {
        if (!userId || !content) return alert("모든 항목을 입력해주세요.");

        fetch("http://localhost:3005/feed/"+id, {
            method : "PUT",
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify({userId, content})
        })
        .then(res => res.json())
        .then(data => {
            alert("수정 완료");
            navigate("/feedList"); // 원하는 경로
        })
    };

    return (
        <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>피드 등록</Typography>
        <Divider sx={{ mb: 2 }} />
        <TextField
            disabled={id}
            label="작성자 ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
        />
        {/* 3. 컴포넌트 부착(file값을 수정할 수 있게 props로 함수 전달) */}
        <UploadButton setFile={setFile}></UploadButton>
        <TextField
            label="내용"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />
        <Box mt={2}>
            {id ? 
            <Button variant="contained" color="primary" onClick={handleEdit}>수정</Button> : 
            <Button variant="contained" color="primary" onClick={handleSubmit}>
            등록
            </Button>}
            
            {/* <Button variant="contained" onClick={fnUploadFile}>업로드 테스트 버튼</Button> */}
        </Box>
        </Container>
    )
}
 
export default FeedAdd