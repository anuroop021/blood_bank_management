import React, { Component } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link, Navigate } from "react-router-dom";
import '../../styles/donorStyles/DonorRegistration.css';
const api_uri = process.env.REACT_APP_API_URI;

class DonorRegDetails extends Component {
  constructor(props) {
    super(props);
    const { username, password } = this.props.location.state || {};

    this.state = {
      username: username || "",
      password: password || "",
      fname: "",
      lname: "",
      email: "",
      gender: "",
      age: "",
      phone: "",
      bloodGroup: "",
      address: "",
      idType: "",
      idNumber: "",
      idDocument: null,
      errorMessage: "",
      successMessage: "",
      isRegistered: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    console.log(`Field ${e.target.name} updated: ${e.target.value}`);
  };

  handleFileChange = (e) => {
    this.setState({ idDocument: e.target.files[0] });
  };

  handleIdTypeChange = (e) => {
    this.setState({ idType: e.target.value });
    console.log(`ID Type selected: ${e.target.value}`);
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, fname, lname, email, gender, age, phone, bloodGroup, address, idType, idNumber, idDocument } = this.state;
  
    if (!fname || !lname || !email || !gender || !age || !phone || !bloodGroup || !address || !idType || !idNumber || !idDocument) {
      console.log("Some fields are missing!");
      this.setState({ errorMessage: "Please fill out all fields." });
      return;
    }
  
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("fname", fname);
    formData.append("lname", lname);
    formData.append("email", email);
    formData.append("gender", gender);
    formData.append("age", age);
    formData.append("phone", phone);
    formData.append("bloodGroup", bloodGroup);
    formData.append("address", address);
    formData.append("idType", idType);
    formData.append("idNumber", idNumber);
    formData.append("idDocument", idDocument); // Append the file
  
    try {
      const response = await axios.post(`${api_uri}/api/donor/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Important!
      });
  
      console.log("Registration successful:", response.data);
  
      this.setState({
        successMessage: "Registration completed successfully!",
        errorMessage: "",
        isRegistered: true, 
      });
    } catch (error) {
      console.error("Error during registration:", error.response?.data?.message || error.message);
      this.setState({
        errorMessage: error.response?.data?.message || "Error during registration.",
        successMessage: "",
      });
    }
  };
  

  render() {
    const { fname, lname, email, gender, age, phone, bloodGroup, address, idType, idNumber, errorMessage, successMessage, isRegistered } = this.state;

    return (
      <div className="donor-reg-details-container">
        <h2>Complete Your Registration</h2>
        {errorMessage && <p className="donor-reg-details-error">{errorMessage}</p>}
        {successMessage && <p className="donor-reg-details-success">{successMessage}</p>}
        {isRegistered && <Navigate to="/donor/DonorLogin" replace={true} />}

        <form className="donor-reg-details-form" onSubmit={this.handleSubmit}>
          <div className="donor-reg-details-group">
            <label htmlFor="donor-fname">First Name:</label>
            <input
              type="text"
              id="donor-fname"
              name="fname"
              value={fname}
              onChange={this.handleChange}
              required
            />
          </div>

          <div className="donor-reg-details-group">
            <label htmlFor="donor-lname">Last Name:</label>
            <input
              type="text"
              id="donor-lname"
              name="lname"
              value={lname}
              onChange={this.handleChange}
              required
            />
          </div>

          <div className="donor-reg-details-group">
            <label htmlFor="donor-email">Email:</label>
            <input
              type="email"
              id="donor-email"
              name="email"
              value={email}
              onChange={this.handleChange}
              required
            />
          </div>

          <div className="donor-reg-details-group">
            <label htmlFor="donor-gender">Gender:</label>
            <select
              name="gender"
              id="donor-gender"
              value={gender}
              onChange={this.handleChange}
              required
            >
              <option disabled value="">
                -- Select gender --
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div className="donor-reg-details-group">
            <label htmlFor="donor-age">Age:</label>
            <input
              type="number"
              id="donor-age"
              name="age"
              value={age}
              min="18"
              max="65"
              onChange={this.handleChange}
              required
            />
          </div>

          <div className="donor-reg-details-group">
            <label htmlFor="donor-phone">Mobile Number:</label>
            <input
              type="tel"
              id="donor-phone"
              name="phone"
              value={phone}
              pattern="[0-9]{10}"
              onChange={this.handleChange}
              required
            />
          </div>

          <div className="donor-reg-details-group">
            <label htmlFor="donor-blood-group">Blood Group:</label>
            <select
              name="bloodGroup"
              id="donor-blood-group"
              value={bloodGroup}
              onChange={this.handleChange}
              required
            >
              <option disabled value="">
                -- Select a blood group --
              </option>
              <option value="A+Ve">A+Ve</option>
              <option value="A-Ve">A-Ve</option>
              <option value="B+Ve">B+Ve</option>
              <option value="B-Ve">B-Ve</option>
              <option value="O+Ve">O+Ve</option>
              <option value="O-Ve">O-Ve</option>
              <option value="AB+Ve">AB+Ve</option>
              <option value="AB-Ve">AB-Ve</option>
            </select>
          </div>

          <div className="donor-reg-details-group">
            <label htmlFor="donor-address">Address:</label>
            <textarea
              name="address"
              id="donor-address"
              cols="30"
              rows="5"
              value={address}
              onChange={this.handleChange}
              required
            ></textarea>
          </div>

          <div className="donor-reg-details-group">
            <label htmlFor="donor-id-type">Government ID type:</label>
            <select
              name="idType"
              id="donor-id-type"
              value={idType}
              onChange={this.handleIdTypeChange}
              required
            >
              <option disabled value="">
                -- Select a government ID --
              </option>
              <option value="Aadhar">Aadhar</option>
              <option value="Driving License">Driving License</option>
              <option value="PAN">PAN</option>
              <option value="Passport">Passport</option>
              <option value="Voter ID">Voter ID</option>
            </select>
          </div>

          {idType && (
            <>
            <div className="donor-reg-details-group">
              <label htmlFor="donor-id-number">Government ID number:</label>
              <input
                type="text"
                id="donor-id-number"
                name="idNumber"
                value={idNumber}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="donor-reg-details-group">
                <label htmlFor="donor-id-document">Upload ID Document:</label>
                <input type="file" id="donor-id-document" name="idDocument" onChange={this.handleFileChange} required />
              </div></>
          )}

          <input className="donor-reg-details-submit" type="submit" value="Submit" />
        </form>

        <p className="donor-reg-details-login-link">
          Already registered? <Link to="/donor/DonorLogin">Login</Link>
        </p>
      </div>
    );
  }
}

function DonorRegDetailsWrapper(props) {
  const location = useLocation();
  const navigate = useNavigate();

  return <DonorRegDetails {...props} location={location} navigate={navigate} />;
}

export default DonorRegDetailsWrapper;
