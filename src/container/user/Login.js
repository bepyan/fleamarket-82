import React, { useState } from 'react';
import { withRouter } from "react-router-dom";
import {ip} from "../../store/ip"
import axios from 'axios';
import Store from "../../store/store";

import { Button, Grid, Container, Typography, Paper, Input } from '@material-ui/core';
import { useSnackbar } from 'notistack';

function Login(props) {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = (e) => {
    e.preventDefault()
    if(!id || !password)
      return setMessage("모두 입력해주세요")

    axios.get(ip+"/users/login", { params: {id: id, password: password}})
      .then(response => {
        const res = response.data

        // 로그인 실패시 {success, message}
        if(!res.success){
          setMessage(res.message)
          return
        }
        // 로그인 성공시 {success, nickname, school}
        window.sessionStorage.setItem('id',id)
        window.sessionStorage.setItem('nickname', res.nickname)
        window.sessionStorage.setItem('school',res.school)
        enqueueSnackbar('로그인에 성공했습니다')
        props.onLogin()
        props.history.push('/')
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 로그인 폼
  const LoginForm = () => {
    return (
      <form noValidate onSubmit={onSubmit}>
        <Grid container spacing={1} justify='center'>
            <Grid item xs={8}>
              <Input onChange={(e) => {setId(e.target.value)}}
                value={id}
                inputProps={{style: { textAlign: 'center',  fontSize: '1.3rem', color: "#34373B", marginTop: "10px" }}}
                autoFocus
                fullWidth/>
            </Grid>
            <Grid item xs={8}>
              <Input onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                inputProps={{style: { textAlign: 'center',  fontSize: '1.4rem', color: "#34373B" }}}
                fullWidth/>
            </Grid>
            <Grid item xs={8} style={{textAlign: 'center'}}>
              {/* 버튼을 누를 때마다 이펙트, 타이머? */}
              <Typography variant="overline">
                {message} &nbsp; 
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Button type="submit" fullWidth variant="outlined">
                LOGIN
              </Button>
            </Grid>
        </Grid>
      </form>
    )
  }

  return (
    <Container component="main" maxWidth="xs" style={{marginTop: 50}}>
      <Paper elevation={5} style={{padding: '1rem'}}>
        <Store.Consumer>
          {store => ( 
              <div>
                {store.logged ? "logout" : LoginForm()}
              </div>
          )}
        </Store.Consumer>
      </Paper>
    </Container>
  )
}
export default withRouter(Login)