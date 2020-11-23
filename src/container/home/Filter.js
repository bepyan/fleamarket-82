import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Alert from '../home/Alert'

import { Button, FormControlLabel, Grid, Switch } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DashboardIcon from '@material-ui/icons/Dashboard';

function Filter(props) {
  const school = window.sessionStorage.getItem("school")
  const getBoards = props.getBoards
  const [alertOption, setAlertOption] = useState({})
  const loginAlert= {open: true, text: "로그인하시지요..", doAfter: () => {props.history.push("/login")}}
  const noSchoolAlert= {open: true, text: "내 학교를 인증받으세요!", doAfter: () => {props.history.push("/mypage")}}
      
  const [type, setType] = props.useType
  const [align, setAlign] = props.useAlign
  const [desc, setDesc] = props.useDesc
  const [mySchoolText, setMySchoolText] = props.useSchool
  const [viewMySchool, setViewMySchool] = useState(false)
  const [viewNoContract, setViewNoContract] = props.useViewNoContract

  const changType = (event, newType) => {
      if (newType === null)
          return
      getBoards({type: newType})
      setType(newType)
  }
  const changeAlign = (event, newAlign) => {
      if (newAlign === null)
          return
      getBoards({align: newAlign})
      setAlign(newAlign)
  }
  const changeCending = () => {
      getBoards({desc: !desc})
      setDesc(!desc)
  }
  const changeMySchool = () => {
    if(!window.sessionStorage.getItem("id"))
      return setAlertOption(loginAlert)
    if(school === '')
      return setAlertOption(noSchoolAlert)

    setMySchoolText(viewMySchool? '' : school)
    getBoards({school: viewMySchool? '' : school})
    setViewMySchool(!viewMySchool)
  }
  const changeViewNoContract = () => {
    getBoards({viewNoContract: !viewNoContract})
    setViewNoContract(!viewNoContract)
  }
  return (
    <Grid item xs={12} style={{margin: '1rem'}}>
      <Grid container spacing={3} justify="center">
        <Grid item >
          <ToggleButtonGroup value={type} onChange={changType} exclusive style={{maxHeight: 50}}>
            <ToggleButton value="all">
              <h4>전체</h4>
            </ToggleButton>
            <ToggleButton value="wish">
              <h4>찜한 물건</h4>
            </ToggleButton>
            <ToggleButton value="mine">
              <h4>내 물건</h4>
            </ToggleButton>
            <ToggleButton value="purchased">
              <h4>구매한 물건</h4>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        
        <Grid item >
          <FormControlLabel 
            control={<Switch color="primary" checked={viewMySchool} onChange={changeMySchool} />}
            label={mySchoolText===''? '내 학교' : mySchoolText}
          />
        </Grid>
        <Alert option={alertOption}/>

        <Grid item>
          <ToggleButtonGroup value={align} onChange={changeAlign} exclusive style={{maxHeight: 50}}>
            <ToggleButton value="time" >
                <h4>시간순</h4>
            </ToggleButton>
            <ToggleButton value="view">
                <h4>조회순</h4>
            </ToggleButton>
            <Button onClick={() => changeCending()}>
                {desc ? <ArrowDropDownIcon/>: <ArrowDropUpIcon/>}
            </Button>
            <Button color={viewNoContract ? 'primary' : 'action'} onClick={() => changeViewNoContract()}>
              <DashboardIcon color={viewNoContract ? 'primary' : 'action'}/>
              &nbsp;거래전 게시물만 보기
            </Button>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default withRouter(Filter)
