import {ApiUrl} from 'constants/apiUrlContant';
import {getToken} from 'utils';
export const editUserInfo = async body => {
  let URL = `http://81.169.173.21:3000/apis/v1${ApiUrl.updateProfile}`;
  let headers = {
    'Content-Type': 'multipart/form-data', // this is a imp line
    Authorization: await getToken(),
    Accept: 'application/json',
  };
  let obj = {
    method: 'POST',
    headers: headers,
    body,
  };
  return fetch(URL, obj)
    .then(resp => {
      let json = null;
      json = resp.json();
      if (resp.ok) {
        return json;
      }
      return json.then(err => {
        throw err;
      });
    })
    .then(json => json);
};
