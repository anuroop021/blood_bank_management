import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/AdminStyles/admin.css';
const api_uri = process.env.REACT_APP_API_URI;

const AdminHospManUpd = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [hospital, sethospital] = React.useState({
    username: '',
    contact: '',
    shift: '',
    email: '',
    address: ''
  });

  React.useEffect(() => {
    fetchhospitalData(id);
  }, [id]);

  const fetchhospitalData = async (id) => {
    try {
      const response = await fetch(`${api_uri}/api/hospital/update/${id}`);
      if (response.ok) {
        const data = await response.json();
        sethospital({
          username: data.username,
          contact: data.contact,
          shift: data.shift,
          email: data.email,
          address: data.address
        });
      } else {
        console.error('Failed to fetch hospital:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching hospital:', error);
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    sethospital((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${api_uri}/api/hospitals/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(hospital)
      });
      if (response.ok) {
        alert('hospital updated successfully!');
        navigate('/Admin/hosp'); 
      } else {
        console.error('Failed to update hospital:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating hospital:', error);
    }
  };

  return (
    <div className="udiv">
      <form id="updempForm" onSubmit={handleSubmit}>
        <label htmlFor="username">Update Full Name</label><br />
        <input id="username" type="text"  value={hospital.username} onChange={handleChange}  /><br /><br />
        
        <label htmlFor="contact">Update Contact Number</label><br />
        <input id="contact" type="text" value={hospital.contact} onChange={handleChange}  /><br /><br />
        
        <label htmlFor="shift">Update Shift</label><br />
        <select id="shift" value={hospital.shift} onChange={handleChange} >
          <option value="">Select a shift</option>
          <option value="9:00 AM - 5:00 PM">9:00 AM - 5:00 PM</option>
          <option value="1:00 PM - 9:00 PM">1:00 PM - 9:00 PM</option>
          <option value="10:00 PM - 6:00 AM">10:00 PM - 6:00 AM</option>
        </select><br /><br />
        
        <label htmlFor="email">Update Email</label><br />
        <input id="email" type="email" value={hospital.email} onChange={handleChange}  /><br /><br />
        
        <label htmlFor="address">Update Address</label><br />
        <textarea id="address" value={hospital.address} onChange={handleChange}  /><br /><br />

        <input id="sub" type="submit" value="Update" />
      </form>
    </div>
  );
};

export default AdminHospManUpd;
