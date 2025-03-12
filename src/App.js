import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from "react-redux";
import store from "./store"
import AdmLog from './pages/Admin_pages/admin_login';
import AdminDash from './pages/Admin_pages/admin_dash';
import AdminDonDet from './pages/Admin_pages/admin_donor_det';
import AdmEmp from './pages/Admin_pages/admin_emp';
import AdmMed from './pages/Admin_pages/admin_medic';
import AdmHosp from './pages/Admin_pages/admin_hosp';
import AddEmp from './pages/Admin_pages/admin_addemp';
import UpdEmp from './pages/Admin_pages/adm_empupd';
import AddHosp from './pages/Admin_pages/admin_addHosp';
import UpdHosp from './pages/Admin_pages/adm_hospupd';
import AdmAddEmp from './pages/Admin_pages/amin_med_addpg';
import AdmMedUpd from './pages/Admin_pages/admin_med_updpg';
import ProtectedRoute from './components/admin_components/protected_route';

import HospLog from './pages/hospital_pages/hospital_logpg';
import HospMain from './pages/hospital_pages/hosp_mainpg';
import HospReg from './pages/hospital_pages/hospRegpg';
import HospProtectedRoute from './components/hospital/hospProtected';

import Home from './pages/home/home_page';
import Entry from './components/landingPage/Entry';
import DonManage from './pages/Donor_Pages/ManageMyProfile_page';
import DonSched from './pages/Donor_Pages/ScheduleMyAppointment_page';
import DonHist from './pages/Donor_Pages/Donation_hist_page';
import DonReg from './pages/Donor_Pages/DonorReg_page';
import DonLog from './pages/Donor_Pages/DonorLogin_page';
import Eligib from './pages/howtoDonBlood_pages/eligibility_page';
import DonRegDet from './pages/Donor_Pages/DonorRegDetails_page';
import DonProtectedRoute from './components/donor/DonProtectedRoute';

import EmpProtectedRoute from './components/employee_components/emp_protected_route';
import EHome from './pages/employee_pages/employee_home';
import EmployeeLogin from './pages/employee_pages/employee_login';
import EmployeeInstructions from './pages/employee_pages/employee_instructions';
import RecipientPortal from './pages/Donor_Pages/receiveBlood_page';
import IssueFormPage from './pages/employee_pages/issueformpage'
import DonDashboard from './pages/Donor_Pages/DonDashboard';
import FaqPage from './pages/howtoDonBlood_pages/faq_page';

import AssignDoctor from './pages/employee_pages/employee_assigndoctor';

import MedicalProfessionalLogin from './pages/employee_pages/medicalprofessionallogin';
import AssignDonors from './pages/employee_pages/mp_assigneddonors';

import PaymentPage from './components/payment/payment';

class Layout extends Component {
  

  render() {
    return (
      <>
        <Routes>
          <Route path="/" element={<Entry />} />
          <Route path="/home" element={<Home />} />
          <Route path="/donor/DonorProfileManage" element={<DonProtectedRoute><DonManage /></DonProtectedRoute>} />
          <Route path="/donor/DonorProfile" element={<DonProtectedRoute><DonDashboard /></DonProtectedRoute>} />
          <Route path="/donor/receiveBlood" element={<DonProtectedRoute><RecipientPortal/></DonProtectedRoute>} />
          <Route path="/donor/Appointment" element={<DonProtectedRoute><DonSched /></DonProtectedRoute>} />
          <Route path="/donor/DonorHistory" element={<DonHist />} />
          <Route path="/donor/DonorRegistration" element={<DonReg />} />
          <Route path="/donor/DonorLogin" element={<DonLog />} />
          <Route path="/eligibility" element={<Eligib />} />
          <Route path="/donor/DonorRegDetails" element={<DonRegDet />} />
          <Route path="/Faq" element={<FaqPage/>}></Route>

          {/* Admin Routes (Protected) */}
          <Route path="/adminLogin" element={<AdmLog />} />
          <Route path="/Admin/Home" element={<ProtectedRoute><AdminDash /></ProtectedRoute>}/>
          <Route path="/Admin/donorDetails" element={<ProtectedRoute><AdminDonDet /></ProtectedRoute>}/>
          <Route path="/Admin/employeeManage" element={<ProtectedRoute><AdmEmp /></ProtectedRoute>}/>
          <Route path="/Admin/addemp" element={<ProtectedRoute><AddEmp/></ProtectedRoute>}/>
          <Route path="/Admin/addHosp" element={<ProtectedRoute><AddHosp/></ProtectedRoute>}/>
          <Route path="/Admin/MedicManage" element={<ProtectedRoute><AdmMed /></ProtectedRoute>}/>
          <Route path="/Admin/hosp"element={<ProtectedRoute><AdmHosp /></ProtectedRoute>}/>
          <Route path="/Admin/addmed" element={<ProtectedRoute><AdmAddEmp/></ProtectedRoute>}/>
          <Route path="/Admin/medicUpdate/:id"element={<ProtectedRoute><AdmMedUpd /></ProtectedRoute>}/>
          <Route path="/Admin/updateHosp/:id"element={<ProtectedRoute><UpdHosp/></ProtectedRoute>}/>
          <Route path="/Admin/updateemp/:id" element={<ProtectedRoute><UpdEmp /></ProtectedRoute>}/>


          <Route path="/payment"element={<PaymentPage />}/>
          <Route path="/hospital"element={<HospLog />}/>
          <Route path="/hospital/register"element={<HospReg />}/>
          <Route path="/hospital/home"element={<HospProtectedRoute><HospMain /></HospProtectedRoute>}/>
          
          {/* Employee Routes */}
          <Route path="/employee/Home" element={<EmpProtectedRoute><EHome /></EmpProtectedRoute>} />
          
          <Route path="/employeeLogin" element={<EmployeeLogin />} />
          <Route path="/issueform" element={<IssueFormPage />} />
          <Route path="/employee/instructions" element={<EmpProtectedRoute><EmployeeInstructions /></EmpProtectedRoute>} />
          <Route path="/employee/assigndoctor" element={<EmpProtectedRoute><AssignDoctor /></EmpProtectedRoute>} />

          <Route path="/medicalprofessional" element={<MedicalProfessionalLogin />} />
          <Route path="/medicalprofessional/Home" element={<AssignDonors />} />
        </Routes>
      </>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
      <Provider store={store}>
        <Router>
          <Layout />
        </Router>
      </Provider>
      </div>
    );
  }
}

export default App;
