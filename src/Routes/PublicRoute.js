import {
    // Route,
    Navigate,
    Outlet
} from 'react-router-dom';
import AuthenticationService from '../Business/Services/AuthenticationService/AuthenticationService';

function PublicRoute() {
    const isAuthenticated = AuthenticationService.getToken();
    return (
        !isAuthenticated ? <Outlet /> : <Navigate to="/home" />
    );
}

export default PublicRoute;