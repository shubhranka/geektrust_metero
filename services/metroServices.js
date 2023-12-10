import { platforms, travel_charges } from "../constants/constants.js";
import { journey_details, metro_cards, summary } from "../models/models.js";

const getTwoPercentDiscount = (value) => value * 0.02;

const getFiftyPercentDiscount = (value) => value * 0.5;

const findPassengerJourney = (card_number, passenger_type, platform) =>
  journey_details.findIndex(
    (e) =>
      e.card_number === card_number &&
      e.platform === platform &&
      e.passenger_type === passenger_type
  );

export const services = {
  balanceService: (args) => {
    const card_number = args[0];
    const card_balance = Number.parseInt(args[1].trim());
    metro_cards[card_number] = card_balance;
  },

  checkInService: (args) => {
    const card_number = args[0];
    const passenger_type = args[1];
    const platform = args[2];
    let charges = travel_charges[passenger_type];
    let first_journey_index = -1;
    let return_journey = false;

    if (platform === platforms.CENTRAL) {
      first_journey_index = findPassengerJourney(
        card_number,
        passenger_type,
        platforms.AIRPORT
      );
    } else {
      first_journey_index = findPassengerJourney(
        card_number,
        passenger_type,
        platforms.CENTRAL
      );
    }

    if (first_journey_index !== -1) {
      charges = getFiftyPercentDiscount(charges);
      summary[platform].discount += charges;
      journey_details.splice(first_journey_index, 1);
      return_journey = true;
    }

    const balance = metro_cards[args[0]];

    if (balance >= charges) {
      metro_cards[card_number] -= charges;
    } else {
      const remaining_amount = charges - balance;
      metro_cards[card_number] = 0;
      const transaction_charge = getTwoPercentDiscount(remaining_amount);
      summary[platform].value += transaction_charge;
    }

    summary[platform].value += charges;
    summary[platform][passenger_type] += 1;

    if (!return_journey) {
      journey_details.push({
        card_number,
        passenger_type,
        platform,
      });
    }
  },
  printSummaryService: () => {
    for (let platform in platforms) {
      console.log(
        "TOTAL_COLLECTION",
        platform,
        summary[platform].value,
        summary[platform].discount
      );

      const passengers = ["ADULT", "KID", "SENIOR_CITIZEN"];
        
      console.log("PASSENGER_TYPE_SUMMARY");
      passengers.forEach((passenger_type) => {
        const count = summary[platform][passenger_type];
        if (count > 0) {
          console.log(passenger_type, count);
        }
      });
    }
  },
};
