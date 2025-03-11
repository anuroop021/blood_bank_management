import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, Activity, Droplets, Heart } from 'lucide-react';
import '../../styles/HomeStyles/HomePage.css';
import '../layouts/Footer.js';
import '../layouts/Header.js';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      val1: 0,
      val2: 0,
      val3: 0,
      val4: 0,
      finalVal1: 0,
      finalVal2: 0,
      finalVal3: 0,
      finalVal4: 0,
      activeDropdown: null,
    };
  }

  componentDidMount() {
    axios.get('http://localhost:5000/api/counts')
      .then((response) => {
        const { donorsRegistered, employeesRegistered, donationsDone, bloodUnitsCollected } = response.data;
        this.setState({
          finalVal1: donorsRegistered,
          finalVal2: employeesRegistered,
          finalVal3: donationsDone,
          finalVal4: bloodUnitsCollected,
        }, () => {
          this.incrementCounts();
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  incrementCounts = () => {
    this.incrementWithDelay('val1', this.state.finalVal1, 50);
    this.incrementWithDelay('val2', this.state.finalVal2, 400);
    this.incrementWithDelay('val3', this.state.finalVal3, 200);
    this.incrementWithDelay('val4', this.state.finalVal4, 200);
  };

  incrementWithDelay = (key, targetValue, delay) => {
    const intervalId = setInterval(() => {
      this.setState((prevState) => {
        if (prevState[key] < targetValue) {
          return { [key]: prevState[key] + 1 };
        } else {
          clearInterval(intervalId);
          return null;
        }
      });
    }, delay);
  };

  handleMouseEnter = (dropdown) => {
    this.setState({ activeDropdown: dropdown });
  };

  handleMouseLeave = () => {
    this.setState({ activeDropdown: null });
  };

  render() {
    const {
      val1: donorsRegistered,
      val2: employeesRegistered,
      val3: donationsDone,
      val4: bloodUnitsCollected,
    } = this.state;

    return (
      <div className="homepage-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1>Give the Gift of Life</h1>
            <p>Every drop counts. Your donation can save up to three lives.</p>
            <Link to="/donor/DonorRegistration">
              <button className="donate-now-btn">Donate Now</button>
            </Link>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="statistics-container">
          <div className="statistic-card">
            <div className="stat-icon">
              <Users size={32} className="icon-users" />
            </div>
            <div className="stat-content">
              <h2>Donors Registered</h2>
              <h1 className="statistic-number">{donorsRegistered}</h1>
            </div>
          </div>
          
          <div className="statistic-card">
            <div className="stat-icon">
              <Activity size={32} className="icon-activity" />
            </div>
            <div className="stat-content">
              <h2>Employees Registered</h2>
              <h1 className="statistic-number">{employeesRegistered}</h1>
            </div>
          </div>
          
          <div className="statistic-card">
            <div className="stat-icon">
              <Droplets size={32} className="icon-droplets" />
            </div>
            <div className="stat-content">
              <h2>Donations Done</h2>
              <h1 className="statistic-number">{donationsDone}</h1>
            </div>
          </div>
          
          <div className="statistic-card">
            <div className="stat-icon">
              <Heart size={32} className="icon-heart" />
            </div>
            <div className="stat-content">
              <h2>Blood Units Collected</h2>
              <h1 className="statistic-number">{bloodUnitsCollected}</h1>
            </div>
          </div>
        </div>

        {/* Blood Type Section */}
        <div className="blood-type-section">
          <div className="blood-type-info">
            <h1>Blood Type Compatibility Guide</h1>
            <div className="table-container">
              <table className="blood-type-table">
                <thead>
                  <tr>
                    <th>Blood Type</th>
                    <th>Can Donate To</th>
                    <th>Can Receive From</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>A+</td>
                    <td>A+, AB+</td>
                    <td>A+, A-, O+, O-</td>
                  </tr>
                  <tr>
                    <td>O+</td>
                    <td>O+, A+, B+, AB+</td>
                    <td>O+, O-</td>
                  </tr>
                  <tr>
                    <td>B+</td>
                    <td>B+, AB+</td>
                    <td>B+, B-, O+, O-</td>
                  </tr>
                  <tr>
                    <td>AB+</td>
                    <td>AB+</td>
                    <td>Everyone</td>
                  </tr>
                  <tr>
                    <td>A-</td>
                    <td>A+, A-, AB+, AB-</td>
                    <td>A-, O-</td>
                  </tr>
                  <tr>
                    <td>O-</td>
                    <td>Everyone</td>
                    <td>O-</td>
                  </tr>
                  <tr>
                    <td>B-</td>
                    <td>B+, B-, AB+, AB-</td>
                    <td>B-, O-</td>
                  </tr>
                  <tr>
                    <td>AB-</td>
                    <td>AB+, AB-</td>
                    <td>AB-, A-, B-, O-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Articles Section */}
        <section className="articles-section">
          <h2>Latest Articles</h2>
          <div className="articles-container">
            <article className="article-card">
              <div className="article-image">
                <img src="https://images.unsplash.com/photo-1615461066841-6116e61058f4" alt="Blood Donation" />
              </div>
              <div className="article-content">
                <h3>Why Blood Donation is Important</h3>
                <p>
                  Blood donation is vital for saving lives. Learn the importance of donating blood
                  and how it can help those in need.
                </p>
                <Link to="/Eligibility" className="read-more">Read More →</Link>
              </div>
            </article>

            <article className="article-card">
              <div className="article-image">
                <img src="https://images.unsplash.com/photo-1579154204601-01588f351e67" alt="Eligibility Check" />
              </div>
              <div className="article-content">
                <h3>Eligibility for Blood Donation</h3>
                <p>
                  Are you eligible to donate blood? Find out the requirements and whether you're 
                  able to contribute to saving lives.
                </p>
                <Link to="/Eligibility" className="read-more">Read More →</Link>
              </div>
            </article>

            <article className="article-card">
              <div className="article-image">
                <img src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b" alt="Donation Process" />
              </div>
              <div className="article-content">
                <h3>How to Prepare for a Blood Donation</h3>
                <p>
                  Donating blood is a simple process. Learn how to prepare for your next blood 
                  donation appointment to ensure a smooth experience.
                </p>
                <Link to="/blog/preparing-for-donation" className="read-more">Read More →</Link>
              </div>
            </article>
          </div>
        </section>

        {/* Motivation Section */}
        <div className="motivation-section">
          <div className="motivation-content">
            <h2>Why Should I Donate Blood?</h2>
            <div className="motivation-text">
              <p>
                Donating blood saves lives by providing essential transfusions for surgeries,
                emergencies, and treating illnesses like cancer. It supports community health,
                medical research, and personal fulfillment, making it a crucial and rewarding act
                of generosity.
              </p>
              <div className="motivation-buttons">
                <button onClick={() => window.location.href='/donor/DonorRegistration'} className="register-btn">
                  Register as Donor
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Become a Hero: Donate Blood</h2>
            <p>Your donation can save a life. Sign up today!</p>
            <Link to="/donor/DonorRegistration">
              <button className="cta-button">Register Now</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  

}
export default HomePage;
