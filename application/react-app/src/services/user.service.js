import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/';

class UserService {
    getPublicContent() {
        return axios.get(API_URL + 'all');
    }

    getUserBoard() {
        return axios.get(API_URL + 'user', { headers: authHeader() });
    }

    getSchools() {
        return axios.get(API_URL + 'getSchools', { headers: authHeader() })
    }

    checkIamASchool(address) {
        return axios.post(API_URL + "canimint", {address});
    }

    getSchool(address) {
        return axios.post(API_URL + "getSchool", {address});
    }

    encryptMetadata(metadata) {
        return axios.post(API_URL + "encryptMetadata", {metadata})
    }
}

export default new UserService();
