import http from "../../../Headers/http-common";

class AuthenticationService {
    
    Login(userLogin) {
        return http.post("Authentication/Login", userLogin)
            .then(result => {
                localStorage.setItem('token', result.data.Token);
                localStorage.setItem('user', JSON.stringify(result.data.User));
                return result.data;
            });
    }

    autoLogin(userLogin) {
        return http.post("Authentication/Login", userLogin)
            .then(result => {
                localStorage.removeItem('user');
                localStorage.setItem('user', JSON.stringify(result.data.user));
            });
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    getToken() {
        let token= localStorage.getItem('token');
        return token != null ? token : null;
    }
}

export default new AuthenticationService();