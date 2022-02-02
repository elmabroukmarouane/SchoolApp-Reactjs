export default function authHeader() {
    const token = localStorage.getItem('token');

    if (token != null) {
        return {
            "Content-type": "application/json",
            Authorization: 'Bearer ' + token
        };
    } else {
        return {};
    }
}