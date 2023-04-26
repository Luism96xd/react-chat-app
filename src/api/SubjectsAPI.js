import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const SubjectAPI = {
  async getAll() {
    return await axios.get(BASE_URL + '/subjects/');
  },
  async get(id) {
    return await axios.get(BASE_URL + `/subjects/${id}`);
  },
  async create(subject) {
    return await axios.post(BASE_URL + '/subjects/', subject);
  },
  async update(subject) {
    return await axios.put(BASE_URL + `/subjects/${subject.id}/`, subject);
  },
  async delete(id) {
    return await axios.delete(BASE_URL + `/subjects/${id}/`);
  }
}

export default SubjectAPI;