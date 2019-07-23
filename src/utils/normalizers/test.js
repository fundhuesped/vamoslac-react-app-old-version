import {
  normalizeBoolean,
  normalizePlace,
  normalizeEvaluation,
  normalizePlacesList,
  normalizeEvaluationsList,
  normalizeAndInsertEvaluationsList
} from ".";

describe("Normalizer engine: ", () => {
  it("Normalize boolean works as expected", () => {
    expect(normalizeBoolean("SI")).toBe(true);
    expect(normalizeBoolean("si")).toBe(true);
    expect(normalizeBoolean("true")).toBe(true);
    expect(normalizeBoolean("1")).toBe(true);
    expect(normalizeBoolean(1)).toBe(true);
    expect(normalizeBoolean(true)).toBe(true);

    expect(normalizeBoolean("NO")).toBe(false);
    expect(normalizeBoolean("no")).toBe(false);
    expect(normalizeBoolean("false")).toBe(false);
    expect(normalizeBoolean("0")).toBe(false);
    expect(normalizeBoolean(0)).toBe(false);
    expect(normalizeBoolean(false)).toBe(false);
  });

  it("Normalize evaluation works as expected", () => {
    expect(
      normalizeEvaluation({
        id: "32",
        que_busca: 1,
        le_dieron: "TEST",
        info_ok: 1,
        privacidad_ok: 1,
        edad: 32,
        genero: "TEST",
        comentario: "TEST",
        voto: "32.0",
        aprobado: 0,
        service: "TEST",
        comodo: 1,
        informacion_vacunas: 1,
        idPlace: 32,
        es_gratuito: 0
      })
    ).toEqual({
      id: 32,
      que_busca: "1",
      le_dieron: "TEST",
      info_ok: true,
      privacidad_ok: true,
      edad: 32,
      genero: "TEST",
      comentario: "TEST",
      voto: 32,
      aprobado: false,
      service: "TEST",
      comodo: true,
      informacion_vacunas: true,
      idPlace: 32,
      es_gratuito: false
    });
  });

  it("Normalize evaluation list work as expected", () => {
    let normalizedEvaluationList = normalizeEvaluationsList([
      {
        idPlace: 32
      },
      {
        idPlace: 32
      },
      {
        idPlace: 33
      },
      {
        idPlace: 34
      },
      {
        placeId: 35
      }
    ]);

    expect(normalizedEvaluationList["32"].length).toEqual(2);
    expect(normalizedEvaluationList["33"].length).toEqual(1);
    expect(Array.isArray(normalizedEvaluationList["33"])).toEqual(true);
    expect(Array.isArray(normalizedEvaluationList["35"])).toEqual(false);
  });

  it("Insert and normalize evaluation list on place works as expected", () => {
    let normalizedPlacesWithEvaluations = normalizeAndInsertEvaluationsList(
      normalizePlacesList({
        1: [
          {
            placeId: 32
          },
          {
            placeId: 33
          }
        ],
        2: [
          {
            placeId: 32
          },
          {
            placeId: 33
          }
        ]
      }),
      [
        {
          idPlace: 32
        },
        {
          idPlace: 32
        },
        {
          idPlace: 32
        },
        {
          idPlace: 33
        },
        {
          idPlace: 34
        }
      ]
    );

    expect(normalizedPlacesWithEvaluations["32"].eval.length).toBe(3);
    expect(normalizedPlacesWithEvaluations["33"].eval.length).toBe(1);
    expect(typeof normalizedPlacesWithEvaluations["34"]).toBe("undefined");
  });

  it("Normalize places list avoid places without id", () => {
    expect(
      Object.keys(
        normalizePlacesList({
          1: [
            {},
            {
              placeId: 1,
              altura: "TEST"
            },
            {
              placeId: 3,
              ssr: "SI"
            }
          ],
          2: [
            {},
            {
              placeId: 4,
              altura: "TEST"
            },
            {
              placeId: 2,
              ssr: "SI"
            }
          ]
        })
      ).length
    ).toEqual(4);
  });

  it("Normalize places list normalize correctly every place", () => {
    expect(
      normalizePlacesList({
        1: [
          {},
          {
            placeId: 1,
            altura: "TEST"
          },
          {
            placeId: 3,
            ssr: "SI"
          }
        ],
        2: [
          {},
          {
            placeId: 4,
            altura: "TEST"
          },
          {
            placeId: 2,
            ssr: "SI"
          }
        ]
      })["2"].ssr
    ).toEqual(true);
  });

  it("Normalize place with fullfilled place works as expected", () => {
    expect(
      normalizePlace({
        altura: "TEST",
        aprobado: "NO",
        barrio_localidad: "TEST",
        calle: "TEST",
        comentarios_distrib: "TEST",
        comentarios_ile: "TEST",
        comentarios_infectologia: "TEST",
        comentarios_mac: "TEST",
        comentarios_vac: "TEST",
        condones: "SI",
        cruce: "TEST",
        dc: "SI",
        establecimiento: "TEST",
        formattedAddress: "TEST",
        habilitado: "SI",
        horario_distrib: "TEST",
        horario_ile: "TEST",
        horario_infectologia: "TEST",
        horario_mac: "TEST",
        horario_testeo: "TEST",
        horario_vac: "TEST",
        placeId: 1,
        rateReal: 3.1,
        ile: "SI",
        latitude: -30.3,
        longitude: -30.3,
        mac: "SI",
        mail_distrib: "TEST",
        mail_ile: "TEST",
        mail_infectologia: "TEST",
        mail_mac: "TEST",
        mail_testeo: "TEST",
        mail_vac: "TEST",
        observacion: "TEST",
        observaciones_testeo: "TEST",
        pais: "TEST",
        partido_comuna: "TEST",
        piso_dpto: "TEST",
        provincia_region: "TEST",
        prueba: "SI",
        responsable_distrib: "TEST",
        responsable_ile: "TEST",
        responsable_infectologia: "TEST",
        responsable_mac: "TEST",
        responsable_testeo: "TEST",
        responsable_vac: "TEST",
        ssr: "SI",
        tel_distrib: "TEST",
        tel_ile: "TEST",
        tel_infectologia: "TEST",
        tel_mac: "TEST",
        tel_testeo: "TEST",
        tel_vac: "TEST",
        tipo: "TEST",
        ubicacion_distrib: "TEST",
        ubicacion_ile: "TEST",
        ubicacion_infectologia: "TEST",
        ubicacion_mac: "TEST",
        ubicacion_testeo: "TEST",
        ubicacion_vac: "TEST",
        web_distrib: "TEST",
        web_ile: "TEST",
        web_infectologia: "TEST",
        web_mac: "TEST",
        web_testeo: "TEST",
        web_vac: "TEST",
        friendly_condones: "no",
        friendly_vacunatorios: "NO",
        friendly_prueba: false,
        friendly_ssr: "TEST",
        friendly_ile: "SI",
        friendly_infectologia: "si",
        friendly_dc: true,
        friendly_mac: "SI"
      })
    ).toEqual({
      altura: "TEST",
      aprobado: false,
      barrio_localidad: "TEST",
      calle: "TEST",
      comentarios_distrib: "TEST",
      comentarios_ile: "TEST",
      comentarios_infectologia: "TEST",
      comentarios_mac: "TEST",
      comentarios_vac: "TEST",
      condones: true,
      cruce: "TEST",
      dc: true,
      establecimiento: "TEST",
      formattedAddress: "TEST",
      habilitado: true,
      horario_distrib: "TEST",
      horario_ile: "TEST",
      horario_infectologia: "TEST",
      horario_mac: "TEST",
      horario_testeo: "TEST",
      horario_vac: "TEST",
      placeId: 1,
      ile: true,
      latitude: -30.3,
      longitude: -30.3,
      rateReal: 3.1,
      mac: true,
      mail_distrib: "TEST",
      mail_ile: "TEST",
      mail_infectologia: "TEST",
      mail_mac: "TEST",
      mail_testeo: "TEST",
      mail_vac: "TEST",
      observacion: "TEST",
      observaciones_testeo: "TEST",
      pais: "TEST",
      partido_comuna: "TEST",
      piso_dpto: "TEST",
      provincia_region: "TEST",
      prueba: true,
      responsable_distrib: "TEST",
      responsable_ile: "TEST",
      responsable_infectologia: "TEST",
      responsable_mac: "TEST",
      responsable_testeo: "TEST",
      responsable_vac: "TEST",
      ssr: true,
      tel_distrib: "TEST",
      tel_ile: "TEST",
      tel_infectologia: "TEST",
      tel_mac: "TEST",
      tel_testeo: "TEST",
      tel_vac: "TEST",
      tipo: "TEST",
      ubicacion_distrib: "TEST",
      ubicacion_ile: "TEST",
      ubicacion_infectologia: "TEST",
      ubicacion_mac: "TEST",
      ubicacion_testeo: "TEST",
      ubicacion_vac: "TEST",
      web_distrib: "TEST",
      web_ile: "TEST",
      web_infectologia: "TEST",
      web_mac: "TEST",
      web_testeo: "TEST",
      web_vac: "TEST",
      friendly_condones: false,
      friendly_vacunatorios: false,
      friendly_prueba: false,
      friendly_ssr: false,
      friendly_ile: true,
      friendly_infectologia: true,
      friendly_dc: true,
      friendly_mac: true
    });
  });

  it("Normalize place with type errors", () => {
    expect(
      normalizePlace({
        altura: 32,
        aprobado: "NO",
        barrio_localidad: 32,
        calle: 32,
        comentarios_distrib: 32,
        comentarios_ile: 32,
        comentarios_infectologia: 32,
        comentarios_mac: 32,
        comentarios_vac: 32,
        condones: "SI",
        cruce: 32,
        dc: "SI",
        establecimiento: 32,
        formattedAddress: 32,
        habilitado: "SI",
        horario_distrib: 32,
        horario_ile: 32,
        horario_infectologia: 32,
        horario_mac: 32,
        horario_testeo: 32,
        horario_vac: 32,
        placeId: 1,
        ile: "SI",
        rateReal: "3.0",
        latitude: -30.3,
        longitude: -30.3,
        mac: "SI",
        mail_distrib: 32,
        mail_ile: 32,
        mail_infectologia: 32,
        mail_mac: 32,
        mail_testeo: 32,
        mail_vac: 32,
        observacion: 32,
        observaciones_testeo: 32,
        pais: 32,
        partido_comuna: 32,
        piso_dpto: 32,
        provincia_region: 32,
        prueba: "SI",
        responsable_distrib: 32,
        responsable_ile: 32,
        responsable_infectologia: 32,
        responsable_mac: 32,
        responsable_testeo: 32,
        responsable_vac: 32,
        ssr: "SI",
        tel_distrib: 32,
        tel_ile: 32,
        tel_infectologia: 32,
        tel_mac: 32,
        tel_testeo: 32,
        tel_vac: 32,
        tipo: 32,
        ubicacion_distrib: 32,
        ubicacion_ile: 32,
        ubicacion_infectologia: 32,
        ubicacion_mac: 32,
        ubicacion_testeo: 32,
        ubicacion_vac: 32,
        web_distrib: 32,
        web_ile: 32,
        web_infectologia: 32,
        web_mac: 32,
        web_testeo: 32,
        web_vac: 32,
        friendly_condones: true,
        friendly_vacunatorios: true,
        friendly_prueba: true,
        friendly_ssr: true,
        friendly_ile: true,
        friendly_infectologia: true,
        friendly_dc: true,
        friendly_mac: true
      })
    ).toEqual({
      altura: "32",
      aprobado: false,
      barrio_localidad: "32",
      calle: "32",
      comentarios_distrib: "32",
      comentarios_ile: "32",
      comentarios_infectologia: "32",
      comentarios_mac: "32",
      comentarios_vac: "32",
      condones: true,
      cruce: "32",
      dc: true,
      establecimiento: "32",
      formattedAddress: "32",
      habilitado: true,
      horario_distrib: "32",
      horario_ile: "32",
      horario_infectologia: "32",
      horario_mac: "32",
      horario_testeo: "32",
      horario_vac: "32",
      placeId: 1,
      ile: true,
      latitude: -30.3,
      longitude: -30.3,
      rateReal: 3.0,
      mac: true,
      mail_distrib: "32",
      mail_ile: "32",
      mail_infectologia: "32",
      mail_mac: "32",
      mail_testeo: "32",
      mail_vac: "32",
      observacion: "32",
      observaciones_testeo: "32",
      pais: "32",
      partido_comuna: "32",
      piso_dpto: "32",
      provincia_region: "32",
      prueba: true,
      responsable_distrib: "32",
      responsable_ile: "32",
      responsable_infectologia: "32",
      responsable_mac: "32",
      responsable_testeo: "32",
      responsable_vac: "32",
      ssr: true,
      tel_distrib: "32",
      tel_ile: "32",
      tel_infectologia: "32",
      tel_mac: "32",
      tel_testeo: "32",
      tel_vac: "32",
      tipo: "32",
      ubicacion_distrib: "32",
      ubicacion_ile: "32",
      ubicacion_infectologia: "32",
      ubicacion_mac: "32",
      ubicacion_testeo: "32",
      ubicacion_vac: "32",
      web_distrib: "32",
      web_ile: "32",
      web_infectologia: "32",
      web_mac: "32",
      web_testeo: "32",
      web_vac: "32",
      friendly_condones: true,
      friendly_vacunatorios: true,
      friendly_prueba: true,
      friendly_ssr: true,
      friendly_ile: true,
      friendly_infectologia: true,
      friendly_dc: true,
      friendly_mac: true
    });
  });

  it("Normalize place with shity empty place works as expected", () => {
    expect(normalizePlace({})).toEqual({
      altura: "",
      aprobado: false,
      barrio_localidad: "",
      calle: "",
      comentarios_distrib: "",
      comentarios_ile: "",
      comentarios_infectologia: "",
      comentarios_mac: "",
      comentarios_vac: "",
      condones: false,
      cruce: "",
      dc: false,
      establecimiento: "",
      formattedAddress: "",
      habilitado: false,
      horario_distrib: "",
      horario_ile: "",
      horario_infectologia: "",
      horario_mac: "",
      horario_testeo: "",
      horario_vac: "",
      placeId: -1,
      ile: false,
      latitude: 0,
      longitude: 0,
      rateReal: -1,
      mac: false,
      mail_distrib: "",
      mail_ile: "",
      mail_infectologia: "",
      mail_mac: "",
      mail_testeo: "",
      mail_vac: "",
      observacion: "",
      observaciones_testeo: "",
      pais: "",
      partido_comuna: "",
      piso_dpto: "",
      provincia_region: "",
      prueba: false,
      responsable_distrib: "",
      responsable_ile: "",
      responsable_infectologia: "",
      responsable_mac: "",
      responsable_testeo: "",
      responsable_vac: "",
      ssr: false,
      tel_distrib: "",
      tel_ile: "",
      tel_infectologia: "",
      tel_mac: "",
      tel_testeo: "",
      tel_vac: "",
      tipo: "",
      ubicacion_distrib: "",
      ubicacion_ile: "",
      ubicacion_infectologia: "",
      ubicacion_mac: "",
      ubicacion_testeo: "",
      ubicacion_vac: "",
      web_distrib: "",
      web_ile: "",
      web_infectologia: "",
      web_mac: "",
      web_testeo: "",
      web_vac: "",
      friendly_condones: false,
      friendly_vacunatorios: false,
      friendly_prueba: false,
      friendly_ssr: false,
      friendly_ile: false,
      friendly_infectologia: false,
      friendly_dc: false,
      friendly_mac: false
    });
  });
});
