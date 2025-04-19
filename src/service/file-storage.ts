import multer from "multer";

export function initFileMiddleware() {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Save files in "uploads" folder
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Keep original filename
    },
  });
  return multer({ storage });
}
