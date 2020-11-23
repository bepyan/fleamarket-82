import React, { Component } from 'react';

import '../../App.css';
import Web3 from 'web3';
import axios from 'axios';
import {ip} from "../../store/ip"
import ethers from 'ethers';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { hot } from 'react-hot-loader'


let parepeopleAddress='0x4DB50ffd951e814cbf1b87448b2533b8c22423DA';
let parepeopleABI=[ { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" } ], "name": "buyerrequest", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" } ], "name": "buyfleamarket", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" }, { "name": "_sellerid", "type": "bytes32" }, { "name": "_buyerid", "type": "bytes32" }, { "name": "_price", "type": "uint256" } ], "name": "createContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getBuyerAddress", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getBuyerID", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getfee", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getSellerAddress", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getSellerID", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getstep", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" } ], "name": "productsend", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" } ], "name": "returnfee", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" }, { "name": "_sellerid", "type": "bytes32" }, { "name": "_buyerid", "type": "bytes32" }, { "name": "_price", "type": "uint256" } ], "name": "sellerapprove", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "contractInfo", "outputs": [ { "name": "contractId", "type": "uint256" }, { "name": "buyerAddress", "type": "address" }, { "name": "sellerAddress", "type": "address" }, { "name": "buyerid", "type": "bytes32" }, { "name": "sellerid", "type": "bytes32" }, { "name": "price", "type": "uint256" }, { "name": "state", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getContractInfo", "outputs": [ { "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]


class modal extends Component{


  constructor(props) {
    super(props);

    this.state = {
      //contract를 위한 상태변수들
      tradeNum: 0, 
      stage: 0,
      stage_str: '',
      contractAddress: '',
      sellerAddress: '',
      buyerAddress: '',
      fee:0,
      boardId:1, //게시판 번호 임의로 
      sellerId: '',
      buyerId: window.sessionStorage.getItem('id'),
      open:false,

      //지금 임의로 설정한거 게시판ID(채팅을 통해서 가져옴),구매자ID(세션)

      //쿼리를 위한 상태변수들  
      
      viewType : this.props.viewType,
      q_ownerID: '',
      q_borrowerID: '',
      q_ownerNum: 0,
      q_borrowerNum: 0,
      q_fee: 0
    };

    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this);
  }


  handleClickOpen() {
    this.setState({
    open: true
    });} // 모달 오픈 
    
    handleClose() {
    this.setState({
    open: false
    });} //모달 닫기 



  async componentDidMount(){ //시작시 
    await this.initWeb3()   
  }

  //--------------------------------------메타 마스크 연동 ---------------------------------------------//

  initWeb3 = async() =>{
    if(window.ethereum){
      this.web3 =new Web3(window.ethereum);

      try{
        await window.ethereum.enable();
      }catch(error){
      
      }
    }

    else if(window.web3){
      this.web3=new Web3(Web3.currentProvider);
    }
    else{
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask');
    }


    this.parepeopleContract=new this.web3.eth.Contract(parepeopleABI,parepeopleAddress);


  }


//------------------------------------- 거래 정보 ---------------------------------------------//

  getInfo = async () =>{

    let stage = await this.parepeopleContract.methods.getstep(this.state.tradeNum).call()
    let stage_str;
    if(stage === "0") {stage_str = "구매 요청 승인 대기"}
    if(stage === "1") {stage_str = "구매자 거래 승인 대기"}
    if(stage === "2") {stage_str = "구매자 물품 구매 대기"}
    if(stage === "3") {stage_str = "판매자 물건 전송 대기"}
    if(stage === "4") {stage_str = "판매 중"}
    if(stage === "5") {stage_str = "구매 확정 완료[판매 완료]"}
   
       this.setState({
         stage: stage,
         stage_str: stage_str,

       })


  }



  //--------------------------------------함수 시작 !  ---------------------------------------------//



    buyerrequest= async () => {    //구매요청 
  
      // 게시판에서 판매자ID 가격 가져오기 (게시판 ID 이용해서)
      const accounts = await this.web3.eth.getAccounts();
      this.buyeraccount = accounts[0]; // 현재 계정은 owner
  
      axios
      .get(ip+"/contract/board", { 
        params: {
          boardId: this.state.boardId //게시판 ID 일단 임의로 
      },
      })
      .then((data) => {
        const boarddata = data.data[0];
          this.setState({
            
            sellerId: boarddata[0].sellerId, //판매자아이디
            fee:boarddata[0].price,
        }); // end of setState
        
      //----------------------------아이디 , 가격 get--------------------------------------//

        const contract = { //게시판ID,가격,구매자ID,판매자ID,상태
          boardId:this.state.boardId,
          fee:this.state.fee,
          buyerId:this.state.buyerId,
          sellerId: this.state.sellerId,
          state: 0,
        };
    
                axios.post(ip+"/contract/contract", { contract }).then((res) => {

                });

        
      });   

   

      //---------------------------거래 DB 생성 --------------------------------------//



      axios.get(ip+"/contract/contract").then((data) => {
      
        const tradedata = data.data[0];
        this.setState({
          tradeNum: tradedata[0],
      }); // end of setState
       });



      this.parepeopleContract.methods.buyerrequest(this.state.tradeNum).send({ from: this.buyeraccount});
      
        this.setState({
          buyerAddress:this.buyeraccount
        })

    
    
        this.getInfo()   
        let trade =this.parepeopleContract.methods.getContractInfo(this.state.tradeNum).call();
  
    }



  sellerapprove = async () => { //판매자 승인 (판)

    const accounts = await this.web3.eth.getAccounts();
    this.selleraccount = accounts[0]; // 현재 계정은 owner
    axios
      .get(ip+"/contract", { 
        params: {
        tradeNum: this.state.tradeNum //거래번호로 
      },
      })
      .then((data) => {
        const contractData = data.data[0];
          this.setState({
            
              id: contractData[0].id, //판매자아이디
              fee: contractData[0].board_price, //가격
              sellerId: contractData[0].seller_id, 
              buyerId:contractData[0].buyer_id,
              state:contractData[0].state
        
        }); // end of setState


        //거래 ID는 그냥 사용 
        let sellerId32= ethers.utils.formatBytes32String(this.state.sellerId);//판매자 아이디 
        let buyerId32= ethers.utils.formatBytes32String(this.state.buyerId);//구매자 아이디

        let board_price = this.state.fee * 10 ** 18;
        let fee_str = String(board_price) //가격
        //await this.parepeopleContract.methods.getContractInfo(1).call()


        this.parepeopleContract.methods.sellerapprove(this.state.tradeNum,sellerId32,buyerId32, fee_str).send({ from: this.selleraccount});

        //가져올수있는거 sellerAddress 여기서 바로 넣기 ! 
        this.setState({
          sellerAddress:this.selleraccount
        })
        this.getInfo()
        let trade =this.parepeopleContract.methods.getContractInfo(this.state.tradeNum).call();
      });    
  }




  //물건 입금 (구)
  buyfleamarket = async() =>{

    let cost = this.state.fee * 1000000000000000000 //이더를 웨이로
    this.parepeopleContract.methods.buyfleamarket(this.state.tradeNum).send({ from: this.state.buyerAddress, value: cost});
    await this.getInfo()  
  }

  //물건 전송 (판)
  productsend = async() =>{
    this.parepeopleContract.methods.productsend(this.state.tradeNum).send({ from: this.state.sellerAddress});
    await this.getInfo()  
  }

  //구매 확정(구)
  returnfee = async() =>{
    this.parepeopleContract.methods.returnfee(this.state.tradeNum).send({ from: this.state.buyerAddress});
    await this.getInfo()  
  }

  render(){
  return (
    <div>
      <Button variant="contained" color="secondary" onClick={this.handleClickOpen}>
        거래 관리 
      </Button>

      <Dialog onClose={this.handleClose} open={this.state.open} >
      <DialogTitle align="center">거래관리</DialogTitle>
      <Divider variant="middle" style={{ marginBottom: 25 }} />
        <DialogContent> 
            <Typography gutterBottom>거래번호 : {this.state.tradeNum}</Typography>
            <Typography gutterBottom>거래상태 : {this.state.stage_str}</Typography>
            <Typography gutterBottom>요    금(Ether) : {this.state.fee}</Typography>
            <Typography gutterBottom>SELLER 지갑주소 : {this.state.sellerAddress === "0x0000000000000000000000000000000000000000"? "판매자 측 거래승인 이후 등록됩니다." : this.state.sellerAddress}</Typography>
            <Typography gutterBottom>BUYER 지갑주소 :{this.state.buyerAddress === "0x0000000000000000000000000000000000000000"? "구매자 측 거래승인 이후 등록됩니다." : this.state.buyerAddress}</Typography>
            <Typography gutterBottom>SELLER 아이디 : {this.state.sellerId}</Typography>
            <Typography gutterBottom>BUYER  아이디 : {this.state.buyerId}</Typography>
            <Divider variant="middle" style={{ marginBottom: 25 }} />
        </DialogContent>
        
        <DialogActions>
                <Button variant="outlined" color="secondary" onClick={this.buyerrequest}>구매요청</Button>
                <Button variant="outlined" color="secondary" onClick={this.sellerapprove}>(판)거래승인</Button>
                <Button variant="outlined" color="secondary" onClick={this.buyfleamarket}>물품 구매</Button>
                <Button variant="outlined" color="secondary" onClick={this.productsend}>물건 전송</Button>
                <Button variant="outlined" color="secondary" onClick={this.returnfee}>구매 확정</Button>
                <Button variant="outlined" color="primary" onClick={this.handleClose}>닫기</Button>
       </DialogActions>
      </Dialog>
    </div>

    );
  } 
}
export default hot(module)(modal);