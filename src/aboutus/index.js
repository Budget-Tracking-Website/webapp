import React from 'react';
import './aboutus.css'
import Anika from '../assets/anika.png'
import Ananya from '../assets/ananya.jpg'
import Sakshi from '../assets/sakshi.jpg'
import Mission from '../assets/mission1.webp'

function AaskPage() {
    return (
        <div>
            <div className='main1'>
                <section>
                    <h1> ABOUT US</h1><br /><br />
                    <p>At AASK, we understand that managing finances as a student can be daunting. From tuition fees and textbooks to rent and groceries, the financial responsibilities can quickly pile up. That's why we've made it our mission to provide innovative solutions that empower students to take control of their finances with confidence and ease.</p>
                </section>
                <hr />
                <section className="mission">
                    <div className="left">
                        <h4>Our Mission</h4><br /><br />
                        <p>Our mission at AASK is clear: to empower college students to achieve financial success. We believe that every student deserves access to the tools and resources they need to manage their finances effectively, regardless of their background or financial literacy.</p>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <img src={Mission} height="200" width="300" alt="Mission" />
                    </div>
                </section>
                <hr />
                <section>
                    <div>
                        <h4>Our Team</h4><br /><br />
                        <p>Behind AASK is a dedicated team of passionate individuals who are committed to making a difference in the lives of college students.</p>
                    </div>
                </section>
                <div className="Team">
                    <div className="us">
                        <img src={Anika} height="200" width="200" alt="Anika" />
                        <p>Anika Jha</p>
                    </div>
                    <div className="us">
                        <img src={Ananya} height="200" width="200" alt="Ananya" />
                        <p>Ananya Ahuja</p>
                    </div>
                    <div className="us">
                        <img src={Sakshi} height="200" width="200" alt="Sakshi" />
                        <p>Sakshi Chauhan</p>
                    </div>
                    <div className="us">
                        <img src={Anika} height="200" width="200" alt="Kaushiki" />
                        <p>Kaushiki Sharma</p>
                    </div>
                </div>
                <hr />
                <section>
                    <h4>Contact Us</h4>
                </section>
            </div>
            <footer>
                <p>&#64;AASK</p>
            </footer>
        </div>
    );
}

export default AaskPage;
