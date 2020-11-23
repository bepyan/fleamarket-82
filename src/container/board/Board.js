
import React from 'react'
import BoardThum from "./BoardThum"
import { withRouter } from 'react-router-dom'

import { Grid, Grow, IconButton, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

function Board(props) {
    const [boards, getBoards] = props.useBoard
    
    const showMore = () => {
        getBoards({start_idx: boards.length})
    }

    // 상품 카드 이미지 좌측에 그리기,, view 아이콘으로 하기, 거래 상태를 표시
    const renderBoards = boards.map((board,index) => {
        return (
            <Grow key={index} in={true} {...{ timeout: 200*(boards.length - index) }}>
                <Grid item xs={12} sm={6} md={4}>
                    <BoardThum index={index} useBoard={[board, getBoards]}/>
                </Grid>
            </Grow>
        )
    })

    return (
        <div style={{textAlign: 'center', padding: '0px 4rem 2rem 4rem'}}>
            {/* 상품게시판 출력 */}
            <Grid container spacing={4} style={{padding: "3rem"}}>
                {renderBoards}
            </Grid>
            <div>
                { boards.length === 0 ? <Typography> 게시물이 없습니다 </Typography> : 
                    boards.length % 6 ? <Typography> 더 이상 게시물이 없습니다 </Typography> : 
                    <IconButton onClick={showMore} > 
                        <ExpandMoreIcon fontSize={'large'} />
                    </IconButton>
                }
            </div>
        </div>
    )
}
export default withRouter(Board)