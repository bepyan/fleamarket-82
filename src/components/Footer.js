import React from "react";
import "../lib/css/footer.css";
import "../lib/css/common.css";
import { withRouter } from "react-router-dom";

function Footer() {
    return (
      <div id="footer_wrap" style={{marginTop: "1rem"}}>
        <footer>
          <div id="footer_info_wrap">
            <div className="footer_logo_wrap">
            </div>
            <p>
              <b>팔이피플</b> | (39177) 경북 구미시 대학로 61
              <br />
              <br />
              <b>팔이피플은 통신판매중개자이며 통신판매의 당사자가 아닙니다. <br />
              따라서 팔이피플은 판매자가 등록한 상품, 거래정보 및 거래에
              대하여 책임을 지지 않습니다.</b>
              <br /><br />
              고객 상담 센터 : (054) 478-7114 FAX : (054) 478-7114 E-mail 
              <br />
              <br />
              <br />© PAR2PEOPLE Corp. ALL RIGHTS RESERVED.
            </p>
          </div>
        </footer>
      </div>
    );
}
export default withRouter(Footer);
