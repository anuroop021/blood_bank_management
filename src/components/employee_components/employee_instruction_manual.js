import React from 'react';
import '../../styles/employee_styles/employee_instructions.css';

class Text extends React.Component {
    render() {
        return (
            <>
                {/* manual_Section 1: Compliance with Regulatory Bodies */}
                <div id="manual_section1" className="manual_section">
                    <h2>Compliance with Regulatory Bodies</h2>
                    <p>
                        Blood bank employees must comply with national and regional regulations.  
                        **Key Regulatory Bodies in India:**
                    </p>
                    <ul>
                        <li><strong>CDSCO</strong>: Regulates blood banks under the Drugs and Cosmetics Act (1940).</li>
                        <li><strong>National Blood Policy (2002)</strong>: Provides guidelines for donation, testing, and storage.</li>
                        <li><strong>NACO</strong>: Oversees blood testing for transfusion-transmissible infections (TTIs).</li>
                        <li><strong>State Drug Authorities</strong>: Enforce regulations at the state level.</li>
                    </ul>

                    <p><strong>Steps to Ensure Compliance:</strong></p>
                    <ul>
                        <li>Understand and follow relevant regulations.</li>
                        <li>Obtain & renew necessary licenses.</li>
                        <li>Adhere to Standard Operating Procedures (SOPs).</li>
                        <li>Participate in inspections by CDSCO and state authorities.</li>
                        <li>Stay updated through training and professional development.</li>
                    </ul>

                    {/* Donor Screening */}
                    <h3>Donor Screening & Eligibility</h3>
                    <p>Ensuring donor eligibility is crucial for donor & recipient safety.</p>
                    <ul>
                        <li><strong>Health Assessment:</strong>  
                            <ul>
                                <li>Age: 18 to 65 years, Weight: ≥50 kg</li>
                                <li>Hemoglobin: ≥12.5 g/dl</li>
                            </ul>
                        </li>
                        <li><strong>Medical History:</strong>  
                            <ul>
                                <li>Questionnaire: Recent surgeries, chronic diseases, infections.</li>
                                <li>Risk Factors: Travel, sexual behavior, drug use.</li>
                            </ul>
                        </li>
                        <li><strong>Physical Examination:</strong>  
                            <ul>
                                <li>Vital signs: Blood pressure, pulse, temperature.</li>
                            </ul>
                        </li>
                        <li><strong>Informed Consent:</strong>  
                            <ul>
                                <li>Explain donation process & risks.</li>
                                <li>Obtain written consent before proceeding.</li>
                            </ul>
                        </li>
                    </ul>

                    {/* Blood Collection & Handling */}
                    <h3>Blood Collection & Handling</h3>
                    <p>Critical for ensuring the safety & integrity of the blood supply.</p>
                </div>

                {/* manual_Section 2: Concept of Time */}
                <div id="manual_section2" className="manual_section">
                    <h2>The Concept of Time</h2>
                    <p>
                        Time has been perceived in various ways:  
                        <ul>
                            <li>As a linear progression from past to future.</li>
                            <li>As a cyclical phenomenon repeating in loops.</li>
                            <li>As an illusion—a construct of human perception.</li>
                        </ul>
                        <strong>Scientific Perspective:</strong>  
                        <ul>
                            <li>In physics, time is linked to space, forming the fabric of the universe.</li>
                            <li>Einstein’s Theory of Relativity shows time can bend & stretch due to speed & gravity.</li>
                            <li>Time dilation: Time appears to slow down or speed up depending on the observer.</li>
                        </ul>
                    </p>
                </div>

                {/* manual_Section 3: Additional Perspectives on Time */}
                <div id="manual_section3" className="manual_section">
                    <h2>Philosophical & Scientific Views on Time</h2>
                    <p>
                        Across cultures & disciplines, time remains a subject of deep exploration.  
                        <ul>
                            <li>Philosophers, scientists, and theologians provide different interpretations.</li>
                            <li>Some view time as a fundamental reality, others as an illusion.</li>
                            <li>Modern physics continues to uncover how time interacts with the universe.</li>
                        </ul>
                    </p>
                </div>
            </>
        );
    }
}

export default Text;
