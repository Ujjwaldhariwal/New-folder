import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { Grid, Card, Container } from '@mui/material';
import { ClipLoader } from 'react-spinners';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import CustomBarChart from '../../components/customChart/CustomBarChart';
import './dashboardAppPage.css';
import {
  GetCommunicationStatusMeterReport,
  GetDisconnectionReconnectionReport,
  getConnectionAgingReport,
  getConnectionStatusReport,
  getDashboardSLAReport,
  getPFReport,
  GetSLAProfile,
} from '../../auth/services/Services';
import CustomDoubleBarChart from '../../components/customChart/CustomDoubleBarChart';
import CustomPieChartNew from '../../components/customChart/CustomPieChart_New';
import CustomBarChartWithMultiAxis from '../../components/customChart/CustomBarChartWithMultiAxis';
import RadialBarChart from '../../components/customChart/RadialBarChart';
import SemiCircleChart from '../../components/customChart/SemiCircleChart';

const pf_colors = ['#ff5700', '#009ffd', '#344bfe', '#00d7b4', '#17d1d1', '#000'];
const colors = ['#ff5700', '#009ffd', '#344bfe', '#00d7b4', '#17d1d1'];
const pf_keys = 'count(9)';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function DashboardAppPage() {
  const [isLoading, setIsLoading] = useState(false);

  // ---------------------------------------------------------------------
  // #region Billing SLA
  const [billingSLAList, setBillingSLAList] = useState([
    {
      months: '12-2024',
      sla: 'Billing',
      package: 'All PKG',
      sla_target: '99.50',
      sla_achieved: '95.86',
      max_value: '100',
    },
    {
      months: '11-2024',
      sla: 'Billing',
      package: 'All PKG',
      sla_target: '99.50',
      sla_achieved: '94.83',
      max_value: '100',
    },
    {
      months: '10-2024',
      sla: 'Billing',
      package: 'All PKG',
      sla_target: '99.50',
      sla_achieved: '93.86',
      max_value: '100',
    },
  ]);
  const [dailySLAList, setDailySLAList] = useState([
    {
      months: '12-2024',
      sla: 'Daily',
      package: 'All PKG',
      sla_target: '99.00',
      sla_achieved: '93.43',
      max_value: '100',
    },
    {
      months: '11-2024',
      sla: 'Daily',
      package: 'All PKG',
      sla_target: '99.00',
      sla_achieved: '94.76',
      max_value: '100',
    },
    {
      months: '10-2024',
      sla: 'Daily',
      package: 'All PKG',
      sla_target: '99.00',
      sla_achieved: '95.50',
      max_value: '100',
    },
  ]);
  const [availabilitySLAList, setAvailabilitySLAList] = useState([
    {
      months: '12-2024',
      sla: 'Availibility',
      package: 'All PKG',
      sla_target: '99.50',
      sla_achieved: '95.72',
      max_value: '100',
    },
    {
      months: '11-2024',
      sla: 'Availibility',
      package: 'All PKG',
      sla_target: '99.50',
      sla_achieved: '93.64',
      max_value: '100',
    },
    {
      months: '10-2024',
      sla: 'Availibility',
      package: 'All PKG',
      sla_target: '99.50',
      sla_achieved: '92.75',
      max_value: '100',
    },
  ]);
  const [powerLostList, setPowerLostList] = useState([
    {
      months: '12-2023',
      sla: 'Meter Loss and Restoration of Power',
      package: 'All PKG',
      sla_target: 60,
      sla_achieved: '65.44',
      max_value: '100',
    },
    {
      months: '11-2023',
      sla: 'Meter Loss and Restoration of Power',
      package: 'All PKG',
      sla_target: 60,
      sla_achieved: '63.61',
      max_value: '100',
    },
    {
      months: '10-2023',
      sla: 'Meter Loss and Restoration of Power',
      package: 'All PKG',
      sla_target: 60,
      sla_achieved: '59.68',
      max_value: '100',
    },
  ]);
  const [blockSLAList, setBlockSLAList] = useState([
    {
      months: '12-2024',
      sla: 'Block-12-Hrs',
      sla_achieved_8hrs: '99.40',
      sla_target_8hrs: 99,
      sla_achieved_12hrs: '99.42',
      sla_target_12hrs: 99,
    },
    {
      months: '11-2024',
      sla: 'Block-12-Hrs',
      sla_achieved_8hrs: '99.40',
      sla_target_8hrs: 99,
      sla_achieved_12hrs: '99.41',
      sla_target_12hrs: 99,
    },
    {
      months: '10-2024',
      sla: 'Block-12-Hrs',
      sla_achieved_8hrs: '99.09',
      sla_target_8hrs: 99,
      sla_achieved_12hrs: '99.11',
      sla_target_12hrs: 99,
    },
  ]);
  const [DCDRSlaList, setDCDRSlaList] = useState([
    {
      months: '12-2024',
      sla: 'RC/DC-15 MINUTES',
      sla_achieved_6hrs: '99.97',
      sla_target_6hrs: '99.90',
      sla_achieved_15min: '99.22',
      sla_target_15min: 99,
    },
    {
      months: '11-2024',
      sla: 'RC/DC-15 MINUTES',
      sla_achieved_6hrs: '99.92',
      sla_target_6hrs: '99.90',
      sla_achieved_15min: '99.50',
      sla_target_15min: 99,
    },
    {
      months: '10-2024',
      sla: 'RC/DC-15 MINUTES',
      sla_achieved_6hrs: '99.93',
      sla_target_6hrs: '99.90',
      sla_achieved_15min: '98.82',
      sla_target_15min: 99,
    },
  ]);

  const [lowBillVal, setLowBillVal] = useState(0);
  const [lowDailyVal, setLowDailyVal] = useState(0);
  const [lowBlockVal, setLowBlockVal] = useState(0);
  const [lowAvilVal, setLowAvailVal] = useState(0);
  const [lowDCDRVal, setLowDCDRVal] = useState(0);
  const [lowPowerLostVal, setLowPowerLostVal] = useState(0);

  const [IsBillingSLALoading, setIsBillingSLALoading] = useState(false);
  const [IsDailySLALoading, setIsDailySLALoading] = useState(false);
  const [IsAvailabilitySLALoading, setIsAvailabilitySLALoading] = useState(false);
  const [IsBlockSLALoading, setIsBlockSLALoading] = useState(false);
  const [IsDCRCSLALoading, setIsDCRCSLALoading] = useState(false);
  const [IsPowerLostSLALoading, setIsPowerLostSLALoading] = useState(false);

  const GetBillingSLA = () => {
    setIsBillingSLALoading(true);
    toast.dismiss();
    getDashboardSLAReport(['Billing'])
      .then((res) => {
        if (res?.status === true) {
          const _data = res.data;
          // ------------------------
          // get lowest Val
          if (_data?.length > 0) {
            const lowest_sla_Achieved = _data.reduce((min, current) => {
              return current.sla_achieved < min ? current.sla_achieved : min;
            }, _data[0].sla_achieved);

            const lowest_sla_target = _data.reduce((min, current) => {
              return current.sla_target < min ? current.sla_target : min;
            }, _data[0].sla_target);

            let lowest = Math.min(parseInt(lowest_sla_Achieved), parseInt(lowest_sla_target));

            if (lowest >= 100) {
              setLowBillVal(parseInt(90));
            } else {
              setLowBillVal(parseInt(lowest) - 1);
            }
          }

          const formatedData = _data?.map((val) => {
            let _sla_achieved = val.sla_achieved;
            if (_sla_achieved - parseInt(_sla_achieved) > 0) {
              val.sla_achieved = _sla_achieved.toFixed(2);
            }
            let _sla_target = val.sla_target;
            if (_sla_target - parseInt(_sla_target) > 0) {
              val.sla_target = _sla_target.toFixed(2);
            }

            return val;
          });

          // setBillingSLAList(formatedData);
        } else {
          // setBillingSLAList([]);
          toast.dismiss();
          // toast.error(res.message);
        }
        setIsBillingSLALoading(false);
      })
      .catch((err) => {
        setIsBillingSLALoading(false);
        toast.dismiss();
        toast.error(err);
      });
  };

  const GetDailySLA = () => {
    setIsDailySLALoading(true);
    toast.dismiss();
    getDashboardSLAReport(['Daily'])
      .then((res) => {
        if (res?.status === true) {
          const _data = res.data;

          // ------------------------
          // get lowest Val
          if (_data?.length > 0) {
            const lowest_sla_Achieved = _data.reduce((min, current) => {
              return current.sla_achieved < min ? current.sla_achieved : min;
            }, _data[0].sla_achieved);

            const lowest_sla_target = _data.reduce((min, current) => {
              return current.sla_target < min ? current.sla_target : min;
            }, _data[0].sla_target);

            let lowest = Math.min(parseInt(lowest_sla_Achieved), parseInt(lowest_sla_target));

            if (lowest >= 100) {
              setLowDailyVal(parseInt(90));
            } else {
              setLowDailyVal(parseInt(lowest) - 1);
            }
          }
          const formatedData = _data?.map((val) => {
            let _sla_achieved = val.sla_achieved;
            if (_sla_achieved - parseInt(_sla_achieved) > 0) {
              val.sla_achieved = _sla_achieved.toFixed(2);
            }
            let _sla_target = val.sla_target;
            if (_sla_target - parseInt(_sla_target) > 0) {
              val.sla_target = _sla_target.toFixed(2);
            }

            return val;
          });

          // setDailySLAList(formatedData);
        } else {
          // setDailySLAList([]);
          toast.dismiss();
          // toast.error(res.message);
        }
        setIsDailySLALoading(false);
      })
      .catch((err) => {
        setIsDailySLALoading(false);
        toast.dismiss();
        toast.error(err);
      });
  };

  const GetBlockProfileSLA = () => {
    setIsBlockSLALoading(true);
    toast.dismiss();
    getDashboardSLAReport(['Block-8-Hrs', 'Block-12-Hrs'])
      .then((res) => {
        if (res?.status === true) {
          const _data = res.data;

          const _months = _data?.map((val) => val.months);

          let uniqueMonth = _months?.filter((value, index, self) => {
            return self.indexOf(value) === index;
          });

          let _blockProfileList = [];
          for (let mon of uniqueMonth) {
            let setVal = {};
            const blockObject = _data.filter((val) => val.months == mon);

            if (blockObject && blockObject.length > 0) {
              setVal.months = mon;
              for (let block of blockObject) {
                let _sla_achieved = block.sla_achieved;
                if (_sla_achieved - parseInt(_sla_achieved) > 0) {
                  _sla_achieved = _sla_achieved.toFixed(2);
                }
                let _sla_target = block.sla_target;
                if (_sla_target - parseInt(_sla_target) > 0) {
                  _sla_target = _sla_target.toFixed(2);
                }

                setVal.sla = block.sla;
                if (block.sla == 'Block-8-Hrs') {
                  setVal.sla_achieved_8hrs = _sla_achieved;
                  setVal.sla_target_8hrs = _sla_target;
                } else if (block.sla == 'Block-12-Hrs') {
                  setVal.sla_achieved_12hrs = _sla_achieved;
                  setVal.sla_target_12hrs = _sla_target;
                }
              }
              _blockProfileList.push(setVal);
            }
          }

          // ------------------------
          // get lowest Val
          if (_data?.length > 0) {
            const lowestSlaAchieved_8hrs = _blockProfileList.reduce((min, current) => {
              return current.sla_achieved_8hrs < min ? current.sla_achieved_8hrs : min;
            }, _blockProfileList[0].sla_achieved_8hrs);

            const lowestSlaAchieved_12hrs = _blockProfileList.reduce((min, current) => {
              return current.sla_achieved_12hrs < min ? current.sla_achieved_12hrs : min;
            }, _blockProfileList[0].sla_achieved_12hrs);

            const lowest_sla_target_8hrs = _blockProfileList.reduce((min, current) => {
              return current.sla_target_8hrs < min ? current.sla_target_8hrs : min;
            }, _blockProfileList[0].sla_target_8hrs);

            const lowest_sla_target_12hrs = _blockProfileList.reduce((min, current) => {
              return current.sla_target_12hrs < min ? current.sla_target_12hrs : min;
            }, _blockProfileList[0].sla_target_12hrs);

            const lowest = Math.min(
              parseInt(lowestSlaAchieved_8hrs),
              parseInt(lowestSlaAchieved_12hrs),
              parseInt(lowest_sla_target_8hrs),
              parseInt(lowest_sla_target_12hrs)
            );

            setLowBlockVal(parseInt(lowest) - 1);
          }

          // setBlockSLAList(_blockProfileList);
        } else {
          // setBlockSLAList([]);
          toast.dismiss();
          // toast.error(res.message);
        }
        setIsBlockSLALoading(false);
      })
      .catch((err) => {
        setIsBlockSLALoading(false);
        toast.dismiss();
        toast.error(err);
      });
  };

  const GetAvailabilitySLA = () => {
    setIsAvailabilitySLALoading(true);
    toast.dismiss();
    getDashboardSLAReport(['Availibility'])
      .then((res) => {
        if (res?.status === true) {
          const _data = res.data;

          // ------------------------
          // get lowest Val
          if (_data?.length > 0) {
            const lowest_sla_Achieved = _data.reduce((min, current) => {
              return current.sla_achieved < min ? current.sla_achieved : min;
            }, _data[0].sla_achieved);

            const lowest_sla_target = _data.reduce((min, current) => {
              return current.sla_target < min ? current.sla_target : min;
            }, _data[0].sla_target);

            let lowest = Math.min(parseInt(lowest_sla_Achieved), parseInt(lowest_sla_target));

            if (lowest >= 100) {
              setLowAvailVal(parseInt(90));
            } else {
              setLowAvailVal(parseInt(lowest) - 1);
            }
          }
          const formatedData = _data?.map((val) => {
            let _sla_achieved = val.sla_achieved;
            if (_sla_achieved - parseInt(_sla_achieved) > 0) {
              val.sla_achieved = _sla_achieved.toFixed(2);
            }

            let _sla_target = val.sla_target;
            if (_sla_target - parseInt(_sla_target) > 0) {
              val.sla_target = _sla_target.toFixed(2);
            }

            return val;
          });
          // setAvailabilitySLAList(formatedData);
        } else {
          // setAvailabilitySLAList([]);
          toast.dismiss();
          // toast.error(res.message);
        }
        setIsAvailabilitySLALoading(false);
      })
      .catch((err) => {
        setIsAvailabilitySLALoading(false);
        toast.dismiss();
        toast.error(err);
      });
  };

  const GetDCDRSLA = () => {
    setIsDCRCSLALoading(true);
    toast.dismiss();
    getDashboardSLAReport(['RC/DC - 6 HOURS', 'RC/DC-15 MINUTES'])
      .then((res) => {
        if (res?.status === true) {
          const _data = res.data;

          const _months = _data?.map((val) => val.months);

          let uniqueMonth = _months?.filter((value, index, self) => {
            return self.indexOf(value) === index;
          });

          let _dcdrList = [];
          for (let mon of uniqueMonth) {
            let setVal = {};
            const dcdrObject = _data.filter((val) => val.months == mon);

            if (dcdrObject && dcdrObject.length > 0) {
              setVal.months = mon;
              for (let dcdr of dcdrObject) {
                let _sla_achieved = dcdr.sla_achieved;
                if (_sla_achieved - parseInt(_sla_achieved) > 0) {
                  _sla_achieved = _sla_achieved.toFixed(2);
                }
                let _sla_target = dcdr.sla_target;
                if (_sla_target - parseInt(_sla_target) > 0) {
                  _sla_target = _sla_target.toFixed(2);
                }

                setVal.sla = dcdr.sla;
                if (dcdr.sla == 'RC/DC-15 MINUTES') {
                  setVal.sla_achieved_15min = _sla_achieved;
                  setVal.sla_target_15min = _sla_target;
                } else if (dcdr.sla == 'RC/DC - 6 HOURS') {
                  setVal.sla_achieved_6hrs = _sla_achieved;
                  setVal.sla_target_6hrs = _sla_target;
                }
              }
              _dcdrList.push(setVal);
            }
          }

          // ------------------------
          // get lowest Val
          if (_data?.length > 0) {
            const lowest_sla_Achieved_15min = _dcdrList.reduce((min, current) => {
              return current.sla_achieved_15min < min ? current.sla_achieved_15min : min;
            }, _dcdrList[0].sla_achieved_15min);

            const lowest_sla_Achieved_6hrs = _dcdrList.reduce((min, current) => {
              return current.sla_achieved_6hrs < min ? current.sla_achieved_6hrs : min;
            }, _dcdrList[0].sla_achieved_6hrs);

            const lowest_sla_target_15min = _dcdrList.reduce((min, current) => {
              return current.sla_target_15min < min ? current.sla_target_15min : min;
            }, _dcdrList[0].sla_target_15min);

            const lowest_sla_target_6hrs = _dcdrList.reduce((min, current) => {
              return current.sla_target_6hrs < min ? current.sla_target_6hrs : min;
            }, _dcdrList[0].sla_target_6hrs);

            const lowest = Math.min(
              parseInt(lowest_sla_Achieved_15min),
              parseInt(lowest_sla_Achieved_6hrs),
              parseInt(lowest_sla_target_15min),
              parseInt(lowest_sla_target_6hrs)
            );

            setLowDCDRVal(parseInt(lowest) - 1);
          }

          // setDCDRSlaList(_dcdrList);
        } else {
          // setDCDRSlaList([]);
          toast.dismiss();
          // toast.error(res.message);
        }
        setIsDCRCSLALoading(false);
      })
      .catch((err) => {
        setIsDCRCSLALoading(false);
        toast.dismiss();
        toast.error(err);
      });
  };

  const GetPowerLostSLA = () => {
    setIsPowerLostSLALoading(true);
    toast.dismiss();
    getDashboardSLAReport(['Meter Loss and Restoration of Power'])
      .then((res) => {
        if (res?.status === true) {
          const _data = res.data;

          // ------------------------
          // get lowest Val
          if (_data?.length > 0) {
            const lowest_sla_Achieved = _data.reduce((min, current) => {
              return current.sla_achieved < min ? current.sla_achieved : min;
            }, _data[0].sla_achieved);

            const lowest_sla_target = _data.reduce((min, current) => {
              return current.sla_target < min ? current.sla_target : min;
            }, _data[0].sla_target);

            let lowest = Math.min(parseInt(lowest_sla_Achieved), parseInt(lowest_sla_target));

            if (lowest >= 100) {
              setLowPowerLostVal(parseInt(90));
            } else {
              setLowPowerLostVal(parseInt(lowest) - 1);
            }
          }
          const formatedData = _data?.map((val) => {
            let _sla_achieved = val.sla_achieved;
            if (_sla_achieved - parseInt(_sla_achieved) > 0) {
              val.sla_achieved = _sla_achieved.toFixed(2);
            }
            let _sla_target = val.sla_target;
            if (_sla_target - parseInt(_sla_target) > 0) {
              val.sla_target = _sla_target.toFixed(2);
            }

            return val;
          });
          // setPowerLostList(formatedData);
        } else {
          // setPowerLostList([]);
          toast.dismiss();
          // toast.error(res.message);
        }
        setIsPowerLostSLALoading(false);
      })
      .catch((err) => {
        setIsPowerLostSLALoading(false);
        toast.dismiss();
        // toast.error(err);
      });
  };

  //#endregion
  // ---------------------------------------------------------------------
  // #region Connection Status

  const [connectionStatusList, setConnectionStatusList] = useState([]);
  const [connectedValue, setConnectedValue] = useState('');
  const [disconnectedValue, setDisconnectedValue] = useState('');

  const [communicationStatusList, setCommunicationStatusList] = useState([]);
  const [CommunicateVal, setCommunicateVal] = useState('');
  const [NonCommunicateVal, setNonCommunicateVal] = useState('');
  const [AllVal, setAllVal] = useState(0);

  const GetConnectionStatusReport = () => {
    toast.dismiss();
    setIsLoading(true);
    getConnectionStatusReport()
      .then((res) => {
        if (res?.status === true) {
          const _actData = res.data;
          // const totalValue = _actData?.reduce((preVal, entry) => preVal + entry[pf_keys], 0);
          setConnectedValue(_actData[0].conn_comm);
          setDisconnectedValue(_actData[0].disconn_comm);
          // const _data = _actData?.map((val) => {
          //   if (val.bo_status_cd?.trim() == 'CONN-COMM') {
          //     val.bo_status_cd = 'Connected';
          //   } else if (val.bo_status_cd?.trim() == 'DISCONN-COMM') {
          //     val.bo_status_cd = 'Disconnected';
          //   }
          //   const percentage = `${((val[pf_keys] / totalValue) * 100).toFixed(0)}`;
          //   val.percentage = percentage;
          //   return val;
          // });
          setConnectionStatusList(_actData);
        } else {
          setConnectionStatusList([]);
          setConnectedValue(0);
          setDisconnectedValue(0);
          toast.error(res.message);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err);
      });
  };

  const GetCommunicationStatusMeter = () => {
    toast.dismiss();
    setIsLoading(true);
    GetCommunicationStatusMeterReport()
      .then((res) => {
        let _commList = [];
        if (res?.status === true) {
          const _actData = res.data;
          if (_actData && _actData?.length > 0) {
            setAllVal(_actData[0].communicating);
            setCommunicateVal(_actData[0].communicating);
            setNonCommunicateVal(_actData[0].non_communicating);
            // setCommunicateVal(parseInt(_actData[0].all_mdm_meters) - parseInt(_actData[0].non_comm_meters));
            // setNonCommunicateVal(_actData[0].non_comm_meters);

            // _commList.push({
            //   phase: 'Communicated',
            //   count: parseInt(_actData[0].all_mdm_meters) - parseInt(_actData[0].non_comm_meters),
            // });
            // _commList.push({ phase: 'Non Communicated', count: _actData[0].non_comm_meters });
            //
          } else {
            setAllVal(0);
            setCommunicateVal(0);
            setNonCommunicateVal(0);

            _commList.push({ phase: 'Communicated', count: 0 });
            _commList.push({ phase: 'Non Communicated', count: 0 });
          }

          setCommunicationStatusList(_commList);
        } else {
          _commList.push({ phase: 'Communicated', count: 0 });
          _commList.push({ phase: 'Non Communicated', count: 0 });

          setCommunicationStatusList(_commList);
          setAllVal(0);
          setCommunicateVal(0);
          setNonCommunicateVal(0);
          toast.error(res.message);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err);
      });
  };

  //#endregion
  // ---------------------------------------------------------------------
  // #region Disconnection vs Reconnection
  const [DcRcList, setDcRcList] = useState([]);
  const [isDCRCLoading, setIsDCRCLoading] = useState(false);

  // const GetDisconnectionReconnectionList = () => {
  //   toast.dismiss();
  //   setIsDCRCLoading(true);
  //   GetDisconnectionReconnectionReport()
  //     .then((res) => {
  //       if (res?.status === true) {
  //         const _actData = res.data;
  //         _actData.forEach((item) => {
  //           if (item.dc_count === null) {
  //             item.dc_count = 0;
  //           }

  //           // const [day, month, year] = item.rc_dc_date.split('-');
  //           // item.rc_dc_date = `${day}-${month}-${year}`;
  //         });

  //         // -----------------------
  //         // get unique date list
  //         // const _DateList = _data?.map((val) => val.rc_dc_date);
  //         // let _uniqueDateList = _DateList?.filter((value, index, self) => {
  //         //   return self.indexOf(value) === index;
  //         // });

  //         // let _dcdrList = [];

  //         // for (let date of _uniqueDateList) {
  //         //   let setVal = {};
  //         //   const findObject = _data.filter((val) => val.rc_dc_date == date);

  //         //   setVal.dates = date;
  //         //   setVal.dc_count = 0;
  //         //   setVal.rc_count = 0;

  //         //   for (let item of findObject) {
  //         //     if (item.activity_type == 'RC') {
  //         //       setVal.rc_count = item.transaction_count;
  //         //     } else if (item.activity_type == 'DC') {
  //         //       setVal.dc_count = item.transaction_count;
  //         //     }
  //         //   }
  //         //   _dcdrList.push(setVal);
  //         // }
  //         const last15DaysData = _actData.slice(-15);
  //         setDcRcList(last15DaysData);
  //         // setDcRcList(_actData);
  //         console.log(_actData);
  //       } else {
  //         setDcRcList([]);
  //         // toast.error(res.message);
  //       }
  //       setIsDCRCLoading(false);
  //     })
  //     .catch((err) => {
  //       setIsDCRCLoading(false);
  //       // toast.error(err);
  //     });
  // };

  const GetDisconnectionReconnectionList = () => {
    toast.dismiss();
    setIsDCRCLoading(true);

    GetDisconnectionReconnectionReport()
      .then((res) => {
        if (res?.status === true) {
          const rawData = res.data || [];
          // console.log(rawData);

          rawData.forEach((item) => {
            if (item.dc_count === null) item.dc_count = 0;
            if (item.rc_count === null) item.rc_count = 0;
          });

          // Map existing data by date for fast lookup
          const dataMap = new Map();
          rawData.forEach((item) => {
            dataMap.set(item.rc_dc_date, item);
          });

          // Build the last 15 days array (ascending)
          const last15DaysData = [];
          for (let i = 14; i >= 0; i--) {
            const date = dayjs().subtract(i, 'day').format('DD-MM-YYYY');
            if (dataMap.has(date)) {
              last15DaysData.push(dataMap.get(date));
            } else {
              last15DaysData.push({
                rc_dc_date: date,
                rc_count: 0,
                dc_count: 0,
              });
            }
          }

          setDcRcList(last15DaysData);
        } else {
          setDcRcList([]);
          // toast.error(res.message);
        }
        setIsDCRCLoading(false);
      })
      .catch((err) => {
        setIsDCRCLoading(false);
        // toast.error(err);
      });
  };

  //#endregion

  // ---------------------------------------------------------------------
  //#region PF Report
  const [pfList, setPFList] = useState([]);
  const [IsPFLoading, setIsPFLoading] = useState(false);

  const GetPFReport = () => {
    toast.dismiss();
    setIsPFLoading(true);
    getPFReport()
      .then((res) => {
        if (res?.status === true) {
          const _actData = res.data;
          const totalValue = _actData?.reduce((preVal, entry) => preVal + entry[pf_keys], 0);
          const _data = _actData?.map((val) => {
            const percentage = `${((val[pf_keys] / totalValue) * 100).toFixed(0)}`;
            val.percentage = percentage;
            return val;
          });

          // -----------------------------------------------
          // changing order of data in List
          const orderList = ['Greater than 0.9', 'Between 0.7 and 0.9', 'Between 0.5 and 0.7', 'Less than 0.5'];
          let rearrangedList = [];

          orderList.forEach((name) => {
            const foundItemIndex = _data?.findIndex((item) => item.pf_cat === name);
            if (foundItemIndex !== -1) {
              rearrangedList.push(_data[foundItemIndex]);
              _data?.splice(foundItemIndex, 1);
            }
          });

          rearrangedList = rearrangedList.concat(_data);
          // -----------------------------------------------

          setPFList(rearrangedList);
        } else {
          setPFList([]);
          toast.error(res.message);
        }
        setIsPFLoading(false);
      })
      .catch((err) => {
        setIsPFLoading(false);
        toast.error(err);
      });
  };
  //#endregion

  // ---------------------------------------------------------------------
  //#region DisconnectionAging
  const [connectionAgingList, setConnectionAgingList] = useState([]);
  const [IsDisAgingLoading, setIsDisAgingLoading] = useState(false);

  const GetDisconnectionAgingReport = () => {
    setIsDisAgingLoading(true);

    getConnectionAgingReport()
      .then((res) => {
        if (res?.status === true) {
          const _actData = res.data;
          const totalValue = _actData?.reduce((preVal, entry) => preVal + entry[pf_keys], 0);
          const _data = _actData?.map((val) => {
            const percentage = `${((val[pf_keys] / totalValue) * 100).toFixed(0)}`;
            val.percentage = percentage;
            return val;
          });

          // -----------------------------------------------
          // changing order of data in List
          const orderList = ['30+ days', '15–30 days', '7–15 days', '2–7 days', 'Since yesterday'];

          let rearrangedList = [];

          orderList.forEach((name) => {
            const foundItemIndex = _data?.findIndex((item) => item.disconnected_since === name);
            if (foundItemIndex !== -1) {
              rearrangedList.push(_data[foundItemIndex]);
              _data?.splice(foundItemIndex, 1);
            }
          });

          rearrangedList = rearrangedList.concat(_data);

          // -----------------------------------------------

          setConnectionAgingList(rearrangedList);
        } else {
          setConnectionAgingList([]);
          // toast.error(res.message);
        }
        setIsDisAgingLoading(false);
      })
      .catch((err) => {
        setIsDisAgingLoading(false);
        toast.error(err);
      });
  };
  //#endregion

  //#region SLA Profile
  const [SLAProfileList, setSLAProfileList] = useState([]);
  const [lowestSLAProfile, setLowestSLAProfile] = useState(0);
  const [IsSLAProfileLoading, setIsSLAProfileLoading] = useState(false);

  const GetSLAProfileList = () => {
    setIsSLAProfileLoading(true);
    toast.dismiss();

    GetSLAProfile()
      .then((res) => {
        if (res?.status === true) {
          const _data = res.data;
          // ------------------------
          // get lowest Val

          if (_data?.length > 0) {
            const lowest_sla_Achieved = _data.reduce((min, current) => {
              return current.sla_achieved < min ? current.sla_achieved : min;
            }, _data[0].sla_achieved);

            const lowest_sla_target = _data.reduce((min, current) => {
              return current.sla_target < min ? current.sla_target : min;
            }, _data[0].sla_target);

            let lowest = Math.min(parseInt(lowest_sla_Achieved), parseInt(lowest_sla_target));

            if (lowest >= 100) {
              setLowestSLAProfile(parseInt(90));
            } else {
              setLowestSLAProfile(parseInt(lowest) - 10);
            }
          }

          const formatedData = _data?.map((val) => {
            // ------------------------
            // Change Date Formate
            let _month = val.months;
            let forDate = dayjs(_month, 'MM-YYYY').format('YYYY-MM');
            //change dayjs(_month,'MM-YYYY') when data will be currect in db
            val.months = forDate;

            // ------------------------
            // Round Decimal Val

            let _sla_achieved = val.sla_achieved;
            if (_sla_achieved - parseInt(_sla_achieved) > 0) {
              val.sla_achieved = _sla_achieved.toFixed(2);
            }
            let _sla_target = val.sla_target;
            if (_sla_target - parseInt(_sla_target) > 0) {
              val.sla_target = _sla_target.toFixed(2);
            }

            return val;
          });
          setSLAProfileList(formatedData);
        } else {
          setSLAProfileList([]);
          toast.dismiss();
          // toast.error(res.message);
        }
        setIsSLAProfileLoading(false);
      })
      .catch((err) => {
        setIsSLAProfileLoading(false);
        toast.dismiss();
        toast.error(err);
      });
  };

  //#endregion

  // ---------------------------------------------------------------------
  // Common
  useEffect(() => {
    // GetBillingSLA();
    // GetDailySLA();
    // GetBlockProfileSLA();
    // GetAvailabilitySLA();
    // GetDCDRSLA();
    // GetPowerLostSLA();
    GetConnectionStatusReport();
    GetCommunicationStatusMeter();
    GetDisconnectionReconnectionList();
    GetPFReport();
    GetDisconnectionAgingReport();
    // GetSLAProfileList();
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | BOSCH </title>
      </Helmet>

      <Container className="container">
        <Grid container spacing={1} columns={{ xs: 12, md: 12, lg: 12 }}>
          <Grid item xs={12} lg={8}>
            <Card className="customDashboardCardbg">
              <div className="px-4 pt-8 pb-4 overflow-auto" style={{ height: '320px' }}>
                {/* <div className="customCardHeader">Dashboard</div> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2 lg:gap-6 justify-items-center">
                  <RadialBarChart
                    label="Connected"
                    subject="Connected"
                    seriesData={connectedValue ? connectedValue : 0}
                    progessbarColor="#35b53a"
                    innerCircleColor="#e1fbd6"
                  />
                  <RadialBarChart
                    label="Disconnected"
                    subject="Disconnected"
                    seriesData={disconnectedValue ? disconnectedValue : 0}
                    // seriesData={disconnectedValue ? disconnectedValue : "0"}
                    progessbarColor="#fc4365"
                    innerCircleColor="#ffe5d4"
                  />
                  <RadialBarChart
                    label="Communication"
                    subject="Comm.."
                    seriesData={CommunicateVal ? CommunicateVal : 0}
                    progessbarColor="#5c59e8"
                    innerCircleColor="#d8e9f9"
                  />
                  <RadialBarChart
                    label="Non Communication"
                    subject="Non Comm.."
                    seriesData={NonCommunicateVal ? NonCommunicateVal : 0}
                    progessbarColor="#ffc301"
                    innerCircleColor="#fcefdc"
                  />
                </div>
              </div>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card className="customDashboardCardbg">
              <div style={{ height: '320px' }}>
                <p className="customChartHead">RC Profile SLA</p>
                <div>
                  {IsDCRCSLALoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '240px' }}>
                      <ClipLoader size={50} color={'var(--secondary-color)'} loading={IsDCRCSLALoading} />
                    </div>
                  ) : (
                    <CustomDoubleBarChart
                      data={DCDRSlaList}
                      xAxisDataKey={'months'}
                      barDataKey1={'sla_achieved_15min'}
                      barDataKey2={'sla_achieved_6hrs'}
                      lineDataKey1={'sla_target_15min'}
                      lineDataKey2={'sla_target_6hrs'}
                      LegendName1={'Achieved (15 Min)'}
                      LegendName2={'Achieved (6 Hrs)'}
                      LineLegendName1={'Target (15 Min)'}
                      LineLegendName2={'Target (6 Hrs)'}
                      minYAixsVal={lowDCDRVal}
                      chartTopPadding={35}
                      title={''}
                      xAxis_dyTick={30}
                      xAxisAgnle={-50}
                      chartHeight={280}
                      legendTop={35}
                      barSize={10}
                      legendBottom={2}
                      isShowBarLabel={false}
                      applyTickFormatter={true}
                      addExtraHeight={false}
                    />
                  )}
                </div>
              </div>
            </Card>
          </Grid>

          <Grid item xs={12} lg={8}>
            <Card className="customDashboardCardbg">
              <div style={{ height: '305px' }}>
                <div
                  className="mt-3 mx-3"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <div className="flex justify-center items-center text-cardHeader font-semibold">
                    <span className="inline-block rounded-full w-4 h-4 mr-2 bg-[#3f3ae1]"></span>
                    Reconnected
                  </div>
                  <div className="flex justify-center items-center text-cardHeader font-semibold ml-3">
                    <span className="inline-block rounded-full w-4 h-4 mr-2 bg-[#f25404]"></span>
                    Disconnected
                  </div>
                </div>
                <div>
                  {isDCRCLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '280px' }}>
                      <ClipLoader size={50} color={'var(--secondary-color)'} loading={isDCRCLoading} />
                    </div>
                  ) : (
                    <CustomDoubleBarChart
                      data={DcRcList}
                      isShowLegend={false}
                      xAxisDataKey={'rc_dc_date'}
                      barDataKey1={'rc_count'}
                      barDataKey2={'dc_count'}
                      LegendName1={'Reconnected'}
                      LegendName2={'Disconnected'}
                      showLabelList={false}
                      title={''}
                      xAxisAgnle={-50}
                      xAxisOffset={-5}
                      unit=""
                      chartBottomPadding={50}
                      maxYAxisVal={9}
                      chartHeight={275}
                      xAxis_dyTick={40}
                      xAxis_dxTick={-12}
                      legendBottom={'auto'}
                      barSize={10}
                      barLabelAngle={-70}
                      barLabelDX={5}
                      barLabelDY={-9}
                      chartTopPadding={35}
                      isShowLineChart={false}
                      displayLegend={true}
                    />
                  )}
                </div>
              </div>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card className="customDashboardCardbg">
              <div className="px-4 py-3" style={{ height: '320px' }}>
                <p className="customCardHeader">Billing Profile SLA</p>
                <p className="text-gray-400 text-sm">This Quarter</p>
                <div>
                  <SemiCircleChart label="+12" seriesData="100" progessbarColor="#5c59e8" innerCircleColor="#fcefdc" />
                </div>
              </div>
            </Card>
          </Grid>

          <Grid item xs={12} lg={3}>
            <Card className="customDashboardCardbg">
              <div>
                <div>
                  {IsBillingSLALoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '280px' }}>
                      <ClipLoader size={50} color={'var(--secondary-color)'} loading={IsBillingSLALoading} />
                    </div>
                  ) : (
                    <CustomBarChart
                      data={billingSLAList}
                      xAxisDataKey={'months'}
                      barDataKey={'sla_achieved'}
                      minYAixsVal={90}
                      maxYAixsVal={'auto'}
                      lineDataKey={'sla_target'}
                      LineLegendName={'SLA Target'}
                      title={'Billing Profile SLA 1'}
                      LegendName={'SLA Achieved'}
                      yAxisLabel={'Percentage'}
                      barSize={7}
                      chartHeight={270}
                      shadowDatakey={'max_value'}
                      showTick={false}
                      displayLegend={true}
                    />
                  )}
                </div>
              </div>
            </Card>
          </Grid>

          <Grid item xs={12} lg={3}>
            <Card className="customDashboardCardbg">
              <div>
                <div>
                  {IsDailySLALoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '280px' }}>
                      <ClipLoader size={50} color={'var(--secondary-color)'} loading={IsDailySLALoading} />
                    </div>
                  ) : (
                    <CustomBarChart
                      data={dailySLAList}
                      xAxisDataKey={'months'}
                      barDataKey={'sla_achieved'}
                      minYAixsVal={90}
                      maxYAixsVal={'auto'}
                      lineDataKey={'sla_target'}
                      LineLegendName={'SLA Target'}
                      title={'Daily Profile SLA'}
                      LegendName={'SLA Achieved'}
                      yAxisLabel={'Percentage'}
                      barSize={7}
                      chartHeight={270}
                      barLabelDY={-10}
                      shadowDatakey={'max_value'}
                      showTick={false}
                      displayLegend={true}
                    />
                  )}
                </div>
              </div>
            </Card>
          </Grid>

          <Grid item xs={12} lg={3}>
            <Card className="customDashboardCardbg">
              <div>
                <div>
                  {IsAvailabilitySLALoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '280px' }}>
                      <ClipLoader size={50} color={'var(--secondary-color)'} loading={IsAvailabilitySLALoading} />
                    </div>
                  ) : (
                    <CustomBarChart
                      data={availabilitySLAList}
                      barSize={7}
                      xAxisDataKey={'months'}
                      barDataKey={'sla_achieved'}
                      minYAixsVal={90}
                      maxYAixsVal={'auto'}
                      lineDataKey={'sla_target'}
                      LineLegendName={'SLA Target'}
                      title={'System Availability SLA'}
                      LegendName={'SLA Achieved'}
                      yAxisLabel={'Percentage'}
                      chartHeight={270}
                      shadowDatakey={'max_value'}
                      showTick={false}
                      displayLegend={true}
                    />
                  )}
                </div>
              </div>
            </Card>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Card className="customDashboardCardbg">
              <div>
                <div>
                  {IsPowerLostSLALoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '280px' }}>
                      <ClipLoader size={50} color={'var(--secondary-color)'} loading={IsPowerLostSLALoading} />
                    </div>
                  ) : (
                    <CustomBarChart
                      data={powerLostList}
                      barSize={7}
                      xAxisDataKey={'months'}
                      barDataKey={'sla_achieved'}
                      minYAixsVal={90}
                      maxYAixsVal={'auto'}
                      lineDataKey={'sla_target'}
                      LegendName={'SLA Achieved'}
                      LineLegendName={'SLA Target'}
                      title={'Power Lost & Restoration SLA'}
                      yAxisLabel={'Percentage'}
                      chartHeight={270}
                      shadowDatakey={'max_value'}
                      showTick={false}
                      displayLegend={true}
                    />
                  )}
                </div>
              </div>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card className="customDashboardCardbg">
              <div>
                <p className="customChartHead">PF</p>
                <div>
                  {IsPFLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '240px' }}>
                      <ClipLoader size={50} color={'var(--secondary-color)'} loading={IsPFLoading} />
                    </div>
                  ) : (
                    <Grid container columns={{ xs: 12, md: 12, lg: 12 }} style={{ alignItems: 'center' }}>
                      <Grid item xs={11.5} lg={6}>
                        <div style={{ padding: '0px 0px 0px 25px' }}>
                          <ul style={{ listStyle: 'none' }}>
                            {pfList.map((entry, index) => (
                              <li key={`item-${index}`} style={{ marginTop: '5px', marginBottom: '3px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <svg width="20" height="15" style={{ marginRight: '7px' }}>
                                    <circle cx="7" cy="7" r="7" fill={pf_colors[index]} />
                                  </svg>
                                  <span
                                    className={IsPFLoading ? '' : 'write-text'}
                                    style={{
                                      color: pf_colors[index],
                                      fontSize: 'small',
                                      fontFamily: 'sans-serif',
                                      display: 'inline-block',
                                      overflow: 'hidden',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {entry?.pf_cat}
                                  </span>
                                  <span
                                    style={{
                                      color: pf_colors[index],
                                      fontSize: 'small',
                                      fontFamily: 'cursive',
                                      marginLeft: '10px',
                                    }}
                                  >{`${entry[pf_keys]}`}</span>
                                </div>
                                <hr
                                  style={{
                                    width: '100%',
                                    borderBottom: '1px solid var(--secondary-border-color)',
                                    margin: '0.8rem 0 0.8rem 0',
                                    opacity: 0.9,
                                  }}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Grid>
                      <Grid item xs={12} lg={6} style={{ height: '240px' }}>
                        <CustomPieChartNew
                          key={'pf_pie_chart'}
                          data={pfList}
                          pieDataKey={'count(9)'}
                          pieNameKey={'pf_cat'}
                          chartHeight={240}
                          radius={70}
                          colors={pf_colors}
                        />
                      </Grid>
                    </Grid>
                  )}
                </div>
              </div>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card className="customDashboardCardbg">
              <div>
                <p className="customChartHead">Disconnection1 Aging </p>
                <div>
                  {IsDisAgingLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '240px' }}>
                      <ClipLoader size={50} color={'var(--secondary-color)'} loading={IsDisAgingLoading} />
                    </div>
                  ) : (
                    <Grid container columns={{ xs: 12, md: 12, lg: 12 }} style={{ alignItems: 'center' }}>
                      <Grid item xs={11.5} lg={6}>
                        <div style={{ padding: '10px 0px 0px 25px' }}>
                          <ul style={{ listStyle: 'none' }}>
                            {connectionAgingList?.map((entry, index) => (
                              <li key={`item-${index}`} style={{ marginTop: '5px', marginBottom: '3px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <svg width="20" height="15" style={{ marginRight: '7px' }}>
                                    <circle cx="7" cy="7" r="7" fill={colors[index]} />
                                  </svg>
                                  <span
                                    className={IsDisAgingLoading ? '' : 'write-text'}
                                    style={{
                                      color: colors[index],
                                      fontSize: 'small',
                                      fontFamily: 'sans-serif',
                                      display: 'inline-block',
                                      overflow: 'hidden',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {entry?.disconnected_since}
                                  </span>
                                  <span
                                    style={{
                                      color: colors[index],
                                      fontSize: 'small',
                                      fontFamily: 'cursive',
                                      marginLeft: '10px',
                                    }}
                                  >{`${entry[pf_keys]}`}</span>
                                </div>
                                <hr
                                  style={{
                                    width: '100%',
                                    borderBottom: '1px solid var(--secondary-border-color)',
                                    margin: '0.8rem 0 0.8rem 0',
                                    opacity: 0.9,
                                  }}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Grid>
                      <Grid item xs={12} lg={6} style={{ height: '240px' }}>
                        <CustomPieChartNew
                          key={'disconnectionaging_pie_chart'}
                          data={connectionAgingList}
                          pieDataKey={'count(9)'}
                          pieNameKey={'disconnected_since'}
                          chartHeight={240}
                          radius={70}
                          colors={colors}
                        />
                      </Grid>
                    </Grid>
                  )}
                </div>
              </div>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card className="customDashboardCardbg">
              <div style={{ height: '350px' }}>
                <p className="customChartHead">Block Profile SLA</p>
                <div>
                  {IsBlockSLALoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '240px' }}>
                      <ClipLoader size={50} color={'var(--secondary-color)'} loading={IsBlockSLALoading} />
                    </div>
                  ) : (
                    <CustomDoubleBarChart
                      data={blockSLAList}
                      xAxisDataKey={'months'}
                      barDataKey1={'sla_achieved_8hrs'}
                      barDataKey2={'sla_achieved_12hrs'}
                      lineDataKey1={'sla_target_8hrs'}
                      lineDataKey2={'sla_target_12hrs'}
                      LegendName1={'Achieved (8 Hrs)'}
                      LegendName2={'Achieved (12 Hrs)'}
                      LineLegendName1={'Target (8 Hrs)'}
                      LineLegendName2={'Target (12 Hrs)'}
                      minYAixsVal={lowBlockVal}
                      title={''}
                      barSize={10}
                      xAxis_dyTick={30}
                      legendBottom={2}
                      xAxisAgnle={-50}
                      chartHeight={300}
                      legendTop={35}
                      chartTopPadding={35}
                      isShowBarLabel={false}
                      applyTickFormatter={true}
                      addExtraHeight={false}
                    />
                  )}
                </div>
              </div>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
