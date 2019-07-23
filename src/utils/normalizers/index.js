export const normalizeBoolean = kindOfBoolean => {
  if (
    kindOfBoolean === "SI" ||
    kindOfBoolean === "si" ||
    kindOfBoolean === "true" ||
    kindOfBoolean === "1" ||
    kindOfBoolean === 1 ||
    kindOfBoolean === true
  )
    return true;
  else return false;
};

export const normalizeEvaluation = element => {
  return {
    id: element.id ? parseInt(element.id) : -1,
    que_busca: element.que_busca ? String(element.que_busca) : "",
    le_dieron: element.le_dieron ? String(element.le_dieron) : "",
    info_ok: normalizeBoolean(element.info_ok),
    privacidad_ok: normalizeBoolean(element.privacidad_ok),
    edad: element.edad ? parseInt(element.edad) : -1,
    genero: element.genero ? String(element.genero) : "",
    comentario: element.comentario ? String(element.comentario) : "",
    voto: element.voto ? parseInt(element.voto) : -1,
    aprobado: normalizeBoolean(element.aprobado),
    service: element.service ? String(element.service) : "",
    comodo: normalizeBoolean(element.comodo),
    informacion_vacunas: normalizeBoolean(element.informacion_vacunas),
    idPlace: element.idPlace ? parseInt(element.idPlace) : -1,
    es_gratuito: normalizeBoolean(element.es_gratuito)
  };
};
export const normalizeAndInsertEvaluationsList = (places, list) => {
  let normalizedEvaluationsObject = normalizeEvaluationsList(list);
  let evaluationPlacesIds = Object.keys(normalizedEvaluationsObject);
  evaluationPlacesIds.forEach(placeId => {
    if (places[placeId.toString()])
      places[placeId.toString()].eval =
        normalizedEvaluationsObject[placeId.toString()];
  });
  return places;
};

export const normalizeEvaluationsList = evaluations => {
  if (!Array.isArray(evaluations)) return [];
  let normalizedEvaluationList = {};
  evaluations.forEach(evaluation => {
    let _idPlace = evaluation.idPlace;
    if (_idPlace) {
      delete evaluation.idPlace;
      if (!Array.isArray(normalizedEvaluationList[_idPlace.toString()]))
        normalizedEvaluationList[_idPlace.toString()] = [];
      normalizedEvaluationList[_idPlace.toString()].push(
        normalizeEvaluation(evaluation)
      );
    }
  });
  return normalizedEvaluationList;
};

export const normalizePlacesList = places => {
  let keys = Object.keys(places);
  let flatPlaces = [];
  let normalizedPlacesList = [];

  keys.forEach(index => {
    flatPlaces = flatPlaces.concat(places[index]);
  });

  flatPlaces.forEach(place => {
    let _placeId = place.placeId;
    if (_placeId) {
      // delete place.placeId
      // normalizedPlacesList[_placeId.toString()] = normalizePlace(place)
      normalizedPlacesList.push(normalizePlace(place));
    }
  });
  return normalizedPlacesList;
};

export const normalizePlace = place => {
  return {
    id: place.placeId ? parseInt(place.placeId) : -1,
    idCiudad: place.idCiudad ? parseInt(place.idCiudad) : -1,
    idPartido: place.idPartido ? parseInt(place.idPartido) : -1,
    placeId: place.placeId ? parseInt(place.placeId) : -1,
    establecimiento: place.establecimiento ? String(place.establecimiento) : "",
    tipo: place.tipo ? String(place.tipo) : "",
    calle: place.calle ? String(place.calle) : "",
    altura: place.altura ? String(place.altura) : "",
    piso_dpto: place.piso_dpto ? String(place.piso_dpto) : "",
    cruce: place.cruce ? String(place.cruce) : "",
    barrio_localidad: place.barrio_localidad
      ? String(place.barrio_localidad)
      : "",
    partido_comuna: place.partido_comuna ? String(place.partido_comuna) : "",
    provincia_region: place.provincia_region
      ? String(place.provincia_region)
      : "",
    pais: place.pais ? String(place.pais) : "",
    aprobado: normalizeBoolean(place.aprobado),
    observacion: place.observacion ? String(place.observacion) : "",
    formattedAddress: place.formattedAddress
      ? String(place.formattedAddress)
      : "",
    latitude: place.latitude ? parseFloat(place.latitude) : 0.0,
    longitude: place.longitude ? parseFloat(place.longitude) : 0.0,
    rateReal: place.rate ? parseFloat(place.rate) : 0,
    cantidad_votos: place.cantidad_votos ? parseInt(place.cantidad_votos) : 0,
    habilitado: normalizeBoolean(place.habilitado),
    es_rapido: normalizeBoolean(place.es_rapido),
    condones: normalizeBoolean(place.condones),
    prueba: normalizeBoolean(place.prueba),
    ssr: normalizeBoolean(place.ssr),
    dc: normalizeBoolean(place.dc),
    mac: normalizeBoolean(place.mac),
    ile: normalizeBoolean(place.ile),
    tel_testeo: place.tel_testeo ? String(place.tel_testeo) : "",
    mail_testeo: place.mail_testeo ? String(place.mail_testeo) : "",
    horario_testeo: place.horario_testeo ? String(place.horario_testeo) : "",
    responsable_testeo: place.responsable_testeo
      ? String(place.responsable_testeo)
      : "",
    web_testeo: place.web_testeo ? String(place.web_testeo) : "",
    ubicacion_testeo: place.ubicacion_testeo
      ? String(place.ubicacion_testeo)
      : "",
    observaciones_testeo: place.observaciones_testeo
      ? String(place.observaciones_testeo)
      : "",
    tel_dc: place.tel_dc ? String(place.tel_dc) : "",
    mail_dc: place.mail_dc ? String(place.mail_dc) : "",
    horario_dc: place.horario_dc ? String(place.horario_dc) : "",
    responsable_dc: place.responsable_dc ? String(place.responsable_dc) : "",
    web_dc: place.web_dc ? String(place.web_dc) : "",
    ubicacion_dc: place.ubicacion_dc ? String(place.ubicacion_dc) : "",
    comentarios_dc: place.comentarios_dc ? String(place.comentarios_dc) : "",
    tel_distrib: place.tel_distrib ? String(place.tel_distrib) : "",
    mail_distrib: place.mail_distrib ? String(place.mail_distrib) : "",
    horario_distrib: place.horario_distrib ? String(place.horario_distrib) : "",
    responsable_distrib: place.responsable_distrib
      ? String(place.responsable_distrib)
      : "",
    web_distrib: place.web_distrib ? String(place.web_distrib) : "",
    ubicacion_distrib: place.ubicacion_distrib
      ? String(place.ubicacion_distrib)
      : "",
    comentarios_distrib: place.comentarios_distrib
      ? String(place.comentarios_distrib)
      : "",
    tel_infectologia: place.tel_infectologia
      ? String(place.tel_infectologia)
      : "",
    mail_infectologia: place.mail_infectologia
      ? String(place.mail_infectologia)
      : "",
    horario_infectologia: place.horario_infectologia
      ? String(place.horario_infectologia)
      : "",
    responsable_infectologia: place.responsable_infectologia
      ? String(place.responsable_infectologia)
      : "",
    web_infectologia: place.web_infectologia
      ? String(place.web_infectologia)
      : "",
    ubicacion_infectologia: place.ubicacion_infectologia
      ? String(place.ubicacion_infectologia)
      : "",
    comentarios_infectologia: place.comentarios_infectologia
      ? String(place.comentarios_infectologia)
      : "",
    tel_ssr: place.tel_ssr ? String(place.tel_ssr) : "",
    mail_ssr: place.mail_ssr ? String(place.mail_ssr) : "",
    horario_ssr: place.horario_ssr ? String(place.horario_ssr) : "",
    responsable_ssr: place.responsable_ssr ? String(place.responsable_ssr) : "",
    web_ssr: place.web_ssr ? String(place.web_ssr) : "",
    ubicacion_ssr: place.ubicacion_ssr ? String(place.ubicacion_ssr) : "",
    comentarios_ssr: place.comentarios_ssr ? String(place.comentarios_ssr) : "",
    tel_vac: place.tel_vac ? String(place.tel_vac) : "",
    mail_vac: place.mail_vac ? String(place.mail_vac) : "",
    horario_vac: place.horario_vac ? String(place.horario_vac) : "",
    responsable_vac: place.responsable_vac ? String(place.responsable_vac) : "",
    web_vac: place.web_vac ? String(place.web_vac) : "",
    ubicacion_vac: place.ubicacion_vac ? String(place.ubicacion_vac) : "",
    comentarios_vac: place.comentarios_vac ? String(place.comentarios_vac) : "",
    tel_mac: place.tel_mac ? String(place.tel_mac) : "",
    mail_mac: place.mail_mac ? String(place.mail_mac) : "",
    horario_mac: place.horario_mac ? String(place.horario_mac) : "",
    responsable_mac: place.responsable_mac ? String(place.responsable_mac) : "",
    web_mac: place.web_mac ? String(place.web_mac) : "",
    ubicacion_mac: place.ubicacion_mac ? String(place.ubicacion_mac) : "",
    comentarios_mac: place.comentarios_mac ? String(place.comentarios_mac) : "",
    tel_ile: place.tel_ile ? String(place.tel_ile) : "",
    mail_ile: place.mail_ile ? String(place.mail_ile) : "",
    horario_ile: place.horario_ile ? String(place.horario_ile) : "",
    responsable_ile: place.responsable_ile ? String(place.responsable_ile) : "",
    web_ile: place.web_ile ? String(place.web_ile) : "",
    ubicacion_ile: place.ubicacion_ile ? String(place.ubicacion_ile) : "",
    comentarios_ile: place.comentarios_ile ? String(place.comentarios_ile) : "",
    servicetype_ile: place.servicetype_ile ? String(place.servicetype_ile) : "",
    servicetype_mac: place.servicetype_mac ? String(place.servicetype_mac) : "",
    servicetype_condones: place.servicetype_condones
      ? String(place.servicetype_condones)
      : "",
    servicetype_prueba: place.servicetype_prueba
      ? String(place.servicetype_prueba)
      : "",
    servicetype_ssr: place.servicetype_ssr ? String(place.servicetype_ssr) : "",
    servicetype_dc: place.servicetype_dc ? String(place.servicetype_dc) : "",
    friendly_condones: normalizeBoolean(place.friendly_condones),
    friendly_vacunatorios: normalizeBoolean(place.friendly_vacunatorios),
    friendly_prueba: normalizeBoolean(place.friendly_prueba),
    friendly_ssr: normalizeBoolean(place.friendly_ssr),
    friendly_ile: normalizeBoolean(place.friendly_ile),
    friendly_infectologia: normalizeBoolean(place.friendly_infectologia),
    friendly_dc: normalizeBoolean(place.friendly_dc),
    friendly_mac: normalizeBoolean(place.friendly_mac)
  };
};
