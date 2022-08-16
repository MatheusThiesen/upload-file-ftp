import fs from "fs";
import path from "path";
import FTPClient from "../service/FTPClient";

const path_source = process.env.PATH_SOURCE || "";
const path_remote = process.env.PATH_REMOTE || "";

const ftp = new FTPClient({
  host: process.env.FTP_ALPARHUB_HOST,
  username: process.env.FTP_ALPARHUB_USERNAME,
  password: process.env.FTP_ALPARHUB_PASSWORD,
  port: Number(process.env.FTP_ALPARHUB_PORT),
  secure: false,
});

async function exec(type: "all" | "split", timeSplit: number) {
  //Lista todos arquivos da pasta
  fs.readdir(path.resolve(path_source), async (err, files) => {
    var contEdit = 0;

    //Se ocorrer erro ele reclama
    if (err) throw err;

    console.log(
      `[INICIO] Sincronização por FTP Data ${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    );

    //Percorre todos os arquivos

    var uploadFiles: string[] = [];

    for (const file of files) {
      if (type === "split") {
        var now: Date = new Date();
        now.setMinutes(now.getMinutes() - timeSplit);

        //informações do arquivo
        const statFile = fs.statSync(path.resolve(path_source, file));
        if (
          now <= new Date(statFile.mtime) ||
          now <= new Date(statFile.ctime) ||
          now <= new Date(statFile.birthtime) ||
          now <= new Date(statFile.atime)
        ) {
          uploadFiles.push(file);
        }
      } else {
        uploadFiles.push(file);
      }
    }

    for (const file of uploadFiles) {
      await ftp.upload(
        path.resolve(path_source, file),
        `/${path_remote}/${file}`
      );

      contEdit += 1;

      console.log(
        `[ANDAMENTO] ${contEdit} DE ${
          uploadFiles.length
        } arquivos enviados   Data ${new Date().getDate()}/${
          new Date().getMonth() + 1
        }/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
      );
    }

    console.log(
      `[FIM] Sincronização por FTP, total de ${contEdit} arquivos  Data ${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    );
  });
}

export default exec;
