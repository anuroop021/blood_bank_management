import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/HomeStyles/Entry.css'; 

const Entry = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/home');
  };

  return (
    <div className="cover-unique">
      <main className="main-content-unique">
        <section className="heading-unique">
          <h1>
            <span className="text-part-1">Donate</span>
            <span className="circle-unique">Blood</span>
            <span className="text-part-2">Save Lives</span>
          </h1>
          <hr className="heading-line-unique" />
        </section>
        <section className="content-unique">
          <p className="welcome-message-unique">
            Welcome to the Blood Donation Management System. Join us in saving lives 
            by becoming a donor or managing blood donations efficiently. Your contribution matters.
          </p>
        </section>
        <button className="button-action-unique" onClick={handleGetStarted}>
          <i className="fas fa-arrow-right"></i>
        </button>
      </main>
    </div>
  );
}

export default Entry;
