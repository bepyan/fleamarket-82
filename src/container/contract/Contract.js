import React, { useEffect, useState } from 'react'

import Web3 from 'web3';
import axios from 'axios';
import {ip} from "../../store/ip"
import ethers from 'ethers';
import CloseIcon from '@material-ui/icons/Close';
import { Button, Dialog, DialogTitle,IconButton, DialogContent, Typography,Tooltip } from '@material-ui/core'

import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';


function Conteact(props) {
  
 const partypeopleAddress='0x6de658f56af984c42780551620e5c60b3f4c0b5c';
 const partypeopleABI=[ { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" } ], "name": "buyproduct", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" } ], "name": "cancle", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" }, { "name": "_sellerid", "type": "bytes32" }, { "name": "_buyerid", "type": "bytes32" }, { "name": "_price", "type": "uint256" } ], "name": "createContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" } ], "name": "refundapprove", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" } ], "name": "refundrequest", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" } ], "name": "returnprice", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" }, { "name": "_sellerid", "type": "bytes32" }, { "name": "_buyerid", "type": "bytes32" }, { "name": "_price", "type": "uint256" } ], "name": "sellerapprove", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "contractInfo", "outputs": [ { "name": "contractId", "type": "uint256" }, { "name": "buyerAddress", "type": "address" }, { "name": "sellerAddress", "type": "address" }, { "name": "buyerid", "type": "bytes32" }, { "name": "sellerid", "type": "bytes32" }, { "name": "price", "type": "uint256" }, { "name": "state", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getBuyerAddress", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getBuyerID", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getContractId", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getContractInfo", "outputs": [ { "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getprice", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getSellerAddress", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getSellerID", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getstate", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]
  
 const [room, setRoom] = props.useRoom
  const ViewType=props.ViewType
  const [chatlog, setChatlog]=props.chatlog

  const [stage, setstage] = useState("0")
  const [tradeNum,settradeNum]=useState("")
  const [stage_str,setstage_str]=useState("")
  const [trade,settrade]=useState([])
  const[sellerAddress,setsellerAddress]=useState("")
  const[buyerAddress,setbuyerAddress]=useState("")
  const[price,setprice]=useState("")
  const [web3, setWeb3] = useState("");
  const [Contract, setContract] = useState(undefined);
  const[open,setopen]=useState(false)  
  const [Click,setClick]=useState(-1)
  const [level, setLevel] = useState("")
  const [board,setboard]=useState([])
  const [chat,setchat]=useState([])



  useEffect(() => {
    initWeb3();
    getLevel();
  },[chatlog,room,stage]) 


 

 /*DB 거래 정보 가져오기 */ 
 const getContract = (Contract) =>{
  axios
  .get(ip+"/contract/user", { 
    params: { chat_id:room.id,board_id:room.board_id},})
  .then((data) => {
      const TradeData = data.data[0];
      settradeNum(TradeData[0].id)
      settrade(TradeData[0])
      getInfo(Contract,TradeData[0].id,web3)
    })
    .catch(err => 
      {settradeNum("0")
       getInfo(Contract,0,web3)
    })

    axios
    .get(ip+"/contract/board", { 
      params: { board_id:room.board_id ,chat_id:room.id},})
    .then((data) => {
        const boardData = data.data[0];
        setboard(boardData[0][0])
        setchat(boardData[1][0])

      })
    
}


  
  /*컨트렉트 주소,ABI연결*/
  const initWeb3 =async ()=>{ 
     let web3=undefined;
     let Contract=undefined;
  
    if(window.ethereum){
      web3 =new Web3(window.ethereum);
      try{await window.ethereum.enable();}catch(error){}}
      else if(window.web3){
          web3=new Web3(Web3.currentProvider); }
    Contract=new web3.eth.Contract(partypeopleABI,partypeopleAddress); 
    getContract(Contract)
    setContract(Contract)
    setWeb3(web3)
    }

  /*거래 정보 보여줌*/
   const getInfo = async (Contract,tradeNum) =>{ 
  

    const buyerAddress_b32 = await Contract.methods.getBuyerAddress(tradeNum).call()
    const sellerAddress_b32 = await Contract.methods.getSellerAddress(tradeNum).call()
    const Stage=await Contract.methods.getstate(tradeNum).call();
    const fee =await Contract.methods.getprice(tradeNum).call() 
    const tempfee= Math.ceil((fee/(0.0000227* 10 ** 18)))

  
    
    let stage_str;

    if(Stage === "1") {stage_str = "구매요청 이후 구매승인대기"}
    if(Stage === "2") {stage_str = "구매승인 이후 입금대기"}
    if(Stage === "3") {stage_str = "입금 이후 구매확정대기"}
    if(Stage === "4") {stage_str = "구매 확정 완료[판매 완료]"}
    if(Stage === "10") {stage_str = "물품 환불 요청 상태[거래취소]"} //구매자
    if(Stage === "11") {stage_str = "물품 환불 승인 상태[거래취소]"} //판매자
    if(Stage === "7") {stage_str = "구매 전 [거래 취소]"}
    

    setstage(Stage)
    setstage_str(stage_str) 
    setsellerAddress(sellerAddress_b32)
    setbuyerAddress(buyerAddress_b32)
    setprice(tempfee)
    }

  /*DB상태 업데이트 */
  const updatestate = (state) => {

    axios.get(ip + '/contract/state', { params: { tradeNum: tradeNum, state: state ,board_id:room.board_id } })
      .then(res => { })
      .catch(err => {
        console.log(err)
        alert("업데이트에러")
      })
    
    if (state===4 || state===7){

      setUserLevel(state) //레벨설정
    }
  }



/*구매요청 (DB생성) */
    const buyerrequest= async () => {
      const contract = {  //채팅방 아이디를 추가 구분하기위해 ! 
        chat_id:room.id,
        board_id:room.board_id,
        price:board.price,
        buyer_id:room.buyer_id,
        seller_id:room.seller_id};
        axios.post(ip+"/contract/contract", { contract }).then((res) => 
          {
             updatestate(1)
             props.sendMessage(1)
             setstage(1)
          });
         
    }

    
/*판매자 승인*/
  const sellerapprove = async () => { 

  const accounts = await web3.eth.getAccounts();
  setsellerAddress(accounts[0])

  let sellerId32= ethers.utils.formatBytes32String(room.seller_id);
  let buyerId32= ethers.utils.formatBytes32String(room.buyer_id);
  let board_price = trade.board_price*0.0000227* 10 ** 18; //1원에 0.00000227 이더.. 일단 이렇게
  let price_str = String(board_price) //가격
  
  props.sendMessage(21)
  await Contract.methods.sellerapprove(tradeNum,sellerId32,buyerId32,price_str).send({ from: accounts[0]}); 
  await updatestate(2)
  await props.sendMessage(2)
  

}

/*물품구매*/
const buyproduct = async() =>{

  const accounts = await web3.eth.getAccounts();
  setbuyerAddress(accounts[0])

  let cost = trade.board_price*0.0000227* 10 ** 18 //원->이더->웨이
  props.sendMessage(21)
  await Contract.methods.buyproduct(tradeNum).send({ from:accounts[0], value: cost}); 
  await updatestate(3)
  await props.sendMessage(3) 
  
 

}



/*구매확정(구)*/
const returnprice = async() =>{
 
props.sendMessage(21)
await Contract.methods.returnprice(tradeNum).send({ from:buyerAddress});
await updatestate(4)
await props.sendMessage(4)

}

/*물품 환불 요청 상태[거래취소] //구매자*/   
 const refundrequest = async() =>{
  
  props.sendMessage(21)
  await Contract.methods.refundrequest(tradeNum).send({from:buyerAddress});
  await updatestate(10)
  await props.sendMessage(10)

}

/*물품 환불 승인 상태[거래취소] //구매자*/   
 const refundapprove = async() =>{

  props.sendMessage(21)
  await Contract.methods.refundapprove(tradeNum).send({from:sellerAddress});
  await updatestate(11)
  await  props.sendMessage(11)

}

 /*구매 취소[구매자]*/
 const buyercancle = async() =>{
  
  
  const accounts = await web3.eth.getAccounts();
  setbuyerAddress(accounts[0])

  props.sendMessage(21)
  await Contract.methods.cancle(tradeNum).send({ from:accounts[0]});
  await updatestate(7)
  await props.sendMessage(7) 
  
}

/*구매 취소[판매자]*/
 const sellercancle = async() =>{
  
  props.sendMessage(21)
  await Contract.methods.cancle(tradeNum).send({ from:sellerAddress});
  await updatestate(7)
  await props.sendMessage(7) 

}

 /* 나의레벨 */
 const setUserLevel = (state) => {
  if (0 <= level && level < 100 && state!==4  && state!==7){
    axios
      .post("/chat/updatelevel", {
        room_state: state,
        chat_id: room.id
      })
      .then(res => {

      })
      .catch(err => {

      })
  }

}

const getLevel = () => {
  axios
    .get(ip + "/mypages/profile", {
      params: {
        id: window.sessionStorage.getItem("id")
      },
    })
    .then(data => {
      const result = data.data[0]

      setLevel(result.level)
    })
}



    return (
        <div style={{fontSize:30 }}>
              {/* 거래 정보 보여줌 */}
            
    <Button size={"small"} type={"button"} onClick={()=>setopen(true)} > 거래 정보 </Button>

              {/* 거래정보 */}
                <Dialog onClose={open} open={open} >
                          <DialogTitle align="center"style={{textAlign:"center",fontWeight:"bold",width:550 }}></DialogTitle>
                                                          
                                <DialogContent style={{textAlign:"center",height:"350px"}} >  
                                
                              
                                    <Tooltip title="계정정보 보기" placement='left'> 
                                    <IconButton onClick={() => setClick(-Click)} style={{marginLeft:"45px",color:"#FFA500"}}  >
                                        <SupervisedUserCircleIcon style={{fontSize:80 }}/>
                                   </IconButton>
                                    </Tooltip>
                                    
                                   <IconButton  onClick={() => setopen(false)} style={{color:"#696969",float:"right"}}  >
                                        <CloseIcon  style={{fontSize: 30}} /> 
                                   </IconButton>

                                  <Typography gutterBottom style={{fontWeight:"bold",fontSize:"25px",color:"#000069",marginTop:"30px"}}>{stage_str ==="0"?"구매 요청 전입니다." : stage_str}</Typography>
                               

                                   <IconButton style={{margin:"auto",color:"#000069"}} >
                                        <MonetizationOnIcon style={{fontSize:35 ,marginRight:"8px"}}/>
                                         <Typography gutterBottom style={{fontWeight:"bold"}} > {price} / ETH : {price*(0.0000227)} </Typography>
                                   </IconButton>
                                       {Click===1?
                                        (      
                                        <div>
                                          <Typography gutterBottom style={{fontWeight:"bold",fontSize:"15px"}}>SELLER:{sellerAddress === ""? "판매자 측 거래승인 이후 등록됩니다." : sellerAddress}</Typography>
                                          <Typography gutterBottom  style={{fontWeight:"bold",fontSize:"15px"}}>BUYER :{buyerAddress === ""? "판매자 측 거래승인 이후 등록됩니다." : buyerAddress}</Typography>
                                        </div>) :null}
                                           
                                </DialogContent>
                                
                </Dialog>
                {/* 거래정보 */}
               
              {ViewType===1 && chat.state===0 &&(board.state===1||board.state===0||board.state===7||board.state===11) ?<Button size={"small"} type={"button"} onClick={() => buyerrequest()} >구매 요청</Button>:null}
              {board.state===chat.state?
              <div style={{display:"inline-block"}}>
              {ViewType===2 && trade.state===1? <Button size={"small"} type={"button"} onClick={() => sellerapprove()} >구매 승인</Button>:null}
              {ViewType===1 && stage==="2"? <Button size={"small"} type={"button"}  onClick={() => buyproduct()}>물품 구매</Button>:null}
              {ViewType===1 && stage==="3"?<Button size={"small"} type={"button"}  onClick={() => returnprice()}>구매 확정</Button>:null}
              {ViewType===1 && stage==="2"? <Button size={"small"} type={"button"}  onClick={() => buyercancle()}>구매 취소</Button>:null}
              {ViewType===2 &&stage==="2"?<Button size={"small"} type={"button"}  onClick={() => sellercancle()}>구매 취소</Button>:null}
              {ViewType===1 && stage==="3"? <Button size={"small"} type={"button"} onClick={() => refundrequest()}>물품 환불 요청</Button>:null}
              {ViewType===2 && stage==="10"? <Button size={"small"} type={"button"}  onClick={() => refundapprove()} >물품 환불 승인</Button>:null}
              </div>:null
              }

              
             
            
        </div>
      
    )
}
export default Conteact;