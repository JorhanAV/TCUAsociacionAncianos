// middleware/ActasUpload.ts
import multer from "multer";
import path from "path";

const __basedir = path.resolve();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__basedir, "/assets/uploads/actas/"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export default multer({ storage }).single("archivo");
