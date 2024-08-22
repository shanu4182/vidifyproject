import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

 function ProfileScreen() {
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
    };

    return (
        <div>
            <h1>Profile</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
export default ProfileScreen