// src/data/dashboardData.js
import { 
    getConnectionStatusReport, 
    getConnectionAgingReport,
    getPFReport,
    comStatusFDR,
    comStatusDTR,
    comStatusCONS,
    netMeteringCon,
    outageCountFDR,
    outageCountDTR
} from '../../../auth/services/Services';

// --- STATIC DATA (as a fallback or for other charts) ---
export const installedMetersData = [
  { id: 1, label: 'Consumer', value: 85, color: '#06B6D4' },
  { id: 2, label: 'Others', value: 15, color: '#FB923C' }
];


// --- API-DRIVEN DATA FUNCTIONS ---

/**
 * A generic error handler for fetch functions to return a consistent error object for charts.
 * @param {string} chartName - The name of the chart for logging purposes.
 * @param {Error} error - The error object caught.
 * @returns {Array<object>} - An array containing a single error data point.
 */
const handleFetchError = (chartName, error) => {
    console.error(`Error fetching data for ${chartName}:`, error);
    return [{ id: 1, label: 'API Error', value: 100, color: '#F43F5E' }];
};

const fetchConnectDisconnectData = async () => {
    try {
        const response = await getConnectionStatusReport();
        if (!response || response.status !== true || !Array.isArray(response.data) || response.data.length === 0) {
            throw new Error('Invalid API response for connection status');
        }
        const statusData = response.data[0];
        return [
            { id: 1, label: 'Connected', value: statusData.conn_comm || 0, color: '#22C55E' },
            { id: 2, label: 'Disconnected', value: statusData.disconn_comm || 0, color: '#F43F5E' },
            { id: 3, label: 'Communication', value: '...', color: '#2563EB', isLoading: true },
            { id: 4, label: 'Non Communication', value: '...', color: '#FACC15', isLoading: true }
        ];
    } catch (error) {
        return handleFetchError("Connection Status", error);
    }
};

const fetchDisconnectionAgeingData = async () => {
  const colors = ['#0EA5E9', '#A855F7', '#22C55E', '#FACC15', '#F43F5E'];
  try {
    const response = await getConnectionAgingReport();
    if (!response || response.status !== true || !Array.isArray(response.data)) {
        throw new Error("Invalid API response for disconnection ageing");
    }
    return response.data.map((item, index) => ({ 
        id: index + 1, 
        label: item.disconnected_since || 'Unknown', 
        value: parseFloat(item['count(9)']) || 0, 
        color: colors[index % colors.length] 
    }));
  } catch (error) {
    return handleFetchError("Disconnection Ageing", error);
  }
};

const fetchPFReportData = async () => {
    const colorMapping = {
        'Between 0.9 and 1': '#22C55E',
        'Between 0.7 and 0.9': '#FACC15',
        'Between 0.5 and 0.7': '#F43F5E',
        'Less than 0.5': '#b91c1c'
    };
    try {
        const response = await getPFReport();
        if (!response || response.status !== true || !Array.isArray(response.data)) {
            throw new Error("Invalid API response for PF Report");
        }
        return response.data.map((item, index) => ({
            id: index + 1,
            label: item.pf_cat || 'Unknown',
            value: parseFloat(item['count(9)']) || 0,
            color: colorMapping[item.pf_cat] || '#9ca3af'
        }));
    } catch (error) {
        return handleFetchError("PF Report", error);
    }
};

const fetchNetMeteringData = async () => {
    const formatDateLabel = (dateStr) => {
        if (!dateStr || typeof dateStr !== 'string' || !dateStr.includes('-')) return "Invalid Date";
        const [month, year] = dateStr.split('-');
        const date = new Date(`${year}-${month}-01`);
        return date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    };
    const colors = ['#3b82f6', '#16a34a', '#ef4444', '#f97316', '#8b5cf6', '#d946ef', '#14b8a6', '#f59e0b', '#6366f1', '#ec4899'];
    try {
        const response = await netMeteringCon();
        if (!response || response.status !== true || !Array.isArray(response.data)) {
            throw new Error("Invalid API response for Net Metering");
        }
        return response.data.map((item, index) => ({
            id: index + 1,
            label: formatDateLabel(item.month_year),
            value: parseFloat(item.count) || 0,
            color: colors[index % colors.length]
        }));
    } catch(error) {
        return handleFetchError("Net Metering", error);
    }
};

const fetchCommunicationData = async (apiFunction, chartName) => {
    try {
        const response = await apiFunction();
        if (!response || response.status !== true || !Array.isArray(response.data) || response.data.length === 0) {
            throw new Error(`Invalid API response for ${chartName}`);
        }
        const data = response.data[0];
        const communicating = parseFloat(data.communnicating_meters) || 0;
        const nonCommunicating = parseFloat(data.non_comm_current) || 0;
        return [
            { id: 1, label: 'On Line Meters', value: communicating, color: '#06B6D4' },
            { id: 2, label: 'Off Line Meters', value: nonCommunicating, color: '#FB923C' }
        ];
    } catch (error) {
        return handleFetchError(chartName, error);
    }
};

const fetchFDRData = () => fetchCommunicationData(comStatusFDR, 'FDR Communication Status');
const fetchDTRData = () => fetchCommunicationData(comStatusDTR, 'DTR Communication Status');
const fetchConsumerData = () => fetchCommunicationData(comStatusCONS, 'Consumer Communication Status');

const fetchOutageData = async (apiFunction, chartName) => {
    try {
        const response = await apiFunction();
        if (!response || response.status !== true || !Array.isArray(response.data) || response.data.length === 0) {
            throw new Error(`Invalid API response for ${chartName}`);
        }
        const data = response.data[0];
        return [
            { id: 1, label: 'Duration 0-5 min', value: parseFloat(data.less_then_5min) || 0, color: '#2563EB' },
            { id: 2, label: 'Duration 5-10 min', value: parseFloat(data.between_5_10min) || 0, color: '#22C55E' },
            { id: 3, label: 'Duration 10-60 min', value: parseFloat(data.between_10_60min) || 0, color: '#FACC15' },
            { id: 4, label: 'Duration >60 min', value: parseFloat(data.more_then_60min) || 0, color: '#F43F5E' }
        ];
    } catch (error) {
        return handleFetchError(chartName, error);
    }
};

const fetchOutageFDR = () => fetchOutageData(outageCountFDR, 'Outage Count FDR');
const fetchOutageDTR = () => fetchOutageData(outageCountDTR, 'Outage Count DTR');


// --- Dashboard Sections Configuration ---

export const dashboardSections = [
  {
    id: 'connect-disconnect',
    title: 'Connect & Disconnect Status',
    subtitle: 'Real-time connection monitoring',
    defaultOpen: true,
    charts: [
      { id: 'main-status-circles', title: 'Overall Status', type: 'status-circles', fetchData: fetchConnectDisconnectData },
      { id: 'installed-meters', title: 'Installed Meters', type: 'pie', data: installedMetersData }
    ]
  },
  {
    id: 'communication',
    title: 'Communication Status',
    subtitle: 'Network communication metrics',
    defaultOpen: false,
    charts: [
      { id: 'comm-fdr', title: 'Communication Status - FDR', type: 'pie', fetchData: fetchFDRData },
      { id: 'comm-dtr', title: 'Communication Status - DTR', type: 'pie', fetchData: fetchDTRData },
      { id: 'comm-consumer', title: 'Communication Status - Consumer', type: 'pie', fetchData: fetchConsumerData }
    ]
  },
  {
    id: 'disconnection-ageing',
    title: 'Disconnection Ageing & PF Status',
    subtitle: 'Aging analysis and power factor monitoring',
    defaultOpen: false,
    charts: [
      { id: 'disconnection-aging', title: 'Disconnection Ageing', type: 'pie', fetchData: fetchDisconnectionAgeingData },
      { id: 'monthly-pf', title: 'Monthly PF Status', type: 'pie', fetchData: fetchPFReportData }
    ]
  },
  {
    id: 'outage-status',
    title: 'Outage Status',
    subtitle: 'Power outage duration analysis',
    defaultOpen: false,
    charts: [
        { id: 'outage-fdr', title: 'Outage Count - Feeders', type: 'bar', fetchData: fetchOutageFDR },
        { id: 'outage-dtr', title: 'Outage Count - DTR', type: 'bar', fetchData: fetchOutageDTR }
    ]
  },
  {
    id: 'net-metering',
    title: 'Month-wise Conversion to Net Metering',
    subtitle: 'Monthly net metering conversion analysis',
    defaultOpen: false,
    charts: [
      { id: 'net-metering-bar', title: 'Month - Wise Conversion to Net Metering', type: 'bar', fetchData: fetchNetMeteringData }
    ]
  }
];

