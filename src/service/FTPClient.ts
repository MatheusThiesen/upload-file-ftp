import * as ftp from "basic-ftp";
import fs from "fs";

class FTPClient {
  client: ftp.Client;
  settings: {
    host: string;
    port: number;
    user: string;
    password: string;
    secure: boolean;
  };
  constructor({
    host = "localhost",
    port = 21,
    username = "anonymous",
    password = "guest",
    secure = false,
  }) {
    this.client = new ftp.Client();
    this.settings = {
      host: host,
      port: port,
      user: username,
      password: password,
      secure: secure,
    };
  }

  async upload(sourcePath: string, remotePath: string) {
    let self = this;

    try {
      //Inicia conexão com FTP
      await self.client.access(self.settings);
      //Realiza upload do arquivo
      await self.client.upload(fs.createReadStream(sourcePath), remotePath);
    } catch (err) {
      console.log(err);
    }
    //Finaliza conexão com FTP
    self.client.close();
  }

  close() {
    this.client.close();
  }
}

export default FTPClient;
