import React from "react";

const schoolDetails=(props)=>{
    return(
        <div>
            { props.isSelected ? <p>현재 재학중인 대학교: {props.school.school}</p> : null }
        </div>
    );
}

schoolDetails.defaultProps={
    school:{
        school:'',
        address:'',
        test:'',
    }
}
export default schoolDetails;
