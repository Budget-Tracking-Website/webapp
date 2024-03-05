import React from "react";
import '../styles/dashboard.css'
const Leftpanel=()=>{
    return(
        // <div className="navigation-links">
            <div className="left-panel">
                <ul className='list'>
                <li><i className="fas fa-receipt"></i> Manage Expense</li>
                <li><i className="fas fa-history"></i> Transaction History</li>
                <li><i className="fas fa-cog"></i> Settings</li>
                </ul>
            {/* </div> */}
        </div>
        
    )
}

export default Leftpanel