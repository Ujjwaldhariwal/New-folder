const IP1 = import.meta.env.VITE_APP_API_URL;

const RegistrationURL = `${IP1}/userRegistration`;
const Login = `${IP1}/userLogin`;
const GetUserListURL = `${IP1}/getUsers`;
const GetEditProfileURL = `${IP1}/editProfile`;
const UpdateProfileURL = `${IP1}/updateProfile`;


const GetDashboardSLAReportURL = `${IP1}/GetDashboardSLA`;
const GetDisconnectionVsReconnectionURL = `${IP1}/GetDisconnectionVsReconnection`;
const GetCommunicationStatusMeterURL = `${IP1}/GetCommunicationStatusMeter`;
const GetSLAProfileURL = `${IP1}/GetSLAProfile`;




const generateLogURL = `${IP1}/generateLog`;
const GetConnectionStatusReportURL = `${IP1}/GetConnectionStatus`;
const GetPFReportURL = `${IP1}/GetPF`;
const GetConnectionAgingReportURL = `${IP1}/GetDisconnectionAging`;
const comStatusFdrURL = `${IP1}/comStatusFDR`;
const comStatusDtrURL = `${IP1}/comStatusDTR`;
const comStatusConsumerURL = `${IP1}/comStatusCONS`;
const netMeteringConURL = `${IP1}/netMeteringCon`;
const outageCountFdrURL = `${IP1}/outageCountFDR`;
const outageCountDtrURL = `${IP1}/outageCountDTR`;




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
  GetUserListURL,
  generateLogURL,
  GetSLAProfileURL,


  GetCommunicationStatusMeterURL,
  comStatusFdrURL,
  comStatusDtrURL,
  comStatusConsumerURL,
  netMeteringConURL,
  outageCountFdrURL,
  outageCountDtrURL
};
