import {
    // Route,
    Navigate,
    Outlet
} from 'react-router-dom';
import AuthenticationService from '../Business/Services/AuthenticationService/AuthenticationService';

function PrivateRoute() {
    const isAuthenticated = AuthenticationService.getToken();
    return (
        isAuthenticated ? <Outlet /> : <Navigate to="/login" />
    );
}

export default PrivateRoute;
