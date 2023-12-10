import { readFile } from "fs";
import { commands } from "./commands/commands.js";
import { services } from "./services/metroServices.js";

const filename = process.argv[2];



readFile(filename, "utf8", (err, data) => {
  if (err) throw err;
  var inputLines = data.toString().split("\n");
  // Add your code here to process input commands

  for (let line of inputLines) {
    const command = line.split(" ")[0];
    const args = line.split(" ").slice(1);

    switch (command) {
      case commands.BALANCE:
        services.balanceService(args);
        break;
      case commands.CHECK_IN:
        services.checkInService(args);
        break;
      case commands.PRINT_SUMMARY:
        services.printSummaryService(args);
        break;
    }
  }
});
