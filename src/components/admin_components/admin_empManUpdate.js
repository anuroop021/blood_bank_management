import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/AdminStyles/admin.css';
const api_uri = process.env.REACT_APP_API_URI;

const AdminEmpManUpd = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [employee, setEmployee] = React.useState({
    username: '',
    contact: '',
    shift: '',
    email: '',
    address: ''
  });

  React.useEffect(() => {
    fetchEmployeeData(id);
  }, [id]);

  const fetchEmployeeData = async (id) => {
    try {
      const response = await fetch(`${api_uri}/api/employees/${id}`);
      if (response.ok) {
        const data = await response.json();
        setEmployee({
          username: data.username,
          contact: data.contact,
          shift: data.shift,
          email: data.email,
          address: data.address
        });
      } else {
        console.error('Failed to fetch employee:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setEmployee((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${api_uri}/api/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee)
      });
      if (response.ok) {
        alert('Employee updated successfully!');
        navigate('/Admin/employeeManage'); 
      } else {
        console.error('Failed to update employee:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  return (
    <div className="udiv">
      <form id="updempForm" onSubmit={handleSubmit}>
        <label htmlFor="username">Update Full Name</label><br />
        <input id="username" type="text"  value={employee.username} onChange={handleChange}  /><br /><br />
        
        <label htmlFor="contact">Update Contact Number</label><br />
        <input id="contact" type="text" value={employee.contact} onChange={handleChange}  /><br /><br />
        
        <label htmlFor="shift">Update Shift</label><br />
        <select id="shift" value={employee.shift} onChange={handleChange} >
          <option value="">Select a shift</option>
          <option value="9:00 AM - 5:00 PM">9:00 AM - 5:00 PM</option>
          <option value="1:00 PM - 9:00 PM">1:00 PM - 9:00 PM</option>
          <option value="10:00 PM - 6:00 AM">10:00 PM - 6:00 AM</option>
        </select><br /><br />
        
        <label htmlFor="email">Update Email</label><br />
        <input id="email" type="email" value={employee.email} onChange={handleChange}  /><br /><br />
        
        <label htmlFor="address">Update Address</label><br />
        <textarea id="address" value={employee.address} onChange={handleChange}  /><br /><br />

        <input id="sub" type="submit" value="Update" />
      </form>
    </div>
  );
};

export default AdminEmpManUpd;
