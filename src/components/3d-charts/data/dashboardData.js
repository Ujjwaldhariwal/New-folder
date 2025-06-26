// src/data/dashboardData.js
import { 
    getConnectionStatusReport, 
    getConnectionAgingReport,
    getPFReport,
    GetCommunicationStatusMeterReport,
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
 * Handles session timeout by clearing stored user data and redirecting to login.
 */
const handleSessionTimeout = () => {
    console.warn("Session token expired. Logging out.");
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/login'; // Adjust this route if needed
};

/**
 * A generic error handler for fetch functions.
 */
const handleFetchError = (chartName, error) => {
    console.error(`Error fetching data for ${chartName}:`, error);
    return [{ id: 1, label: 'API Error', value: 100, color: '#F43F5E' }];
};

// --- REFACTORED: Fetches data for the first two status circles ---
const fetchConnectionData = async () => {
    try {
        const response = await getConnectionStatusReport();
        if (response?.message === "Token is invalid/malformed/expired") {
            handleSessionTimeout();
            return [
                { id: 1, label: 'Connected', value: 'Expired', color: '#22C55E' },
                { id: 2, label: 'Disconnected', value: 'Expired', color: '#F43F5E' }
            ];
        }
        if (!response || !response.status || !Array.isArray(response.data) || response.data.length === 0) {
            throw new Error('Invalid API response');
        }
        const data = response.data[0];
        return [
            { id: 1, label: 'Connected', value: data.conn_comm || 0, color: '#22C55E' },
            { id: 2, label: 'Disconnected', value: data.disconn_comm || 0, color: '#F43F5E' }
        ];
    } catch (error) {
        console.error("Error fetching connection data:", error);
        return [
            { id: 1, label: 'Connected', value: 'Error', color: '#22C55E' },
            { id: 2, label: 'Disconnected', value: 'Error', color: '#F43F5E' }
        ];
    }
};

// --- REFACTORED: Fetches data for the second two status circles ---
const fetchCommunicationMeterData = async () => {
    try {
        const response = await GetCommunicationStatusMeterReport();
        if (response?.message === "Token is invalid/malformed/expired") {
            handleSessionTimeout();
            return [
                 { id: 3, label: 'Communication', value: 'Expired', color: '#2563EB' },
                 { id: 4, label: 'Non Communication', value: 'Expired', color: '#FACC15' }
            ];
        }
        if (!response || !response.status || !Array.isArray(response.data) || response.data.length === 0) {
            throw new Error('Invalid API response');
        }
        const data = response.data[0];
        return [
            { id: 3, label: 'Communication', value: data.communicating || 0, color: '#2563EB' },
            { id: 4, label: 'Non Communication', value: data.non_communicating || 0, color: '#FACC15' }
        ];
    } catch(error) {
        console.error("Error fetching communication meter data:", error);
        return [
            { id: 3, label: 'Communication', value: 'Error', color: '#2563EB' },
            { id: 4, label: 'Non Communication', value: 'Error', color: '#FACC15' }
        ];
    }
};

// --- NEW: Main function to fetch all status circle data in parallel ---
const fetchAllStatusData = async () => {
    const [connectionData, communicationData] = await Promise.all([
        fetchConnectionData(),
        fetchCommunicationMeterData()
    ]);
    return [...connectionData, ...communicationData];
};

const fetchDisconnectionAgeingData = async () => {
  const colors = ['#0EA5E9', '#A855F7', '#22C55E', '#FACC15', '#F43F5E'];
  try {
    const response = await getConnectionAgingReport();
    if (response?.message === "Token is invalid/malformed/expired") {
        handleSessionTimeout(); return [];
    }
    if (!response || !response.status || !Array.isArray(response.data)) throw new Error("Invalid API response");
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
        'Between 0.9 and 1': '#22C55E', 'Between 0.7 and 0.9': '#FACC15',
        'Between 0.5 and 0.7': '#F43F5E', 'Less than 0.5': '#b91c1c'
    };
    try {
        const response = await getPFReport();
        if (response?.message === "Token is invalid/malformed/expired") {
            handleSessionTimeout(); return [];
        }
        if (!response || !response.status || !Array.isArray(response.data)) throw new Error("Invalid API response");
        return response.data.map((item, index) => ({
            id: index + 1, label: item.pf_cat || 'Unknown',
            value: parseFloat(item['count(9)']) || 0,
            color: colorMapping[item.pf_cat] || '#9ca3af'
        }));
    } catch (error) {
        return handleFetchError("PF Report", error);
    }
};

const fetchNetMeteringData = async () => {
    const formatDateLabel = (dateStr) => {
        if (!dateStr || !dateStr.includes('-')) return "Invalid Date";
        const [month, year] = dateStr.split('-');
        return new Date(`${year}-${month}-01`).toLocaleString('en-US', { month: 'short', year: '2-digit' });
    };
    const colors = ['#3b82f6', '#16a34a', '#ef4444', '#f97316', '#8b5cf6', '#d946ef', '#14b8a6', '#f59e0b', '#6366f1', '#ec4899'];
    try {
        const response = await netMeteringCon();
        if (response?.message === "Token is invalid/malformed/expired") {
            handleSessionTimeout(); return [];
        }
        if (!response || !response.status || !Array.isArray(response.data)) throw new Error("Invalid API response");
        return response.data.map((item, index) => ({
            id: index + 1, label: formatDateLabel(item.month_year),
            value: parseFloat(item.count) || 0, color: colors[index % colors.length]
        }));
    } catch(error) {
        return handleFetchError("Net Metering", error);
    }
};

const fetchFDRData = async () => {
    try {
        const response = await comStatusFDR();
        if (response?.message === "Token is invalid/malformed/expired") {
            handleSessionTimeout(); return [];
        }
        if (!response || !response.status || !Array.isArray(response.data) || response.data.length === 0) throw new Error("Invalid API response");
        const data = response.data[0];
        return [
            { id: 1, label: 'On Line Meters', value: parseFloat(data.communnicating_meters) || 0, color: '#06B6D4' },
            { id: 2, label: 'Off Line Meters', value: parseFloat(data.non_comm_current) || 0, color: '#FB923C' }
        ];
    } catch (error) {
        return handleFetchError("FDR Status", error);
    }
};

const fetchDTRData = async () => {
    try {
        const response = await comStatusDTR();
        if (response?.message === "Token is invalid/malformed/expired") {
            handleSessionTimeout(); return [];
        }
        if (!response || !response.status || !Array.isArray(response.data) || response.data.length === 0) throw new Error("Invalid API response");
        const data = response.data[0];
        return [
            { id: 1, label: 'On Line Meters', value: parseFloat(data.communnicating_meters) || 0, color: '#06B6D4' },
            { id: 2, label: 'Off Line Meters', value: parseFloat(data.non_comm_current) || 0, color: '#FB923C' }
        ];
    } catch (error) {
        return handleFetchError("DTR Status", error);
    }
};

const fetchConsumerData = async () => {
    try {
        const response = await comStatusCONS();
        if (response?.message === "Token is invalid/malformed/expired") {
            handleSessionTimeout(); return [];
        }
        if (!response || !response.status || !Array.isArray(response.data) || response.data.length === 0) throw new Error("Invalid API response");
        const data = response.data[0];
        return [
            { id: 1, label: 'On Line Meters', value: parseFloat(data.communnicating_meters) || 0, color: '#06B6D4' },
            { id: 2, label: 'Off Line Meters', value: parseFloat(data.non_comm_current) || 0, color: '#FB923C' }
        ];
    } catch (error) {
        return handleFetchError("Consumer Status", error);
    }
};

const fetchOutageFDR = async () => {
    try {
        const response = await outageCountFDR();
        if (response?.message === "Token is invalid/malformed/expired") {
            handleSessionTimeout(); return [];
        }
        if (!response || !response.status || !Array.isArray(response.data) || response.data.length === 0) throw new Error("Invalid API response");
        const data = response.data[0];
        return [
            { id: 1, label: '0-5 min', value: parseFloat(data.less_then_5min) || 0, color: '#2563EB' },
            { id: 2, label: '5-10 min', value: parseFloat(data.between_5_10min) || 0, color: '#22C55E' },
            { id: 3, label: '10-60 min', value: parseFloat(data.between_10_60min) || 0, color: '#FACC15' },
            { id: 4, label: '>60 min', value: parseFloat(data.more_then_60min) || 0, color: '#F43F5E' }
        ];
    } catch (error) {
        return handleFetchError('Outage Count FDR', error);
    }
};

const fetchOutageDTR = async () => {
    try {
        const response = await outageCountDTR();
        if (response?.message === "Token is invalid/malformed/expired") {
            handleSessionTimeout(); return [];
        }
        if (!response || !response.status || !Array.isArray(response.data) || response.data.length === 0) throw new Error("Invalid API response");
        const data = response.data[0];
        return [
            { id: 1, label: '0-5 min', value: parseFloat(data.less_then_5min) || 0, color: '#2563EB' },
            { id: 2, label: '5-10 min', value: parseFloat(data.between_5_10min) || 0, color: '#22C55E' },
            { id: 3, label: '10-60 min', value: parseFloat(data.between_10_60min) || 0, color: '#FACC15' },
            { id: 4, label: '>60 min', value: parseFloat(data.more_then_60min) || 0, color: '#F43F5E' }
        ];
    } catch (error) {
        return handleFetchError('Outage Count DTR', error);
    }
};


// --- Dashboard Sections Configuration ---

export const dashboardSections = [
  {
    id: 'connect-disconnect',
    title: 'Connect & Disconnect Status',
    icon: '🔌',
    subtitle: 'Real-time connection monitoring',
    defaultOpen: true,
    charts: [
      { 
        id: 'main-status-circles', 
        title: 'Overall Status', 
        type: 'status-circles', 
        fetchData: fetchAllStatusData,
        tableHeaders: { label: 'Overall Category', value: 'Total Count' } // Added
      },
      { 
        id: 'installed-meters', 
        title: 'Installed Meters', 
        type: 'pie', 
        data: installedMetersData,
        tableHeaders: { label: 'Meter Type', value: 'Value' } // Added
      }
    ]
  },
  {
    id: 'communication',
    title: 'Communication Status',
    icon: '📡',
    subtitle: 'Network communication metrics',
    defaultOpen: false,
    charts: [
      { 
        id: 'comm-fdr', 
        title: 'Communication Status - FDR', 
        type: 'pie', 
        fetchData: fetchFDRData,
        tableHeaders: { label: 'FDR Meter Status', value: 'Count' } // Added
      },
      { 
        id: 'comm-dtr', 
        title: 'Communication Status - DTR', 
        type: 'pie', 
        fetchData: fetchDTRData,
        tableHeaders: { label: 'DTR Meter Status', value: 'Count' } // Added
      },
      { 
        id: 'comm-consumer', 
        title: 'Communication Status - Consumer', 
        type: 'pie', 
        fetchData: fetchConsumerData,
        tableHeaders: { label: 'Consumer Meter Status', value: 'Count' } // Added
      }
    ]
  },
  {
    id: 'disconnection-ageing',
    title: 'Disconnection Ageing & PF Status',
    icon: '⏰',
    subtitle: 'Aging analysis and power factor monitoring',
    defaultOpen: false,
    charts: [
      { 
        id: 'disconnection-aging', 
        title: 'Disconnection Ageing', 
        type: 'pie', 
        fetchData: fetchDisconnectionAgeingData,
        tableHeaders: { label: 'Disconnected Period', value: 'Number of Consumers' } // Added
      },
      { 
        id: 'monthly-pf', 
        title: 'Monthly PF Status', 
        type: 'pie', 
        fetchData: fetchPFReportData,
        tableHeaders: { label: 'Power Factor Range', value: 'Meter Count' } // Added
      }
    ]
  },
  {
    id: 'outage-status',
    title: 'Outage Status',
    icon: '⚡',
    subtitle: 'Power outage duration analysis',
    defaultOpen: false,
    charts: [
        { 
          id: 'outage-fdr', 
          title: 'Outage Count - Feeders', 
          type: 'bar', 
          fetchData: fetchOutageFDR,
          tableHeaders: { label: 'Outage Duration', value: 'Feeder Count' } // Added
        },
        { 
          id: 'outage-dtr', 
          title: 'Outage Count - DTR', 
          type: 'bar', 
          fetchData: fetchOutageDTR,
          tableHeaders: { label: 'Outage Duration', value: 'DTR Count' } // Added
        }
    ]
  },
  {
    id: 'net-metering',
    title: 'Month-wise Conversion to Net Metering',
    icon: '📊',
    subtitle: 'Monthly net metering conversion analysis',
    defaultOpen: false,
    charts: [
      { 
        id: 'net-metering-bar', 
        title: 'Month - Wise Conversion to Net Metering', 
        type: 'bar', 
        fetchData: fetchNetMeteringData,
        tableHeaders: { label: 'Month/Year', value: 'Net Meters' } // Added
      }
    ]
  }
];
