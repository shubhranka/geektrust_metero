import { services } from "./metroServices.js";
import { platforms } from "../constants/constants.js";
import { journey_details, metro_cards, summary } from "../models/models.js";

describe("Metro Services", () => {
  beforeEach(() => {
    journey_details.length = 0;
    metro_cards.length = 0;
    summary.length = 0;
  });

  describe("balanceService", () => {
    it("should update the balance of the metro card", () => {
      const args = ["1234567890", "100"];
      services.balanceService(args);
      expect(metro_cards["1234567890"]).toEqual(100);
    });
  });

  describe("checkInService", () => {
    beforeEach(() => {
      metro_cards["1234567890"] = 100;
    });

    it("should charge the correct amount for an adult passenger", () => {
      const args = ["1234567890", "ADULT", platforms.CENTRAL];
      services.checkInService(args);
      expect(metro_cards["1234567890"]).toEqual(85);
      expect(summary[platforms.CENTRAL].value).toEqual(85);
      expect(summary[platforms.CENTRAL].ADULT).toEqual(1);
    });

    it("should charge the correct amount for a kid passenger", () => {
      const args = ["1234567890", "KID", platforms.CENTRAL];
      services.checkInService(args);
      expect(metro_cards["1234567890"]).toEqual(70);
      expect(summary[platforms.CENTRAL].value).toEqual(70);
      expect(summary[platforms.CENTRAL].KID).toEqual(1);
    });

    it("should charge the correct amount for a senior citizen passenger", () => {
      const args = ["1234567890", "SENIOR_CITIZEN", platforms.CENTRAL];
      services.checkInService(args);
      expect(metro_cards["1234567890"]).toEqual(50);
      expect(summary[platforms.CENTRAL].value).toEqual(50);
      expect(summary[platforms.CENTRAL].SENIOR_CITIZEN).toEqual(1);
    });

    it("should apply a 50% discount for a return journey", () => {
      journey_details.push({
        card_number: "1234567890",
        passenger_type: "ADULT",
        platform: platforms.AIRPORT,
      });
      const args = ["1234567890", "ADULT", platforms.CENTRAL];
      services.checkInService(args);
      expect(metro_cards["1234567890"]).toEqual(57.5);
      expect(summary[platforms.CENTRAL].value).toEqual(57.5);
      expect(summary[platforms.CENTRAL].ADULT).toEqual(1);
      expect(summary[platforms.CENTRAL].discount).toEqual(42.5);
    });

    it("should charge a transaction fee if the balance is insufficient", () => {
      metro_cards["1234567890"] = 10;
      const args = ["1234567890", "ADULT", platforms.CENTRAL];
      services.checkInService(args);
      expect(metro_cards["1234567890"]).toEqual(0);
      expect(summary[platforms.CENTRAL].value).toEqual(10.3);
      expect(summary[platforms.CENTRAL].ADULT).toEqual(1);
    });
  });

  describe("printSummaryService", () => {
    beforeEach(() => {
      summary[platforms.CENTRAL] = {
        value: 100,
        discount: 50,
        ADULT: 2,
        KID: 1,
        SENIOR_CITIZEN: 0,
      };
      summary[platforms.AIRPORT] = {
        value: 150,
        discount: 0,
        ADULT: 1,
        KID: 2,
        SENIOR_CITIZEN: 1,
      };
    });

    it("should print the summary for each platform", () => {
      const consoleSpy = jest.spyOn(console, "log");
      services.printSummaryService();
      expect(consoleSpy).toHaveBeenCalledWith(
        "TOTAL_COLLECTION",
        platforms.CENTRAL,
        100,
        50
      );
      expect(consoleSpy).toHaveBeenCalledWith("ADULT", 2);
      expect(consoleSpy).toHaveBeenCalledWith("KID", 1);
      expect(consoleSpy).toHaveBeenCalledWith(
        "TOTAL_COLLECTION",
        platforms.AIRPORT,
        150,
        0
      );
      expect(consoleSpy).toHaveBeenCalledWith("ADULT", 1);
      expect(consoleSpy).toHaveBeenCalledWith("KID", 2);
      expect(consoleSpy).toHaveBeenCalledWith("SENIOR_CITIZEN", 1);
    });
  });
});