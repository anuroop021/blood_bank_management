import React from'react';
import logo from '../../logo.png';
import {Link} from 'react-router-dom';
import '../../styles/AdminStyles/Admin_header.css';


class AdminHeader extends React.Component {
  render(){
    return(
      <div id="maindiv">
        <div className='logocont'>
          <img alt="logo" src={logo} id="logoa" width={256} height={168}></img>
        </div>
        <div>
        <Link className="navi" id="adminHome" to="/Admin/Home">
            Home
        </Link>
        </div>
        <div>
        <Link className="navi" id="donorDet" to="/Admin/donorDetails">
            Donor details
        </Link>
        </div>
        <div>
        <Link className="navi" id="employeeDet" to="/Admin/employeeManage">
            Employee Management
        </Link>
        </div>
        
        <div>
        <Link className="navi" id="bdreserve" to="/Admin/MedicManage">
            Medical Professional
        </Link>
        </div>
        <div>
        <Link className="navi" id="hosp" to="/Admin/hosp">
            Hospital management
        </Link>
        </div>
        
        
      </div>
    )
  }
}

export default AdminHeader;
