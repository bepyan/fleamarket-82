import {storage} from './firebase'

function getImageUrls(props) {
    const imgAry = props.imgAry
    const setLoading = props.setLoading
    const setImgUrls = props.setImgUrls
    var urls = ""
    imgAry.forEach((file) => {
        if(typeof(file) === 'string'){
            urls = urls === "" ? file : urls + " " + file
            setImgUrls(urls)
            return
        }
        const route = "images/" + file.name + "_" + new Date().toLocaleTimeString();
        const uploadTask = storage.ref(route).put(file);
        uploadTask.on(
            "state_changed",
            (snapshot) => { 
                setLoading((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            },
            (err) => {
                console.log(err);
            },
            () => { // 이미지 url 다운로드
                uploadTask.snapshot.ref.getDownloadURL()
                    .then((downloadURL) => {
                        urls = urls === "" ? downloadURL : urls + " " + downloadURL
                        setImgUrls(urls)
                    })
            }
        )
    })
}
export default getImageUrls