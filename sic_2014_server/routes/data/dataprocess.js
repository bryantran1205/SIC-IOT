const db = require("../../models/postgresql");
const path = require("path");
const fs = require("fs").promises;
require("dotenv").config();
const cron = require('node-cron');
const PATH_COMMON = process.env.PATH_COMMON;

const getNews = async (name_file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileNameNoHtml = name_file.replace(".html", "");
      const fileName = path.basename(name_file, path.extname(name_file));
      const filePath = path.join(`${PATH_COMMON}/news/${fileName}`, name_file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      resolve({ status: true, data: fileContent });
    } catch (error) {
      // resolve({ status: false, code: 255, message: "Error System" });
      reject(error);
    }
  });
};
// sort các bài báo theo ký tự index (1,2,3,4,0,0,0,..)
const customSort = (a, b) => {
  if (a.index === 0) return 1;
  if (b.index === 0) return -1;
  return a.index - b.index;
};
//lâý tất cả danh mục bài báo
const getAllCategories = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_getallcategories()");
      const customSort = (a, b) => {
        if (a.index === 0) return 1;
        if (b.index === 0) return -1;
        return a.index - b.index;
      };
      const sortedResult = res.rows.sort(customSort);
      resolve({ status: true, data: sortedResult });
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};
// Thêm danh mục
//[tên danh mục (string)]
const addCategory = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_addcategory",body);
      if(res.rows[0]["func_addcategory"]["status"]){
        resolve({ status: true, message :"Thêm danh mục thành công" ,id :res.rows[0]["func_addcategory"]["id"] });
      }else resolve({ status: false, data: "Danh mục đã tồn tại"   });
     
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}
// Sửa danh mục
//[id danh mục(int), tên mới danh mục(string)]
const editCategoryName = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_editcategoryname",body);
      if(res.rows[0]["func_editcategoryname"]["status"]){
        resolve({ status: true, message :"Sửa tên danh mục thành công"  });
      }else if(res.rows[0]["func_editcategoryname"]["message"] == 'Category name already exists')
      {
        resolve({ status: false, data: "tên danh mục đã được sử dụng"   });
      }
      else resolve({ status: false, data: "Danh mục không tồn tại"   });
     
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}
// Sửa thứ tự danh mục
//[id danh mục(int), thứ tự danh mục(int)]
const editCategoryIndex = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_editcategoryindex",body);
      if(res.rows[0]["func_editcategoryindex"]["status"]){
        resolve({ status: true, message :"Sửa thứ tự danh mục thành công"  });
      }else if(res.rows[0]["func_editcategoryindex"]["message"] == 'Category index already exists')
      {
        resolve({ status: false, data: "thứ tự danh mục đã được sử dụng"   });
      }
      else resolve({ status: false, data: "Danh mục không tồn tại"   });
     
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}
// Sửa trạng thái công khai danh mục
//[id danh mục(int), trạng thái danh mục(boolean)]
const editCategoryStatus = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_editcategorystatus",body);
      if(res.rows[0]["func_editcategorystatus"]["status"]){
        resolve({ status: true, message :"Sửa trạng thái danh mục thành công"  });
      }
      else resolve({ status: false, data: "Danh mục không tồn tại"   });
     
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}
// Xóa danh mục
//[id danh mục(int)]
const deleteCategory = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_deletecategory",body);
      if(res.rows[0]["func_deletecategory"]["status"]){
        resolve({ status: true, message :"Xóa danh mục thành công"  });
      }
      else resolve({ status: false, data: "Danh mục không tồn tại"   });
     
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}
// Tạo bài viết
//[img_url (string), title (string), content (string), news (string) , [id danh mục, id danh mục,... ] (Array)]
const createNews = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*","func_addnews", body);
        if (res.rows[0]["func_addnews"]["status"]) {
          resolve({ status: true, message: "Đăng bài thành công" });

      } else {
        resolve({ status: false, message: "Tiêu đề không được trùng" });

      }
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

// Sửa bài viết
//[id bài viết(int), img_url (string), title (string), content (string), news (string) , [id danh mục, id danh mục,... ] (Array)]
const editNews = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_editnews", body);
      console.log(res)
      if (res.rows[0]["func_editnews"]["status"]) {
        resolve({ status: true, message: "Sửa bài thành công" });
      } else {
        resolve({ status: false, message: "Tiêu đề không được trùng" });
      }
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

// Sửa thứ tự bài viết
//[id bài viết(int), thứ tự bài viết(int)]
const editIndexNews = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_editnewsindex", body);
      if (res.rows[0]["func_editnewsindex"]["status"]) {
        resolve({ status: true, message: "Sửa thành công" });
      }else if (res.rows[0]["func_editnewsindex"]["message"] == 'news index already exists'){
        resolve({ status: false, message: "thứ tự không được trùng lặp" });
      } 
      else {
        resolve({ status: false, message: "không tìm thấy bài viết" });
      }
      resolve({ status: true });
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

//Sửa trạng thái bài viết
//[id bài viết(int), trạng thái công khai bài viết(boolean)]
const editPublishNews = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*","func_editnewsstatus", body);
      if (res.rows[0]["func_editnewsstatus"]["status"]) {
        resolve({ status: true, message: "Sửa thành công" });
      } else {
        resolve({ status: false, message: "không tìm thấy bài viết" });
      }
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

//Xóa bài viết
//[id bài viết(int)]
const deleteNews = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*","func_deletenews", body);
      if (res.rows[0]["func_deletenews"]["status"]) {
        resolve({ status: true, message: "Xóa bài viết thành công" });
      }
      else resolve({ status: false ,message: "không tìm thấy bài viết" });
      
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

//Lấy tất cả bài viết theo danh mục
const getNewsByCategory = async (id_category) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT(
          "*",
          "func_getnewsbycategoryid(" + id_category + ") "
        );
      
      const sortedResult = res.rows.sort(customSort);

      resolve({ status: true, data: sortedResult });

    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};
// lấy bài viết theo id bài viết
const getNewsById = async (id_news) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_getnewsbyid(" + id_news + ") ");
      if (res.rows[0] == undefined) {
        resolve({ status: false, code: 254, message: "Not Found" });
      }
      else resolve({ status: true, data: res.rows });

    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};
//lấy tất cả bài viết nổi bật
const getHighlightNews = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_admingethighlightnews() ");
      const sortedResult = res.rows.sort(customSort);
      resolve({ status: true, data: sortedResult });
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};
//lấy tất cả bài viết không có danh mục
const getNewsBNullCategory = async (id_category) => {
  return new Promise(async (resolve, reject) => {
    try {
        let res
        res = await db.SELECT("*", "func_getnewsbynullcategory() ");
      resolve({ status: true, data: res.rows });

    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};
// lấy tất cả bài viết cho người dùng (các bài viết có status công khai là true)
const getUserNews = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let resHighligh = await db.SELECT("*", "func_usergethighlightnews()");
      let resCategoryHighlight = await db.SELECT("*", "func_usergetnews()");
      let result ={
        highlight:resHighligh.rows,
        category:resCategoryHighlight.rows
      }
      resolve({ status: true, data: result });
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};
// Thêm bài viết nổi bật
//[id bài viết (int)]
const addNewsHighlight = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_addhighlightnews", body);
      if (res.rows[0]["func_addhighlightnews"]["status"]) {
        resolve({ status: true, message: "Đặt bài nổi bật thành công" });
      } else if(res.rows[0]["func_addhighlightnews"]["message"] == 'News already highlighted'){
        resolve({ status: false, message: "Bài viết đã được để làm nổi bật" });
      } 
      else {
        resolve({ status: false, message: "Không tìm thấy bài viết" });
      }
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}
//Sửa thứ tự bài viết nổi bật
//[id bài viết nổi bật (int), số thứ tự (int)]
const editNewsHighlightIndex = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_edithighlightnewsindex", body);
      if (res.rows[0]["func_edithighlightnewsindex"]["status"]) {
        resolve({ status: true, message: "Sửa thứ tự thành công" });
      } else if(res.rows[0]["func_edithighlightnewsindex"]["message"] == 'High light news index already exists')
        {
          resolve({ status: false, message: "Thứ tự đã được sử dụng" });
        } 
      else {
        resolve({ status: false, message: "Không tìm thấy bài viết" });
      }
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}

//Sửa trạng thái công khai bài viết nổi bật
//[id bài viết nổi bật (int), trạng thái công khai (boolean)]
const editNewsHighlightStatus = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_edithighlightnewsstatus", body);
      if (res.rows[0]["func_edithighlightnewsstatus"]["status"]) {
        resolve({ status: true, message: "Sửa trạng thái bài nổi bật thành công" });
      } else {
        resolve({ status: false, message: "Không tìm thấy bài viết" });
      }
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}

//Xóa bài viết nổi bật
//[id bài viết nổi bật (int)]
const deleteNewsHighlight = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_deletehighlightnews", body);
      if (res.rows[0]["func_deletehighlightnews"]["status"]) {
        resolve({ status: true, message: "Xóa bài bài nổi bật thành công" });
      } else {
        resolve({ status: false, message: "Không tìm thấy bài viết" });
      }
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}

//lấy các phần tử trong menu có trạng thái công khai là true
const getMenu = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_usergetmenu() ");
      const sortedResult = res.rows.sort(customSort);

      resolve({ status: true, data: sortedResult });
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};
//lấy tất cả các phần tử trong menu
const getAdminMenu = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_admingetmenu() ");
      const sortedResult = res.rows.sort(customSort);
      resolve({ status: true, data: sortedResult });
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};
//thêm phần tử trong menu
//[tên phần tử (string), link  (string)]
const addMenu = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT('*','func_addmenuitem', body);
      if (res.rows[0]["func_addmenuitem"]["status"]) {
        resolve({ status: true, message :"Thêm thành công" ,id :res.rows[0]["func_addmenuitem"]["id"] });

      } else if(res.rows[0]["func_addmenuitem"]["message"] == 'Name already exist' ) {
        resolve({ status: false, message: "Tên menu đã tồn tại" });
      }
      else resolve({ status: false, message: "Thêm thất bại" });

    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}

//Sửa thứ tự phần tử trong menu
//[id phần tử (int), thứ tự (int)])]
const editIndexMenu = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "func_editmenuindex", body);
      if (res.rows[0]["func_editmenuindex"]["status"]) {
        resolve({ status: true, message: "Sửa thành công" });
      }else if (res.rows[0]["func_editmenuindex"]["message"] == 'index already exists'){
        resolve({ status: false, message: "thứ tự không được trùng lặp" });
      } 
      else {
        resolve({ status: false, message: "không tìm thấy thư mục trong menu" });
      }
      resolve({ status: true });
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}
//Sửa trạng thái công khai phần tử trong menu
//[id phần tử (int), trạng thái (boolean)])
const editPublishMenu = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*","func_editmenustatus", body);
      if (res.rows[0]["func_editmenustatus"]["status"]) {
        resolve({ status: true, message: "Sửa thành công" });
      } else {
        resolve({ status: false, message: "không tìm thấy thư mục trong menu" });
      }
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}
//Sửa phần tử trong menu
//[id phần tử (int), tên phần tử (string),link  (string)])
const editMenu = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT('*','func_editmenuname', body);
      [12,cuong]
      if (res.rows[0]["func_editmenuname"]["status"]) {
        resolve({ status: true, message: "Sửa tên thành công" });
      } else if(res.rows[0]["func_editmenuname"]["message"] == 'Menu name already exists' ) {
        resolve({ status: false, message: "Tên menu đã tồn tại" });
      }
      else resolve({ status: false, message: "không tìm thấy thư mục trong menu" });

    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}

//Xóa phần tử trong menu
//[id phần tử (int)]
const deleteMenu = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*","func_deletemenu", body);
      if (res.rows[0]["func_deletemenu"]["status"]) {
        resolve({ status: true, message: "Xóa thành công" });
      }
      else resolve({ status: false ,message: "không tìm thấy thư mục trong menu" });
      
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}

const { exec } = require("child_process");
const { default: Message } = require("tedious/lib/message");

const delete_file_zip = async () => {
  const dir = path.join(PATH_COMMON, "del_func.bat");
  try {
    try {
      await fs.access(dir, fs.constants.F_OK);
    } catch {
      const batchContent = `
      @echo off
      cd /d ${path.join(PATH_COMMON, "temp-images")}
      del /Q *
      `;

      await fs.writeFile(dir, batchContent);
    }
    exec(`"${dir}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing batch file: ${stderr}`);
      } else {
        // console.log(stdout);
      }
    });

  } catch (error) {
    console.error(`Lỗi khi thực thi hoặc ghi file batch: ${error}`);
  }
};

const delete_file_temp_24h = async () => {
  const batchFilePath = path.join(PATH_COMMON, "del_func.bat");
  try {
    // Kiểm tra nếu tệp batch chưa tồn tại, tạo tệp
    try {
      await fs.access(batchFilePath, fs.constants.F_OK);
    } catch {
      const batchContent = `
      @echo off
      cd /d ${path.join(PATH_COMMON, "temp-images")}
      for /d %%p in (*) do rmdir /s /q "%%p"
      del /Q *
      `;
      await fs.writeFile(batchFilePath, batchContent);
    }

    // Thực thi tệp batch
    exec(`"${batchFilePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing batch file: ${stderr}`);
      } else {
        console.log(stdout);
      }
    });

  } catch (error) {
    console.error(`Lỗi khi thực thi hoặc ghi file batch: ${error}`);
  }
};

// 0 0 = 24 pm
cron.schedule('0 0 * * *', () => {
  console.log(`[${new Date().toISOString()}] Running delete_file_temp_24h task...`);
  delete_file_temp_24h();
});
module.exports = {
  
  delete_file_zip,
  getNews,
  getAllCategories,
  getNewsByCategory,
  editIndexNews,
  editPublishNews,
  createNews,
  editNews,
  deleteNews,
  getNewsById,
  getUserNews,
  addCategory,
  editCategoryName,
  editCategoryIndex,
  editCategoryStatus,
  deleteCategory,
  getMenu,
  getAdminMenu,
  addMenu,
  editIndexMenu,
  editPublishMenu,
  editMenu,
  deleteMenu,
  addNewsHighlight,
  deleteNewsHighlight,
  editNewsHighlightIndex,
  editNewsHighlightStatus,
  getNewsBNullCategory,
  getHighlightNews,
};

// select * from Customer_Occupation("18")
