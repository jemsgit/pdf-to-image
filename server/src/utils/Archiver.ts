import archiver from "archiver";
import path from "path";
import fs from "fs";

class Archiver {
  archive: unknown;
  output: unknown;
  zipFilePath: string;

  constructor(zipFilePath: string) {
    this.zipFilePath = zipFilePath;
    this.archive = archiver("zip", { zlib: { level: 9 } });
    this.output = fs.createWriteStream(this.zipFilePath);
    this.archive.pipe(this.output);
  }

  onFinish(cb) {
    this.output.on("close", () => {
      console.log(this.archive.pointer() + " total bytes");
      console.log(
        "archiver has been finalized and the output file descriptor has closed.",
      );
      cb(this.zipFilePath);
    });
  }

  onError(cb) {
    this.output.on("error", cb);
  }

  addFile(path: string, params: unknown) {
    this.archive.file(path, params);
  }

  finalize() {
    this.archive.finalize();
  }
}

export default Archiver;
