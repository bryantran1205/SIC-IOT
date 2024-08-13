const router = require("express").Router();
const data = require("./dataprocess");
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const { PORT, LOCALHOST, PATH_COMMON } = process.env;

router.post("/get-session-id", (req, res) => {
  const sessionId = uuidv4();
  res.json({ sessionId });
});
  
const removeOldBiaImage = async (dirPath) => {
  try {
    const files = await fs.readdir(dirPath);
    for (const file of files) {
      if (file.includes("__bia") && !file.includes(`${Date.now()}__bia`)) {
        await fs.unlink(path.join(dirPath, file));
      }
    }
  } catch (error) {
    console.error("Error removing old __bia image:", error);
  }
};

const tempStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const session_id = req.headers["session_id"];
    const dirPath = path.join(PATH_COMMON, "temp-images", session_id);
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
    req.sessionId = session_id;
    req.tempDirPath = dirPath;
    cb(null, dirPath);
  },
  filename: async (req, file, cb) => {
    const dirPath = req.tempDirPath;

    const originalName = file.originalname;
    const hasBiaSuffix = originalName.includes("__bia");

    const extname = path.extname(originalName);
    const basename = path.basename(originalName, extname);

    const newFilename = hasBiaSuffix
      ? `${Date.now()}__bia${extname}`
      : `${Date.now()}${extname}`;

    if (hasBiaSuffix) {
      await removeOldBiaImage(dirPath);
    }

    cb(null, newFilename);
  },
});

const uploadTemp = multer({
  storage: tempStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dirPath = path.join(PATH_COMMON, "images");
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
    cb(null, dirPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/news", async (req, res) => {
  let result = await data.getNews(req.body.name_file);
  res.json(result);
});

router.get("/get-all-categories", async (req, res) => {
  let result = await data.getAllCategories();
  res.json(result);
});

router.post("/add-category", async (req, res) => {
  let result = await data.addCategory(req.body);
  res.json(result);
});

router.post("/edit-category-name", async (req, res) => {
  let result = await data.editCategoryName(req.body);
  res.json(result);
});

router.post("/edit-category-index", async (req, res) => {
  let result = await data.editCategoryIndex(req.body);
  res.json(result);
});

router.post("/edit-category-status", async (req, res) => {
  let result = await data.editCategoryStatus(req.body);
  res.json(result);
});

router.post("/delete-category", async (req, res) => {
  let result = await data.deleteCategory(req.body);
  res.json(result);
});

router.get("/get-news-by-id/:id", async (req, res) => {
  let result = await data.getNewsById(req.params.id);
  res.json(result);
});

router.get("/get-news-by-category/:id", async (req, res) => {
  let result = await data.getNewsByCategory(req.params.id);
  res.json(result);
});

router.get("/get-highlight-news", async (req, res) => {
  let result = await data.getHighlightNews();
  res.json(result);
})

router.get("/get-news-by-null-category", async (req, res) => {
  let result = await data.getNewsBNullCategory();
  res.json(result);
});


router.post("/edit-index-news", async (req, res) => {
  let result = await data.editIndexNews(req.body);
  res.json(result);
});

router.post("/edit-publish-news", async (req, res) => {
  let result = await data.editPublishNews(req.body);
  res.json(result);
});

router.post("/edit-news", async (req, res) => {
  try {
    let result = await data.editNews(req.body);
    res.json(result);
  } catch (error) {
    console.error("Unhandled error:", error);
    res.json({ status: false, message: "Unhandled error occurred" });
  }
}); 

router.post("/delete-news", async (req, res) => {
  let result = await data.deleteNews(req.body);
  res.json(result);
  // if (result.status) {
  //   data.deleteFolderAndFile(folderName, imgName);
  // }
});

router.get("/get-menu", async (req, res) => {
  let result = await data.getMenu();
  res.json(result);
});

router.get("/get-admin-menu", async (req, res) => {
  let result = await data.getAdminMenu();
  res.json(result);
});

router.post("/add-menu", async (req, res) => {
  try {
    let result = await data.addMenu(req.body);
    res.json(result);
  } catch (error) {
    res.json({ status: false, message: "Unhandled error occurred" });
  }
});

router.post("/edit-index-menu", async (req, res) => {
  let result = await data.editIndexMenu(req.body);
  res.json(result);
});

router.post("/edit-publish-menu", async (req, res) => {
  let result = await data.editPublishMenu(req.body);
  res.json(result);
});

router.post("/edit-name-menu", async (req, res) => {
  try {
    let result = await data.editMenu(req.body);
    res.json(result);
  } catch (error) {
    res.json({ status: false, message: "Unhandled error occurred" });
  }
});

router.post("/delete-menu", async (req, res) => {
  let result = await data.deleteMenu(req.body);
  res.json(result);
});

router.get("/get-news", async (req, res) => {
  let result = await data.getUserNews();
  res.json(result);
});

router.post("/add-news-highlight", async (req, res) => {
  let result = await data.addNewsHighlight(req.body);
  res.json(result);
});

router.post("/eidt-news-highlight-index", async (req, res) => {
  let result = await data.editNewsHighlightIndex(req.body);
  res.json(result);
});

router.post("/eidt-news-highlight-status", async (req, res) => {
  let result = await data.editNewsHighlightStatus(req.body);
  res.json(result);
});

router.post("/delete-news-highlight", async (req, res) => {
  let result = await data.deleteNewsHighlight(req.body);
  res.json(result);
});

router.post("/upload-image", upload.single("upload"), async (req, res) => {
  // console.log(req.file); // Kiểm tra thông tin tệp
  // console.log(req.body); // Kiểm tra các trường khác trong yêu cầu
});

router.post("/upload-image-temp", uploadTemp.single("upload"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const tempFileUrl = `${LOCALHOST}:${PORT}/temp-images/${req.sessionId}/${req.file.filename}`;
  // console.log("tempFileUrl:", tempFileUrl);
  res.json({
    url: tempFileUrl,
    sessionId: req.headers.sessionid,
    imageName: req.file.filename,
  });
});

router.post("/save-edit-news", async (req, res) => {
  const { content, sessionId, dataArray } = req.body;
  const tempDir = path.join(PATH_COMMON, "temp-images", sessionId);
  const finalDir = path.join(PATH_COMMON, "images");

  try {
    console.log("tempDir:", tempDir);
    console.log("dataArray[1]:", dataArray[1]);

    // Xác định tiền tố thư mục cuối cùng
    const index = dataArray[1].indexOf("__");
    const prefix = index !== -1 ? dataArray[1].substring(index + 2) : "";
    console.log("sessionId:", sessionId);
    console.log("prefix:", prefix);
    const prefixDir = path.join(finalDir, prefix);

    // Tạo thư mục cuối cùng nếu chưa tồn tại
    if (!(await directoryExists(prefixDir))) {
      await fs.mkdir(prefixDir, { recursive: true });
    }

    // Cập nhật nội dung hình ảnh
    let updatedContent = updateContentWithNewImagePaths(content, sessionId, prefix);
    updatedContent = updateContentToCenterImages(updatedContent);
    updatedContent = updateContentReplaceSingleQuotes(updatedContent);

    if (Array.isArray(dataArray) && dataArray.length > 3) {
      dataArray[3] = updatedContent;
    }

    // Tạo tin tức mới
    const result = await data.editNews(dataArray);

    if (result.status === true) {
      // Lấy danh sách tệp từ thư mục tạm
      let tempFiles = [];
      try {
        tempFiles = await fs.readdir(tempDir);
      } catch (error) {
        if (error.code === "ENOENT") {
          console.log(`Thư mục tạm thời không tồn tại: ${tempDir}`);
        } else {
          throw error;
        }
      }

      const newBiaImage = tempFiles.find(file => file.includes("__bia"));

      if (newBiaImage) {
        // Xóa ảnh bìa cũ nếu có
        const existingFiles = await fs.readdir(prefixDir);
        const existingBiaImage = existingFiles.find(file => file.includes("__bia"));

        if (existingBiaImage) {
          console.log("Removing existing Bia image:", existingBiaImage);
          await fs.unlink(path.join(prefixDir, existingBiaImage));
        }

        console.log("Moving new Bia image to final directory:", newBiaImage);
        await fs.rename(path.join(tempDir, newBiaImage), path.join(prefixDir, newBiaImage));
      }

      // Lấy danh sách hình ảnh từ nội dung đã cập nhật
      const imageNamesInContent = [
        ...updatedContent.matchAll(/\/([^\/"]+\.(jpg|jpeg|png|gif))/g),
      ].map(match => match[1]);
      console.log("Image names in content:", imageNamesInContent);

      // Lấy danh sách các tệp hiện có trong thư mục cuối cùng
      const existingFiles = await fs.readdir(prefixDir);
      console.log("Existing files in final directory:", existingFiles);

      // Xóa các hình ảnh không cần thiết trong thư mục cuối cùng
      for (const file of existingFiles) {
        if (!imageNamesInContent.includes(file) && !file.includes("__bia")) {
          console.log("Removing unnecessary file:", file);
          await fs.unlink(path.join(prefixDir, file));
        }
      }

      // Di chuyển tất cả các tệp còn lại từ thư mục tạm sang thư mục cuối cùng
      await moveImagesFromTempToFinal(tempDir, prefixDir, tempFiles);
    }

    // Xóa thư mục tạm
    console.log("Deleting temporary directory:", tempDir);
    await deleteTempDirectory(tempDir);

    // Trả về kết quả
    res.json({ content: updatedContent, sessionId, result });

  } catch (error) {
    console.error("Unhandled error:", error);
    res.status(500).json({ status: false, message: "Unhandled error occurred" });
  }
});

// Hàm kiểm tra sự tồn tại của thư mục
async function directoryExists(dirPath) {
  try {
    await fs.access(dirPath);
    return true;
  } catch {
    return false;
  }
}

//create news
router.post("/save-post", async (req, res) => {
  const { content, sessionId, dataArray } = req.body;
  const tempDir = path.join(PATH_COMMON, "temp-images", sessionId);
  console.log("dataArray[1]:", dataArray[1]);
  let index = dataArray[1].indexOf("__");
  let prefix = "";
  if (index !== -1) {
    prefix = dataArray[1].substring(index + 2);
  }

  const finalDir = path.join(PATH_COMMON, "images", prefix);

  try {
    if (
      !(await fs
        .access(finalDir)
        .then(() => true)
        .catch(() => false))
    ) {
      await fs.mkdir(finalDir, { recursive: true });
    }

    let updatedContent = updateContentWithNewImagePaths(
      content,
      sessionId,
      prefix
    );
    updatedContent = updateContentToCenterImages(updatedContent);
    updatedContent = updateContentReplaceSingleQuotes(updatedContent);
    if (Array.isArray(dataArray) && dataArray.length > 3) {
      dataArray[3] = updatedContent;
    }

    let result = await data.createNews(dataArray);

    if (result.status === true) {
      const imageNamesInContent = [
        ...content.matchAll(/\/([^\/"]+\.(jpg|jpeg|png|gif))/g),
      ].map((match) => match[1]);
      const imageNameFromArray = dataArray[0];
      if (imageNameFromArray) {
        imageNamesInContent.push(imageNameFromArray);
      }

      await moveImagesFromTempToFinal(tempDir, finalDir, imageNamesInContent);
    }

    await deleteTempDirectory(tempDir);

    res.json({ content: updatedContent, sessionId, result });
  } catch (error) {
    console.error("Unhandled error:", error);
    res
      .status(500)
      .json({ status: false, message: "Unhandled error occurred" });
  }
});

const updateContentReplaceSingleQuotes = (content) => {
  return content.replace(/'/g, '"');
};

const moveImagesFromTempToFinal = async (tempDir, finalDir, imageNames) => {
  console.log(`Danh sách tên ảnh: ${imageNames}`);
  console.log(`Thư mục tạm thời: ${tempDir}`);
  console.log(`Thư mục đích: ${finalDir}`);

  await Promise.all(
    imageNames.map(async (imageName) => {
      const fileName = path.basename(imageName);
      const tempFilePath = path.join(tempDir, fileName);
      const finalFilePath = path.join(finalDir, fileName);

      try {
        await fs.copyFile(tempFilePath, finalFilePath);
        console.log(
          `Đã di chuyển ${fileName} từ ${tempFilePath} đến ${finalFilePath}`
        );
      } catch (err) {
        console.error(`Lỗi khi di chuyển ${fileName}: ${err.message}`);
      }
    })
  );
};

const updateContentWithNewImagePaths = (content, sessionId, prefix) => {
  if (typeof content !== "string") {
    throw new Error("Content must be a string");
  }

  const tempDir = `/temp-images/${sessionId}`;
  const newPath = `/images/${prefix}`;

  return content.replace(new RegExp(tempDir, "g"), newPath);
};

const updateContentToCenterImages = (htmlContent) => {
  return htmlContent.replace(
    /<figure\s*class="image"(?![^>]*style)([^>]*)>/g,
    (match, p1) => {
      return `<figure class="image" style="text-align: center;"${p1}>`;
    }
  );
};

const deleteTempDirectory = async (tempDir) => {
  try {
    // Kiểm tra xem thư mục có tồn tại không
    try {
      await fs.access(tempDir);
    } catch {
      console.log(`Thư mục không tồn tại: ${tempDir}`);
      return; // Thoát hàm nếu thư mục không tồn tại
    }

    // Xóa thư mục và tất cả các tệp bên trong
    await fs.rm(tempDir, { recursive: true, force: true });
    console.log(`Đã xóa thư mục tạm thời: ${tempDir}`);
  } catch (err) {
    console.error(`Lỗi khi xóa thư mục tạm thời: ${err.message}`);
  }
};

module.exports = router;
