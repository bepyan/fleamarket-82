import React, { useState,useEffect } from 'react';
import SchoolInfo from "./schoolinfo"
import SchoolDetail from "./schoolDetails"
import "../../lib/css/email.css";
import "../../lib/css/common.css";
import axios from 'axios';
import {ip} from "../../store/ip"
import { styled } from '@material-ui/core/styles';
import SchoolIcon from '@material-ui/icons/School';

import {Button,Dialog, Divider, DialogContent, IconButton, Typography} from '@material-ui/core';


const MyButton = styled(Button)({
    background: 'rgb(12, 39, 114)',
    border: 0,
    borderRadius: 3,
    color: 'white',
    height: 48,
    padding: '0 30px',
    fontWeight:'bold',
    width:'552px',
    marginTop:'3px',
  });


function Schooltest(props) {



    const [open, setOpen] = useState(false)
    const [school, setschool] = useState([]) /* csv파일 load */
    const [schoolkey,setschoolkey] =useState("") 
    const [selectedKey,setselectedKey] =useState(-1) /* 학교 선택 */
    const [emailkey,setemailkey]=useState("")
    const [codekey,setcodekey]=useState(0)
    const [iscodekey,setiscodekey]=useState(0)
    const [Matchcode,setMatchcode]=useState(false)
    const [SearchNum,setSearchNum]=useState(-1)

    useEffect(() => {
     getcsv();
    },[]) 
    

    /*파일로딩 */
    const getcsv =()=>{
      var csvFilePath = require("./school2.csv");
      var Papa = require("../../../node_modules/papaparse/papaparse.min.js");
      Papa.parse(csvFilePath, {
        header:true,
        download: true,
        skipEmptyLines: true,
        complete: updateData
      });
    }
    const updateData = (res) => {
        setschool(res.data)
    }

    /*랜덤번호 */
    const randcode = () => { 
    
    if(emailkey==="")  alert("이메일을 입력해주세요.") 
    
      const codekey = Math.random().toString().substr(2,6);
      axios.get(ip + '/email', { params: { id: emailkey, email :school[selectedKey].email,codekey: codekey }})
      .then(() => {
        alert("이메일이 전송되었습니다.")
    })
      setcodekey(codekey)  
    }


    /*props 학교이름,인증 true false */
    const SendSchool = () => {
            props.SendSchool(school[selectedKey].school);
;
    }
   
    /*코드키 일치하는지 확인 */
    const checkMatchCode = () => {
      let timer;
      if (timer)
        clearTimeout(timer)
      timer = setTimeout(() => {
          if(codekey === iscodekey)
          {
            setMatchcode(true) 
            alert("일치!")
          }
          else {
              setMatchcode(false)
              alert("불일치!")
            } 
      }, 500);
    }


    /*학교이름 출력/클릭 */
    const mapToComponents = (data) => {
        data.sort((a,b) => { return a.name > b.name; })
        data = data.filter( (schoolinfo) => { 
            return schoolinfo.school.toLowerCase().indexOf(schoolkey.toLowerCase()) > -1;
        } )
        if (schoolkey !== ''&&SearchNum===1) {
          return data.map((school, i) => {
            return (
                <SchoolInfo
                    school={school} 
                    key={i}
                    isSelected={selectedKey !== -1}
                    onClick={()=>setselectedKey(school.number)}/>
               );
            });
        } 
    }
    /*모달 close ->props 호출 */
    const handleClose =()=> {
      setOpen(false)
      SendSchool()
      }
      

    return (
    <div>
        <IconButton onClick={() => setOpen(true)}>
            <SchoolIcon fontSize="large"/>
        </IconButton>
        <Typography variant="overline">
            * 학교 입력은 선택입니다 *
        </Typography>
        <Typography variant="overline" style={{marginLeft: '1rem', fontWeight: 'bold'}}>
          {Matchcode ? school[selectedKey].school + '인증성공' : '인증실패'}
        </Typography>

        <Dialog onClose={() =>setOpen(false)} open={open} >
            <Divider variant="middle" style={{ marginBottom: 25 }} />
            <DialogContent >
                <div className="school_Wrap" >
                    <h1>[학교 검색]</h1>
                    <div className="school">
                        <form name="header_search_box"
                            action="#"
                            method="get"
                            target="_blank">

                            <input type="search"
                                name="keyword"
                                placeholder="학교 입력"
                                onChange={(e) => setschoolkey(e.target.value)}/>
                        </form>

                        <button className="header_button" type="button" onClick={() =>setSearchNum(-SearchNum)}></button>
                    </div>
                            
                    <div className="school_result">           
                    {mapToComponents(school)} <br/><br/>
                        <SchoolDetail 
                              isSelected={selectedKey !== -1}
                              school={school[selectedKey]}
                              />
                      </div> 
                    </div>

                <Divider variant="middle" style={{ marginBottom: 25, height:3 }}/>
                <div className="email_Wrap" >
                    <h1>[이메일 전송]</h1>
                    <div className="email" style={{ width: "557px" }} >
                        <form name="header_search_box"
                            action="#"
                            method="get"
                            target="_blank">

                            <input type="search"
                                name="keyword"
                                placeholder="이메일 입력"
                                onChange={(e) => setemailkey(e.target.value)}
                                style={{ width: "200px" }}/>
                        </form>
                        <div style={{width:"200px",marginleft:"30px",fontSize:"20px",lineHeight:"50px",display:"inline-block" }}>
                        { school[selectedKey]? <p>@ {school[selectedKey].email}</p>:
                           <div> ex) naver.com </div>}
                        </div>
                        <MyButton style={{width:"145px",float:"right" ,paddingRight:"30px"}}  onClick={randcode}> EMAIL 전 송 </MyButton>
                    </div>

                     <div>
                        <h1 className="check">[인증번호]</h1>
                        <div className="email">
                            <form name="header_search_box"
                                action="#"
                                method="get"
                                target="_blank">
                                <input type="search"
                                 name="keyword"
                                 placeholder="인증번호 입력"
                                    onChange={(e) =>setiscodekey(e.target.value)}/>
                            </form>

                            <MyButton style={{width:"145px",marginLeft:"15px"}}  onClick={checkMatchCode}> 확 인 </MyButton>
                           
                            
                        </div>
                    </div> 
                </div>
            </DialogContent>
            <DialogContent style={{height:'60px',margin:'0 auto'}} >  
                        <MyButton  
                            color="primary"
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={() => handleClose()}
                            >
                            확인
                        </MyButton>      
            </DialogContent>
        
        </Dialog>
    </div>
    )
}
export default Schooltest;
