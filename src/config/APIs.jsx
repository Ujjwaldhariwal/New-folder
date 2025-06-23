const IP1 = import.meta.env.VITE_APP_API_URL;

const RegistrationURL = `${IP1}/userRegistration`;
const Login = `${IP1}/userLogin`;


const GetUserListURL = `${IP1}/getUsers`;
const GetEditProfileURL = `${IP1}/editProfile`;
const UpdateProfileURL = `${IP1}/updateProfile`;
const GetDashboardSLAReportURL = `${IP1}/GetDashboardSLA`;
const GetPFReportURL = `${IP1}/GetPF`;
const GetConnectionStatusReportURL = `${IP1}/GetConnectionStatus`;
const GetConnectionAgingReportURL = `${IP1}/GetDisconnectionAging`;
const GetDisconnectionVsReconnectionURL = `${IP1}/GetDisconnectionVsReconnection`;
const GetCommunicationStatusMeterURL = `${IP1}/GetCommunicationStatusMeter`;
const GetSLAProfileURL = `${IP1}/GetSLAProfile`;
const generateLogURL = `${IP1}/generateLog`;


export {
  Login,
  RegistrationURL,
  GetEditProfileURL,
  UpdateProfileURL,
  GetDashboardSLAReportURL,
  GetPFReportURL,
  GetConnectionStatusReportURL,
  GetConnectionAgingReportURL,
  GetDisconnectionVsReconnectionURL,
  GetCommunicationStatusMeterURL,
  GetUserListURL,
  generateLogURL,
  GetSLAProfileURL,
};
