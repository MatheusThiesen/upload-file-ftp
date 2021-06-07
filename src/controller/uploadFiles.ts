import FTPClient from "../service/FTPClient";
import fs from "fs";
import path from "path";

const path_source = process.env.PATH_SOURCE || "";
const path_remote = process.env.PATH_REMOTE || "";

const ftp = new FTPClient({
  host: process.env.FTP_HOST,
  username: process.env.FTP_USERNAME,
  password: process.env.FTP_PASSWORD,
  port: Number(process.env.FTP_PORT),
  secure: false,
});

async function exec(type: "all" | "split") {
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
    for (const file of files) {
      if (type === "split") {
        var now: Date = new Date();
        now.setDate(now.getDate() - 1);

        //informações do arquivo
        const statFile = fs.statSync(path.resolve(path_source, file));
        if (new Date(statFile.mtime) > now) {
          await ftp.upload(
            path.resolve(path_source, file),
            `/${path_remote}/${file}`
          );

          contEdit += 1;
        }
      } else {
        await ftp.upload(
          path.resolve(path_source, file),
          `/${path_remote}/${file}`
        );
        contEdit += 1;
      }
    }

    console.log(
      `[FIM] Sincronização por FTP, total de ${contEdit} arquivos  Data ${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    );
  });
}

export default exec;
