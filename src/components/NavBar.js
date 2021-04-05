import React, { useState } from 'react';
import { Link } from "react-router-dom";

function NavBar() {

    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);

    return (
        <>
            <nav className="NavBar">
                <div className="NavBar-container">
                    <Link to="/" className="NavBar-logo">
                        Lucky Draw
                    </Link>
                    <div className="menu-icon" onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavBar
