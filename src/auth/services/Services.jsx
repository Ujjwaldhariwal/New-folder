import {
  GetEditProfileURL,
  UpdateProfileURL,
  RegistrationURL,
  Login,
  GetUserListURL,
  GetDashboardSLAReportURL,
  GetPFReportURL,
  GetConnectionStatusReportURL,
  GetConnectionAgingReportURL,
  GetDisconnectionVsReconnectionURL,
  GetCommunicationStatusMeterURL,
  GetSLAProfileURL,
} from '../../config/APIs';
import { generateLog } from '../../errorHandling';

const authUserId = import.meta.env.VITE_AUTHUSERID;
const authPassword = import.meta.env.VITE_AUTHPASSWORD;
const authHeader = `Basic ${window.btoa(`${authUserId}:${authPassword}`)}`;

export const UserLogin = async (userID, password) => {
  return fetch(Login, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify(
      {
        mhgj70aizasybty01ob6mfvqoh0fj6rwvjluukcw8mjr04pkjh: `${window.btoa(`${userID}:${password}`)}`,
      }
    ),
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch((err) => {
      // generateLog("Error during login API call", err);
      return err;
    });
};
export const UserRegistration = async (reqData) => {
   
  return fetch(RegistrationURL, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({
      username: reqData?.username,
      password: reqData?.password,
      user_id: reqData?.user_id,
      roleid: reqData?.roleid,
      created_by: reqData?.created_by,
    }),
    headers: new Headers({
      'content-type': 'application/json',
      Authorization: authHeader,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      generateLog('Error during Registration API call', err);
      return err;
    });
};

export const getUserListAPI = async () => {
  return fetch(GetUserListURL, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'content-type': 'application/json',
      Authorization: authHeader,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      // generateLog("Error during get user list API call", err);
      return err;
    });
};

export const searchUserAPI = async (user_id) => {
  return fetch(GetUserListURL, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ user_id: user_id }),
    headers: new Headers({
      'content-type': 'application/json',
      Authorization: authHeader,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      // generateLog("Error during get user list API call", err);
      return err;
    });
};

export const getEditProfileAPI = async (user_id) => {
  return fetch(GetEditProfileURL, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({
      user_id: user_id,
    }),
    headers: new Headers({
      'content-type': 'application/json',
      Authorization: authHeader,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch((err) => {
      // generateLog('Error during get zone API call', err);
      return err;
    });
};

export const updateProfileAPI = async (reqData) => {
  return fetch(UpdateProfileURL, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({
      user_id: reqData?.user_id,
      user_status: reqData?.user_status,
      username: reqData?.name,
      password: reqData?.password,
      menulist: reqData?.menu,
    }),
    headers: new Headers({
      'content-type': 'application/json',
      Authorization: authHeader,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch((err) => {
      // generateLog('Error during get zone API call', err);
      return err;
    });
};

export const getDashboardSLAReport = async (slaprofile) => {
  return fetch(GetDashboardSLAReportURL, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ sla_profile: slaprofile }),
    headers: new Headers({
      'content-type': 'application/json',
      Authorization: authHeader,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err;
    });
};

export const getPFReport = async () => {
  return fetch(GetPFReportURL, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'content-type': 'application/json',
      Authorization: authHeader,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err;
    });
};

export const getConnectionStatusReport = async () => {
  return fetch(GetConnectionStatusReportURL, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'content-type': 'application/json',
      Authorization: authHeader,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err;
    });
};

export const getConnectionAgingReport = async () => {
  return fetch(GetConnectionAgingReportURL, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'content-type': 'application/json',
      Authorization: authHeader,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err;
    });
};

export const GetDisconnectionReconnectionReport = async () => {
  return fetch(GetDisconnectionVsReconnectionURL, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'content-type': 'application/json',
      Authorization: authHeader,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err;
    });
};

export const GetCommunicationStatusMeterReport = async () => {
  return fetch(GetCommunicationStatusMeterURL, {
    method: 'POST',
    mode: 'cors',
     body: JSON.stringify({}),
    headers: new Headers({
      'content-type': 'application/json',
      Authorization: authHeader,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err;
    });
};

export const GetSLAProfile = async () => {
  return fetch(GetSLAProfileURL, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'content-type': 'application/json',
      Authorization: authHeader,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err;
    });
};
