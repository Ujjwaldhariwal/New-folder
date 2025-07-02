import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Grid, Accordion, AccordionDetails } from '@mui/material';
import { Card } from 'react-bootstrap';
// MUI Datepicker

import { Container } from 'react-bootstrap';
import { toast } from 'react-hot-toast';

// components
import ContentLoader from '../../components/loader/ContentLoader';
import { GetDisconnectionReconnectionReport } from '../../auth/services/Services';
import dayjs from 'dayjs';
import CustomDoubleBarChart from '../../components/customChart/CustomDoubleBarChart';
import CustomBarChart from '../../components/customChart/CustomBarChart';

// const colors = ['#7eeb1e', '#fabe46', '#1eebaa', '#d4823b', '#fabe46'];
const colors = ['#413aef', '#ff5700', '#413aef', '#00d7b4', '#17d1d1']; 

const keys = 'count(9)';

export default function DisconnectionReconnectionReport() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [DcRcList, setDcRcList] = useState([]);
  const [lowest_dcdr_value, set_lowest_dcdr_value] = useState(0);

  const GetDisconnectionReconnectionList = () => {
    setIsLoading(true);
    GetDisconnectionReconnectionReport()
      .then((res) => {
        if (res?.status === true) {
          const _actData = res.data;

          // -----------------------
          // change date formate
          const _data = _actData?.map((val) => {
            let _date = dayjs(val.dates).format('DD-MM-YYYY');
            val.dates = _date;
            return val;
          });

          // -----------------------
          // get unique date list
          const _DateList = _data?.map((val) => val.dates);
          let _uniqueDateList = _DateList?.filter((value, index, self) => {
            return self.indexOf(value) === index;
          });

          // -----------------------
          // manipulate data
          let _dcdrList = [];

          for (let date of _uniqueDateList) {
            let setVal = {};
            const findObject = _data.filter((val) => val.dates == date);

            setVal.dates = date;
            setVal.dc_transaction_count = 0;
            setVal.rc_transaction_count = 0;

            for (let item of findObject) {
              if (item.activity_type == 'RC') {
                setVal.rc_transaction_count = item.transaction_count;
              } else if (item.activity_type == 'DC') {
                setVal.dc_transaction_count = item.transaction_count;
              }
            }
            _dcdrList.push(setVal);
          }

          setDcRcList(_dcdrList);
        } else {
          setDcRcList([]);
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
    GetDisconnectionReconnectionList();
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | BOSCH </title>
      </Helmet>

      <Container>
          <ContentLoader propData={isLoading} />
          <Grid container spacing={1} columns={{ xs: 12, md: 12, lg: 12 }}>
          
            <Grid item xs={12} lg={6}>
              <Card className="customDashboardCardbg" style={{ borderRadius: '12px' }}>
                <Card.Header
                 className='customChartHead'
                >
                  Disconnection
                </Card.Header>

                <div style={{ height: '355px' }}>
                  <CustomBarChart
                    data={DcRcList}
                    xAxisDataKey={'dates'}
                    barDataKey={'dc_transaction_count'}
                    LegendName={'Disconnection'}
                    title={''}
                    chartHeight={310}
                    isShowLineChart={false}
                    isShowShadowBar={false}
                    xAxisAgnle={-70}
                    xAxis_dyTick={40}
                    xAxis_dxTick={-12}
                    legendBottom={'auto'}
                    barSize={14}
                    barLabelAngle={-70}
                    barLabelDX={5}
                    barLabelDY={-9}
                    chartTopPadding={40}
                    displayLegend={true}
                    unit=""
                    barColor={colors[0]}
                    yAxisColor={'#fff'}
                    labelColor={colors[0]}
                  />
                </div>
              </Card>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Card className="customDashboardCardbg" style={{ borderRadius: '12px' }}>
                <Card.Header
                  className='customChartHead'
                >
                  Reconnection
                </Card.Header>
                <div style={{ height: '355px' }}>
                  <CustomBarChart
                    data={DcRcList}
                    xAxisDataKey={'dates'}
                    barDataKey={'rc_transaction_count'}
                    LegendName={'Reconnection'}
                    title={''}
                    chartHeight={310}
                    isShowLineChart={false}
                    isShowShadowBar={false}
                    xAxisAgnle={-70}
                    xAxis_dyTick={40}
                    xAxis_dxTick={-12}
                    legendBottom={'auto'}
                    barSize={14}
                    barLabelAngle={-70}
                    barLabelDX={5}
                    barLabelDY={-9}
                    chartTopPadding={40}
                    displayLegend={true}
                    unit=""
                    barColor={colors[1]}
                    yAxisColor={'#fff'}
                    labelColor={colors[1]}
                  />
                </div>
              </Card>
            </Grid>

            <Grid item xs={12} lg={12}>
              <Card className="customDashboardCardbg" style={{ borderRadius: '12px' }}>
                <Card.Header
                  className='customChartHead'
                >
                  Disconnection vs Reconnection
                </Card.Header>
                <div style={{ height: '385px' }}>
                  <CustomDoubleBarChart
                    data={DcRcList}
                    xAxisDataKey={'dates'}
                    barDataKey1={'dc_transaction_count'}
                    barDataKey2={'rc_transaction_count'}
                    LegendName1={'Disconnection'}
                    LegendName2={'Reconnection'}
                    title={''}
                    xAxisAgnle={-70}
                    xAxisOffset={-5}
                    unit=""
                    chartHeight={340}
                    xAxis_dyTick={40}
                    xAxis_dxTick={-12}
                    legendBottom={'auto'}
                    barSize={14}
                    barLabelAngle={-70}
                    barLabelDX={5}
                    barLabelDY={-9}
                    chartTopPadding={35}
                    isShowLineChart={false}
                  />
                </div>
              </Card>
            </Grid>
          </Grid>
      </Container>
    </>
  );
}
