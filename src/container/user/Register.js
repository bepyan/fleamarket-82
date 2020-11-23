
import React, { useState } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import {ip} from "../../store/ip"
import {TextField, Button, Container, Grid} from "@material-ui/core";
import SchoolCheck from "./schooltest";
import Alert from "../home/Alert";

function Register() {
  const [alertOption, setAlertOption] = useState({})
  const inputAlert = {open: true, text: "모든 값을 넣어 주셔야 합니다.."}
  const registAlert = {open: true, text: "회원가입에 성공했습니다! 로그인하세요!", doAfter: () => {window.location.reload()}}

  const [id, setId] = useState("")
  const [pw, setPw] = useState("")
  const [rpw, setRpw] = useState("")
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [birth, setBirth] = useState("")
  const [school, setSchool] = useState("")
  const [address, setAddress] = useState("")
  const [nickName, setNickName] = useState("")
  const [checkRpw, setCheckRpw] = useState(true)

  // 아이디 저장 함수
  const checkID = (id) => {
    // const idReg = /^[A-za-z0-9]{5,15}$/g
    setId(id)
  };

  // 패스워드 저장 함수
  const checkPassword = (pw) => {
    // var regExp = /^[a-zA-Z0-9]{5,20}$/;
    if(rpw !== "")
      setCheckRpw(rpw === pw)
    setPw(pw)
  };
  // 패스워드 매칭 함수
  const checkRepassword = (rpw) => {
    setCheckRpw(rpw === pw)
    setRpw(rpw)
  };

  // 전화번호 저장 함수 (서버로 보낼 땐 - 없애기)
  const checkPhoneNumber = (v) => {
    var num = v.replace(/[^0-9]/g, "").substring(0,11)
    if(num.length > 3)
      num = num.substring(0,3)+"-"+num.substring(3)
    if(num.length > 8)
      num = num.substring(0,8)+"-"+num.substring(8)
    setPhone(num)
  }
  const checkBirth = (v) => {
    // 2020-01-01 정규식
    var num = v.replace(/[^0-9]/g, "").substring(0,8)
    setBirth(num)
  }

  /*학교이름,true false 받아오기 */
  const SendSchool = (school) => {
    setSchool(school)
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: id,
      pw: pw,
      name: name,
      nickName: nickName,
      phone: phone.replace(/[^0-9]/g, ""),
      address: address,
      birth: birth.replace(/[^0-9]/g, ""),
      school: school,
    };
    // 입력이 전부 있는지 체크
    if(!id || !pw || !name || !nickName || !phone || !address || !birth){
      setAlertOption(inputAlert)
      return
    }
  
    // 데이터 입력
    axios.post(ip+"/users/register", newUser)
      .then(() => {
        setAlertOption(registAlert)
      })
      .catch(e => {
        console.log(e)
      })
  };

  return (
    <Container component="main" maxWidth="xs">
      <Alert option={alertOption}/>
      <form noValidate onSubmit={onSubmit}>
        <Grid container spacing={2}>
          {/* 아이디 */}
          <Grid item xs={12}>
            <TextField value={id}
              onChange={(e) => checkID(e.target.value)}
              // onBlur={(e) => onCheckDuplicateID(e)}
              variant="outlined"
              required fullWidth
              label="ID"
            />
          </Grid>
          {/* 비밀번호 */}
          <Grid item xs={6}>
            <TextField
              value={pw}
              onChange={(e) => checkPassword(e.target.value)}
              variant="outlined"
              required fullWidth
              label="비밀번호"
              type="password"
            />
          </Grid>
          {/* 비밀번호 확인 */}
          <Grid item xs={6}>
            <TextField value={rpw} 
              onChange={(e) => checkRepassword(e.target.value)}
              variant="outlined"
              required fullWidth
              label="비밀번호 확인"
              type="password"
              error={!checkRpw} helperText={checkRpw ? "" : "비밀번호 불일치"}
            />
          </Grid>
          {/* 닉네임 */}
          <Grid item xs={12}>
            <TextField value={nickName} 
              onChange={(e) => { setNickName(e.target.value)}}
              variant="outlined"
              required
              fullWidth
              label="닉네임"
            />
          </Grid>
          {/* 이름 */}
          <Grid item xs={12}>
            <TextField value={name} 
              onChange={(e) => {setName(e.target.value)}}
              variant="outlined"
              required
              fullWidth
              label="이름"
            />
          </Grid>
          {/* 핸드폰 번호 */}
          <Grid item xs={12}>
            <TextField  
              value={phone}
              onChange={(e) => checkPhoneNumber(e.target.value)}
              variant="outlined"
              required
              fullWidth
              label="휴대전화 입력"
            />
          </Grid>
          {/* 생년월일 */}
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              value={birth}
              onChange={(e) => { checkBirth(e.target.value)}}
              required
              fullWidth
              label="생년월일 입력"
              placeholder="(형식 2020-01-01)"
              type="birth"
            />
          </Grid>
          {/* 주소 */}
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              value={address}
              onChange={(e) => {setAddress(e.target.value)}}
              required
              fullWidth
              label="주소 입력"
              placeholder="*(형식:경상북도 구미시 상세주소)"
              type="address"
            />
          </Grid>
                {/* 학교 인증 */}
          <Grid item xs={12}>
            <SchoolCheck SendSchool={SendSchool}/>
          </Grid>
          
          <Grid item xs={12}>
            <Button style={{height: "50px", fontSize: "15px"}}
              type="submit"
              fullWidth
              variant="contained"
              color="primary">
              가입하기
            </Button>
          </Grid>
        </Grid> 
      </form>
    </Container>
  );
}

export default withRouter(Register);