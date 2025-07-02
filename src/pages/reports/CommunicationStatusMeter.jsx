import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Grid, Accordion, AccordionDetails } from '@mui/material';
import { Card } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import CopyrightRoundedIcon from '@mui/icons-material/CopyrightRounded';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import WifiOffRoundedIcon from '@mui/icons-material/WifiOffRounded';

// components
import { GetCommunicationStatusMeterReport } from '../../auth/services/Services';
import CustomPieChartNew from '../../components/customChart/CustomPieChart_New';
import ContentLoader from '../../components/loader/ContentLoader';
import Loader from '../../components/loader/Loader';

const colors = ['green', '#ff5700', '#1eebaa', '#d4823b', '#fabe46', '#d9d9d9'];
const keys = 'count(9)';

export default function CommunicationStatusMeter() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [communicationStatusList, setCommunicationStatusList] = useState([]);
  const [CommunicateVal, setCommunicateVal] = useState('');
  const [NonCommunicateVal, setNonCommunicateVal] = useState('');
  const [AllVal, setAllVal] = useState(0);

  const GetCommunicationStatusMeter = () => {
    setIsLoading(true);
    GetCommunicationStatusMeterReport()
      .then((res) => {
        let _commList = [];
        if (res?.status === true) {
          const _actData = res.data;
          if (_actData && _actData?.length > 0) {
            setAllVal(_actData[0].all_mdm_meters);
            setCommunicateVal(parseInt(_actData[0].all_mdm_meters) - parseInt(_actData[0].non_comm_meters));
            setNonCommunicateVal(_actData[0].non_comm_meters);

            _commList.push({
              phase: 'Communicated',
              count: parseInt(_actData[0].all_mdm_meters) - parseInt(_actData[0].non_comm_meters),
            });
            _commList.push({ phase: 'Non Communicated', count: _actData[0].non_comm_meters });
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

  useEffect(() => {
    GetCommunicationStatusMeter();
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | BOSCH </title>
      </Helmet>
      <Container>
        <Card className="customDashboardCardbg" style={{ borderRadius: '12px' }}>
          <ContentLoader propData={isLoading} />
          <Grid container columns={{ xs: 12, md: 12, lg: 12 }}>
            <Grid item xs={12} lg={6}>
              <div style={{ padding: '2.5rem 0 0 2.5rem' }}>
                <div style={{ fontSize: 'xxx-large', fontFamily: 'auto' }}>
                  <span className="primaryColor">Communication Status</span>
                </div>
                <div style={{ fontSize: 'x-large', fontFamily: 'sans-serif', paddingTop: '10px', opacity: 0.7 }}>
                  <span className="primaryColor">Pie Chart</span>
                </div>
                <hr
                  style={{
                    width: '100%',
                    borderBottom: '1px solid var(--primary-border-color)',
                    margin: '0.5rem 0 1rem 0',
                    color: 'white',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ alignItems: 'center', width: '50%', textAlign: 'center' }}>
                    {/* <WifiRoundedIcon
                      className={isLoading ? '' : 'animated-icon'}
                      style={{ width: 48, height: 48, color: 'green' }}
                    /> */}

                    <svg
                      className={isLoading ? '' : 'animated-icon'}
                      width="44"
                      height="44"
                      viewBox="-6 0 44 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="Icon-Lightning">
                        <path
                          id="Vector"
                          d="M37.0889 20.3105C37.0368 20.0901 36.9312 19.886 36.7812 19.7163C36.6313 19.5466 36.4418 19.4165 36.2295 19.3377L26.3278 15.6234L28.8475 3.01985C28.9046 2.72701 28.8648 2.42356 28.7343 2.15528C28.6037 1.88701 28.3895 1.66847 28.1239 1.53265C27.8582 1.39682 27.5556 1.35108 27.2617 1.40232C26.9678 1.45357 26.6985 1.59902 26.4945 1.81672L7.24453 22.4417C7.08818 22.6065 6.97508 22.8074 6.91532 23.0265C6.85557 23.2456 6.85102 23.4761 6.90209 23.6974C6.95316 23.9187 7.05826 24.1239 7.20799 24.2947C7.35772 24.4655 7.54743 24.5965 7.76015 24.6761L17.6653 28.3903L15.1525 40.9802C15.0954 41.273 15.1352 41.5765 15.2657 41.8447C15.3962 42.113 15.6105 42.3315 15.8761 42.4674C16.1418 42.6032 16.4444 42.6489 16.7383 42.5977C17.0322 42.5464 17.3015 42.401 17.5055 42.1833L36.7555 21.5583C36.909 21.3935 37.0197 21.1935 37.0778 20.976C37.136 20.7584 37.1398 20.5299 37.0889 20.3105ZM18.798 36.7813L20.5975 27.7784C20.6619 27.4591 20.6109 27.1274 20.4535 26.8422C20.2961 26.557 20.0426 26.337 19.7381 26.2213L10.6562 22.8095L25.2003 7.22735L23.4025 16.2302C23.3381 16.5494 23.3891 16.8812 23.5465 17.1664C23.7039 17.4516 23.9574 17.6716 24.2619 17.7873L33.3369 21.1905L18.798 36.7813Z"
                          fill="green"
                        />
                      </g>
                    </svg>

                    <svg
                      className={isLoading ? '' : 'animated-icon'}
                      width="44"
                      height="44"
                      viewBox="0 0 44 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="Group">
                        <path
                          id="Vector"
                          d="M1.265 12.8278C7.13 8.07642 14.4519 5.48883 22 5.5C29.8558 5.5 37.07 8.2445 42.735 12.8278L40.4323 15.6805C35.2187 11.4566 28.7099 9.15647 22 9.16667C15.0168 9.16667 8.60567 11.605 3.56767 15.6805L1.265 12.8278ZM7.0235 19.9595C11.2596 16.5275 16.5481 14.6585 22 14.6667C27.6723 14.6667 32.8827 16.6485 36.9765 19.9577L34.672 22.8103C31.0875 19.9069 26.6128 18.326 22 18.3333C17.2003 18.3333 12.7912 20.0108 9.328 22.8103L7.0235 19.9577V19.9595ZM12.7838 27.0912C15.3905 24.979 18.645 23.8286 22 23.8333C25.4907 23.8333 28.6972 25.0525 31.2162 27.0893L28.9117 29.942C26.9566 28.3584 24.516 27.4961 22 27.5C19.382 27.5 16.9767 28.4148 15.0883 29.942L12.7838 27.0893V27.0912ZM18.5442 34.2228C19.5214 33.4303 20.7418 32.9985 22 33C23.309 33 24.5117 33.4583 25.4558 34.221L22 38.5L18.5442 34.221V34.2228Z"
                          fill="green"
                        />
                      </g>
                    </svg>

                    <div style={{ padding: '10px 0', color: colors[0], fontSize: 'large' }}>
                      <span>{CommunicateVal}</span>
                    </div>
                    <div style={{ fontSize: 'large', color: colors[0] }}>
                      <p>Communicated</p>
                    </div>
                  </div>

                  <div style={{ alignItems: 'center', width: '50%', textAlign: 'center' }}>
                    <svg
                      className={isLoading ? '' : 'animated-icon'}
                      width="44"
                      height="44"
                      viewBox="0 0 44 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="Group">
                        <path
                          id="Vector"
                          d="M22 33C23.309 33 24.5117 33.4583 25.4577 34.221L22 38.5L18.5423 34.221C19.5203 33.4287 20.7414 32.9976 22 33ZM5.148 2.55383L37.5558 34.9635L34.9635 37.5558L25.4668 28.0592C24.3487 27.6881 23.1781 27.4993 22 27.5C19.382 27.5 16.9767 28.4148 15.0883 29.942L12.7857 27.0893C15.1948 25.1377 18.1626 24.0037 21.2593 23.8517L16.5 19.0923C13.8823 19.8343 11.4424 21.0998 9.328 22.8122L7.02167 19.9595C8.99764 18.3594 11.2172 17.0862 13.596 16.1883L9.40867 11.9992C7.32434 12.9917 5.3644 14.2268 3.5695 15.6787L1.26317 12.8278C2.94067 11.4712 4.752 10.2777 6.67517 9.2675L2.55383 5.148L5.148 2.55383ZM26.5833 18.8558L22.396 14.6703L22 14.6667C27.6742 14.6667 32.8845 16.6485 36.9783 19.9595L34.672 22.8122C32.3098 20.8985 29.5441 19.5457 26.5833 18.8558ZM22 5.5C29.8558 5.5 37.07 8.2445 42.735 12.8278L40.4305 15.6787C35.2171 11.4559 28.709 9.15637 22 9.16667C20.3903 9.16667 18.81 9.295 17.27 9.54617L14.1625 6.435C16.6723 5.8245 19.2995 5.5 22 5.5Z"
                          fill="#ff5700"
                        />
                      </g>
                    </svg>
                    {/* <WifiOffRoundedIcon  className={isLoading?"":"animated-icon"} style={{ width: 48, height: 48, color: '#ff5700' }} /> */}
                    <div style={{ padding: '10px 0', color: colors[1], fontSize: 'large' }}>
                      <span>{NonCommunicateVal}</span>
                    </div>
                    <div style={{ color: colors[1], fontSize: 'large' }}>
                      <p>Non Communicated</p>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} lg={6}>
              <CustomPieChartNew
                data={communicationStatusList}
                pieDataKey={'count'}
                pieNameKey={'phase'}
                chartHeight={480}
                colors={colors}
              />
            </Grid>
          </Grid>
        </Card>
      </Container>
    </>
  );
}
