import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/AdminStyles/admin.css';
const api_uri = process.env.REACT_APP_API_URI;

const AdminMedManUpd = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [medic, setMedic] = React.useState({
    username: '',
    contactNumber: '',
    role: '',
    email: '',
  });

  React.useEffect(() => {
    fetchMedicData(id);
  }, [id]);

  const fetchMedicData = async (id) => {
    try {
      const response = await fetch(`${api_uri}/api/medics/${id}`);
      if (response.ok) {
        const data = await response.json();
        setMedic({
          username: data.username,
          contactNumber: data.contactNumber,
          role: data.role,
          email: data.email,
        });
      } else {
        console.error('Failed to fetch medic:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching medic:', error);
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setMedic((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${api_uri}/api/medics/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medic),
      });
      if (response.ok) {
        alert('Medic updated successfully!');
        navigate('/Admin/medicManage'); 
      } else {
        console.error('Failed to update medic:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating medic:', error);
    }
  };

  return (
    <div className="udiv">
      <form id="updempForm" onSubmit={handleSubmit}>
        <label htmlFor="username">Update Full Name</label><br />
        <input id="username" type="text" value={medic.username} onChange={handleChange} /><br /><br />
        
        <label htmlFor="contactNumber">Update Contact Number</label><br />
        <input id="contactNumber" type="text" value={medic.contactNumber} onChange={handleChange} /><br /><br />

        <label htmlFor="role">Update Role</label><br />
        <select id="role" value={medic.role} onChange={handleChange}>
          <option value="Doctor">Doctor</option>
          <option value="Nurse">Nurse</option>
        </select><br /><br />

        <label htmlFor="email">Update Email</label><br />
        <input id="email" type="email" value={medic.email} onChange={handleChange} /><br /><br />
        
        <input id="sub" type="submit" value="Update" />
      </form>
    </div>
  );
};

export default AdminMedManUpd;
