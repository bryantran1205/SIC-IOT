import logo from './logo.svg';
import './App.scss';
import DataTable from 'react-data-table-component';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { callAPi } from './service/services';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function App() {
  const [data, setData] = useState([]);
  const [predata, setPreData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    let filter = []
    const formattedStartDate = startDate.toISOString().split('T')[0];
  predata.forEach((item) => {
    if (item.time_in) {
      // Chuyển đổi item.time_in thành định dạng ngày 'YYYY-MM-DD'
      const date = new Date(item.time_in).toISOString().split('T')[0];
      
      // So sánh ngày
      if (date === formattedStartDate) {
        filter.push(item);
      }
    }
  });
    setData(filter);
  }, [startDate]);

  useEffect(() => {
    const fetchData = async () => {
      let res = await callAPi('get', "http://192.168.13.47:3001/data/get-all-attendances");
      if (!res.status) {
        alert('get fail');
      } else {
        const dataWithSTT = res.data.map((item, index) => ({
          ...item,
          stt: index + 1 // Thêm chỉ số STT (bắt đầu từ 1)
        }));
        setData(dataWithSTT); // Assumes `res.data` is the data array
        setPreData(dataWithSTT);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      name: 'STT',
      selector: row => row.stt,
    },
    {
      name: 'Name',
      selector: row => row.student_name,
    },
    {
      name: 'Date',
      selector: row => {
        const dateObject = new Date(row.time_in);
        return dateObject.toISOString().split('T')[0];
      }, // Assuming time_in is a timestamp
    },
    {
      name: 'Time',
      selector: row => {
        const dateObject = new Date(row.time_in);
        return dateObject.toISOString().split('T')[1].split('.')[0];
      }, // Assuming time_in is a timestamp
    },
  ];

  return (
    <div className="App">
      <h1 style={{ color: 'white', fontSize: '50px' }}>RFID ATTENDANCE</h1>
      <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />

      <div className='App_Table'>
        <DataTable
          className='App_Table_Data'
          columns={columns}
          data={data}
        />
      </div>
    </div>
  );
}

export default App;
