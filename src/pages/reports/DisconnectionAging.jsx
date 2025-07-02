import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Grid, Accordion, AccordionDetails } from '@mui/material';
import { Card } from 'react-bootstrap';
// MUI Datepicker

import { Container } from 'react-bootstrap';
import { toast } from 'react-hot-toast';

// components
import ContentLoader from '../../components/loader/ContentLoader';
import { getConnectionAgingReport, getPFReport } from '../../auth/services/Services';
import CustomPieChartNew from '../../components/customChart/CustomPieChart_New';

// const colors = ['#17d1d1','#eded2f','#fabe46','rgb(87 165 223)','#7eeb1e'];
// const colors = ['#ff5700', '#d9d9d9', '#22d3ee', '#cffafe', '#17d1d1'];
const colors = ['#ff5700', '#009ffd', '#344bfe', '#00d7b4', '#17d1d1', '#000'];

const keys = 'count(9)';

export default function DisconnectionAging() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [connectionAgingList, setConnectionAgingList] = useState([]);

  const GetDisconnectionAgingReport = () => {
    setIsLoading(true);

    getConnectionAgingReport()
      .then((res) => {
        if (res?.status === true) {
          const _actData = res.data;
          const totalValue = _actData?.reduce((preVal, entry) => preVal + entry[keys], 0);
          const _data = _actData?.map((val) => {
            const percentage = `${((val[keys] / totalValue) * 100).toFixed(0)}`;
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
    GetDisconnectionAgingReport();
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | BOSCH1 </title>
      </Helmet>

      <Container>
        <Card className="customDashboardCardbg" style={{ borderRadius: '12px' }}>
          <ContentLoader propData={isLoading} />
          <Grid container columns={{ xs: 12, md: 12, lg: 12 }}>
            <Grid item xs={12} lg={5}>
              <div style={{ padding: '2.5rem 0 0 2.5rem' }}>
                <div style={{ fontSize: 'xxx-large', fontFamily: 'auto' }}>
                  <span className="primaryColor">Disconnection Aging</span>
                </div>
                <div style={{ fontSize: 'x-large', fontFamily: 'sans-serif', paddingTop: '10px', opacity: 0.7 }}>
                  <span className="primaryColor">Pie Chart</span>
                </div>
                <ul style={{ listStyle: 'none', padding: '1.5rem 0 1.5rem 0' }}>
                  {connectionAgingList.map((entry, index) => (
                    <li key={`item-${index}`} style={{ marginTop: '10px', marginBottom: '3px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="20" height="15" style={{ marginRight: '7px' }}>
                          <circle cx="7" cy="7" r="7" fill={colors[index]} />
                        </svg>
                        <span
                          className={isLoading ? '' : 'write-text'}
                          style={{
                            color: colors[index],
                            fontSize: 'larger',
                            fontFamily: 'sans-serif',
                            display: 'inline-block',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {entry.disconnected_since}
                        </span>
                        <span
                          style={{
                            color: colors[index],
                            fontSize: 'larger',
                            fontFamily: 'cursive',
                            marginLeft: '10px',
                          }}
                        >{`${entry[keys]}`}</span>
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
            <Grid item xs={12} lg={7}>
              <CustomPieChartNew
                data={connectionAgingList}
                pieDataKey={'count(9)'}
                pieNameKey={'disconnected_since'}
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
