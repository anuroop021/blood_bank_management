import React from 'react';
import '../../styles/AdminStyles/admin.css';
import { Link } from 'react-router-dom';
const api_uri = process.env.REACT_APP_API_URI;

class AdminEmp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
    };
  }

  componentDidMount() {
    this.fetchEmployees();
  }

  fetchEmployees = async () => {
    try {
      const response = await fetch(`${api_uri}/api/employees`); 
      if (response.ok) {
        const data = await response.json();
        this.setState({ employees: data });
      } else {
        console.error('Failed to fetch employees:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  removeEmployee = async (id) => {
    try {
      const response = await fetch(`${api_uri}/api/employees/${id}`, { method: 'DELETE' });
      if (response.ok) {
        this.setState({
          employees: this.state.employees.filter((employee) => employee._id !== id)
        });
      } else {
        console.error('Failed to remove employee:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing employee:', error);
    }
  };

  render() {
    return (
      <>
        <div className="ddiv">
          <table id="donTab">
            <thead>
              <tr>
                <th>Name</th>
                <th>Shift</th>
                <th>Contact Number</th>
                <th>Address</th>
                <th>Email</th>
                <th>Update/Remove</th>
              </tr>
            </thead>
            <tbody>
              {this.state.employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.username}</td>
                  <td>{employee.shift}</td>
                  <td>{employee.contact}</td>
                  <td>{employee.address}</td>
                  <td>{employee.email}</td>
                  <td>
                    <div id='manipul'>
                      <Link className="lin" to={`/Admin/updateemp/${employee._id}`}>
                        <button id="update">Update</button>
                      </Link>
                      <button
                        id="remove"
                        onClick={() => this.removeEmployee(employee._id) }
                        style={{
                        color: 'white',
                        padding: '10px ' ,
                        borderRadius: '1rem',
                      }}
                      >
                     Remove
                     </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='addemp'>
          <Link className='addemplink' to="/Admin/addemp">Add Employee</Link>
        </div>
      </>
    );
  }
}

export default AdminEmp;
