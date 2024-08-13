require('dotenv').config();
const { Client } = require('pg');

// Cấu hình kết nối
const pg = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  extendedQuery: true,
  // Bật rowMode để nhận kết quả dưới dạng mảng các object
  rowMode: 'array'
});

const connection = async () => {
  try {
    await pg.connect();
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('Connection error', err.stack);
  }
};

const SELECT = async (select, funcname, params) => {
  return new Promise(async (resolve, reject) => {
    if (params) {
      let paramStr = '';

      if (params && params.length > 0) {
        paramStr = params.map(param => Array.isArray(param) ? `ARRAY[${param.join(', ')}]` : `'${param}'`).join(', ');
      }

      // Gọi stored procedure và trả về kết quả
      // console.log(paramStr)
      const result = await pg.query(`SELECT ${select} FROM ${funcname} (${paramStr})`)
      resolve(result);
    }
    else {
      const result = await pg.query(
        "select " + select + " from " + funcname + " "
      );

      resolve(result);
    }

  });
};
// const selectFunction = async (pro_name, params) => {
//   try {
//     // Tạo chuỗi tham số từ đối số 'params'

//     return result;
//   } catch (error) {
//     console.error('Error executing stored procedure:', error);
//     throw error; // Ném lỗi để xử lý ở phía gọi hàm
//   }
// };
const executeProcedure = async (pro_name, params) => {
  try {
    // Tạo chuỗi tham số từ đối số 'params'
    
    let paramStr = '';
    if (params && params.length > 0) {
      paramStr = params.map(param => `'${param}'`).join(', ');
    }
    // Gọi stored procedure và trả về kết quả
    // console.log(paramStr)
    const result = await pg.query(`CALL ${pro_name} (${paramStr})`);
    return result;
  } catch (error) {
    console.error('Error executing stored procedure:', error);
    throw error; // Ném lỗi để xử lý ở phía gọi hàm
  }
};

module.exports = { connection, SELECT, executeProcedure }
