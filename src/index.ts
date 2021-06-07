import "dotenv/config";
import uploadFiles from "./controller/uploadFiles";
import cron from "node-cron";

(async () => {
  await uploadFiles("split");
})();

cron.schedule(
  "0 0 0 * * *",
  async () => {
    try {
      console.log(
        `[SINC-DIARIO] Data ${new Date().getDate()}/${
          new Date().getMonth() + 1
        }/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
      );

      await uploadFiles("split");
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
