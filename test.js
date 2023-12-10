import { services } from "./services/metroServices.js";
import { platforms } from "./constants/constants.js";
import { journey_details, metro_cards, summary } from "./models/models.js";
import chai from "chai";

const expect = chai.expect;

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
      expect(metro_cards["1234567890"]).to.equal(100);
    });
  });

  describe("checkInService", () => {
    beforeEach(() => {
      metro_cards["1234567890"] = 100;
    });

    it("should charge the correct amount for an adult passenger", () => {
      const args = ["1234567890", "ADULT", platforms.CENTRAL];
      services.checkInService(args);
      expect(metro_cards["1234567890"]).to.equal(0);
      expect(summary[platforms.CENTRAL].value).to.equal(202);
      expect(summary[platforms.CENTRAL].ADULT).to.equal(1);
    });

    it("should charge the correct amount for a kid passenger", () => {
      const args = ["1234567890", "KID", platforms.CENTRAL];
      services.checkInService(args);
      expect(metro_cards["1234567890"]).to.equal(50);
      expect(summary[platforms.CENTRAL].value).to.equal(252);
      expect(summary[platforms.CENTRAL].KID).to.equal(1);
    });

    it("should charge the correct amount for a senior citizen passenger", () => {
      const args = ["1234567890", "SENIOR_CITIZEN", platforms.CENTRAL];
      services.checkInService(args);
      expect(metro_cards["1234567890"]).to.equal(0);
      expect(summary[platforms.CENTRAL].value).to.equal(352);
      expect(summary[platforms.CENTRAL].SENIOR_CITIZEN).to.equal(1);
    });

    it("should apply a 50% discount for a return journey", () => {
      journey_details.push({
        card_number: "1234567890",
        passenger_type: "ADULT",
        platform: platforms.AIRPORT,
      });
      const args = ["1234567890", "ADULT", platforms.CENTRAL];
      services.checkInService(args);
      expect(metro_cards["1234567890"]).to.equal(0);
      expect(summary[platforms.CENTRAL].value).to.equal(452);
      expect(summary[platforms.CENTRAL].ADULT).to.equal(2);
      expect(summary[platforms.CENTRAL].discount).to.equal(100);
    });

    it("should charge a transaction fee if the balance is insufficient", () => {
      metro_cards["1234567890"] = 10;
      const args = ["1234567890", "ADULT", platforms.CENTRAL];
      services.checkInService(args);
      expect(metro_cards["1234567890"]).to.equal(0);
      expect(summary[platforms.CENTRAL].value).to.equal(655.8);
      expect(summary[platforms.CENTRAL].ADULT).to.equal(3);
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
  });
});