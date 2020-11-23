import React from "react";
import { Zoom } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

function ImageUpload(props) {
    const imageBoxStyle = {
        width: 160,
        height: 160,
        display: "inline-block",
        border: "1px solid #e4e4e4",
        overflow: "hidden",
    }

    const imageStyle = {
        resize: "both",
        float: "center",
        width: 160,
        height: "auto",
    }

    const [imgAry, setImgAry] = props.useImgAry
    const [imgBase64Ary, setImgBase64Ary] = props.useImgBase64Ary
    const hiddenFileInput = React.useRef(null)
    const handleClick = () => {
        hiddenFileInput.current.click();
    }

    const inputImg = (e) => {
        const files = Array.from(e.target.files)
        if (!files)
            return
        setImgAry([...imgAry, ...files])
        files.forEach(file => {
            var reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                const base64 = reader.result
                if(base64){
                    let arr = imgBase64Ary
                    arr.push(base64.toString())
                    setImgBase64Ary([...arr])
                }
            }
        })
    }
    const deleteImg = (idx) => {
        let fileArr = [...imgAry]
        fileArr.splice(idx, 1)
        setImgAry([...fileArr])
    }
    const deleteNewImg = (idx) => {
        let fileArr = [...imgAry]
        fileArr.splice(imgAry.length - imgBase64Ary.length + idx, 1)
        setImgAry([...fileArr])

        let arr = [...imgBase64Ary]
        arr.splice(idx,1)
        setImgBase64Ary([...arr])
    }
    
    return (
        <div>
            <div style={{ width: 100, height: 100, border: "1px solid lightgray",
                display: "flex", alignItems: "center", justifyContent: "center" }} 
                onClick={handleClick}>
                <input accept="image/*" type="file" multiple
                    onChange={inputImg}
                    ref={hiddenFileInput}
                    style={{display: 'none'}}
                />
                <AddIcon color="action" fontSize="large"/>
            </div>
            {imgAry.map((image, idx) => {
                if(typeof(image) === 'string' && image !== '')
                    return (
                    <Zoom key={idx} in={true} timeout={(imgAry.length - idx)*300}>
                        <div onClick={()=> deleteImg(idx)} style={imageBoxStyle} >
                        <img src={image} alt="미리보기" style={imageStyle}/>
                        </div>
                    </Zoom>
                    )
                else return null
            })}
            {imgBase64Ary.map((image, idx) => {
                return (
                    <Zoom key={idx} in={true} timeout={(imgBase64Ary.length - idx)*300}>
                        <div onClick={()=> deleteNewImg(idx)} style={imageBoxStyle} >
                            <img src={image} alt="미리보기" style={imageStyle}/>
                        </div>
                    </Zoom>
                )}
            )}
        </div>
    )
}

export default ImageUpload;
