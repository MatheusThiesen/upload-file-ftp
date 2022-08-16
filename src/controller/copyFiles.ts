import FTPClient from "../service/FTPClient";
import path from "path";
import fs from "fs";

const path_copy = process.env.PATH_COPY || "";
// const path_remote = process.env.PATH_REMOTE || "";

const ftp = new FTPClient({
  host: process.env.FTP_ALPAR_HOST,
  username: process.env.FTP_ALPAR_USERNAME,
  password: process.env.FTP_ALPAR_PASSWORD,
  port: Number(process.env.FTP_ALPAR_PORT),
  secure: false,
});

async function exec() {
  try {
    console.log(
      `[INICIO] Sincronização de arquivos MKT ${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    );

    //Inicia conexão com FTP
    await ftp.client.access(ftp.settings);
    //Download dos arquivos
    // await ftp.client.downloadToDir(path.resolve(path_copy), "Alpar");

    let pathMap: any = {};

    const onePath = await ftp.client.list("Alpar");

    for (const one of onePath) {
      pathMap = {
        ...pathMap,
        [one.name]: one.isFile ? "file" : {},
      };
      const twoPath = await ftp.client.list(`Alpar/${one.name}`);

      for (const two of twoPath) {
        pathMap = {
          ...pathMap,
          [one.name]: {
            ...pathMap[one.name],
            [two.name]: two.isFile ? "file" : {},
          },
        };

        const threePath = await ftp.client.list(
          `Alpar/${one.name}/${two.name}`
        );

        for (const three of threePath) {
          pathMap = {
            ...pathMap,
            [one.name]: {
              ...pathMap[one.name],
              [two.name]: {
                ...pathMap[one.name][two.name],
                [three.name]: three.isFile ? "file" : {},
              },
            },
          };

          const fourPath = await ftp.client.list(
            `Alpar/${one.name}/${two.name}/${three.name}`
          );
          for (const four of fourPath) {
            pathMap = {
              ...pathMap,
              [one.name]: {
                ...pathMap[one.name],
                [two.name]: {
                  ...pathMap[one.name][two.name],
                  [three.name]: {
                    ...pathMap[one.name][two.name][three.name],
                    [four.name]: four.isFile ? "file" : {},
                  },
                },
              },
            };

            const fivePath = await ftp.client.list(
              `Alpar/${one.name}/${two.name}/${three.name}/${four.name}`
            );
            for (const five of fivePath) {
              pathMap = {
                ...pathMap,
                [one.name]: {
                  ...pathMap[one.name],
                  [two.name]: {
                    ...pathMap[one.name][two.name],
                    [three.name]: {
                      ...pathMap[one.name][two.name][three.name],
                      [four.name]: {
                        ...pathMap[one.name][two.name][three.name][four.name],
                        [five.name]: five.isFile ? "file" : {},
                      },
                    },
                  },
                },
              };
            }
          }
        }
      }
    }

    console.log(pathMap);

    for (const one of Object.keys(pathMap)) {
      fs.mkdir(path.resolve(path_copy, one), () => {});
    }

    for (const one of Object.keys(pathMap)) {
      const twoPath = Object.keys(pathMap[one]);
      for (const two of twoPath) {
        fs.mkdir(path.resolve(path_copy, one, two), () => {});
      }
    }

    for (const one of Object.keys(pathMap)) {
      const twoPath = Object.keys(pathMap[one]);
      for (const two of twoPath) {
        const threePath = Object.keys(pathMap[one][two]);
        for (const three of threePath) {
          fs.mkdir(path.resolve(path_copy, one, two, three), () => {});
        }
      }
    }

    for (const one of Object.keys(pathMap)) {
      const twoPath = Object.keys(pathMap[one]);
      for (const two of twoPath) {
        const threePath = Object.keys(pathMap[one][two]);
        for (const three of threePath) {
          const fourPath = Object.keys(pathMap[one][two][three]);
          for (const four of fourPath) {
            fs.mkdir(path.resolve(path_copy, one, two, three, four), () => {});
          }
        }
      }
    }

    // for (const one of Object.keys(pathMap)) {
    //   const twoPath = Object.keys(pathMap[one]);
    //   for (const two of twoPath) {
    //     const threePath = Object.keys(pathMap[one][two]);
    //     for (const three of threePath) {
    //       const fourPath = Object.keys(pathMap[one][two][three]);
    //       for (const four of fourPath) {
    //         // fs.mkdirSync(path.resolve(path_copy, one, two, three));
    //         console.log(`[INICIO] Download pasta ${four}`);
    //         //Download dos arquivos
    //         await ftp.client.downloadToDir(
    //           path.resolve(path_copy, one, two, three, four),
    //           `Alpar/${one}/${two}/${three}/${four}`
    //         );
    //         console.log(`[FIM] Download pasta ${four}`);
    //       }
    //     }
    //   }
    // }

    console.log(
      `[FIM] Sincronização de arquivos MKT ${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    );

    //Finaliza conexão com FTP
    ftp.client.close();
  } catch (err) {
    console.log(err);
  }
}

export default exec;
