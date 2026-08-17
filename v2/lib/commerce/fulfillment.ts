import type { FulfillmentPolicy } from "./types";

// Server-only policy data. This module is not imported by any V2 client
// component or public route. It contains storage object names and env refs.
export const fulfillmentPolicies = [
  {
    offerId: "offer-hardtechno-essentials-v1",
    productName: "Hardtechno Essentials Vol. 1",
    emailSubject: "Your AKA SOUNDS Download Request!",
    storageObject: { kind: "environment", variable: "GCP_FILE_NAME" },
  },
  {
    offerId: "offer-hardtechno-essentials-free-trial",
    productName: "Hardtechno Essentials Vol. 1 (Free Trial)",
    emailSubject: "Your AKA SOUNDS Free Access!",
    storageObject: {
      kind: "static",
      objectName: "AKA_SOUNDS_HARDTECHNO-ESSENTIALS-VOL.-1-FREE-TRIAL 1.zip",
    },
  },
  {
    offerId: "offer-serum-2-reverse-bass-kick",
    productName: "AKA Sounds Free Serum 2 Reverse Bass Kick",
    emailSubject: "Your AKA SOUNDS Download Request!",
    storageObject: {
      kind: "static",
      objectName: "AKA Sounds Free Serum 2 Reverse Bass Kick.zip",
    },
  },
  {
    offerId: "offer-serum-2-zaag-kick",
    productName: "AKA Sounds Free Serum 2 Zaag Kick",
    emailSubject: "Your AKA SOUNDS Download Request!",
    storageObject: {
      kind: "static",
      objectName: "AKA Sounds Free Serum 2 Zaag Kick.zip",
    },
  },
  {
    offerId: "offer-serum-2-hardtechno-kick",
    productName: "AKA Sounds Free Serum 2 Hardtechno Kick",
    emailSubject: "Your AKA SOUNDS Download Request!",
    storageObject: {
      kind: "static",
      objectName: "AKA Sounds Free Serum 2 Hardtechno Kick.zip",
    },
  },
  {
    offerId: "offer-serum-2-hard-dance-screeches",
    productName: "AKA Sounds Free Serum 2 Hard Dance Screeches",
    emailSubject: "Your AKA SOUNDS Download Request!",
    storageObject: {
      kind: "static",
      objectName: "AKA Sounds Free Serum 2 Hard Dance Screeches.zip",
    },
  },
] as const satisfies readonly FulfillmentPolicy[];
