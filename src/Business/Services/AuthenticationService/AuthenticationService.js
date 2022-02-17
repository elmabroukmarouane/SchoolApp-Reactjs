import http from "../../../Headers/http-common";
// import { config } from "../../../Configurations/config";
// import * as CryptoJS from 'crypto-js';

class AuthenticationService {

    Login(userLogin) {
        return http.post("Authentication/Login", userLogin)
            .then(result => {
                localStorage.setItem('token', result.data.Token);
                // localStorage.setItem('email', userLogin.email);
                // localStorage.setItem('password', this.encryptPassword(userLogin.password));
                localStorage.setItem('user', JSON.stringify(result.data.User));
                return result.data;
            });
    }

    // autoLogin(userLogin) {
    //     userLogin.password = this.decryptPassword(userLogin.password);
    //     return http.post("Authentication/Login", userLogin)
    //         .then(result => {
    //             localStorage.removeItem('token');
    //             localStorage.removeItem('password');
    //             localStorage.removeItem('user');
    //             localStorage.setItem('token', result.data.Token);
    //             localStorage.setItem('email', userLogin.email);
    //             localStorage.setItem('password', this.encryptPassword(userLogin.password));
    //             localStorage.setItem('user', JSON.stringify(result.data.user));
    //         });
    // }

    logout(id) {
        return http.get("Authentication/Logout", {
            params: {
                id: id
            }
        })
            .then(result => {
                localStorage.removeItem('token');
                // localStorage.removeItem('email');
                // localStorage.removeItem('password');
                localStorage.removeItem('user');
                return result.data;
            });
    }

    // encryptPassword(password) {
    //     return CryptoJS.AES.encrypt(password, config.hashMessage).toString();
    // }

    // decryptPassword(password) {
    //     return CryptoJS.AES.decrypt(password, config.hashMessage).toString(CryptoJS.enc.Utf8);
    // }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    getToken() {
        let token = localStorage.getItem('token');
        return token != null ? token : null;
    }
}

export default new AuthenticationService();