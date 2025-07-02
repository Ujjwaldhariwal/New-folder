import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Grid } from '@mui/material';
import { Card } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import ContentLoader from '../../components/loader/ContentLoader';
import { getConnectionStatusReport } from '../../auth/services/Services';
import CustomPieChartNew from '../../components/customChart/CustomPieChart_New';

const colors = ['green', '#ff5700', '#1eebaa', '#d4823b', '#fabe46'];
// const colors = ['#808000', '#483C32','#F5F5DC', '#B0C4DE'];
const keys = 'count(9)';

export default function ConnectionStatusReport() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [connectionStatusList, setConnectionStatusList] = useState([]);
  const [connectedValue, setConnectedValue] = useState('');
  const [disconnectedValue, setDisconnectedValue] = useState('');

  const GetConnectionStatusReport = () => {
    setIsLoading(true);
    getConnectionStatusReport()
      .then((res) => {
        if (res?.status === true) {
          const _actData = res.data;
          const totalValue = _actData?.reduce((preVal, entry) => preVal + entry[keys], 0);
          const _data = _actData?.map((val) => {
            // -------------------------
            // set connected and disconnected value
            if (val.bo_status_cd?.trim() == 'CONN-COMM') {
              val.bo_status_cd = 'Connected';
              setConnectedValue(val[keys]);
            } else if (val.bo_status_cd?.trim() == 'DISCONN-COMM') {
              val.bo_status_cd = 'Disconnected';
              setDisconnectedValue(val[keys]);
            }
            // -------------------------
            const percentage = `${((val[keys] / totalValue) * 100).toFixed(0)}`;
            val.percentage = percentage;
            return val;
          });

          setConnectionStatusList(_data);
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

  useEffect(() => {
    GetConnectionStatusReport();
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
                  <span className="primaryColor">Connection Status</span>
                </div>
                <div style={{ fontSize: 'x-large', fontFamily: 'sans-serif', paddingTop: '10px', opacity: 0.7 }}>
                  <span className="primaryColor">Pie Chart</span>
                </div>
                <hr
                  style={{
                    width: '100%',
                    borderBottom: '1px solid var(--primary-border-color)',
                    margin: '0.5rem 0 1rem 0',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ alignItems: 'center', width: '50%', textAlign: 'center' }}>
                    {/* <PowerIcon
                      className={isLoading ? '' : 'animated-icon'}
                      style={{ width: 48, height: 48, color: 'green' }}
                    /> */}

                    <svg
                      className={isLoading ? '' : 'animated-icon'}
                      width="46"
                      height="47"
                      viewBox="0 0 46 47"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="Group">
                        <path
                          id="Vector"
                          d="M37.6704 38.4401C37.6682 38.7989 37.4543 39.1209 37.1236 39.2571C36.7929 39.3954 36.4125 39.3198 36.1575 39.0669L30.8387 33.7502L28.6126 35.9763L28.6148 35.9763C28.4138 36.1773 28.1285 36.2702 27.8497 36.2248C27.5687 36.1816 27.3267 36.0044 27.1992 35.7537L22.6973 26.9294C22.5222 26.5879 22.5892 26.173 22.8594 25.9006L26.3995 22.3605L26.4016 22.3605C26.594 22.1639 26.8685 22.0688 27.1429 22.1034C27.4152 22.1379 27.6573 22.2979 27.7956 22.5356L30.7566 27.6102L32.827 25.5398C33.0496 25.3171 33.376 25.2285 33.6807 25.3107C33.9855 25.3906 34.2254 25.6284 34.3075 25.9331L37.638 38.2093C37.6596 38.2849 37.6704 38.3623 37.6704 38.4401ZM28.2259 33.8626L30.2186 31.8699L30.2164 31.8699C30.5622 31.5241 31.122 31.5241 31.4678 31.8699L35.0598 35.4619L32.9979 27.8693L31.1955 29.6717C31.001 29.8641 30.7286 29.957 30.4563 29.9224C30.1862 29.8857 29.9441 29.7279 29.808 29.4902L26.8449 24.4177L24.5691 26.6935L28.2259 33.8626Z"
                          fill="green"
                        />
                        <path
                          id="Vector_2"
                          d="M46 29.5074C46 33.8904 44.258 38.0943 41.1588 41.1932C38.0595 44.2925 33.8583 46.0344 29.4752 46.0344C25.0921 46.0344 20.8883 44.2925 17.7894 41.1932L10.3677 33.7693C10.0219 33.4235 10.0219 32.8638 10.3677 32.518C10.7135 32.1722 11.2754 32.1722 11.6212 32.518L19.0407 39.9419C21.8071 42.7083 25.5611 44.2622 29.4727 44.2622C33.3868 44.2622 37.1384 42.7083 39.907 39.9419C45.66 34.1889 45.66 24.8285 39.907 19.075L32.4831 11.6533C32.1611 11.3031 32.1719 10.7607 32.5091 10.4257C32.8441 10.0885 33.3865 10.0799 33.7345 10.4019L41.1584 17.8236C44.2684 20.9163 46.0108 25.1221 46 29.5074Z"
                          fill="green"
                        />
                        <path
                          id="Vector_3"
                          d="M34.4824 9.31107C34.4846 10.4068 34.0501 11.455 33.2764 12.2287L12.1937 33.3114C11.42 34.0851 10.3718 34.5196 9.27604 34.5196C8.18243 34.5196 7.13424 34.0852 6.36054 33.3114C4.74823 31.7013 4.74823 29.0905 6.36054 27.4782L27.4432 6.39551C28.6233 5.21548 30.3976 4.86105 31.9386 5.50075C33.4796 6.13829 34.4846 7.6426 34.4824 9.31107ZM32.0251 10.9752C32.9436 10.0567 32.9436 8.56542 32.0251 7.64692C31.1065 6.72842 29.6153 6.72836 28.6946 7.64692L7.61189 28.7296C6.69334 29.6503 6.69334 31.1416 7.61189 32.0601C8.53045 32.9786 10.0217 32.9786 10.9402 32.0601L32.0251 10.9752Z"
                          fill="green"
                        />
                        <path
                          id="Vector_4"
                          d="M14.3203 21.6558C14.3182 22.0146 14.1042 22.3366 13.7735 22.4728C13.4429 22.6111 13.0625 22.5355 12.8075 22.2826L3.97215 13.4451C3.45994 12.935 2.63217 12.935 2.11994 13.4451C1.60988 13.9573 1.60988 14.7851 2.11994 15.2973L10.9575 24.1326C11.3033 24.4784 11.3033 25.0403 10.9575 25.3861C10.6095 25.7319 10.0498 25.7319 9.70396 25.3861L0.868643 16.5486C-0.30276 15.3405 -0.2876 13.4169 0.903223 12.2283C2.09189 11.0396 4.01326 11.0244 5.2214 12.1937L14.0611 21.029C14.2276 21.1954 14.3203 21.4224 14.3203 21.6558Z"
                          fill="green"
                        />
                        <path
                          id="Vector_5"
                          d="M25.6105 10.3656C25.6105 10.7244 25.3944 11.0464 25.0637 11.1826C24.7331 11.3209 24.3527 11.2453 24.0998 10.9924L15.2623 2.15487C14.7501 1.64266 13.9223 1.64266 13.4101 2.15487C12.9 2.66709 12.9 3.49486 13.4101 4.00708L22.2476 12.8424C22.5934 13.1882 22.5934 13.7501 22.2476 14.0959C21.9018 14.4417 21.3399 14.4417 20.9941 14.0959L12.1588 5.25617C10.955 4.0545 10.955 2.10507 12.1588 0.90125C13.3605 -0.300417 15.3099 -0.300417 16.5137 0.90125L25.3512 9.73878C25.5176 9.9052 25.6105 10.1301 25.6105 10.3656Z"
                          fill="green"
                        />
                      </g>
                    </svg>

                    <div style={{ padding: '10px 0', color: colors[0], fontSize: 'large' }}>
                      <span>{connectedValue}</span>
                    </div>
                    <div style={{ fontSize: 'large', color: colors[0] }}>
                      <p>Connected</p>
                    </div>
                  </div>

                  <div style={{ alignItems: 'center', width: '50%', textAlign: 'center' }}>
                    <svg
                      className={isLoading ? '' : 'animated-icon'}
                      width="85"
                      height="60"
                      viewBox="0 0 85 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="Group 2">
                        <g id="Group">
                          <path
                            id="Vector"
                            d="M43.0615 35.2035L33.8359 31.1344L37.2052 23.4954L46.43 27.5642C47.797 28.1671 48.5939 27.7142 48.9591 26.8862C49.3243 26.0581 49.1215 25.1643 47.7545 24.5613L38.5296 20.4926L40.1245 16.8767L41.8989 12.8536L34.7397 9.69594C29.0146 7.17079 22.0344 9.42238 17.8129 15.0449L8.02509 10.7279L4.73167 18.1948L14.5194 22.5119C13.2127 29.4211 16.2571 36.0931 21.983 38.6186L29.1421 41.7763L30.9166 37.7532L32.5114 34.1373L41.7363 38.2061C43.1033 38.809 43.9001 38.3561 44.2653 37.528C44.6306 36.7 44.4277 35.8061 43.0615 35.2035ZM37.3622 18.1699L36.7125 19.643L30.6588 33.3682L30.009 34.8413L28.2346 38.8644L22.9103 36.516C17.8009 34.2624 15.1903 28.1446 16.7021 21.9684L16.9248 21.0612L7.49475 16.9019L8.93343 13.6401L18.3635 17.7994L18.8833 17.0231C22.4248 11.7422 28.7029 9.54489 33.8124 11.7985L39.1366 14.1469L37.3622 18.1699ZM70.1006 38.1072C71.4073 31.198 68.363 24.526 62.6371 22.0005L55.4779 18.8428L42.7211 47.7655L49.8803 50.9231C55.6062 53.4486 62.5864 51.197 66.8072 45.5742L76.5949 49.8912L79.8883 42.4243L70.1006 38.1072ZM75.6874 46.9793L66.2573 42.8201L65.7376 43.5963C62.196 48.8772 55.9171 51.0742 50.8076 48.8206L45.4834 46.4722L56.3854 21.7547L61.7097 24.1031C66.8192 26.3567 69.4306 32.4748 67.9188 38.651L67.696 39.5582L77.1261 43.7175L75.6874 46.9793Z"
                            fill="#ff5700"
                          />
                        </g>
                      </g>
                    </svg>
                    {/* <PowerOffIcon className={isLoading ? '' : 'animated-icon'} style={{ width: 48, height: 48, color: '#ff5700' }} /> */}
                    <div style={{ padding: '10px 0', color: colors[1], fontSize: 'large' }}>
                      <span>{disconnectedValue}</span>
                    </div>
                    <div style={{ color: colors[1], fontSize: 'large' }}>
                      <p>Disconnected</p>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} lg={6}>
              <CustomPieChartNew
                data={connectionStatusList}
                pieDataKey={'count(9)'}
                pieNameKey={'bo_status_cd'}
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
