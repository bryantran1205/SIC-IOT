const db = require("../../models/postgresql");
const path = require("path");
require("dotenv").config();

const getAllAttendances = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT(
        "*",
        "func_getattendacnes() "
      );
      resolve({ status: true, data: res.rows });

    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

const addAttendances = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT('*', 'func_addattendance', body);
      resolve({ status: true});

    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}


module.exports = {
  getAllAttendances,
  addAttendances,
};

// select * from Customer_Occupation("18")
