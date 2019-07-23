import {
  CON,
  VIH,
  SSR,
  MAC,
  LPI,
  DC,
  TEEN,
  AUTOCOMPLETE,
  GEOLOCATE,
  RATE,
  DISTANCE,
  ES,
  EN,
  AR,
  CL,
  UY,
  BR,
  PY,
  BO,
  PE,
  EC,
  CO,
  VE,
  GY,
  FG,
  SR,
  NEARBY
} from "../../constants/action-types";

export const availiableServices = [CON, VIH, SSR, MAC, LPI, DC, TEEN, NEARBY];
export const availiableCountries = [
  AR,
  CL,
  UY,
  BR,
  PY,
  BO,
  PE,
  EC,
  CO,
  VE,
  GY,
  FG,
  SR
];
export const availiableLangs = [ES, EN];
export const availiableSortEngines = [RATE, DISTANCE];
export const availiableSearchEngines = [AUTOCOMPLETE, GEOLOCATE, TEEN];
