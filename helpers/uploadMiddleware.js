import multer from "multer";
import path from "path";

const tempDir = path.join(process.cwd(), "temp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerConfig,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Файл має бути зображенням"));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export default upload;
