import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogContentText, IconButton, Slide } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';

function Alert(props) {
    const option = props.option
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setOpen(option.open)
    }, option)

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    })
    const doAfter = () => {
        if('doAfter' in option)
            option.doAfter()
        setOpen(false)
    }
    return (
        <div>
            {open ?
                <Dialog open={open} TransitionComponent={Transition} keepMounted>
                    <DialogContent style={{width: "400px", textAlign: "center"}}>
                        <DialogContentText style={{fontWeight: 'bold'}}>
                            {option.text}
                        </DialogContentText>
                        <IconButton onClick={() => doAfter()}>
                            <DoneIcon/>
                        </IconButton>
                    </DialogContent>
                </Dialog>
            : null}
        </div>
    )
}

export default Alert