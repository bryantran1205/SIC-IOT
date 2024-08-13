require("dotenv").config();
const jwt = require("jsonwebtoken");
const db = require("../../models/postgresql");
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for hashing

const EMAIL_ACCOUNT = process.env.EMAIL_ACCOUNT;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const SECRET_KEY = process.env.SECRET_KEY;

//hash password
const hashPassword = async (password) => {
  try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
  } catch (error) {
      console.error('Error hashing password:', error);
  }
};

//check tài khoản khi admin đăng nhập từ page login
//[tên tài khoản (string), mật khẩu (string)]
const checkValidAdmin = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT(
        "*",
        "func_adminlogin('" + body[0] + "')" //body[0] : tên tài khoản
      );  
      if (res.rows.length == 0) resolve({ status: false, message: "không tìm thấy tên tài khoản" });
      //so sánh password trong postgre và người dùng nhập
      //body[1] : mật khẩu
      bcrypt.compare(body[1], res.rows[0].password, (err, result) => {
        if (result) {
          content = {
            name: body[0],
          };
          let asscessToken = jwt.sign(content, SECRET_KEY);
          resolve({ status: true,username : res.rows[0].username, asscessToken });
        } else resolve({ status: false, message: "sai mật khẩu" });
    }); 
      
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

const LoginWhenIsToken = async (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT(
        "*",
        "func_adminloginwhentoken('" + name +  "')"
      );
      resolve({ status: true, username: res.rows[0]["func_adminloginwhentoken"].data });
    } catch (error) {
      // reject(error);
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

//check tài khoản admin khi có token trong session
//["token (string)"]
function verifyToken(body) {
  return new Promise((resolve, reject) => {
    if (!body[0]) {
      resolve({ status: 401, message: "Token không được cung cấp" });
    }

    jwt.verify(body[0], SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.error("Lỗi xác thực token:", err);
        resolve({ status: false, message: "Token không hợp lệ" });
      } else {
        try {
          const userResult = await LoginWhenIsToken(decoded.name);
          if (userResult.status) {
            resolve({ status: true, username: userResult.username });
          } else {
            resolve({ status: false, message: userResult.message });
          }
        } catch (err) {
          console.error("Lỗi hệ thống:", err);
          resolve({ status: false, code: 255, message: "Error System" });
        }
      }
    });
  });
}

//thay đổi mật khẩu
//[tên tài khoản, mật khẩu cũ (string), mật khẩu mới (string)]
const changePassword = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT(
         "*",
        "func_adminlogin('" + body[0] + "')" //body[0] : tên tài khoản
      );
      if (res.rows.length == 0) resolve({ status: false, message: "không tìm thấy tài khoản" });
      //so sánh password trong postgre và mật khẩu cũ người dùng nhập
      //nodyp[1] : mật khẩu cũ
      bcrypt.compare(body[1],res.rows[0].password, async (err, result) => {
        if (result) {
          // hash mật khẩu mới
          // body[2] : mật mới
          //lưu mật khẩu mới vô vị trí phần từ index 1
          body[1] = await bcrypt.hash(body[2], saltRounds);
          //loại bỏ phần phần tử mật khẩu mới là index 2
          body.splice(2, 1);
          // func_adminchangepassword(tên, mật khẩu mớimới)
          let reschange = await db.SELECT(
            "*",
            "func_adminchangepassword",body
          );
          if (reschange.rows[0]["func_adminchangepassword"].status == true)
            {
              resolve({ status: true, message: reschange.rows[0]["func_adminchangepassword"].message });
            }
            else resolve({ status: false, message: "Đổi mật khẩu thất bại" });
        } else resolve({ status: false, message: "Sai mật khẩu" });
    }); 
      
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

module.exports = {
  checkValidAdmin,
  changePassword,
  verifyToken,
};
