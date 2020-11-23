import React from 'react';
import "../../lib/css/email.css";



const schoolinfo=(props)=>{

    return (
        <div className="school_result_view">
            <ul>
                <li onClick={props.onClick}>{props.isSelected} {props.school.school} </li>
                <li>&nbsp;&nbsp;</li>
                <li onClick={props.onClick}>{props.school.address}  </li>
                
                <br/>
            </ul>
        </div>
    );

}


export default schoolinfo;




