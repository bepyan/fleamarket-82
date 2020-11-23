import React, { useEffect, useRef } from 'react';
import './Message.css'
import moment from 'moment';

function ChatContent(props) {
    const user_id = props.user_id
    const message = props.message
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start"
        })
    }
    useEffect(scrollToBottom, message)

    const showTime = () => {
        const nowDate = moment().format('YYYY-MM-DD');
        //var time = message.sendTime.replace(/T/, ' ').replace(/\..+/, '')
        var time = message.sendTime

        if (nowDate === time.slice(0, 10)) {
            return time.slice(11, 16)
        } else {
            return time
        }
    }

    const contents = (message) => {
        switch(message.type){
            // 일반 채팅
            case 0:
                return <div>
                    <p>{message.contents}</p>
                </div>

                
            // 구매 요청
            case 1:
                return <div>
                    <p> {message.user_id}님이 <span style={{fontWeight: 'bold'}}>[구매요청]</span> 했습니다. </p>
                    <p style={{marginTop: '5px'}}> 판매자는 '구매승인'을 눌러주세요!  </p>
                </div>
            // 구매 수락
            case 2:
                return <div>
                    <p> {message.user_id}님이 <span style={{fontWeight: 'bold'}}>[구매수락]</span> 했습니다 </p>
                    <p style={{marginTop: '5px'}}> 구매자는 '구매(송금)' 눌러주세요! </p>
                </div>
              // 물품 구매
              case 3:
                return(<div  >
                    <p> {message.user_id}님이 <span style={{fontWeight: 'bold'}}>[물품구매]</span> 하셨습니다. </p>
                    <p style={{marginTop: '5px'}}> 구매자는 물품을 확인하시고 '구매확정' 눌러주세요! </p>
                </div>)
                 // 구매 확정
            case 4:
                return(<div >
                    <p> {message.user_id}님이 <span style={{fontWeight: 'bold'}}>[구매확정]</span> 했습니다 </p>
                    <p style={{marginTop: '5px'}}> 구매자는 환불 여부를 결정해주세요! </p>
                </div>)
                 // 반품 요청
                   //상대방이 방을 나감
            case 9:
                return <div>
                    <p>{message.user_id}님이 방을 나갔습니다.</p>
                </div>


            case 10:
                return(<div >
                    <p> {message.user_id}님이 <span style={{fontWeight: 'bold'}}>[반품요청]</span> 했습니다 </p>
                    <p style={{marginTop: '5px'}}> 판매자는 환불 여부를 결정해주세요! </p>
                </div>)
                // 반품 승인
            case 11:
                return(<div >
                    <p> {message.user_id}님이 <span style={{fontWeight: 'bold'}}>[반품승인]</span> 했습니다 </p>
                    <p style={{marginTop: '5px'}}> 물품이 반품처리 되었습니다! </p>
                </div>)

            case 7:
                return(<div >
                    <p> {message.user_id}님이 <span style={{fontWeight: 'bold'}}>[구매취소]</span> 했습니다 </p>
                    <p style={{marginTop: '5px'}}> 거래가 취소 되었습니다! </p>
                </div>)
           case 21:
            return(<div  >
                <h4> 메타마스크 처리 중 </h4>
                <p style={{marginTop: '5px'}}> please wait ... </p>
            </div>) 
                
            case 20:
                return (<img style={{maxWidth: '150px', maxHeight: '150px'}} 
                src={message.contents} onClick={() => { window.open(message.contents) }} />)
        }
    }
    const renderMsg = () => {
        var article = <div ref={messagesEndRef} />;
        var isMine = false;
        if (user_id === message.user_id) {
            isMine = true;
        }
        /* message.type === 0 || message.type === 20 */
        if (message.type === 0 || message.type === 20) {
            article = <div className={[
                'message',
                `${isMine ? 'mine' : ''}`, 'start', 'end'
            ].join(' ')}
            >
                <div className="bubble-container">
                    <div className="bubble">
                        {contents(message)}
                    </div>
                </div>
                <div className="timestamp" >
                    {showTime()}
                </div>
                <div ref={messagesEndRef} />
            </div>
        } else {
            article =
                <div className={[
                    'message',
                    `${isMine ? 'mine' : ''}`, 'start', 'end'
                ].join(' ')}>
                    <div className="system-container">
                        <div className="system">
                            {contents(message)}
                        </div>
                    </div>
                    <div className="timestamp">
                        {showTime()}
                    </div>
                    <div ref={messagesEndRef} />
                </div>
        }

        return article
    }

    return (
        <>
            {renderMsg()}
        </>
    )
}

export default ChatContent
