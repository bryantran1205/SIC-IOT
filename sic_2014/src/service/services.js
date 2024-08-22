import axios from 'axios';

export const callAPi = (method, host, body, headers = {}) => {
  return new Promise(async (resolve, reject) => {
    try {

      const response = await axios({
        method: method,
        url: host,
        data: body,
        headers: headers, 
        withCredentials: true 
      });
      resolve(response.data);
    } catch (error) {
      resolve({
        status: false,
        code: 255,
        message: error.message 
      });
    }
  });
};