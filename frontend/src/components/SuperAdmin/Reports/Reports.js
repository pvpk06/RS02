import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Bar } from 'react-chartjs-2';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import apiService from '../../../apiService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HRStats = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.get('/api/hr-stats');
        console.log(response.data);
        const dataWithDates = response.data.map(row => ({
          ...row,
          postedOn: new Date(), // You'll need to get this from your API
        }));
        setRows(dataWithDates);
        setFilteredRows(dataWithDates);
        updateChartData(dataWithDates);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching HR statistics:', error);
        setRows([]);
        setFilteredRows([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const months = [
    { value: '', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = [
    { value: '', label: 'All Years' },
    ...Array.from({ length: 5 }, (_, i) => ({
      value: String(currentYear - i),
      label: String(currentYear - i),
    })),
  ];

  const updateChartData = (data) => {
    const hrNames = data.map((row) => row.hr_name || 'N/A');
    const drivesConducted = data.map((row) => row.jobs_posted || 0);
    const selected = data.map((row) => row.drives_done || 0);

    setChartData({
      labels: hrNames,
      datasets: [
        {
          label: 'Drives Conducted',
          data: drivesConducted,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Drives Done',
          data: selected,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
      ],
    });
  };

  useEffect(() => {
    const filteredData = rows.filter((row) => {
      if (!row.postedOn) return true;

      const postedDate = new Date(row.postedOn);
      const monthMatch = !selectedMonth || postedDate.getMonth() + 1 === parseInt(selectedMonth);
      const yearMatch = !selectedYear || postedDate.getFullYear() === parseInt(selectedYear);

      return monthMatch && yearMatch;
    });

    setFilteredRows(filteredData);
    updateChartData(filteredData);
  }, [selectedMonth, selectedYear, rows]);

  const columns = [
    { field: 'hr_id', headerName: 'HR ID', width: 200, sortable: true },
    { field: 'hr_name', headerName: 'Name', width: 200, sortable: true },
    { field: 'jobs_posted', headerName: 'Total Jobs Posted', width: 200, sortable: true },
    { field: 'sent_profiles', headerName: 'Profiles Sent', width: 200, sortable: true },
    { field: 'drives_pending', headerName: 'Drives Pending', width: 200, sortable: true },
    { field: 'drives_done', headerName: 'Drive Done', width: 200, sortable: true },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 w-full mb-8">HR's Wise Report</h2>

      <div className="flex gap-4 mb-6 d-flex w-full mb-8">
        <select
          className="p-2 col-4 border rounded"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((year) => (
            <option key={year.value} value={year.value}>
              {year.label}
            </option>
          ))}
        </select>

        <select
          className="p-2 col-4 border rounded"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>
      
      {!loading ? (
        <div className="ag-theme-alpine w-full mb-8" style={{ height: 400, width: 'auto' }}>
          <AgGridReact
            columnDefs={columns}
            rowData={filteredRows}
            pagination={true}
            paginationPageSize={20}
            domLayout="autoHeight"
          />
        </div>
      ) : (
        <p>Loading data...</p>
      )}

      {!loading ? (
        <div className="mb-10">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: "HR's wise palcement statistics",
                },
              },
            }}
          />
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default HRStats;


// import React, { useEffect, useState } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import { Bar } from 'react-chartjs-2';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import apiService from '../../../apiService';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const HRStats = () => {
//   const [rows, setRows] = useState([]);
//   const [filteredRows, setFilteredRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedMonth, setSelectedMonth] = useState('');
//   const [selectedYear, setSelectedYear] = useState('');
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: []
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await apiService.get('/api/hr-stats');
//         // Add postedOn date to each row for filtering
//         const dataWithDates = response.data.map(row => ({
//           ...row,
//           postedOn: new Date(), // You'll need to get this from your API
//         }));
//         setRows(dataWithDates);
//         setFilteredRows(dataWithDates);
//         updateChartData(dataWithDates);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching HR statistics:', error);
//         setRows([]);
//         setFilteredRows([]);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const months = [
//     { value: '', label: 'All Months' },
//     { value: '1', label: 'January' },
//     { value: '2', label: 'February' },
//     { value: '3', label: 'March' },
//     { value: '4', label: 'April' },
//     { value: '5', label: 'May' },
//     { value: '6', label: 'June' },
//     { value: '7', label: 'July' },
//     { value: '8', label: 'August' },
//     { value: '9', label: 'September' },
//     { value: '10', label: 'October' },
//     { value: '11', label: 'November' },
//     { value: '12', label: 'December' },
//   ];

//   const currentYear = new Date().getFullYear();
//   const years = [
//     { value: '', label: 'All Years' },
//     ...Array.from({ length: 5 }, (_, i) => ({
//       value: String(currentYear - i),
//       label: String(currentYear - i),
//     })),
//   ];

//   const updateChartData = (data) => {
//     const hrNames = data.map((row) => row.hr_name || 'N/A');
//     const drivesConducted = data.map((row) => row.drives_conducted || 0);
//     const selected = data.map((row) => row.selected || 0);

//     setChartData({
//       labels: hrNames,
//       datasets: [
//         {
//           label: 'Drives Conducted',
//           data: drivesConducted,
//           backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         },
//         {
//           label: 'Selected',
//           data: selected,
//           backgroundColor: 'rgba(153, 102, 255, 0.6)',
//         },
//       ],
//     });
//   };

//   useEffect(() => {
//     const filteredData = rows.filter((row) => {
//       if (!row.postedOn) return true;
      
//       const postedDate = new Date(row.postedOn);
//       const monthMatch = !selectedMonth || postedDate.getMonth() + 1 === parseInt(selectedMonth);
//       const yearMatch = !selectedYear || postedDate.getFullYear() === parseInt(selectedYear);
      
//       return monthMatch && yearMatch;
//     });

//     setFilteredRows(filteredData);
//     updateChartData(filteredData);
//   }, [selectedMonth, selectedYear, rows]);

//   const columns = [
//     { field: 'hrID', headerName: 'ID', width: 120 },
//     { field: 'hr_name', headerName: 'Name', width: 200 },
//     { field: 'drives_conducted', headerName: 'Total Jobs Posted', width: 150 },
//     { field: 'selected', headerName: 'JD Recieved', width: 100 },
//     { field: 'sent_profiles', headerName: 'Profiles Sent', width: 150 },
//     { field: 'attended', headerName: 'Drive Scheduled', width: 150 },
//     { field: 'rejected', headerName: 'Drive Done/Offer received', width: 150 },
//     { field: 'in_progress', headerName: 'In Progress', width: 150 },
//     { field: 'drives_pending', headerName: 'Drives Pending', width: 150 },
//   ];

//   return (
//     <div className="w-full">
//       <h2 className="text-2xl font-bold mb-4 w-full mb-8">Placement Officer Wise Report</h2>

//       <div className="flex  gap-4 mb-6 d-flex w-full mb-8">
//       <select
//           className="p-2 col-4 border rounded"
//           value={selectedYear}
//           onChange={(e) => setSelectedYear(e.target.value)}
//         >
//           {years.map((year) => (
//             <option key={year.value} value={year.value}>
//               {year.label}
//             </option>
//           ))}
//         </select>

//         <select
//           className="p-2 col-4 border rounded"
//           value={selectedMonth}
//           onChange={(e) => setSelectedMonth(e.target.value)}
//         >
//           {months.map((month) => (
//             <option key={month.value} value={month.value}>
//               {month.label}
//             </option>
//           ))}
//         </select>
//       </div>
      
//       {!loading ? (
//       <div className="ag-theme-alpine w-full mb-8"  style={{ height: 400, width: 'auto' }}>
//         <AgGridReact
//           columnDefs={columns}
//           rowData={filteredRows}
//           pagination={true}
//           paginationPageSize={20}
//         />
//       </div> ) : (
//         <p>Loading data...</p>
//       )}

      // {/* {!loading ? (
      //   <div className="mb-10">
      //     <h3 className="text-xl font-semibold mb-4">Statistics</h3>
      //     <Bar
      //       data={chartData}
      //       options={{
      //         responsive: true,
      //         plugins: {
      //           legend: {
      //             position: 'top',
      //           },
      //           title: {
      //             display: true,
      //             text: 'HR Statistics',
      //           },
      //         },
      //       }}
      //     />
      //   </div>
      // ) : (
      //   <p>Loading data...</p>
      // )} */}
//     </div>
//   );
// };

// export default HRStats;