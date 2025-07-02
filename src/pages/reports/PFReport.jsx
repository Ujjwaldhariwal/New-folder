import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Accordion, AccordionDetails } from '@mui/material';
import { Card } from 'react-bootstrap';
// MUI Datepicker
import { Container } from 'react-bootstrap';
import { toast } from 'react-hot-toast';

// components
import ContentLoader from '../../components/loader/ContentLoader';
import { getPFReport } from '../../auth/services/Services';
import CustomPieChartNew from '../../components/customChart/CustomPieChart_New';

// const colors = ['#eded2f', '#fabe46', '#7eeb1e', '#1eebaa', '#17d1d1'];
// const colors = ['#0891b2', '#06b6d4', '#22d3ee', '#cffafe', '#000'];
const colors = ['#ff5700', '#009ffd', '#344bfe', '#00d7b4', '#17d1d1', '#000'];
const keys = 'count(9)';

export default function PFReport() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [pfList, setPFList] = useState([]);

  const GetPFReport = () => {
    setIsLoading(true);
    getPFReport()
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
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err);
      });
  };

  useEffect(() => {
    GetPFReport();
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | BOSCH </title>
      </Helmet>

      <Container>
      <Card className='customDashboardCardbg' style={{borderRadius:"12px"}}>
        <ContentLoader propData={isLoading} />
            <Grid container columns={{ xs: 12, md: 12, lg: 12 }}>
              <Grid item xs={12} lg={4}>
                <div style={{ padding: '2.5rem 0 0 2.5rem' }}>
                  <div style={{ fontSize: 'xxx-large', fontFamily: 'auto' }}>
                    <span className="primaryColor">PF</span>
                  </div>
                  <div style={{ fontSize: 'x-large', fontFamily: 'sans-serif', paddingTop: '10px', opacity: 0.7 }}>
                    <span className="primaryColor">Pie Chart</span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: '1.5rem 0 1.5rem 0' }}>
                    {pfList.map((entry, index) => (
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
                            {entry.pf_cat}
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
              <Grid item xs={12} lg={8}>
                <CustomPieChartNew
                  data={pfList}
                  pieDataKey={'count(9)'}
                  pieNameKey={'pf_cat'}
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
