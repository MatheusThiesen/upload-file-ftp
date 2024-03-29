import "dotenv/config";
import cron from "node-cron";
// import copyFiles from "./controller/copyFiles";
import uploadFiles from "./controller/uploadFiles";

(async () => {
  await uploadFiles(
    "split",
    1 * 60 * 24 * 300 //300 dia
  );
  // await copyFiles();
})();

cron.schedule(
  "0 0 */5 * * *",
  async () => {
    try {
      console.log(
        `[SINC-DIARIO] Data ${new Date().getDate()}/${
          new Date().getMonth() + 1
        }/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
      );

      await uploadFiles("split", 5);
      // await copyFiles();
    } catch (error) {
      console.log(
        `[ERRO][SINC-DIARIO] Data ${new Date().getDate()}/${
          new Date().getMonth() + 1
        }/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
      );
    }
  },
  { scheduled: true, timezone: "America/Sao_Paulo" }
);

// cron.schedule(
//   "0 0 0 * * 6",
//   async () => {
//     try {
//       console.log(
//         `[SINC-SEMANAL] Data ${new Date().getDate()}/${
//           new Date().getMonth() + 1
//         }/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
//       );

//       await uploadFiles("all");
//     } catch (error) {
//       console.log(
//         `[ERRO][SINC-SEMANAL] Data ${new Date().getDate()}/${
//           new Date().getMonth() + 1
//         }/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
//       );
//     }
//   },
//   { scheduled: true, timezone: "America/Sao_Paulo" }
// );
