import {
  CON,
  VIH,
  SSR,
  MAC,
  LPI,
  DC,
  TEEN,
  RATE,
  DISTANCE,
  NEARBY
} from "../../constants/action-types";
import React from "react";
import store from "../../store";
import I18n from "../../config/i18n/index.js";
import { Toast, Icon } from "native-base";
import { DISTANCE_KM } from "../../config/HTTP/index.js";

import SVGCondomIcon from "../../components/Dummy/SVG/CondomIcon/component.js";
import SVGDetectionIcon from "../../components/Dummy/SVG/DetectionIcon/component.js";
import SVGHealthIcon from "../../components/Dummy/SVG/HealthIcon/component.js";
import SVGILEIcon from "../../components/Dummy/SVG/ILEIcon/component.js";
import SVGMACIcon from "../../components/Dummy/SVG/MACIcon/component.js";
import SVGTeenIcon from "../../components/Dummy/SVG/TeenIcon/component.js";
import SVGVIHIcon from "../../components/Dummy/SVG/VIHIcon/component.js";

import { setResultList } from "../../constants/actions";

export const HaversineFormula = (place, coordsOrigin) => {
  let latOrigin = coordsOrigin.latitude,
    lonOrigin = coordsOrigin.longitude;

  //START ‘Haversine’ formula
  let R = 6371, // Radius of the earth in km
    distance, //Distance between points
    dLat = (Math.PI / 180) * (place.latitude - latOrigin),
    dLon = (Math.PI / 180) * (place.longitude - lonOrigin),
    a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((Math.PI / 180) * latOrigin) *
        Math.cos((Math.PI / 180) * place.latitude) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  distance = R * c;
  //END ‘Haversine’ formula

  return distance; // Distance in km
};

const isTeen = place =>
  place.friendly_condones ||
  place.friendly_dc ||
  place.friendly_ile ||
  place.friendly_mac ||
  place.friendly_prueba ||
  place.friendly_ssr;

export const getGralTextandILEForCountry = country => {
  let ILEService;
  let asocciationImageUrl;
  let ILELinks;
  let generalLinks;
  switch (country) {
    case "AG":
      {
        ILEService = false;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/AG.jpg")
        ];
        generalLinks = ["www.facebook.com/AntiguaPlannedParenthood"];
        ILELinks = ["www.safe2choose.org"];
      }
      break;
    case "AR":
      {
        ILEService = true;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/AR.jpg"),
          require("../../assets/images/countryLogos/AR2.jpg")
        ];
        generalLinks = [
          "Fundación Huésped - www.huesped.org.ar",
          I18n.t("and", {
            locale: store.getState().ui.lang
          }),
          "FUSA - www.grupofusa.org"
        ];
        ILELinks = [];
      }
      break;
    case "AW":
      {
        ILEService = false;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/AW.jpg")
        ];
        generalLinks = ["www.caribbeanfamilyplanning.com/where-we-work/aruba"];
        ILELinks = ["www.safe2choose.org"];
      }
      break;
    case "BB":
      {
        ILEService = true;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/BB.jpg")
        ];
        generalLinks = ["www.facebook.com/BarbadosFamilyPlanningAssociation"];
        ILELinks = [];
      }
      break;
    case "BZ":
      {
        ILEService = true;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/BZ.jpg")
        ];
        generalLinks = ["www.bflabelize.org"];
        ILELinks = [];
      }
      break;
    case "BO":
      {
        ILEService = true;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/BO.jpg")
        ];
        generalLinks = ["www.cies.org.bo"];
        ILELinks = [];
      }
      break;
    case "CL":
      {
        ILEService = true;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/CL.jpg")
        ];
        generalLinks = ["www.aprofa.cl"];
        ILELinks = [];
      }
      break;
    case "CO":
      {
        ILEService = true;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/CO.jpg")
        ];
        generalLinks = ["www.profamilia.org.co"];
        ILELinks = [];
      }
      break;
    case "CW":
      {
        ILEService = false;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/CW.jpg")
        ];
        generalLinks = [
          "http://caribbeanfamilyplanning.com/where-we-work/curacao/"
        ];
        ILELinks = [
          "http://caribbeanfamilyplanning.com/where-we-work/curacao/"
        ];
      }
      break;
    case "DM":
      {
        ILEService = false;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/DM.jpg")
        ];
        generalLinks = ["www.ippfwhr.org/en/country/caribbean"];
        ILELinks = ["www.safe2choose.org"];
      }
      break;
    case "DO":
      {
        ILEService = false;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/DO.jpg")
        ];
        generalLinks = ["www.profamilia.org.do"];
        ILELinks = ["www.safe2choose.org"];
      }
      break;
    case "EC":
      {
        ILEService = true;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/EC.jpg")
        ];
        generalLinks = ["www.cepamgye.org/es"];
        ILELinks = [];
      }
      break;
    case "SV":
      {
        ILEService = false;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/SV.jpg")
        ];
        generalLinks = ["www.ads.org.sv"];
        ILELinks = ["www.safe2choose.org"];
      }
      break;
    case "GD":
      {
        ILEService = false;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/GD.jpg")
        ];
        generalLinks = ["www.ippfwhr.org/en/country/caribbean"];
        ILELinks = ["www.safe2choose.org"];
      }
      break;
    case "GT":
      {
        ILEService = true;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/GT.jpg")
        ];
        generalLinks = ["www.aprofam.org.gt"];
        ILELinks = [];
      }
      break;
    case "GY":
      {
        ILEService = true;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/GY.jpg")
        ];
        generalLinks = ["www.grpa.org.gy"];
        ILELinks = [];
      }
      break;
    case "HT":
      {
        ILEService = true;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/HT.jpg")
        ];
        generalLinks = ["www.profamilhaiti.org"];
        ILELinks = [];
      }
      break;
    case "HN":
      {
        ILEService = false;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/HN.jpg")
        ];
        generalLinks = ["www.ashonplafa.com"];
        ILELinks = ["www.ashonplafa.com"];
      }
      break;
    case "JM":
      {
        ILEService = false;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/JM.jpg")
        ];
        generalLinks = ["www.famplan.wordpress.com"];
        ILELinks = ["www.safe2choose.org"];
      }
      break;
    case "MX":
      {
        ILEService = true;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/MX.jpg")
        ];
        generalLinks = ["www.mexfam.org.mx"];
        ILELinks = [];
      }
      break;
    case "PA":
      {
        ILEService = false;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/PA.jpg")
        ];
        generalLinks = ["www.aplafapanama.org/"];
        ILELinks = ["www.safe2choose.org"];
      }
      break;
    case "PY":
      {
        ILEService = false;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/PY.jpg")
        ];
        generalLinks = ["www.cepep.org.py"];
        ILELinks = ["www.safe2choose.org"];
      }
      break;
    case "PE":
      {
        ILEService = true;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/PE.jpg")
        ];
        generalLinks = ["www.inppares.org"];
        ILELinks = [];
      }
      break;
    case "PR":
      {
        ILEService = true;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/PR.jpg")
        ];
        generalLinks = ["www.profamiliaspr.org"];
        ILELinks = [];
      }
      break;
    case "LC":
      {
        ILEService = true;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/LC.jpg")
        ];
        generalLinks = ["www.slppa.org"];
        ILELinks = [];
      }
      break;
    case "VC":
      {
        ILEService = false;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/VC.jpg")
        ];
        generalLinks = ["www.facebook.com/SVPPA"];
        ILELinks = ["www.safe2choose.org"];
      }
      break;
    case "SR":
      {
        ILEService = false;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/SR.jpg")
        ];
        generalLinks = ["www.lobisuriname.org"];
        ILELinks = ["www.safe2choose.org"];
      }
      break;
    case "TT":
      {
        ILEService = false;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/TT.jpg")
        ];
        generalLinks = ["www.ttfpa.org"];
        ILELinks = ["www.safe2choose.org"];
      }
      break;
    case "UY":
      {
        ILEService = true;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/UY.jpg")
        ];
        generalLinks = ["www.iniciativas.org.uy"];
        ILELinks = [];
      }
      break;
    case "VE":
      {
        ILEService = true;
        asocciationImageUrl = [
          require("../../assets/images/countryLogos/VE.jpg")
        ];
        generalLinks = ["www.plafam.org.ve"];
        ILELinks = [];
      }
      break;

    default: {
      ILEService = false;
      asocciationImageUrl = [];
      generalLinks = [];
      ILELinks = [];
    }
  }

  return {
    generalText: I18n.t(`General_Service_${country}`, {
      locale: store.getState().ui.lang
    }),
    asocciationImageUrl: asocciationImageUrl,
    ILEText: I18n.t(`General_ILE_${country}`, {
      locale: store.getState().ui.lang
    }),
    ILEService: ILEService,
    ILELinks: ILELinks,
    generalLinks: generalLinks
  };
};

export const getServiceData = (service, size) => {
  let serviceData;
  switch (service) {
    case CON:
      serviceData = {
        svg: <SVGCondomIcon height={size} width={size} />,
        title: I18n.t("condones_name", { locale: store.getState().ui.lang }),
        subtitle: I18n.t("condones_desc", { locale: store.getState().ui.lang })
      };
      break;
    case VIH:
      serviceData = {
        svg: <SVGVIHIcon height={size} width={size} />,
        title: I18n.t("prueba_name", { locale: store.getState().ui.lang }),
        subtitle: I18n.t("prueba_desc", { locale: store.getState().ui.lang })
      };
      break;
    case SSR:
      serviceData = {
        svg: <SVGHealthIcon height={size} width={size} />,
        title: I18n.t("ssr_name", { locale: store.getState().ui.lang }),
        subtitle: I18n.t("ssr_desc", { locale: store.getState().ui.lang })
      };
      break;
    case MAC:
      serviceData = {
        svg: <SVGMACIcon height={size} width={size} />,
        title: I18n.t("mac_name", { locale: store.getState().ui.lang }),
        subtitle: I18n.t("mac_desc", { locale: store.getState().ui.lang })
      };
      break;
    case LPI:
      serviceData = {
        svg: <SVGILEIcon height={size} width={size} />,
        title: I18n.t("ile_name", { locale: store.getState().ui.lang }),
        subtitle: I18n.t("ile_desc", { locale: store.getState().ui.lang })
      };
      break;
    case DC:
      serviceData = {
        svg: <SVGDetectionIcon height={size} width={size} />,
        title: I18n.t("dc_name", { locale: store.getState().ui.lang }),
        subtitle: I18n.t("dc_desc", { locale: store.getState().ui.lang })
      };
      break;
    case TEEN:
      serviceData = {
        svg: <SVGTeenIcon height={size} width={size} />,
        title: I18n.t("friendly_service_label", {
          locale: store.getState().ui.lang
        }),
        subtitle: I18n.t("adol_desc_short", {
          locale: store.getState().ui.lang
        })
      };
      break;
    case NEARBY:
      serviceData = {
        svg: (
          <Icon name="ios-pin" style={{ fontSize: size, color: "#e6334c" }} />
        ),
        title: I18n.t("nearby", {
          locale: store.getState().ui.lang
        }).toUpperCase(),
        subtitle: ""
      };
      break;
    default:
  }

  return serviceData;
};

export class Engine {
  constructor(Store, lookingFor) {
    this.Store = Store;
    this.Data = store.getState().ui.resultList;
    // this.coordsOrigin = coords;
    this.Service = lookingFor;

    // this.sortEngine = this.sortEngine.bind(this);
  }

  searchForGeolocation = coordsOrigin => {
    let filterData = Object.values(this.Store)
      .filter(place => {
        switch (this.Service) {
          case CON: {
            if (place.condones) {
              let distance = HaversineFormula(place, coordsOrigin);
              if (distance <= DISTANCE_KM && distance !== 0) return place;
            }

            break;
          }
          case VIH: {
            if (place.prueba) {
              let distance = HaversineFormula(place, coordsOrigin);
              if (distance <= DISTANCE_KM && distance !== 0) return place;
            }
            break;
          }
          case SSR: {
            if (place.ssr) {
              let distance = HaversineFormula(place, coordsOrigin);
              if (distance <= DISTANCE_KM && distance !== 0) return place;
            }
            break;
          }
          case MAC: {
            if (place.mac) {
              let distance = HaversineFormula(place, coordsOrigin);
              if (distance <= DISTANCE_KM && distance !== 0) return place;
            }
            break;
          }
          case LPI: {
            if (place.ile) {
              let distance = HaversineFormula(place, coordsOrigin);
              if (distance <= DISTANCE_KM && distance !== 0) return place;
            }
            break;
          }
          case DC: {
            if (place.dc) {
              let distance = HaversineFormula(place, coordsOrigin);
              if (distance <= DISTANCE_KM && distance !== 0) return place;
            }
            break;
          }
          case NEARBY: {
            let distance = HaversineFormula(place, coordsOrigin);
            if (distance <= DISTANCE_KM && distance !== 0) return place;
            break;
          }

          default:
        }
      })
      .map(place => {
        let distance = HaversineFormula(place, coordsOrigin);
        return {
          placeData: place,
          distance: distance
        };
      });

    this.Data = filterData;
    // alert(this.Store.length)
    this.sortEngine("ALL");
  };

  searchForTeen = coordsOrigin => {
    let filterData = Object.values(this.Store)
      .filter(place => {
        if (isTeen(place)) {
          let distance = HaversineFormula(place, coordsOrigin);
          if (distance <= DISTANCE_KM && distance !== 0) return place;
        }
      })
      .map(place => {
        let distance = HaversineFormula(place, coordsOrigin);
        return {
          placeData: place,
          distance: distance
        };
      });

    this.Data = filterData;
    this.sortEngine("ALL");
  };

  searchForAutocomplete = location => {
    let filterData;
    filterData = Object.values(this.Store)
      .filter(place => {
        switch (this.Service) {
          case CON: {
            if (location.idPartido) {
              if (place.idCiudad === location.idObject && place.condones)
                return place;
            } else {
              if (place.idPartido === location.idObject && place.condones)
                return place;
            }
            break;
          }
          case VIH: {
            if (location.idPartido) {
              if (place.idCiudad === location.idObject && place.prueba)
                return place;
            } else {
              if (place.idPartido === location.idObject && place.prueba)
                return place;
            }
            break;
          }
          case SSR: {
            if (location.idPartido) {
              if (place.idCiudad === location.idObject && place.ssr)
                return place;
            } else {
              if (place.idPartido === location.idObject && place.ssr)
                return place;
            }
            break;
          }
          case MAC: {
            if (location.idPartido) {
              if (place.idCiudad === location.idObject && place.mac)
                return place;
            } else {
              if (place.idPartido === location.idObject && place.mac)
                return place;
            }
            break;
          }
          case LPI: {
            if (location.idPartido) {
              if (place.idCiudad === location.idObject && place.ile)
                return place;
            } else {
              if (place.idPartido === location.idObject && place.ile)
                return place;
            }
            break;
          }
          case DC: {
            if (location.idPartido) {
              if (place.idCiudad === location.idObject && place.dc)
                return place;
            } else {
              if (place.idPartido === location.idObject && place.dc)
                return place;
            }
            break;
          }

          default:
        }
      })
      .map(place => {
        return {
          placeData: place
        };
      });

    this.Data = filterData;
    // alert(this.Data.length)
    this.sortEngine("ALL");
  };

  sortEngine = (sortType, value) => {
    if (sortType === RATE) {
      let ponderedDataset = this.Data.sort((a, b) => {
        return b.placeData.rateReal - a.placeData.rateReal;
      });

      store.dispatch(setResultList(ponderedDataset));
    } else if (sortType === DISTANCE) {
      let ponderedDataset = this.Data.sort((a, b) => {
        return a.distance - b.distance;
      });

      store.dispatch(setResultList(ponderedDataset));
    } else if (sortType === "ALL") {
      let ponderedDataset = this.Data.sort((a, b) =>
        a.placeData.establecimiento
          .toLowerCase()
          .localeCompare(b.placeData.establecimiento.toLowerCase())
      );

      store.dispatch(setResultList(ponderedDataset));
    } else if (sortType === TEEN) {
      let filterForTeen = [];
      if (value) {
        filterForTeen = this.Data.filter(place => {
          if (isTeen(place.placeData)) return place;
        });
      } else {
        filterForTeen = this.Data;
      }

      store.dispatch(setResultList(filterForTeen));
    }
  };

  cleanResultList = () => {
    store.dispatch(setResultList([{ empty: true }]));
  };
}
