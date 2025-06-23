import React from 'react';
import Legend from '../UI/Legend';
import Statistics from '../UI/Statistics';
import DataTable from '../UI/DataTable';

function Sidebar({ data }) {
  return (
    <div className="space-y-6">
      <Legend data={data} />
      <Statistics data={data} />
      <DataTable data={data} />
    </div>
  );
}

export default Sidebar;