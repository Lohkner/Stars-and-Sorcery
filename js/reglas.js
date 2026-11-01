/* ══════════════════════════════════════════
   BASE DE DATOS DE REGLAS — S&S Director
   Generada desde el Manual de Monstruos v1 y la Guía del Director v1.
   Se puede editar entera desde el Editor de Reglas de la app; al cambiar
   este archivo, sube STORAGE.RULES_DATA_VERSION (js/storage.js).
══════════════════════════════════════════ */
const DEFAULT_DB = {
 "na": {
  "0": {
   "name": "NA 0",
   "pb": 2,
   "fuerte": 2,
   "normal": 0,
   "debil": -2,
   "dano": "1d6",
   "ajuste": 0,
   "a": 0,
   "pa": 2,
   "peso": 0,
   "etiqueta": "Civil"
  },
  "1": {
   "name": "NA 1",
   "pb": 2,
   "fuerte": 2,
   "normal": 0,
   "debil": -2,
   "dano": "2d6",
   "ajuste": 1,
   "a": 0,
   "pa": 3,
   "peso": 2,
   "etiqueta": "Novato"
  },
  "2": {
   "name": "NA 2",
   "pb": 2,
   "fuerte": 2,
   "normal": 0,
   "debil": -2,
   "dano": "2d6",
   "ajuste": 3,
   "a": 1,
   "pa": 3,
   "peso": 2
  },
  "3": {
   "name": "NA 3",
   "pb": 3,
   "fuerte": 3,
   "normal": 0,
   "debil": -2,
   "dano": "3d6",
   "ajuste": -2,
   "a": 1,
   "pa": 3,
   "peso": 3,
   "etiqueta": "Veterano"
  },
  "4": {
   "name": "NA 4",
   "pb": 3,
   "fuerte": 3,
   "normal": 1,
   "debil": -2,
   "dano": "3d6",
   "ajuste": 0,
   "a": 2,
   "pa": 3,
   "peso": 3
  },
  "5": {
   "name": "NA 5",
   "pb": 3,
   "fuerte": 3,
   "normal": 1,
   "debil": -2,
   "dano": "4d6",
   "ajuste": 0,
   "a": 2,
   "pa": 3,
   "peso": 4
  },
  "6": {
   "name": "NA 6",
   "pb": 4,
   "fuerte": 4,
   "normal": 1,
   "debil": -2,
   "dano": "4d6",
   "ajuste": -3,
   "a": 3,
   "pa": 3,
   "peso": 4
  },
  "7": {
   "name": "NA 7",
   "pb": 4,
   "fuerte": 4,
   "normal": 1,
   "debil": -2,
   "dano": "5d6",
   "ajuste": -1,
   "a": 3,
   "pa": 4,
   "peso": 5
  },
  "8": {
   "name": "NA 8",
   "pb": 4,
   "fuerte": 4,
   "normal": 2,
   "debil": -2,
   "dano": "5d6",
   "ajuste": 0,
   "a": 4,
   "pa": 4,
   "peso": 5
  },
  "9": {
   "name": "NA 9",
   "pb": 5,
   "fuerte": 5,
   "normal": 2,
   "debil": -2,
   "dano": "6d6",
   "ajuste": -2,
   "a": 4,
   "pa": 4,
   "peso": 6
  },
  "10": {
   "name": "NA 10",
   "pb": 5,
   "fuerte": 5,
   "normal": 2,
   "debil": -2,
   "dano": "6d6",
   "ajuste": 0,
   "a": 5,
   "pa": 4,
   "peso": 6,
   "etiqueta": "Élite"
  },
  "11": {
   "name": "NA 11",
   "pb": 5,
   "fuerte": 5,
   "normal": 2,
   "debil": -2,
   "dano": "7d6",
   "ajuste": 2,
   "a": 5,
   "pa": 5,
   "peso": 7
  },
  "12": {
   "name": "NA 12",
   "pb": 6,
   "fuerte": 6,
   "normal": 3,
   "debil": -2,
   "dano": "7d6",
   "ajuste": 0,
   "a": 6,
   "pa": 5,
   "peso": 7,
   "etiqueta": "Legendario"
  },
  "13": {
   "name": "NA 13",
   "pb": 6,
   "fuerte": 6,
   "normal": 3,
   "debil": -2,
   "dano": "8d6",
   "ajuste": 3,
   "a": 6,
   "pa": 5,
   "peso": 8
  },
  "14": {
   "name": "NA 14",
   "pb": 6,
   "fuerte": 6,
   "normal": 3,
   "debil": -2,
   "dano": "8d6",
   "ajuste": 7,
   "a": 7,
   "pa": 5,
   "peso": 8
  },
  "15": {
   "name": "NA 15",
   "pb": 7,
   "fuerte": 7,
   "normal": 3,
   "debil": -2,
   "dano": "9d6",
   "ajuste": 5,
   "a": 7,
   "pa": 6,
   "peso": 8
  }
 },
 "roles": {
  "arrollador": {
   "name": "Arrollador",
   "mod": "Clave: FUE · Débil: DES · +1d6 al daño",
   "clave": [
    "FUE"
   ],
   "claveAlt": [],
   "afin": [
    "FUE",
    "CON"
   ],
   "debiles": [
    "DES"
   ],
   "hab": "Ataque Masivo",
   "habTipo": "Modificador",
   "habCoste": "1/ronda",
   "habTxt": "Una vez por ronda, al impactar cuerpo a cuerpo, derriba al objetivo o le aplica el estado de Daño en el Tiempo fijado al crearla.",
   "danoDados": 1
  },
  "hostigador": {
   "name": "Hostigador",
   "mod": "Clave: DES · Débil: CON · +10 pies",
   "clave": [
    "DES"
   ],
   "claveAlt": [],
   "afin": [
    "DES",
    "FUE"
   ],
   "debiles": [
    "CON"
   ],
   "hab": "Flanqueo",
   "habTipo": "Rasgo",
   "habCoste": "",
   "habTxt": "Ventaja si un aliado está adyacente al mismo objetivo.",
   "vel": 10
  },
  "represor": {
   "name": "Represor",
   "mod": "Clave: INT o SAB (o CAR)",
   "clave": [
    "INT",
    "SAB"
   ],
   "claveAlt": [
    "CAR"
   ],
   "afin": [
    "INT",
    "SAB"
   ],
   "debiles": [],
   "hab": "Represión",
   "habTipo": "Aptitud",
   "habCoste": "3 PA · 1/ronda",
   "habTxt": "Quien esté a 10 pies hace una Salvación o sufre el estado de Control fijado al crearla (Ud4), nunca Aturdido ni Paralizado: esos quedan para las Aptitudes definitorias."
  },
  "comandante": {
   "name": "Comandante",
   "mod": "Clave: CAR",
   "clave": [
    "CAR"
   ],
   "claveAlt": [],
   "afin": [
    "CAR",
    "FUE"
   ],
   "debiles": [],
   "hab": "Aura de Mando",
   "habTipo": "Aura",
   "habCoste": "",
   "habTxt": "Un aliado ataca como Reacción; +2 al ataque de los aliados a 30 pies."
  },
  "soporte": {
   "name": "Soporte",
   "mod": "Clave: SAB · Débil: CON",
   "clave": [
    "SAB"
   ],
   "claveAlt": [],
   "afin": [
    "SAB",
    "CAR"
   ],
   "debiles": [
    "CON"
   ],
   "hab": "Restaurar",
   "habTipo": "Aptitud",
   "habCoste": "2 PA",
   "habTxt": "Un aliado recupera 1d8 PV o se libra de un estado."
  },
  "explorador": {
   "name": "Explorador",
   "mod": "Clave: DES · +15 pies · Iniciativa +4",
   "clave": [
    "DES"
   ],
   "claveAlt": [],
   "afin": [
    "DES",
    "SAB"
   ],
   "debiles": [],
   "hab": "Primero en Llegar",
   "habTipo": "Rasgo",
   "habCoste": "",
   "habTxt": "Ventaja en todas sus tiradas durante su primer turno.",
   "vel": 15,
   "ini": 4
  },
  "artillero": {
   "name": "Artillero",
   "mod": "Clave: DES (o FUE) · Débil: CON",
   "clave": [
    "DES"
   ],
   "claveAlt": [
    "FUE"
   ],
   "afin": [
    "DES",
    "SAB"
   ],
   "debiles": [
    "CON"
   ],
   "hab": "Posición",
   "habTipo": "Rasgo",
   "habCoste": "",
   "habTxt": "Si no se ha movido este turno, su primer ataque a distancia tiene Ventaja."
  },
  "acechador": {
   "name": "Acechador",
   "mod": "Clave: DES",
   "clave": [
    "DES"
   ],
   "claveAlt": [],
   "afin": [
    "DES",
    "FUE"
   ],
   "debiles": [],
   "hab": "Primer Golpe",
   "habTipo": "Modificador",
   "habCoste": "",
   "habTxt": "Su primer impacto contra una criatura Desprevenida suma el daño base otra vez."
  },
  "guardian": {
   "name": "Guardián",
   "mod": "Clave: CON · +1 Armadura · −10 pies",
   "clave": [
    "CON"
   ],
   "claveAlt": [],
   "afin": [
    "CON",
    "FUE"
   ],
   "debiles": [],
   "hab": "Custodia",
   "habTipo": "Reacción",
   "habCoste": "",
   "habTxt": "Un ataque dirigido a un aliado adyacente pasa a dirigirse contra él.",
   "a": 1,
   "vel": -10
  },
  "esbirro": {
   "name": "Esbirro",
   "mod": "Clave: los Fuertes del tipo · PV = NA × 2 (mín. 1)",
   "clave": [],
   "claveAlt": [],
   "afin": [],
   "debiles": [],
   "hab": "Esbirro",
   "habTipo": "Rasgo",
   "habCoste": "",
   "habTxt": "Cae con cualquier golpe que le quite sus PV. Sin más Rasgos que los de su tipo y su Rasgo de especie gratuito. No tira Moral: huye cuando cae su líder o la mitad de su grupo. Todos los esbirros de un mismo tipo actúan en la misma Iniciativa.",
   "esbirro": true
  }
 },
 "tamanos": {
  "diminuto": {
   "name": "Diminuto",
   "ej": "Rata, fuego fatuo, dron de bolsillo",
   "fue": "D",
   "des": 1,
   "con": -1,
   "atrTxt": "FUE Débil · DES +1 · CON −1",
   "alcance": "0 pies",
   "espacio": "2 pies"
  },
  "pequeno": {
   "name": "Pequeño",
   "ej": "Goblin, kobold, perro",
   "fue": -1,
   "des": 0,
   "con": 0,
   "atrTxt": "FUE −1 · DES — · CON —",
   "alcance": "5 pies",
   "espacio": "5 pies"
  },
  "mediano": {
   "name": "Mediano",
   "ej": "Humano, orco, lobo",
   "fue": 0,
   "des": 0,
   "con": 0,
   "atrTxt": "FUE — · DES — · CON —",
   "alcance": "5 pies",
   "espacio": "5 pies"
  },
  "grande": {
   "name": "Grande",
   "ej": "Ogro, caballo, oso, wyvern",
   "fue": 1,
   "des": 0,
   "con": 0,
   "atrTxt": "FUE +1 · DES — · CON —",
   "alcance": "10 pies",
   "espacio": "10 pies"
  },
  "enorme": {
   "name": "Enorme",
   "ej": "Troll viejo, dragón joven, tanque",
   "fue": 2,
   "des": -1,
   "con": 1,
   "atrTxt": "FUE +2 · DES −1 · CON +1",
   "alcance": "15 pies",
   "espacio": "15 pies",
   "naEnc": 1
  },
  "colosal": {
   "name": "Colosal",
   "ej": "Kraken, titán, dragón adulto, nave de desembarco",
   "fue": 3,
   "des": "D",
   "con": 2,
   "atrTxt": "FUE +3 · DES Débil · CON +2",
   "alcance": "20 pies",
   "espacio": "20 pies o más",
   "naEnc": 1
  }
 },
 "hordas": {
  "grupo": {
   "name": "Grupo",
   "min": 4,
   "max": 6,
   "txt": "NA del miembro + 2",
   "na": 2
  },
  "banda": {
   "name": "Banda",
   "min": 7,
   "max": 12,
   "txt": "NA del miembro + 4",
   "na": 4
  },
  "turba": {
   "name": "Turba",
   "min": 13,
   "max": 30,
   "txt": "NA del miembro + 6",
   "na": 6
  },
  "marea": {
   "name": "Marea",
   "min": 31,
   "max": 999,
   "txt": "Registro Planetario (Guía, Cap. 9)",
   "marea": true
  }
 },
 "tipos": {
  "bestia": {
   "name": "Bestia",
   "txt": "Olfato Agudo o Visión en la Oscuridad. Huye cuando la pelea deja de compensar; con INT Débil no tira Moral, como toda criatura.",
   "fuertesTxt": "DES, CON",
   "atrDeb": "INT",
   "debiles": [
    "INT"
   ],
   "deb": "Fotosensible, Hambre",
   "elige": [
    [
     "olfato_agudo",
     "vision_en_la_oscuridad"
    ]
   ],
   "fuertesDef": [
    "DES",
    "CON"
   ]
  },
  "humanoide": {
   "name": "Humanoide",
   "txt": "Ninguno. Puede llevar equipo del Manual Básico: su armadura sustituye a la Armadura base si es mayor.",
   "fuertesTxt": "Dos, según su oficio",
   "atrDeb": "Ninguno, o el que pida su oficio",
   "debiles": [],
   "deb": "Mando Único, Cobarde",
   "fuertesDef": [
    "FUE",
    "CON"
   ],
   "equipo": true
  },
  "gigante": {
   "name": "Gigante",
   "txt": "Gigantismo. Tamaño Grande o mayor.",
   "fuertesTxt": "FUE, CON",
   "atrDeb": "DES o INT",
   "debiles": [
    "INT"
   ],
   "deb": "Crédula, Lenta",
   "gratis": [
    {
     "id": "gigantismo"
    }
   ],
   "fuertesDef": [
    "FUE",
    "CON"
   ],
   "tamMin": "grande"
  },
  "monstruosidad": {
   "name": "Monstruosidad",
   "txt": "Un Rasgo de Forma y anatomía de Potencial 1.",
   "fuertesTxt": "FUE, CON",
   "atrDeb": "CAR",
   "debiles": [
    "CAR"
   ],
   "deb": "Núcleo Expuesto",
   "gratisFam": {
    "fam": "forma",
    "peso": 1
   },
   "fuertesDef": [
    "FUE",
    "CON"
   ]
  },
  "dragon": {
   "name": "Dragón",
   "txt": "Visión en la Oscuridad, Telepatía e Inmunidad a su elemento. Tiene tres Fuertes, y su clave de Rol no sustituye a ninguno: se suma como cuarto si no es uno de ellos. Debe tener Aliento y Uso de Axiomas: el Aliento es su Rasgo de especie gratuito aunque pase del tope de su NA; Uso de Axiomas paga su Potencial. Es Enorme o Colosal; solo una cría es Grande.",
   "fuertesTxt": "FUE, CON, INT",
   "atrDeb": "Ninguno",
   "debiles": [],
   "deb": "Aversión (un nombre, un metal)",
   "gratis": [
    {
     "id": "vision_en_la_oscuridad"
    },
    {
     "id": "telepatia"
    },
    {
     "id": "inmunidad",
     "nota": "su elemento"
    }
   ],
   "exige": [
    "aliento",
    "uso_de_axiomas"
   ],
   "fuertesDef": [
    "FUE",
    "CON"
   ],
   "fuerteExtra": "INT",
   "alientoGratis": true,
   "tamMin": "enorme"
  },
  "draconido": {
   "name": "Dracónido",
   "txt": "Visión en la Oscuridad e Inmunidad a su elemento. Wyverns, dracos y bestias de sangre de dragón: depredadores sin la mente de un dragón. Debe tener Aliento (paga su Potencial). Su tamaño crece con la edad: Mediano de cría, Grande adulto, Enorme el más viejo (plantillas Cría y Anciana).",
   "fuertesTxt": "FUE, CON",
   "atrDeb": "INT, CAR",
   "debiles": [
    "INT",
    "CAR"
   ],
   "deb": "Hambre, Crédula",
   "gratis": [
    {
     "id": "vision_en_la_oscuridad"
    },
    {
     "id": "inmunidad",
     "nota": "su elemento"
    }
   ],
   "exige": [
    "aliento"
   ],
   "fuertesDef": [
    "FUE",
    "CON"
   ]
  },
  "no_muerto": {
   "name": "No-muerto",
   "txt": "Vigor Inagotable e Inmunidad a Estados (Envenenado y Aterrado). No respira.",
   "fuertesTxt": "CON, SAB",
   "atrDeb": "CAR, e INT si no tiene mente",
   "debiles": [
    "CAR"
   ],
   "deb": "Vulnerabilidad (Radiante), Aversión",
   "gratis": [
    {
     "id": "vigor_inagotable"
    },
    {
     "id": "inmunidad_a_estados",
     "nota": "Envenenado y Aterrado"
    }
   ],
   "fuertesDef": [
    "CON",
    "SAB"
   ]
  },
  "espiritu": {
   "name": "Espíritu",
   "txt": "Telepatía. Suele tener Incorpóreo (paga su Potencial).",
   "fuertesTxt": "SAB, CAR",
   "atrDeb": "FUE",
   "debiles": [
    "FUE"
   ],
   "deb": "Ligada al Lugar, Nombre Verdadero",
   "gratis": [
    {
     "id": "telepatia"
    }
   ],
   "fuertesDef": [
    "SAB",
    "CAR"
   ]
  },
  "constructo": {
   "name": "Constructo",
   "txt": "Vigor Inagotable e Inmunidad a Estados (Envenenado y Encantado). No tira Moral.",
   "fuertesTxt": "FUE, CON",
   "atrDeb": "INT, CAR",
   "debiles": [
    "INT",
    "CAR"
   ],
   "deb": "Mando Único, Crédula",
   "gratis": [
    {
     "id": "vigor_inagotable"
    },
    {
     "id": "inmunidad_a_estados",
     "nota": "Envenenado y Encantado"
    }
   ],
   "fuertesDef": [
    "FUE",
    "CON"
   ],
   "noMoral": "nunca"
  },
  "maquina": {
   "name": "Máquina",
   "txt": "Vigor Inagotable y Sistemas Redundantes. No tira Moral.",
   "fuertesTxt": "CON, INT",
   "atrDeb": "CAR",
   "debiles": [
    "CAR"
   ],
   "deb": "Vulnerabilidad (Rayo)",
   "gratis": [
    {
     "id": "vigor_inagotable"
    },
    {
     "id": "sistemas_redundantes"
    }
   ],
   "fuertesDef": [
    "CON",
    "INT"
   ],
   "noMoral": "nunca"
  },
  "elemental": {
   "name": "Elemental",
   "txt": "Inmunidad a su elemento y Fundirse con el Elemento.",
   "fuertesTxt": "CON y FUE (tierra, agua) o DES (aire, fuego)",
   "atrDeb": "INT",
   "debiles": [
    "INT"
   ],
   "deb": "Vulnerabilidad (elemento opuesto)",
   "gratis": [
    {
     "id": "inmunidad",
     "nota": "su elemento"
    },
    {
     "id": "fundirse_con_el_elemento"
    }
   ],
   "fuertesDef": [
    "CON",
    "FUE"
   ]
  },
  "extraplanar": {
   "name": "Extraplanar",
   "txt": "Telepatía y Resistencia a dos tipos de energía.",
   "fuertesTxt": "CAR y uno a elegir",
   "atrDeb": "Ninguno",
   "debiles": [],
   "deb": "Aversión, Nombre Verdadero",
   "gratis": [
    {
     "id": "telepatia"
    },
    {
     "id": "resistencia",
     "nota": "dos tipos de energía"
    }
   ],
   "fuertesDef": [
    "CAR",
    "SAB"
   ]
  },
  "feerico": {
   "name": "Feérico",
   "txt": "Voluntad de Hierro. Debe tener Aversión (hierro frío) como debilidad.",
   "fuertesTxt": "DES, CAR",
   "atrDeb": "FUE",
   "debiles": [
    "FUE"
   ],
   "deb": "Aversión (obligatoria)",
   "gratis": [
    {
     "id": "voluntad_de_hierro"
    }
   ],
   "exige": [
    "aversion"
   ],
   "fuertesDef": [
    "DES",
    "CAR"
   ]
  },
  "aberracion": {
   "name": "Aberración",
   "txt": "Mente Ajena y Visión en la Oscuridad.",
   "fuertesTxt": "CON, SAB",
   "atrDeb": "FUE",
   "debiles": [
    "FUE"
   ],
   "deb": "Fotosensible",
   "gratis": [
    {
     "id": "mente_ajena"
    },
    {
     "id": "vision_en_la_oscuridad"
    }
   ],
   "fuertesDef": [
    "CON",
    "SAB"
   ]
  },
  "planta_u_hongo": {
   "name": "Planta u hongo",
   "txt": "Inmunidad a Estados (Cegado y Ensordecido) y Camuflaje en su entorno.",
   "fuertesTxt": "FUE, CON",
   "atrDeb": "DES, INT",
   "debiles": [
    "DES",
    "INT"
   ],
   "deb": "Vulnerabilidad (Fuego), Lenta",
   "gratis": [
    {
     "id": "inmunidad_a_estados",
     "nota": "Cegado y Ensordecido"
    },
    {
     "id": "camuflaje"
    }
   ],
   "fuertesDef": [
    "CON",
    "FUE"
   ]
  },
  "cieno": {
   "name": "Cieno",
   "txt": "Forma Amorfa y Sentido Sísmico. Ciego más allá de 60 pies.",
   "fuertesTxt": "FUE, CON",
   "atrDeb": "INT, CAR",
   "debiles": [
    "INT",
    "CAR"
   ],
   "deb": "Vulnerabilidad (Frío)",
   "gratis": [
    {
     "id": "forma_amorfa"
    },
    {
     "id": "sentido_sismico"
    }
   ],
   "fuertesDef": [
    "CON",
    "FUE"
   ]
  },
  "mutante": {
   "name": "Mutante",
   "txt": "Un Rasgo de Forma y anatomía y una Debilidad, ambos aleatorios (Cap. 9).",
   "fuertesTxt": "CON y uno al azar",
   "atrDeb": "Uno al azar",
   "debiles": [],
   "deb": "La que salga en la tabla",
   "gratisFam": {
    "fam": "forma"
   },
   "fuertesDef": [
    "CON",
    "SAB"
   ]
  }
 },
 "familias": {
  "ataque": {
   "name": "Ataque y daño",
   "txt": "Cómo hace daño y qué pasa cuando acierta.",
   "d20": "1",
   "dado": "d20"
  },
  "defensa": {
   "name": "Defensa y resistencia",
   "txt": "Cómo aguanta, y qué hace falta para atravesarla.",
   "d20": "2",
   "dado": "d20"
  },
  "movilidad": {
   "name": "Movilidad",
   "txt": "Por dónde llega y cómo se va.",
   "d20": "3",
   "dado": "d12"
  },
  "sentidos": {
   "name": "Sentidos",
   "txt": "Qué percibe, y por qué es difícil pillarla por sorpresa.",
   "d20": "4",
   "dado": "d10"
  },
  "control": {
   "name": "Control y estados",
   "txt": "Cómo le quita al grupo sus opciones.",
   "d20": "5",
   "dado": "d20"
  },
  "mente": {
   "name": "Mente e influencia",
   "txt": "Lo que hace sin tocar a nadie.",
   "d20": "6",
   "dado": "d12"
  },
  "vitalidad": {
   "name": "Vitalidad",
   "txt": "Por qué no cae cuando debería.",
   "d20": "7",
   "dado": "d10"
  },
  "elementos": {
   "name": "Elementos y energías",
   "txt": "Lo que arde, se congela o chisporrotea a su alrededor.",
   "d20": "8",
   "dado": "d12"
  },
  "sobrenatural": {
   "name": "Poderes sobrenaturales",
   "txt": "Axiomas, maldiciones y cosas que no deberían poder hacerse.",
   "d20": "9",
   "dado": "d12"
  },
  "manada": {
   "name": "Manada y aliados",
   "txt": "Lo que cambia cuando no está sola.",
   "d20": "10",
   "dado": "d10"
  },
  "sigilo": {
   "name": "Sigilo y engaño",
   "txt": "Cómo se esconde, y cómo engaña cuando la encuentran.",
   "d20": "11",
   "dado": "d10"
  },
  "forma": {
   "name": "Forma y anatomía",
   "txt": "El cuerpo que tiene, y lo que ese cuerpo permite.",
   "d20": "12",
   "dado": "d10"
  },
  "tecnologia": {
   "name": "Tecnología y máquinas",
   "txt": "Para autómatas, naves, drones y todo lo que tenga batería.",
   "d20": "13",
   "dado": "d10"
  },
  "mando": {
   "name": "Mando y jefes",
   "txt": "Para quien dirige la pelea o la protagoniza.",
   "d20": "14",
   "dado": "d10"
  },
  "guarida": {
   "name": "Guarida y entorno",
   "txt": "El lugar como parte de la criatura.",
   "d20": "15",
   "dado": "d8"
  },
  "debilidades": {
   "name": "Debilidades",
   "txt": "Potencial negativo: devuelven presupuesto y le dan al grupo algo que descubrir.",
   "d20": "16–20",
   "dado": "d12"
  }
 },
 "rasgos": {
  "ataque": [
   {
    "id": "golpe_aplastante",
    "name": "Golpe Aplastante",
    "tipo": "Modificador",
    "peso": 1,
    "txt": "Al impactar con su ataque principal, el objetivo hace Salvación FUE contra la CD o queda Derribado."
   },
   {
    "id": "garras_dobles",
    "name": "Garras Dobles",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Con 3 PA, su Ataque Normal (2 PA) son dos ataques, cada uno con la mitad de los dados de su daño por turno (el primero lleva el impar) más el ajuste y el MOD. Con 4 PA o más no aporta nada: ya ataca dos veces."
   },
   {
    "id": "mordisco_tenaz",
    "name": "Mordisco Tenaz",
    "tipo": "Modificador",
    "peso": 1,
    "txt": "Al impactar, Apresa sin gastar PA ni necesitar mano libre: el objetivo hace la Salvación de Apresar (FUE o DES contra la CD) o queda Apresado. Mientras lo retiene, no puede morder a otro."
   },
   {
    "id": "embestida",
    "name": "Embestida",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Si se ha movido 20 pies en línea recta, ataca y añade la mitad del daño base; el objetivo es empujado 10 pies.",
    "coste": "2 PA",
    "frec": "1/ronda"
   },
   {
    "id": "ataque_barrido",
    "name": "Ataque Barrido",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Una sola tirada contra la Guardia de cada criatura a su alcance; cada una impactada recibe el daño base.",
    "coste": "3 PA",
    "area": true
   },
   {
    "id": "aguijon_venenoso",
    "name": "Aguijón Venenoso",
    "tipo": "Modificador",
    "peso": 2,
    "txt": "Al impactar, Salvación CON contra la CD o queda Envenenado (Ud8)."
   },
   {
    "id": "garras_desgarradoras",
    "name": "Garras Desgarradoras",
    "tipo": "Modificador",
    "peso": 1,
    "txt": "Si impacta superando la Guardia por 5 o más, o con un Crítico, aplica Sangrado (Ud6)."
   },
   {
    "id": "alcance_largo",
    "name": "Alcance Largo",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Su alcance cuerpo a cuerpo aumenta 10 pies y provoca Ataques de Oportunidad en todo ese radio."
   },
   {
    "id": "proyectiles",
    "name": "Proyectiles",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Ataque a distancia hasta 60 pies con su bono de ataque y el daño base (espinas, púas, saliva, dardos).",
    "coste": "2 PA",
    "frec": "a voluntad",
    "pide": "Qué lanza"
   },
   {
    "id": "andanada",
    "name": "Andanada",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Área de 15 pies de radio a 60 pies: Salvación DES contra la CD; daño base, la mitad si la supera.",
    "coste": "3 PA",
    "frec": "Ud6",
    "area": true
   },
   {
    "id": "aliento",
    "name": "Aliento",
    "tipo": "Aptitud",
    "peso": 3,
    "txt": "Cono de 30 pies (60 si es Enorme o mayor) de un tipo de energía elegido al crearla: Salvación DES contra la CD; daño base más 1 dado de ese tipo por cada 3 NA, la mitad si la supera.",
    "coste": "3 PA",
    "frec": "Ud6",
    "pide": "Tipo de energía",
    "area": true
   },
   {
    "id": "punto_debil",
    "name": "Punto Débil",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "Sus Críticos ocurren con 19–20 y maximizan también cualquier daño añadido por sus Rasgos."
   },
   {
    "id": "frenesi",
    "name": "Frenesí",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Hasta el final de su siguiente turno, sus ataques tienen Ventaja y los ataques contra ella también.",
    "coste": "1 PA",
    "frec": "1/combate"
   },
   {
    "id": "tiro_apuntado",
    "name": "Tiro Apuntado",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Su siguiente ataque a distancia en este turno ignora la cobertura parcial y 2 puntos de Armadura.",
    "coste": "1 PA"
   },
   {
    "id": "constriccion",
    "name": "Constricción",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Contra una criatura que ya tiene Apresada: le inflige el daño base sin tirada, y el objetivo no puede hablar ni respirar hasta liberarse.",
    "coste": "1 PA"
   },
   {
    "id": "remate",
    "name": "Remate",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Ventaja en sus ataques contra criaturas Derribadas, Apresadas o por debajo de la mitad de sus PV."
   },
   {
    "id": "devorar",
    "name": "Devorar",
    "tipo": "Aptitud",
    "peso": 3,
    "txt": "Engulle a una criatura Apresada al menos una categoría de tamaño menor. Dentro, la víctima está Cegada y Apresada y recibe la mitad del daño base (Ácido) al inicio de cada uno de sus turnos. Sale si inflige a la criatura NA × 5 de daño en un solo turno, o cuando esta muere.",
    "coste": "2 PA",
    "frec": "Ud4"
   }
  ],
  "defensa": [
   {
    "id": "piel_gruesa",
    "name": "Piel Gruesa",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "+2 de Armadura, sin superar el NA + 3.",
    "mod": {
     "a": 2
    }
   },
   {
    "id": "caparazon",
    "name": "Caparazón",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "+3 de Armadura y −10 pies de velocidad. Retraerse (1 PA): dobla su Armadura, pero no puede actuar hasta volver a salir (1 PA).",
    "mod": {
     "a": 3,
     "vel": -10
    }
   },
   {
    "id": "evasiva",
    "name": "Evasiva",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "+2 a la Guardia.",
    "mod": {
     "g": 2
    }
   },
   {
    "id": "resistencia",
    "name": "Resistencia",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Resistencia a un tipo físico (Cortante, Perforante o Contundente) o a dos tipos de energía. Se puede tomar varias veces.",
    "multi": true,
    "pide": "Un tipo físico o dos de energía"
   },
   {
    "id": "inmunidad",
    "name": "Inmunidad",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "Inmune a un tipo de daño. Se puede tomar varias veces.",
    "multi": true,
    "pide": "Tipo de daño"
   },
   {
    "id": "inmunidad_a_estados",
    "name": "Inmunidad a Estados",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Inmune a dos estados elegidos al crearla (p. ej., Envenenado y Aterrado). Se puede tomar varias veces.",
    "multi": true,
    "pide": "Dos estados"
   },
   {
    "id": "voluntad_de_hierro",
    "name": "Voluntad de Hierro",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Ventaja en las Salvaciones contra efectos que la dejen Encantada, Aterrada o bajo control ajeno."
   },
   {
    "id": "bloqueador",
    "name": "Bloqueador",
    "tipo": "Reacción",
    "peso": 1,
    "txt": "Bloquea como un personaje: 1d20 + su bono de ataque contra el total del ataque que la ha impactado. Si iguala o supera, no hay daño.",
    "frec": "1/ronda"
   },
   {
    "id": "parada",
    "name": "Parada",
    "tipo": "Reacción",
    "peso": 1,
    "txt": "Cuando un ataque cuerpo a cuerpo la impactaría, +3 a la Guardia contra ese ataque.",
    "frec": "1/ronda"
   },
   {
    "id": "resistencia_sobrenatural",
    "name": "Resistencia Sobrenatural",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "Resistencia al daño no mágico."
   },
   {
    "id": "reflejar_axiomas",
    "name": "Reflejar Axiomas",
    "tipo": "Reacción",
    "peso": 3,
    "txt": "Cuando un Axioma con tirada de ataque falla contra ella, lo devuelve contra quien lo usó con la misma tirada.",
    "frec": "Ud6"
   },
   {
    "id": "escudo_vivo",
    "name": "Escudo Vivo",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Hasta su siguiente turno, un aliado adyacente gana +2 a la Guardia y +2 de Armadura.",
    "coste": "1 PA"
   },
   {
    "id": "incorporeo",
    "name": "Incorpóreo",
    "tipo": "Rasgo",
    "peso": 3,
    "txt": "Resistencia a todo daño no mágico. Atraviesa objetos y criaturas (si termina dentro de algo, sale al espacio libre más cercano y recibe 1d10). No puede Apresar ni ser Apresado."
   },
   {
    "id": "endurecido",
    "name": "Endurecido",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Los Golpes Críticos contra ella son impactos normales."
   },
   {
    "id": "forma_amorfa",
    "name": "Forma Amorfa",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Inmune a Derribado y Apresado. Pasa por huecos del tamaño de una moneda."
   }
  ],
  "movilidad": [
   {
    "id": "veloz",
    "name": "Veloz",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "+20 pies de velocidad.",
    "mod": {
     "vel": 20
    }
   },
   {
    "id": "vuelo",
    "name": "Vuelo",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "Vuela a su velocidad. Si queda Derribada, Aturdida o Paralizada en el aire, cae."
   },
   {
    "id": "planeo",
    "name": "Planeo",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "No recibe daño por caída; avanza 2 pies en horizontal por cada pie que desciende."
   },
   {
    "id": "trepadora",
    "name": "Trepadora",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Trepa a su velocidad por muros y techos, sin tirada."
   },
   {
    "id": "excavadora",
    "name": "Excavadora",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Excava a la mitad de su velocidad. Si emerge junto a una criatura que no la esperaba, esa criatura está Desprevenida."
   },
   {
    "id": "anfibia",
    "name": "Anfibia",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Nada a su velocidad y respira bajo el agua."
   },
   {
    "id": "salto_depredador",
    "name": "Salto Depredador",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Salta hasta su velocidad sin provocar Ataques de Oportunidad; si cae junto a un objetivo, su siguiente ataque tiene Ventaja.",
    "coste": "1 PA"
   },
   {
    "id": "desplazamiento",
    "name": "Desplazamiento",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Se teletransporta hasta 30 pies a un punto que pueda ver.",
    "coste": "1 PA",
    "frec": "Ud6"
   },
   {
    "id": "retirada_agil",
    "name": "Retirada Ágil",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "No provoca Ataques de Oportunidad al alejarse."
   },
   {
    "id": "imparable",
    "name": "Imparable",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Ignora el terreno difícil y no puede quedar Ralentizada."
   },
   {
    "id": "paso_de_sombra",
    "name": "Paso de Sombra",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "En penumbra u oscuridad, pasa de una sombra a otra hasta 60 pies.",
    "coste": "1 PA"
   },
   {
    "id": "carga_arrolladora",
    "name": "Carga Arrolladora",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Recorre su velocidad en línea recta atravesando criaturas de menor tamaño: cada una hace Salvación FUE contra la CD o recibe la mitad del daño base y queda Derribada.",
    "coste": "2 PA",
    "frec": "Ud6",
    "area": true
   }
  ],
  "sentidos": [
   {
    "id": "vision_en_la_oscuridad",
    "name": "Visión en la Oscuridad",
    "tipo": "Rasgo",
    "peso": 0,
    "txt": "Ve sin luz hasta 60 pies, en tonos de gris."
   },
   {
    "id": "olfato_agudo",
    "name": "Olfato Agudo",
    "tipo": "Rasgo",
    "peso": 0,
    "txt": "Ventaja en Percepción basada en el olfato; rastrea sin tirada un rastro de menos de un día."
   },
   {
    "id": "sentido_sismico",
    "name": "Sentido Sísmico",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Percibe a toda criatura que toque el suelo a 60 pies, aunque no pueda verla."
   },
   {
    "id": "ecolocalizacion",
    "name": "Ecolocalización",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Ve sin luz hasta 60 pies. Si queda Ensordecida, queda también Cegada."
   },
   {
    "id": "vision_verdadera",
    "name": "Visión Verdadera",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "Ve a través de ilusiones, invisibilidad y cambios de forma hasta 60 pies."
   },
   {
    "id": "nunca_desprevenida",
    "name": "Nunca Desprevenida",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "No puede quedar Desprevenida, y los ataques desde ocultamiento no tienen Ventaja contra ella."
   },
   {
    "id": "olor_de_la_sangre",
    "name": "Olor de la Sangre",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Percibe a las criaturas heridas a 120 pies, aunque estén ocultas o sean invisibles."
   },
   {
    "id": "ojos_multiples",
    "name": "Ojos Múltiples",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "No se la puede flanquear, y un único efecto no basta para dejarla Cegada: hacen falta dos."
   },
   {
    "id": "sentir_axiomas",
    "name": "Sentir Axiomas",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Percibe el uso de cualquier Axioma a 120 pies y de dónde procede; tiene Ventaja en su primer ataque contra quien lo usó."
   },
   {
    "id": "mente_colmena",
    "name": "Mente Colmena",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Lo que percibe un miembro de su especie lo perciben todos los que estén a menos de una milla.",
    "narrativa": true
   }
  ],
  "control": [
   {
    "id": "mirada_paralizante",
    "name": "Mirada Paralizante",
    "tipo": "Aptitud",
    "peso": 3,
    "txt": "Una criatura a 30 pies que la esté mirando: Salvación CON contra la CD o queda Paralizada (Ud4). Quien aparte la vista a propósito ataca con Desventaja, pero tiene Ventaja en esa Salvación.",
    "coste": "2 PA",
    "frec": "Ud6"
   },
   {
    "id": "mirada_petrificante",
    "name": "Mirada Petrificante",
    "tipo": "Aptitud",
    "peso": 3,
    "txt": "Una criatura a 30 pies que la mire: Salvación CON contra la CD o queda Ralentizada (Ud4). Si falla otra vez mientras sigue Ralentizada, queda Petrificada (Ud4).",
    "coste": "3 PA",
    "frec": "Ud4"
   },
   {
    "id": "rugido_aterrador",
    "name": "Rugido Aterrador",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Cada criatura hostil a 30 pies: Salvación SAB contra la CD o queda Aterrada (Ud4).",
    "coste": "2 PA",
    "frec": "Ud6"
   },
   {
    "id": "telarana",
    "name": "Telaraña",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Área de 10 pies a 30 pies: terreno difícil; quien esté dentro hace Salvación DES contra la CD o queda Apresado (escapa con Proeza Física contra esa CD).",
    "coste": "2 PA",
    "frec": "Ud6"
   },
   {
    "id": "aturdir",
    "name": "Aturdir",
    "tipo": "Modificador",
    "peso": 3,
    "txt": "Al impactar, Salvación CON contra la CD o queda Aturdido (Ud4).",
    "frec": "Ud6"
   },
   {
    "id": "nube_cegadora",
    "name": "Nube Cegadora",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Cono de 15 pies (esporas, tinta, destello): Salvación CON contra la CD o queda Cegado (Ud4).",
    "coste": "1 PA",
    "frec": "Ud6"
   },
   {
    "id": "chillido",
    "name": "Chillido",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Radio de 20 pies: Salvación CON contra la CD o queda Ensordecido (Ud6) y recibe la mitad del daño base Sónico.",
    "coste": "2 PA",
    "frec": "Ud6",
    "area": true
   },
   {
    "id": "pisoton",
    "name": "Pisotón",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Cada criatura a 10 pies: Salvación FUE contra la CD o queda Derribada. El suelo en ese radio pasa a ser terreno difícil.",
    "coste": "2 PA",
    "frec": "Ud6"
   },
   {
    "id": "arrastrar",
    "name": "Arrastrar",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Arrastra a la criatura que tiene Apresada a su velocidad completa, en lugar de a la mitad, sin provocar Ataques de Oportunidad."
   },
   {
    "id": "aliento_helado",
    "name": "Aliento Helado",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Radio de 10 pies: Salvación CON contra la CD o queda Ralentizado (Ud4).",
    "coste": "2 PA",
    "frec": "Ud6"
   },
   {
    "id": "zona_de_control",
    "name": "Zona de Control",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Una criatura que empiece su turno adyacente a ella no puede alejarse sin superar antes una Salvación FUE o DES contra la CD."
   },
   {
    "id": "veneno_paralizante",
    "name": "Veneno Paralizante",
    "tipo": "Modificador",
    "peso": 3,
    "txt": "Al impactar a una criatura Envenenada: Salvación CON contra la CD o queda Paralizada (Ud4)."
   },
   {
    "id": "lanzar",
    "name": "Lanzar",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "En lugar de Empujar, arroja hasta 20 pies a una criatura que tenga Apresada, de su tamaño o menor: daño base Contundente para ella y para quien reciba el golpe.",
    "coste": "2 PA"
   },
   {
    "id": "marca_de_presa",
    "name": "Marca de Presa",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Señala a un objetivo. Sus aliados tienen +2 al ataque contra él hasta que la criatura muera o marque a otro.",
    "coste": "0 PA"
   }
  ],
  "mente": [
   {
    "id": "voz_seductora",
    "name": "Voz Seductora",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Una criatura a 30 pies: Salvación SAB contra la CD o queda Encantada (Ud6). No puede atacarla mientras dure.",
    "coste": "2 PA",
    "frec": "Ud6"
   },
   {
    "id": "dominar",
    "name": "Dominar",
    "tipo": "Aptitud",
    "peso": 3,
    "txt": "Una criatura Encantada por ella: Salvación SAB contra la CD o, en su siguiente turno, actúa como la criatura decida (nunca contra sí misma). Repite la Salvación al final de cada turno.",
    "coste": "3 PA",
    "frec": "Ud4"
   },
   {
    "id": "susurros",
    "name": "Susurros",
    "tipo": "Aura",
    "peso": 1,
    "txt": "Radio de 20 pies: quien empiece su turno dentro tiene Desventaja en las Salvaciones de Concentración."
   },
   {
    "id": "leer_mentes",
    "name": "Leer Mentes",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Oye los pensamientos superficiales a 30 pies. Una vez por ronda, puede preguntar a un jugador qué va a hacer su personaje en su próximo turno."
   },
   {
    "id": "ilusion",
    "name": "Ilusión",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Crea una imagen convincente de sí misma o de un peligro hasta 60 pies. Descubrir el engaño: Investigación o Perspicacia contra la CD.",
    "coste": "2 PA",
    "frec": "Ud6"
   },
   {
    "id": "pavor",
    "name": "Pavor",
    "tipo": "Aura",
    "peso": 2,
    "txt": "Radio de 30 pies: la primera vez que una criatura entra o empieza su turno dentro, Salvación SAB contra la CD o queda Aterrada mientras siga dentro. Quien la supera es inmune un día."
   },
   {
    "id": "drenar_mente",
    "name": "Drenar Mente",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Un objetivo a 30 pies: la mitad del daño base Psíquico y pierde 1d6 de Ingenio.",
    "coste": "2 PA",
    "frec": "Ud6"
   },
   {
    "id": "confundir",
    "name": "Confundir",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Radio de 10 pies a 60 pies: Salvación SAB contra la CD o queda Conmocionado (Ud6); mientras dure, en un 1–2 en 1d6 ataca a la criatura más cercana, amiga o enemiga.",
    "coste": "2 PA",
    "frec": "Ud6"
   },
   {
    "id": "imitacion",
    "name": "Imitación",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Imita cualquier voz o sonido que haya oído. Distinguirlo exige Perspicacia contra la CD.",
    "narrativa": true
   },
   {
    "id": "pesadillas",
    "name": "Pesadillas",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Una criatura que duerma a menos de una milla no descansa: su Descanso Largo no reduce la Fatiga y solo recupera la mitad.",
    "coste": "fuera de combate",
    "narrativa": true
   },
   {
    "id": "mente_ajena",
    "name": "Mente Ajena",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Quien lea su mente o le imponga un efecto mental recibe la mitad del daño base Psíquico."
   },
   {
    "id": "telepatia",
    "name": "Telepatía",
    "tipo": "Rasgo",
    "peso": 0,
    "txt": "Se comunica mentalmente con cualquier criatura con lenguaje a 120 pies."
   }
  ],
  "vitalidad": [
   {
    "id": "regeneracion",
    "name": "Regeneración",
    "tipo": "Rasgo",
    "peso": 3,
    "txt": "Recupera NA × 2 PV al inicio de su turno, salvo si recibió daño de un tipo elegido al crearla (normalmente Fuego o Ácido) desde su turno anterior. Solo muere a 0 PV si ese turno recibió ese daño.",
    "pide": "Daño que la detiene (Fuego, Ácido…)"
   },
   {
    "id": "curacion_rapida",
    "name": "Curación Rápida",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "Recupera NA PV al inicio de su turno mientras le quede al menos 1 PV."
   },
   {
    "id": "absorber_vida",
    "name": "Absorber Vida",
    "tipo": "Modificador",
    "peso": 2,
    "txt": "Recupera PV iguales a la mitad del daño que inflige con su ataque principal."
   },
   {
    "id": "dura_de_matar",
    "name": "Dura de Matar",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "La primera vez en cada combate que llega a 0 PV, queda en 1 PV."
   },
   {
    "id": "segunda_forma",
    "name": "Segunda Forma",
    "tipo": "Rasgo",
    "peso": 3,
    "txt": "Al llegar a 0 PV por primera vez, se transforma: recupera la mitad de sus PV máximos, termina todos sus estados y cambia uno de sus Rasgos o Aptitudes por otro."
   },
   {
    "id": "cuerpo_divisible",
    "name": "Cuerpo Divisible",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "Si un solo golpe Cortante le inflige 10 o más y le quedan al menos 10 PV, se divide en dos criaturas con la mitad de los PV que le queden cada una."
   },
   {
    "id": "carronera",
    "name": "Carroñera",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Devora un cadáver adyacente y recupera NA × 3 PV.",
    "coste": "2 PA"
   },
   {
    "id": "vigor_inagotable",
    "name": "Vigor Inagotable",
    "tipo": "Rasgo",
    "peso": 0,
    "txt": "No sufre Fatiga."
   },
   {
    "id": "resurgir",
    "name": "Resurgir",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "Si no se destruye su núcleo (un objeto, un lugar, un nombre), vuelve a formarse en 1d4 días.",
    "pide": "Su núcleo",
    "narrativa": true
   },
   {
    "id": "transfusion",
    "name": "Transfusión",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Cede hasta NA × 3 de sus PV a un aliado adyacente.",
    "coste": "1 PA"
   }
  ],
  "elementos": [
   {
    "id": "cuerpo_igneo",
    "name": "Cuerpo Ígneo",
    "tipo": "Aura",
    "peso": 2,
    "txt": "Quien la toque o la golpee cuerpo a cuerpo recibe la mitad del daño base de Fuego. Los objetos inflamables a su alcance prenden."
   },
   {
    "id": "toque_gelido",
    "name": "Toque Gélido",
    "tipo": "Modificador",
    "peso": 1,
    "txt": "Su ataque añade 1d6 de Frío; el objetivo hace Salvación CON contra la CD o queda Ralentizado (Ud4)."
   },
   {
    "id": "toque_electrico",
    "name": "Toque Eléctrico",
    "tipo": "Modificador",
    "peso": 1,
    "txt": "Su ataque añade 1d6 de Rayo, y tiene Ventaja contra quien lleve armadura Media o Pesada de metal."
   },
   {
    "id": "acido_corrosivo",
    "name": "Ácido Corrosivo",
    "tipo": "Modificador",
    "peso": 2,
    "txt": "Su ataque añade 1d6 de Ácido y aplica Desgarro (Ud6)."
   },
   {
    "id": "aura_toxica",
    "name": "Aura Tóxica",
    "tipo": "Aura",
    "peso": 2,
    "txt": "Radio de 10 pies: quien empiece su turno dentro hace Salvación CON contra la CD o queda Envenenado (Ud4)."
   },
   {
    "id": "tormenta_personal",
    "name": "Tormenta Personal",
    "tipo": "Aptitud",
    "peso": 3,
    "txt": "Radio de 30 pies: hasta tres objetivos reciben el daño base de Rayo (Salvación DES, la mitad); el viento convierte todo el radio en terreno difícil hasta su siguiente turno.",
    "coste": "3 PA",
    "frec": "Ud6",
    "area": true
   },
   {
    "id": "muro_elemental",
    "name": "Muro Elemental",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Levanta un muro de 30 pies de su elemento durante un minuto; cruzarlo cuesta la mitad del daño base.",
    "coste": "2 PA",
    "frec": "Ud4",
    "pide": "Elemento"
   },
   {
    "id": "absorcion_elemental",
    "name": "Absorción Elemental",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "El daño de un tipo de energía elegido la cura en lugar de dañarla.",
    "pide": "Tipo de energía"
   },
   {
    "id": "estallido_al_morir",
    "name": "Estallido al Morir",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Al llegar a 0 PV explota: radio de 10 pies, Salvación DES contra la CD, la mitad del daño base de su elemento.",
    "pide": "Elemento"
   },
   {
    "id": "fundirse_con_el_elemento",
    "name": "Fundirse con el Elemento",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Dentro de su elemento (fuego, agua, piedra, niebla) es invisible y tiene Resistencia a todo daño.",
    "pide": "Elemento"
   },
   {
    "id": "prender",
    "name": "Prender",
    "tipo": "Modificador",
    "peso": 1,
    "txt": "Al impactar, Salvación DES contra la CD o queda en Ignición."
   },
   {
    "id": "clima_hostil",
    "name": "Clima Hostil",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "En 60 pies a su alrededor el clima cambia —niebla, nevada, calor sofocante—: terreno difícil y visibilidad reducida a 30 pies para todos salvo ella."
   }
  ],
  "sobrenatural": [
   {
    "id": "uso_de_axiomas",
    "name": "Uso de Axiomas",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "Conoce hasta tres Axiomas del Catálogo de un Nivel no superior a la mitad de su NA (redondeando hacia arriba, máximo 9). Usa su CD y una Reserva de NA × 5 puntos. Puede aplicar Esfuerzo a sus Axiomas, pagando 3 puntos de su Reserva por cada uno: +4 al daño, +2 a la CD (solo una vez por Axioma) o +1 objetivo. Su Límite de Esfuerzo depende de su NA: 1 hasta NA 6, 2 de NA 7 a 12 y 3 desde NA 13; un jefe suma 1. Sus ataques y Aptitudes no admiten Esfuerzo, y el Esfuerzo no cambia el NA del encuentro. Potencial 3 si alguno es de Nivel 4 o más.",
    "pide": "Axiomas que conoce (hasta tres)"
   },
   {
    "id": "trucos",
    "name": "Trucos",
    "tipo": "Rasgo",
    "peso": 0,
    "txt": "Conoce dos Trucos del Catálogo y los usa con su CD.",
    "pide": "Los dos Trucos"
   },
   {
    "id": "contraaxioma",
    "name": "Contraaxioma",
    "tipo": "Reacción",
    "peso": 2,
    "txt": "Anula un Axioma de Nivel no superior a la mitad de su NA que se use a 60 pies.",
    "frec": "Ud6"
   },
   {
    "id": "maldicion",
    "name": "Maldición",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Un objetivo a 60 pies: Salvación SAB contra la CD o queda Maldito (Ud8), con Desventaja en un tipo de tirada que ella elige.",
    "coste": "2 PA",
    "frec": "Ud6",
    "pide": "Tipo de tirada"
   },
   {
    "id": "toque_necrotico",
    "name": "Toque Necrótico",
    "tipo": "Modificador",
    "peso": 1,
    "txt": "Su daño pasa a ser Necrótico, y el objetivo no recupera PV hasta el final de su siguiente turno."
   },
   {
    "id": "invocar_aliados",
    "name": "Invocar Aliados",
    "tipo": "Aptitud",
    "peso": 3,
    "txt": "Al final de su turno aparecen 1d4 criaturas de NA igual a la mitad del suyo (mínimo 0), que actúan justo después de ella.",
    "coste": "3 PA",
    "frec": "1/combate"
   },
   {
    "id": "posesion",
    "name": "Posesión",
    "tipo": "Aptitud",
    "peso": 3,
    "txt": "Una criatura adyacente: Salvación SAB contra la CD o entra en su cuerpo y controla sus acciones. El cuerpo recibe el daño; la víctima repite la Salvación al final de cada uno de sus turnos. Sale al llegar el cuerpo a 0 PV.",
    "coste": "3 PA",
    "frec": "Ud4"
   },
   {
    "id": "aura_antiaxiomas",
    "name": "Aura Antiaxiomas",
    "tipo": "Aura",
    "peso": 3,
    "txt": "Radio de 20 pies: los Axiomas de Nivel no superior a un tercio de su NA no funcionan dentro."
   },
   {
    "id": "presencia_consagrada",
    "name": "Presencia Consagrada",
    "tipo": "Aura",
    "peso": 1,
    "txt": "Radio de 30 pies: sus aliados tienen +1 a las Salvaciones, y las criaturas de la naturaleza opuesta (profana o sagrada) atacan con Desventaja."
   },
   {
    "id": "piel_arcana",
    "name": "Piel Arcana",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "Los Axiomas de Nivel 1 y 2 no la afectan, salvo su daño."
   },
   {
    "id": "drenar_reserva",
    "name": "Drenar Reserva",
    "tipo": "Modificador",
    "peso": 2,
    "txt": "Al impactar, el objetivo pierde 1d6 puntos de la mayor de sus dos Reservas."
   }
  ],
  "manada": [
   {
    "id": "tactica_de_manada",
    "name": "Táctica de Manada",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Ventaja en sus ataques si un aliado está adyacente al mismo objetivo."
   },
   {
    "id": "aullido_de_llamada",
    "name": "Aullido de Llamada",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Al final de la ronda siguiente llegan 1d4 congéneres de su mismo NA o inferior.",
    "coste": "1 PA",
    "frec": "1/combate"
   },
   {
    "id": "formacion",
    "name": "Formación",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "+1 a la Guardia por cada aliado adyacente, hasta +3."
   },
   {
    "id": "sacrificio_leal",
    "name": "Sacrificio Leal",
    "tipo": "Reacción",
    "peso": 1,
    "txt": "Recibe en su lugar un ataque dirigido a un aliado adyacente de NA superior al suyo."
   },
   {
    "id": "enjambre",
    "name": "Enjambre",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "Ocupa el espacio de otras criaturas. Resistencia al daño de ataques contra un solo objetivo; recibe el doble de daño de los efectos de área."
   },
   {
    "id": "lider_de_manada",
    "name": "Líder de Manada",
    "tipo": "Aura",
    "peso": 2,
    "txt": "Radio de 30 pies: sus aliados de la misma especie tienen +2 al ataque y +2 a la Moral."
   },
   {
    "id": "coordinacion",
    "name": "Coordinación",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Un aliado a 30 pies hace de inmediato un ataque de 1 PA como Reacción.",
    "coste": "1 PA"
   },
   {
    "id": "rodear",
    "name": "Rodear",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Sus aliados no provocan Ataques de Oportunidad al moverse entre enemigos adyacentes a ella."
   },
   {
    "id": "colmena",
    "name": "Colmena",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "Mientras viva el núcleo de la colmena (su reina, su nodo, su madre), sus miembros no tiran Moral y comparten lo que perciben.",
    "mod": {
     "noMoral": true
    }
   },
   {
    "id": "venganza_del_grupo",
    "name": "Venganza del Grupo",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Cuando cae un aliado de su especie, gana +2 al daño hasta el final del combate."
   }
  ],
  "sigilo": [
   {
    "id": "camuflaje",
    "name": "Camuflaje",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Ventaja en Sigilo en su entorno. Inmóvil, es indistinguible del terreno: Percepción contra la CD para verla."
   },
   {
    "id": "emboscadora_nata",
    "name": "Emboscadora Nata",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "En la primera ronda de combate, sus ataques contra criaturas Desprevenidas suman el daño base otra vez."
   },
   {
    "id": "invisibilidad",
    "name": "Invisibilidad",
    "tipo": "Aptitud",
    "peso": 3,
    "txt": "Queda invisible hasta que ataca o usa una Aptitud.",
    "coste": "1 PA",
    "frec": "Ud6"
   },
   {
    "id": "cambiaformas",
    "name": "Cambiaformas",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Adopta la forma de una criatura de su tamaño que haya visto. Descubrirla exige Perspicacia contra la CD.",
    "coste": "2 PA"
   },
   {
    "id": "falsa_apariencia",
    "name": "Falsa Apariencia",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Inmóvil, parece un objeto corriente: un cofre, una estatua, una maraña de raíces."
   },
   {
    "id": "esconderse",
    "name": "Esconderse",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Puede ocultarse con solo cobertura parcial o penumbra, aunque la estén mirando, y tiene Ventaja en esa tirada de Sigilo."
   },
   {
    "id": "senuelo",
    "name": "Señuelo",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Crea un duplicado ilusorio: el primer ataque que la impactaría golpea al señuelo y lo disipa.",
    "coste": "2 PA",
    "frec": "Ud6"
   },
   {
    "id": "silenciosa",
    "name": "Silenciosa",
    "tipo": "Rasgo",
    "peso": 0,
    "txt": "No hace ningún ruido al moverse.",
    "narrativa": true
   },
   {
    "id": "huida_en_humo",
    "name": "Huida en Humo",
    "tipo": "Reacción",
    "peso": 1,
    "txt": "Al recibir daño, suelta humo o tinta: oscuridad en 10 pies a su alrededor, y se aleja la mitad de su velocidad sin provocar Ataques de Oportunidad.",
    "frec": "Ud4"
   },
   {
    "id": "rastro_falso",
    "name": "Rastro Falso",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Seguir su rastro exige Supervivencia contra la CD + 5.",
    "narrativa": true
   }
  ],
  "forma": [
   {
    "id": "varias_cabezas",
    "name": "Varias Cabezas",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "+1 PA por turno, nunca más, por muchas cabezas que tenga; ese PA puede ser un mordisco más, con la mitad de los dados. Cada Golpe Crítico contra ella, o cada golpe que le quite NA × 5 PV, le arranca una cabeza y le quita ese PA hasta que crezca otra. Si recibe Fuego esa ronda, no vuelve a crecer; si no, al final de su turno le crecen dos.",
    "mod": {
     "pa": 1
    }
   },
   {
    "id": "tentaculos",
    "name": "Tentáculos",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Puede mantener Apresadas a tantas criaturas como tentáculos tenga (de 2 a 4) sin dejar de atacar.",
    "pide": "Cuántos (de 2 a 4)"
   },
   {
    "id": "cola_barredora",
    "name": "Cola Barredora",
    "tipo": "Reacción",
    "peso": 1,
    "txt": "Cuando una criatura la flanquea, le hace un ataque con la cola: daño base, y Salvación FUE contra la CD o queda Derribada.",
    "frec": "1/ronda"
   },
   {
    "id": "sangre_acida",
    "name": "Sangre Ácida",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Quien le inflija daño Cortante o Perforante cuerpo a cuerpo recibe 1d6 de Ácido."
   },
   {
    "id": "espinas",
    "name": "Espinas",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Quien la Apresa o la golpea desarmado recibe 1d6 de daño Perforante."
   },
   {
    "id": "brazos_adicionales",
    "name": "Brazos Adicionales",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "Una vez por turno, un ataque adicional de 1 PA sin coste."
   },
   {
    "id": "gigantismo",
    "name": "Gigantismo",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Ventaja al Apresar y al Empujar a criaturas más pequeñas; puede atravesar su espacio."
   },
   {
    "id": "adaptacion",
    "name": "Adaptación",
    "tipo": "Reacción",
    "peso": 2,
    "txt": "Tras recibir daño de un tipo, gana Resistencia a ese tipo hasta el final del combate.",
    "frec": "Ud6"
   },
   {
    "id": "partes_separables",
    "name": "Partes Separables",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Separa una extremidad, que actúa como criatura de NA 0 en su mismo turno y con sus mismos ataques.",
    "coste": "1 PA"
   },
   {
    "id": "cuerpo_hueco",
    "name": "Cuerpo Hueco",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Dentro lleva algo: al llegar a 0 PV libera 1d4 criaturas de NA 1 (larvas, enjambres, prisioneros).",
    "pide": "Qué lleva dentro"
   }
  ],
  "tecnologia": [
   {
    "id": "blindaje_reactivo",
    "name": "Blindaje Reactivo",
    "tipo": "Reacción",
    "peso": 1,
    "txt": "Al recibir un impacto, resta su Armadura una segunda vez a ese daño.",
    "frec": "1/ronda"
   },
   {
    "id": "escudo_de_energia",
    "name": "Escudo de Energía",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "Absorbe los primeros NA × 3 puntos de daño de cada combate antes de que lleguen a sus PV. Se recarga tras un Respiro."
   },
   {
    "id": "sistemas_redundantes",
    "name": "Sistemas Redundantes",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Inmune a Aturdido y Conmocionado. Cegado solo le impone Desventaja en los ataques a distancia."
   },
   {
    "id": "arma_montada",
    "name": "Arma Montada",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Ataque a distancia hasta 120 pies con su bono de ataque y el daño base (Energía o Perforante).",
    "coste": "2 PA",
    "frec": "a voluntad"
   },
   {
    "id": "sobrecarga",
    "name": "Sobrecarga",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Hasta el final de su siguiente turno gana +1 PA y su dado de daño sube un paso. Después queda Conmocionada (Ud4).",
    "coste": "1 PA",
    "frec": "1/combate"
   },
   {
    "id": "autorreparacion",
    "name": "Autorreparación",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Recupera NA PV al inicio de su turno, salvo si recibió daño de Rayo desde su turno anterior."
   },
   {
    "id": "drones",
    "name": "Drones",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Despliega dos drones de NA 0 (vuelo 40 pies, ataque 1d4) que actúan en su turno.",
    "coste": "2 PA",
    "frec": "Ud6"
   },
   {
    "id": "pulso_electromagnetico",
    "name": "Pulso Electromagnético",
    "tipo": "Aptitud",
    "peso": 2,
    "txt": "Radio de 30 pies: el equipo tecnológico deja de funcionar durante Ud4 rondas, y las máquinas hacen Salvación CON contra la CD o quedan Aturdidas.",
    "coste": "3 PA",
    "frec": "Ud4"
   },
   {
    "id": "protocolo_de_amenaza",
    "name": "Protocolo de Amenaza",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Tras ser atacada por una criatura, tiene +2 al ataque contra ella."
   },
   {
    "id": "autodestruccion",
    "name": "Autodestrucción",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Al llegar a 0 PV, explota al final de la ronda siguiente: radio de 20 pies, Salvación DES contra la CD, el doble del daño base. Desactivarla: Tecnología contra la CD (2 PA)."
   }
  ],
  "mando": [
   {
    "id": "accion_de_jefe",
    "name": "Acción de Jefe",
    "tipo": "Rasgo",
    "peso": 3,
    "txt": "Al final del turno de cada personaje puede gastar 1 PA de su siguiente turno para moverse, atacar o usar una Aptitud de 1 PA. Como máximo dos veces por ronda."
   },
   {
    "id": "turno_doble",
    "name": "Turno Doble",
    "tipo": "Rasgo",
    "peso": 3,
    "txt": "Tira dos veces la Iniciativa y actúa en ambas; reparte sus PA entre los dos turnos."
   },
   {
    "id": "resistencia_legendaria",
    "name": "Resistencia Legendaria",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "Cuando falla una Salvación, puede superarla igualmente; después tira el Ud.",
    "frec": "Ud6"
   },
   {
    "id": "fases",
    "name": "Fases",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "Al bajar de la mitad de sus PV cambia: termina sus estados, gana una Aptitud nueva y el campo de batalla se transforma (tabla de Fases, Cap. 5)."
   },
   {
    "id": "voz_de_mando",
    "name": "Voz de Mando",
    "tipo": "Aptitud",
    "peso": 1,
    "txt": "Hasta tres aliados que la oigan se mueven de inmediato la mitad de su velocidad sin provocar Ataques de Oportunidad.",
    "coste": "1 PA"
   },
   {
    "id": "sin_rendicion",
    "name": "Sin Rendición",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "No tira Moral, y sus aliados a 30 pies tampoco mientras ella siga en pie.",
    "mod": {
     "noMoral": true
    }
   },
   {
    "id": "sacudirse",
    "name": "Sacudirse",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Al inicio de su turno termina uno de sus estados, el más reciente."
   },
   {
    "id": "guardia_personal",
    "name": "Guardia Personal",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Mientras tenga un aliado adyacente, los ataques a distancia contra ella tienen Desventaja."
   },
   {
    "id": "represalia",
    "name": "Represalia",
    "tipo": "Reacción",
    "peso": 1,
    "txt": "Cuando falla un ataque cuerpo a cuerpo contra ella, ataca de inmediato a quien lo hizo.",
    "frec": "1/ronda"
   },
   {
    "id": "victoria_alternativa",
    "name": "Victoria Alternativa",
    "tipo": "Rasgo",
    "peso": 0,
    "txt": "El combate termina si el grupo consigue algo concreto: romper el sello, sacar al rehén, apagar la máquina. Debe poder verse o deducirse en escena.",
    "pide": "La condición"
   }
  ],
  "guarida": [
   {
    "id": "guarida",
    "name": "Guarida",
    "tipo": "Rasgo",
    "peso": 2,
    "txt": "En su guarida, al final de cada ronda elige una Acción de Guarida (tabla del Cap. 5)."
   },
   {
    "id": "terreno_propio",
    "name": "Terreno Propio",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "En su guarida ignora el terreno difícil y conoce cada salida."
   },
   {
    "id": "trampas_de_la_guarida",
    "name": "Trampas de la Guarida",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Su guarida tiene 1d4 trampas de NA igual al suyo, que ella sabe esquivar."
   },
   {
    "id": "oscuridad_viva",
    "name": "Oscuridad Viva",
    "tipo": "Aura",
    "peso": 2,
    "txt": "Radio de 30 pies: la luz no mágica se reduce a penumbra."
   },
   {
    "id": "ecos",
    "name": "Ecos",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Sabe cuántas criaturas entran en su guarida y dónde están en cada momento."
   },
   {
    "id": "nido",
    "name": "Nido",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "Mientras defiende su nido, +2 al daño y no tira Moral."
   },
   {
    "id": "corrupcion_del_lugar",
    "name": "Corrupción del Lugar",
    "tipo": "Rasgo",
    "peso": 1,
    "txt": "En una milla alrededor de su guarida algo va mal —agua envenenada, animales ausentes, sueños compartidos—. Es su señal: el grupo puede notarla antes de entrar.",
    "narrativa": true
   },
   {
    "id": "ligada_al_lugar",
    "name": "Ligada al Lugar",
    "tipo": "Rasgo",
    "peso": -1,
    "txt": "No puede alejarse más de 300 pies de su guarida o de su punto de origen.",
    "pide": "El lugar"
   }
  ],
  "debilidades": [
   {
    "id": "vulnerabilidad",
    "name": "Vulnerabilidad",
    "tipo": "Debilidad",
    "peso": -1,
    "txt": "Un tipo de daño le hace la mitad más: ×1,5, como en el Manual Básico (Cap. 9).",
    "pide": "Tipo de daño"
   },
   {
    "id": "fotosensible",
    "name": "Fotosensible",
    "tipo": "Debilidad",
    "peso": -1,
    "txt": "En luz brillante, Desventaja en ataques y en Percepción."
   },
   {
    "id": "aversion",
    "name": "Aversión",
    "tipo": "Debilidad",
    "peso": -1,
    "txt": "No puede tocar ni cruzar un material o símbolo (plata, hierro frío, sal, un sello sagrado). Las armas de ese material ignoran sus Resistencias y hacen Crítico con 19–20.",
    "pide": "Material o símbolo"
   },
   {
    "id": "lenta",
    "name": "Lenta",
    "tipo": "Debilidad",
    "peso": -1,
    "txt": "−10 pies de velocidad y actúa siempre la última en la ronda.",
    "mod": {
     "vel": -10
    }
   },
   {
    "id": "credula",
    "name": "Crédula",
    "tipo": "Debilidad",
    "peso": -1,
    "txt": "Cae en cualquier finta: Engaño contra su CD − 5, y Desventaja en las Salvaciones contra ilusiones."
   },
   {
    "id": "cobarde",
    "name": "Cobarde",
    "tipo": "Debilidad",
    "peso": -1,
    "txt": "Su Moral baja 4, y la tira en cuanto recibe un golpe que le quite un cuarto de sus PV.",
    "mod": {
     "moral": -4
    }
   },
   {
    "id": "nucleo_expuesto",
    "name": "Núcleo Expuesto",
    "tipo": "Debilidad",
    "peso": -1,
    "txt": "Tiene un punto débil que Analizar o una Percepción contra la CD revelan: los ataques contra él hacen Crítico con 18–20.",
    "pide": "Dónde está"
   },
   {
    "id": "hambre",
    "name": "Hambre",
    "tipo": "Debilidad",
    "peso": -1,
    "txt": "Si hay comida o un cadáver a la vista, Salvación SAB CD 12 o se detiene a comer ese turno."
   },
   {
    "id": "nombre_verdadero",
    "name": "Nombre Verdadero",
    "tipo": "Debilidad",
    "peso": -1,
    "txt": "Pronunciar su nombre verdadero (2 PA) la deja Aturdida (Ud4), una vez por combate.",
    "pide": "El nombre (para el Director)"
   },
   {
    "id": "fragil",
    "name": "Frágil",
    "tipo": "Debilidad",
    "peso": -1,
    "txt": "Su CON pasa a ser Débil.",
    "mod": {
     "conDebil": true
    }
   },
   {
    "id": "mando_unico",
    "name": "Mando Único",
    "tipo": "Debilidad",
    "peso": -1,
    "txt": "Sin su líder a la vista, pierde 1 PA y no puede usar Aptitudes."
   },
   {
    "id": "ruidosa",
    "name": "Ruidosa",
    "tipo": "Debilidad",
    "peso": -1,
    "txt": "No puede ocultarse ni moverse en silencio; nunca sorprende al grupo."
   }
  ]
 },
 "plantillas": {
  "anciana": {
   "name": "Anciana",
   "naTxt": "+2",
   "txt": "Estadísticas del nuevo NA. Gana Voluntad de Hierro y un Rasgo de su familia principal. Tamaño +1 categoría si es una bestia o un dracónido.",
   "na": 2,
   "gana": [
    "voluntad_de_hierro"
   ]
  },
  "no_muerta": {
   "name": "No-muerta",
   "naTxt": "+0",
   "txt": "Tipo No-muerto. Pierde las Aptitudes que requieran respirar o pensar. Gana Toque Necrótico y Vulnerabilidad (Radiante).",
   "na": 0,
   "tipo": "no_muerto",
   "gana": [
    "toque_necrotico",
    "vulnerabilidad"
   ],
   "notas": {
    "vulnerabilidad": "Radiante"
   }
  },
  "espectral": {
   "name": "Espectral",
   "naTxt": "+1",
   "txt": "Tipo Espíritu. Gana Incorpóreo. Pierde los Rasgos que apresan (Mordisco Tenaz, Tentáculos, Constricción…) y cualquier Rasgo de Forma y anatomía.",
   "na": 1,
   "tipo": "espiritu",
   "gana": [
    "incorporeo"
   ],
   "pierdeFam": [
    "forma"
   ]
  },
  "infernal": {
   "name": "Infernal",
   "naTxt": "+1",
   "txt": "Tipo Extraplanar. Gana Cuerpo Ígneo o Maldición, y Aversión (sal consagrada).",
   "na": 1,
   "tipo": "extraplanar",
   "gana": [
    "cuerpo_igneo",
    "aversion"
   ],
   "notas": {
    "aversion": "sal consagrada"
   }
  },
  "mecanizada": {
   "name": "Mecanizada",
   "naTxt": "+1",
   "txt": "Tipo Máquina. +2 de Armadura, Arma Montada, Vulnerabilidad (Rayo).",
   "na": 1,
   "tipo": "maquina",
   "gana": [
    "arma_montada",
    "vulnerabilidad"
   ],
   "notas": {
    "vulnerabilidad": "Rayo"
   },
   "a": 2
  },
  "colosal": {
   "name": "Colosal",
   "naTxt": "+2 (+3 si ya era Grande)",
   "txt": "Dos categorías de tamaño más. Gana Pisotón y Gigantismo. Pierde Camuflaje, Esconderse y cualquier Rasgo de Movilidad salvo Vuelo.",
   "na": 2,
   "tam": 2,
   "gana": [
    "pisoton",
    "gigantismo"
   ],
   "pierdeFam": [
    "sigilo"
   ]
  },
  "enjambre": {
   "name": "Enjambre",
   "naTxt": "+0",
   "txt": "Se convierte en horda de criaturas Diminutas (Cap. 6). Gana Enjambre.",
   "na": 0,
   "horda": true,
   "gana": [
    "enjambre"
   ]
  },
  "corrupta": {
   "name": "Corrupta",
   "naTxt": "+1",
   "txt": "Tipo Mutante. Gana Aura Tóxica o Cuerpo Hueco, y una Debilidad aleatoria.",
   "na": 1,
   "tipo": "mutante",
   "gana": [
    "aura_toxica"
   ]
  },
  "cristalina": {
   "name": "Cristalina",
   "naTxt": "+1",
   "txt": "Gana Piel Gruesa y Reflejar Axiomas. Vulnerabilidad (Contundente).",
   "na": 1,
   "gana": [
    "piel_gruesa",
    "reflejar_axiomas",
    "vulnerabilidad"
   ],
   "notas": {
    "vulnerabilidad": "Contundente"
   }
  },
  "sombria": {
   "name": "Sombría",
   "naTxt": "+1",
   "txt": "Gana Paso de Sombra y Oscuridad Viva. Fotosensible.",
   "na": 1,
   "gana": [
    "paso_de_sombra",
    "oscuridad_viva",
    "fotosensible"
   ]
  },
  "alfa": {
   "name": "Alfa",
   "naTxt": "+1",
   "txt": "Rol Comandante. Gana Líder de Manada. Aparece siempre con 1d4 de su especie.",
   "na": 1,
   "rol": "comandante",
   "gana": [
    "lider_de_manada"
   ]
  },
  "cria": {
   "name": "Cría",
   "naTxt": "−2",
   "txt": "Estadísticas del nuevo NA, un tamaño menos. Pierde su Rasgo de Potencial más alto. Cobarde.",
   "na": -2,
   "tam": -1,
   "gana": [
    "cobarde"
   ],
   "pierdeMayor": true
  }
 },
 "peligros": {
  "losa_con_resorte": {
   "name": "Losa con resorte",
   "na": 1,
   "cond": "Al pisarla",
   "senal": "una junta más limpia que las demás",
   "cons": "Salvación DES o 1d6 y Derribado."
  },
  "foso_cubierto": {
   "name": "Foso cubierto",
   "na": 2,
   "cond": "Al cruzar el pasillo",
   "senal": "polvo sin huellas en el centro",
   "cons": "Salvación DES o 2d6 de caída y Apresado en el fondo."
  },
  "dardos_envenenados": {
   "name": "Dardos envenenados",
   "na": 2,
   "cond": "Al abrir la puerta",
   "senal": "agujeros diminutos en el marco",
   "cons": "Salvación DES o 1d4 y Envenenado (Ud6)."
  },
  "gas_soporifero": {
   "name": "Gas soporífero",
   "na": 3,
   "cond": "Al romper el sello del cofre",
   "senal": "olor dulzón",
   "cons": "Salvación CON o Inconsciente durante 1 minuto, o hasta recibir daño o que alguien lo despierte (1 PA)."
  },
  "cuchillas_pendulares": {
   "name": "Cuchillas pendulares",
   "na": 3,
   "cond": "Cada ronda en la sala",
   "senal": "marcas en el suelo",
   "cons": "Salvación DES o 1d10 Cortante."
  },
  "techo_que_baja": {
   "name": "Techo que baja",
   "na": 4,
   "cond": "Al cerrarse la puerta",
   "senal": "marcas de roce en las paredes",
   "cons": "4 rondas para salir; después, 2d6 por ronda."
  },
  "runa_explosiva": {
   "name": "Runa explosiva",
   "na": 4,
   "cond": "Al leerla",
   "senal": "tinta que brilla en la oscuridad",
   "cons": "Salvación DES o 2d6 de su elemento en 10 pies."
  },
  "cienaga_salobre": {
   "name": "Ciénaga salobre",
   "na": 3,
   "cond": "Al salirse del sendero",
   "senal": "agua que burbujea",
   "cons": "Salvación FUE o Apresado y una Ronda de Exploración perdida."
  },
  "hielo_delgado": {
   "name": "Hielo delgado",
   "na": 2,
   "cond": "Al cruzar el lago",
   "senal": "grietas blancas",
   "cons": "Salvación DES o al agua helada: 1 escalón de Fatiga."
  },
  "aire_enrarecido": {
   "name": "Aire enrarecido",
   "na": 4,
   "cond": "Cada Vigilia en altura",
   "senal": "jaquecas, labios morados",
   "cons": "Salvación CON o 1 escalón de Fatiga."
  },
  "galeria_que_cede": {
   "name": "Galería que cede",
   "na": 5,
   "cond": "Tras una Vigilia bajo sus vigas",
   "senal": "polvo que cae",
   "cons": "Salvación DES o 2d8 y salida bloqueada."
  },
  "fiebre_del_puerto": {
   "name": "Fiebre del puerto",
   "na": 4,
   "cond": "Cada Vigilia en el barrio bajo",
   "senal": "puertas marcadas con cal",
   "cons": "Salvación CON o 1 escalón de Fatiga."
  },
  "esporas_de_sueno": {
   "name": "Esporas de sueño",
   "na": 3,
   "cond": "Al tocar los hongos",
   "senal": "polvo violeta",
   "cons": "Salvación CON o Conmocionado (Ud6) y visiones."
  },
  "radiacion": {
   "name": "Radiación",
   "na": 5,
   "cond": "Cada hora en la zona",
   "senal": "el contador chasquea, la piel escuece",
   "cons": "Salvación CON o pierde 1 de Flesh."
  },
  "sensor_de_movimiento": {
   "name": "Sensor de movimiento",
   "na": 3,
   "cond": "Al entrar en el pasillo",
   "senal": "luz roja intermitente",
   "cons": "alerta a 1d4 guardias (Dron o Centinela)."
  },
  "suelo_electrificado": {
   "name": "Suelo electrificado",
   "na": 5,
   "cond": "Al pisarlo con metal",
   "senal": "chispas en las juntas",
   "cons": "Salvación CON o 2d8 Rayo y Aturdido (Ud4)."
  },
  "espejo_hambriento": {
   "name": "Espejo hambriento",
   "na": 6,
   "cond": "Al mirarse",
   "senal": "el reflejo sonríe tarde",
   "cons": "Salvación SAB o Encantado (Ud6) y se acerca al espejo."
  },
  "tormenta_de_arena": {
   "name": "Tormenta de arena",
   "na": 4,
   "cond": "Al cruzar el desierto",
   "senal": "cielo amarillo al horizonte",
   "cons": "visibilidad 10 pies; Salvación CON cada Vigilia o 1 escalón de Fatiga."
  },
  "maldicion_del_umbral": {
   "name": "Maldición del umbral",
   "na": 6,
   "cond": "Al cruzar sin permiso",
   "senal": "sal derramada en la entrada",
   "cons": "Salvación SAB o Maldito (Ud8)."
  },
  "sala_que_cambia": {
   "name": "Sala que cambia",
   "na": 7,
   "cond": "Cada Ronda de Exploración",
   "senal": "las esquinas no suman",
   "cons": "Salvación INT o el grupo se separa en dos grupos."
  }
 },
 "bestiario": {
  "guardia_de_la_ciudad": {
   "nombre": "Guardia de la Ciudad",
   "na": 1,
   "tipo": "humanoide",
   "tam": "mediano",
   "rol": "esbirro",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "formacion",
     "txt": "+1 a la Guardia por cada guardia adyacente, hasta +3.",
     "especie": true
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Perforante",
   "ataqueNombre": "Lanza",
   "fuertes": [
    "FUE",
    "CON"
   ],
   "debiles": [],
   "senal": "Silbatos que se contestan de calle en calle · antorchas que se acercan en fila · un farol que se apaga de golpe.",
   "contexto": "No son enemigos: son tiempo. Cuatro guardias no matan a nadie, pero cada ronda que el grupo pasa con ellos es una ronda más para que llegue quien sí puede hacerlo.",
   "impreso": {
    "pv": 2,
    "g": 12,
    "a": 0,
    "vel": 30,
    "atk": 4,
    "dano": "2d6+3",
    "cd": 12,
    "ini": 0,
    "moral": null,
    "attrs": {
     "FUE": 2,
     "DES": 0,
     "CON": 2,
     "INT": 0,
     "SAB": 0,
     "CAR": 0
    },
    "enc": 1
   },
   "idea": "«Circulen. Aquí no ha pasado nada.»",
   "botin": "1d6 cr cada uno; uno lleva la llave de la garita",
   "notas": "Común · Número: 2d4 (4d6 en el cuartel) · En su guarida: 10 % · Inteligencia: media · Moral: Huyen si cae su sargento\n\nLa guardia de una ciudad no son soldados: son vecinos con lanza, mal pagados y peor entrenados, que conocen cada portal de su barrio y a quién no conviene molestar. Aceptan sobornos de 5 cr por cabeza para no ver algo pequeño, y de 50 para no ver algo grande; nada compra que olviden un muerto. Visten sobrevestas con el color de la ciudad, casi siempre desteñido, y llevan farol y lanza. Su sargento, si lo hay, es un Mercenario Veterano con otro nombre.\n\nGanchos (d6):\n1 uno de ellos es primo de alguien del grupo y lo reconoce\n2 cobran un peaje que no existe en ninguna ordenanza\n3 buscan a alguien que se parece demasiado a uno de los personajes\n4 vuelven borrachos de una fiesta y quieren compañía, no problemas\n5 escoltan a un preso que pide ayuda a gritos\n6 no son guardias: llevan uniformes robados y buscan lo mismo que el grupo"
  },
  "kobold_trampero": {
   "nombre": "Kobold Trampero",
   "na": 1,
   "tipo": "humanoide",
   "tam": "pequeno",
   "rol": "acechador",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "retirada_agil",
     "txt": "No provoca Ataques de Oportunidad al alejarse.",
     "especie": true
    },
    {
     "id": "trampas_de_la_guarida",
     "txt": "Su madriguera tiene 1d4 trampas de NA 1 (Cap. 7) que él sabe esquivar."
    },
    {
     "id": "tactica_de_manada",
     "txt": "Ventaja si otro kobold está adyacente al mismo objetivo."
    },
    {
     "id": "esconderse",
     "txt": "Se oculta con solo cobertura parcial o penumbra, aunque lo miren, con Ventaja en Sigilo."
    },
    {
     "id": "fotosensible",
     "txt": "En luz brillante, Desventaja en ataques y Percepción."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Perforante",
   "ataqueNombre": "Lanza corta",
   "fuertes": [
    "DES",
    "FUE"
   ],
   "debiles": [],
   "senal": "Cascabeles colgados de hilos · piedras apiladas en los cruces · un olor a sebo quemado que sale del suelo.",
   "contexto": "El kobold no pelea: te hace pelear contra su casa. Si el grupo avanza con prisa, las trampas hacen el trabajo; si avanza con cuidado, los kobolds tienen tiempo de rodearlo.",
   "impreso": {
    "pv": 42,
    "g": 14,
    "a": 0,
    "vel": 30,
    "atk": 4,
    "dano": "2d6+3",
    "cd": 12,
    "ini": 2,
    "moral": 11,
    "attrs": {
     "FUE": 1,
     "DES": 2,
     "CON": 0,
     "INT": 0,
     "SAB": 0,
     "CAR": 0
    },
    "enc": 1
   },
   "idea": "«No lo verás. Verás lo que dejó para ti.»",
   "botin": "Monedas de cobre, piezas de trampa, 1d4 objetos robados",
   "notas": "Común · Número: 1d6 (4d6 en la madriguera) · En su guarida: 40 % · Inteligencia: media, muy astuta · Moral: 11\n\nLos kobolds caben por donde no cabe nadie y lo saben. Cavan madrigueras de techo bajo con galerías que se cruzan, y adoran los mecanismos: un kobold viejo puede pasarse un invierno entero afinando el resorte de una sola trampa. Coleccionan cascabeles y los cuelgan de hilos a la entrada para oír quién pasa. Tienen escamas color óxido, ojos amarillos y una voz que parece un ladrido. Odian a los enanos, que les roban las minas, y negocian con cualquiera que les pague en metal.\n\nGanchos (d6):\n1 la madriguera tiene una trampa que ni ellos recuerdan dónde está\n2 el jefe quiere contratar al grupo contra los kobolds de la madriguera vecina\n3 tienen a un enano prisionero y piden rescate en hierro\n4 están cavando hacia algo que no deberían despertar\n5 uno de ellos quiere desertar y ofrece el mapa de las trampas\n6 la madriguera está vacía: algo se los comió a todos"
  },
  "dron_centinela": {
   "nombre": "Dron Centinela",
   "na": 1,
   "tipo": "maquina",
   "tam": "pequeno",
   "rol": "artillero",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "vigor_inagotable",
     "gratis": true
    },
    {
     "id": "sistemas_redundantes",
     "gratis": true
    },
    {
     "id": "protocolo_de_amenaza",
     "txt": "Tras ser atacado por una criatura, tiene +2 al ataque contra ella.",
     "especie": true
    },
    {
     "id": "vuelo",
     "txt": "Vuela a 30 pies.",
     "nota": "30 pies"
    },
    {
     "id": "arma_montada",
     "txt": "2 PA: ataque a distancia hasta 120 pies."
    },
    {
     "id": "vulnerabilidad",
     "txt": "Recibe ×1,5 de daño de Rayo.",
     "nota": "Rayo"
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Energía",
   "ataqueNombre": "Láser",
   "fuertes": [
    "DES",
    "SAB"
   ],
   "debiles": [
    "CON",
    "CAR"
   ],
   "senal": "Un zumbido intermitente · luces rojas que barren el pasillo · marcas de quemadura a la altura del pecho.",
   "contexto": "Uno solo es una molestia. Tres, cubriendo el mismo pasillo desde el techo, obligan al grupo a buscar otra ruta o a asumir que alguien va a caer antes de llegar a la puerta.",
   "impreso": {
    "pv": 39,
    "g": 14,
    "a": 0,
    "vel": 30,
    "atk": 4,
    "dano": "2d6+3",
    "cd": 12,
    "ini": 2,
    "moral": null,
    "attrs": {
     "FUE": -1,
     "DES": 2,
     "CON": -2,
     "INT": 0,
     "SAB": 2,
     "CAR": -2
    },
    "enc": 1
   },
   "idea": "«Identifíquese. Identifíquese. Identifíquese.»",
   "botin": "Una célula de energía (25 cr) y, con Tecnología contra su CD, un chip de Construido",
   "notas": "Infrecuente; común en ruinas tecnológicas · Número: 1d3 · Inteligencia: ninguna: programada · Moral: No la tira\n\nNadie recuerda quién los fabricó. Los drones centinela siguen patrullando pasillos de instalaciones que llevan siglos muertas, cumpliendo una orden que nadie puede ya revocar. Son esferas del tamaño de una cabeza, de metal mate, con un ojo rojo que barre el pasillo cada pocos segundos. Si alguien lleva una credencial de su instalación —una placa, un sello, a veces solo un uniforme con el emblema correcto— lo escoltan en lugar de dispararle. El Rayo les sobrecarga los circuitos: reciben ×1,5 de su daño.\n\nGanchos (d6):\n1 su orden es proteger a alguien que lleva siglos muerto, y ese alguien sigue ahí\n2 lleva una grabación del último día de la instalación\n3 está dañado y dispara a cualquier cosa que se mueva, incluidas sus compañeras\n4 obedece a quien lleve un emblema que uno de los personajes tiene sin saberlo\n5 escolta a una máquina más grande que todavía no ha despertado\n6 alguien lo ha reprogramado para vigilar un tesoro que no es suyo"
  },
  "cieno_gris": {
   "nombre": "Cieno Gris",
   "na": 2,
   "tipo": "cieno",
   "tam": "mediano",
   "rol": "",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "forma_amorfa",
     "gratis": true
    },
    {
     "id": "sentido_sismico",
     "gratis": true
    },
    {
     "id": "sangre_acida",
     "txt": "Quien le inflija daño Cortante o Perforante cuerpo a cuerpo recibe 1d6 de Ácido.",
     "especie": true
    },
    {
     "id": "acido_corrosivo",
     "txt": "Su ataque añade 1d6 de Ácido y aplica Desgarro (Ud6)."
    },
    {
     "id": "falsa_apariencia",
     "txt": "Inmóvil, parece un charco de agua sucia."
    },
    {
     "id": "vulnerabilidad",
     "txt": "Recibe ×1,5 de daño de Frío.",
     "nota": "Frío"
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Ácido",
   "ataqueNombre": "Pseudópodo",
   "fuertes": [
    "CON",
    "FUE"
   ],
   "debiles": [
    "INT",
    "CAR"
   ],
   "senal": "Armas y armaduras corroídas en el suelo, sin dueño · un charco donde no gotea nada · olor a cobre mojado.",
   "contexto": "No mata rápido: desarma. Cada golpe que recibe el Audaz le quita Armadura que tardará en recuperar, y el grupo descubre demasiado tarde que las espadas también se corroen.",
   "impreso": {
    "pv": 60,
    "g": 12,
    "a": 1,
    "vel": 30,
    "atk": 4,
    "dano": "2d6+5",
    "cd": 13,
    "ini": 0,
    "moral": null,
    "attrs": {
     "FUE": 2,
     "DES": 0,
     "CON": 2,
     "INT": -2,
     "SAB": 0,
     "CAR": -2
    },
    "enc": 2
   },
   "idea": "«No mires el charco. El charco sí te mira.»",
   "botin": "Lo que no pudo disolver: monedas, gemas, hebillas",
   "notas": "Infrecuente · Número: 1 · Inteligencia: ninguna · Moral: No la tira\n\nEl cieno gris vive en cloacas, criptas inundadas y sótanos donde gotea el agua. No caza: espera a que algo pise donde no debe. Digiere carne, cuero y metal, y por eso sus guaridas están llenas de cosas que no supo disolver: monedas, gemas, hebillas de cinturón sin cinturón. Es gris pizarra con vetas verdosas, y huele a cobre mojado. Dicen que en las ciudades viejas los alcantarilleros los mantienen alimentados para que se coman lo que nadie quiere encontrar.\n\nGanchos (d6):\n1 tiene dentro, sin digerir, la llave que el grupo busca\n2 son dos y uno está en el techo\n3 alguien lo alimenta a propósito y no quiere que lo maten\n4 está en una fuente pública y ya se ha llevado a dos niños\n5 es un experimento: brilla en la oscuridad y no le hace nada el frío\n6 hay una víctima dentro que todavía respira"
  },
  "mercenario_veterano": {
   "nombre": "Mercenario Veterano",
   "na": 2,
   "tipo": "humanoide",
   "tam": "mediano",
   "rol": "guardian",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "venganza_del_grupo",
     "txt": "Cuando cae un compañero de su compañía, gana +2 al daño hasta el final del combate.",
     "especie": true
    },
    {
     "id": "bloqueador",
     "txt": "Una vez por ronda, bloquea con 1d20 + 6 contra el total del ataque."
    },
    {
     "id": "formacion",
     "txt": "+1 a la Guardia por cada aliado adyacente, hasta +3."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Cortante",
   "ataqueNombre": "Espada larga",
   "fuertes": [
    "CON",
    "FUE"
   ],
   "debiles": [],
   "equipo": "cota de malla y escudo (Armadura 3 con el Rol; el escudo da +1 a la Guardia y +2 al Bloqueo).",
   "senal": "Hogueras de campamento ordenadas · un estandarte de compañía · tiendas puestas con una zanja alrededor.",
   "contexto": "El mercenario no busca ganar: busca que su pagador salga vivo. Pelea en línea, protege al que paga y se rinde en cuanto el contrato deja de compensar (Moral 12).",
   "manual": {
    "armadura": 3,
    "guardia": 13
   },
   "impreso": {
    "pv": 60,
    "g": 13,
    "a": 3,
    "vel": 20,
    "atk": 4,
    "dano": "2d6+5",
    "cd": 13,
    "ini": 0,
    "moral": 12,
    "attrs": {
     "FUE": 2,
     "DES": 0,
     "CON": 2,
     "INT": 0,
     "SAB": 0,
     "CAR": 0
    },
    "enc": 2
   },
   "idea": "«El precio era por pelear. Morir se cobra aparte.»",
   "botin": "2d6 cr cada uno; el contrato firmado de la compañía",
   "notas": "Común · Número: 1d6 (2d10 y un capitán en el campamento) · En su guarida: 20 % · Inteligencia: media · Moral: 12\n\nLas compañías mercenarias tienen nombre, estandarte y libro de cuentas. Un veterano ha sobrevivido a suficientes campañas como para saber que nadie paga a los muertos: pelea en línea, cuida su escudo más que su espada y nunca persigue. Visten lo que han ido ganando —una cota de un señor, un yelmo de otro— y llevan cosido el emblema de la compañía. Respetan a quien les hace una oferta mejor y desprecian a quien no la cumple.\n\nGanchos (d6):\n1 los contrató el mismo enemigo del grupo, pero les debe tres meses\n2 su capitán es un antiguo compañero de uno de los personajes\n3 escoltan una carga que no saben qué es, y no quieren saberlo\n4 buscan trabajo y ofrecen sus espadas al grupo\n5 desertaron de una guerra y los busca su propio ejército\n6 uno de ellos es un noble disfrazado que paga la compañía en secreto"
  },
  "tejedora_del_techo": {
   "nombre": "Tejedora del Techo",
   "na": 3,
   "tipo": "bestia",
   "tam": "grande",
   "rol": "acechador",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "vision_en_la_oscuridad",
     "gratis": true
    },
    {
     "id": "telarana",
     "txt": "2 PA · Ud6: área de 10 pies a 30 pies, terreno difícil; Salvación DES CD 16 o Apresado.",
     "especie": true
    },
    {
     "id": "trepadora",
     "txt": "Trepa a su velocidad por muros y techos."
    },
    {
     "id": "aguijon_venenoso",
     "txt": "Su mordisco: al impactar, Salvación CON CD 16 o queda Envenenado (Ud8).",
     "especie": true
    },
    {
     "id": "arrastrar",
     "txt": "Arrastra a la criatura que tiene Apresada a su velocidad completa, sin provocar Ataques de Oportunidad."
    },
    {
     "id": "veneno_paralizante",
     "txt": "Al impactar a una criatura Envenenada, Salvación CON CD 16 o queda Paralizada (Ud4).",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "fotosensible",
     "txt": "En luz brillante, Desventaja en ataques y Percepción."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Perforante",
   "ataqueNombre": "Quelíceros",
   "fuertes": [
    "DES",
    "FUE"
   ],
   "debiles": [
    "INT",
    "CAR"
   ],
   "rolNota": "Primer Golpe: su primer impacto contra una criatura Desprevenida suma el daño base otra vez.",
   "proteccion": "Un antídoto bebido antes, o un Axioma que cure venenos, da Ventaja contra la parálisis. Una antorcha encendida en la mano da Ventaja contra la Telaraña y quema los hilos que toca; con luz brillante, la Tejedora pelea con Desventaja.",
   "encuentroTxt": "Pasa en 3 su presupuesto de Potencial: cuenta como NA 4 al calcular el encuentro.",
   "senal": "Hilos pegajosos a la altura de la cabeza · ratas envueltas como regalos · ningún eco en la galería.",
   "contexto": "No pelea: atrapa con la tela al último de la fila, lo muerde hasta paralizarlo y se lo lleva. El grupo decide entre perseguirla hacia su terreno o dejar atrás a un compañero.",
   "impreso": {
    "pv": 66,
    "g": 16,
    "a": 1,
    "vel": 30,
    "atk": 7,
    "dano": "3d6+2",
    "cd": 16,
    "ini": 3,
    "moral": null,
    "attrs": {
     "FUE": 4,
     "DES": 3,
     "CON": 0,
     "INT": -2,
     "SAB": 0,
     "CAR": -2
    },
    "enc": 4
   },
   "idea": "«En esta galería no hay eco. Lo que suena, lo oye ella.»",
   "botin": "Lo que llevaban sus presas; su seda vale 50 cr la vara",
   "notas": "Rara · Número: 1 (1d3 en su guarida) · En su guarida: 60 % · Inteligencia: animal, pero paciente · Moral: No la tira\n\nLas Tejedoras viven en minas abandonadas, criptas y cualquier galería con techo alto y aire quieto. Son negras con bandas color hueso y del tamaño de un caballo, y casi ciegas: cazan por el hilo, no por la vista. Las hembras viejas tienen el abdomen cubierto de cicatrices circulares que los mineros dicen que son mordeduras de sus propias crías. Como guardan vivas a sus presas, sus guaridas casi siempre tienen supervivientes, y un grupo que pierde a alguien tiene un motivo para seguirla hasta donde no quiere ir. Ponen una vez cada tres años, y entonces dejan de cazar y se vuelven el doble de territoriales.\n\nGanchos (d6):\n1 está poniendo huevos: no persigue, pero no cede un palmo\n2 guarda un capullo con alguien que sigue vivo y que el grupo conoce\n3 es vieja y casi ciega: sus hilos cubren tres galerías\n4 comparte guarida con otra, y se roban las presas\n5 está herida por algo más grande que vive más abajo\n6 los mineros le dejan cabras para que no suba"
  },
  "sabueso_infernal": {
   "nombre": "Sabueso Infernal",
   "na": 3,
   "tipo": "extraplanar",
   "tam": "mediano",
   "rol": "hostigador",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "telepatia",
     "nota": "con los suyos",
     "gratis": true
    },
    {
     "id": "resistencia",
     "nota": "Fuego y Necrótico",
     "gratis": true
    },
    {
     "id": "olor_de_la_sangre",
     "txt": "Percibe a las criaturas heridas a 120 pies, aunque estén ocultas o sean invisibles.",
     "especie": true
    },
    {
     "id": "aliento",
     "txt": "3 PA · Ud6: cono de 30 pies, Salvación DES CD 15, 4d6 de Fuego; la mitad si la supera.",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "tactica_de_manada",
     "txt": "Ventaja si un aliado está adyacente al mismo objetivo."
    },
    {
     "id": "aversion",
     "txt": "No cruza una línea de sal consagrada; las armas bendecidas hacen Crítico contra él con 19–20."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Perforante y Fuego",
   "ataqueNombre": "Mordisco",
   "fuertes": [
    "DES",
    "FUE"
   ],
   "debiles": [
    "CON",
    "INT"
   ],
   "rolNota": "Flanqueo: Ventaja si un aliado está adyacente al mismo objetivo.",
   "proteccion": "Resistencia al Fuego, o separarse: el Aliento no alcanza a quien está lejos de los demás. La sal consagrada le cierra el paso.",
   "encuentroTxt": "Su Aliento le suma 3: cuenta como NA 6 al calcular el encuentro.",
   "senal": "Hierba quemada con forma de huellas · un olor a azufre que no se va · ganado muerto con el pelo chamuscado.",
   "contexto": "Cazan en tríos y abren con el aliento antes de cerrar el cerco. El grupo que se agrupa para defenderse es el que mejor queda para el siguiente aliento.",
   "impreso": {
    "pv": 57,
    "g": 16,
    "a": 1,
    "vel": 40,
    "atk": 6,
    "dano": "3d6+1",
    "cd": 15,
    "ini": 3,
    "moral": null,
    "attrs": {
     "FUE": 3,
     "DES": 3,
     "CON": -2,
     "INT": -2,
     "SAB": 0,
     "CAR": 0
    },
    "enc": 6
   },
   "idea": "«Si hueles azufre, ya te ha olido él.»",
   "botin": "Ninguno; su collar de hierro negro vale 30 cr",
   "notas": "Rara · Número: 1d3 (2d4 con su amo) · En su guarida: 20 % · Inteligencia: baja, pero astuta · Moral: No la tira\n\nLos sabuesos infernales no nacen en este mundo: alguien los trae, y casi nunca se van del todo. Son perros de caza del tamaño de un lobo grande, de pelo corto color ceniza y ojos que brillan como brasas a través del humo. Su aliento huele a azufre, y su saliva deja quemaduras pequeñas donde gotea. Obedecen a quien les dio de comer primero en este plano; si su amo muere, se quedan cazando en el mismo territorio, cada vez más hambrientos, hasta que alguien les pone fin.\n\nGanchos (d6):\n1 su amo murió hace un año y siguen cazando para él\n2 llevan un collar con el sello de una casa noble\n3 persiguen a alguien que ha robado algo del otro lado\n4 son una sola hembra con dos cachorros: el grupo puede llevarse uno\n5 un culto les deja ofrendas en un cruce de caminos\n6 huyen de algo peor que también cruzó"
  },
  "ghoul": {
   "nombre": "Ghoul",
   "na": 3,
   "tipo": "no_muerto",
   "tam": "mediano",
   "rol": "arrollador",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "vigor_inagotable",
     "gratis": true
    },
    {
     "id": "inmunidad_a_estados",
     "nota": "Envenenado y Aterrado",
     "gratis": true
    },
    {
     "custom": true,
     "name": "Garras Paralizantes",
     "tipo": "Modificador",
     "peso": 3,
     "txt": "Al impactar, Salvación CON CD 15 o queda Paralizado (Ud4). Los elfos son inmunes.",
     "definitoria": true,
     "especie": true
    },
    {
     "id": "toque_necrotico",
     "txt": "Su daño es Necrótico, y el objetivo no recupera PV hasta el final de su siguiente turno."
    },
    {
     "id": "carronera",
     "txt": "2 PA: devora un cadáver adyacente y recupera 9 PV."
    },
    {
     "id": "remate",
     "txt": "Ventaja contra criaturas Derribadas o por debajo de la mitad de sus PV."
    },
    {
     "id": "garras_desgarradoras",
     "txt": "Dos impactos al mismo objetivo en un turno aplican Sangrado (Ud6)."
    },
    {
     "id": "vulnerabilidad",
     "txt": "Recibe ×1,5 de daño Radiante.",
     "nota": "Radiante"
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Cortante",
   "ataqueNombre": "Garras",
   "fuertes": [
    "FUE",
    "CON"
   ],
   "debiles": [
    "DES",
    "CAR"
   ],
   "rolNota": "Ataque Masivo: derriba al impactar, una vez por ronda.",
   "proteccion": "Agua bendita bebida antes del combate o un amuleto consagrado: Ventaja en la Salvación. Los elfos son inmunes a la parálisis.",
   "encuentroTxt": "Sus garras pasan en 2 su presupuesto de Potencial: cuenta como NA 4 al calcular el encuentro.",
   "senal": "Tumbas abiertas desde dentro · huesos partidos a lo largo · tierra removida en el cementerio, sin pala.",
   "contexto": "Derriba y se ceba. Un personaje en el suelo junto a un ghoul pierde un turno levantándose y sufre dos ataques con Ventaja; el grupo tiene que decidir quién se queda a su lado.",
   "impreso": {
    "pv": 79,
    "g": 11,
    "a": 1,
    "vel": 30,
    "atk": 6,
    "dano": "4d6+1",
    "cd": 15,
    "ini": -2,
    "moral": 13,
    "attrs": {
     "FUE": 3,
     "DES": -2,
     "CON": 3,
     "INT": 0,
     "SAB": 0,
     "CAR": -2
    },
    "enc": 4
   },
   "idea": "«Tiene paciencia. Todo el mundo acaba bajo tierra.»",
   "botin": "Ajuares funerarios: 3d6 × 10 cr en anillos y monedas de difunto",
   "notas": "Infrecuente · Número: 1d4 (2d6 en el osario) · En su guarida: 50 % · Inteligencia: media · Moral: 13\n\nLos ghouls fueron personas que comieron lo que no debían en un invierno largo, y la tumba no les quitó el hambre. Recuerdan su nombre, hablan con voz ronca y pueden negociar, aunque cualquier trato con ellos termina en una mesa. Son flacos hasta el hueso, de piel gris amarillenta, con uñas negras y largas y dientes partidos de roer. Viven en osarios y criptas donde siempre hay algo que comer, y entierran a sus presas para dejarlas madurar. La luz sagrada les quema como el aceite: reciben ×1,5 de daño Radiante.\n\nGanchos (d6):\n1 el sepulturero los alimenta para que no salgan\n2 uno de ellos era un pariente de alguien del grupo\n3 tienen enterrado a un viajero que sigue vivo\n4 quieren un trato: comida a cambio de información de los muertos\n5 su guarida conecta con las cloacas de la ciudad\n6 obedecen a un ghoul viejo que se hace llamar «el Abad»"
  },
  "fuego_fatuo": {
   "nombre": "Fuego Fatuo",
   "na": 3,
   "tipo": "espiritu",
   "tam": "diminuto",
   "rol": "represor",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "telepatia",
     "gratis": true
    },
    {
     "id": "senuelo",
     "txt": "2 PA · Ud6: crea una luz gemela; el primer ataque que lo impactaría golpea al señuelo y lo disipa.",
     "especie": true
    },
    {
     "id": "vuelo",
     "txt": "Flota a 30 pies.",
     "nota": "30 pies"
    },
    {
     "id": "voz_seductora",
     "txt": "2 PA · Ud6: una criatura a 30 pies, Salvación SAB CD 15 o Encantada (Ud6); la sigue hacia el pantano.",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "ligada_al_lugar",
     "txt": "No se aleja más de 300 pies de la ciénaga donde murió."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Rayo",
   "ataqueNombre": "Toque",
   "fuertes": [
    "INT",
    "SAB"
   ],
   "debiles": [],
   "rolNota": "Represión (3 PA): Cegado (Salvación CON, Ud4).",
   "proteccion": "Atarse con una cuerda o taparse los oídos: Ventaja contra su Voz Seductora, y quien la falla así se queda quieto en lugar de caminar hacia el agua.",
   "senal": "Luces azules entre los juncos · viajeros que juran haber visto un farol · campanillas en todas las ventanas de la aldea.",
   "contexto": "No mata: conduce. La víctima Encantada camina hacia la ciénaga más profunda (Cap. 7), y el grupo tiene que elegir entre perseguir la luz o sacar a su compañero del agua.",
   "impreso": {
    "pv": 61,
    "g": 14,
    "a": 1,
    "vel": 30,
    "atk": 4,
    "dano": "3d6-1",
    "cd": 15,
    "ini": 1,
    "moral": 13,
    "attrs": {
     "FUE": -2,
     "DES": 1,
     "CON": -1,
     "INT": 3,
     "SAB": 3,
     "CAR": 0
    },
    "enc": 3
   },
   "idea": "«Sigue la luz. Siempre hay alguien al final de la luz.»",
   "botin": "Lo que llevaban sus víctimas, en el fondo del agua",
   "notas": "Rara · Número: 1 (1d3 en ciénagas antiguas) · Inteligencia: alta · Moral: 13\n\nUn fuego fatuo es lo que queda de alguien que se ahogó perdido en una ciénaga y no quiere estar solo allí abajo. Es una luz azul pálida del tamaño de un puño, que tiembla como la llama de un farol a lo lejos. No odia a los vivos: los quiere cerca. Por eso no mata, conduce. Los pantanos viejos tienen varios, y las aldeas cercanas cuelgan campanillas en las ventanas para que nadie salga cuando se ven luces entre los juncos.\n\nGanchos (d6):\n1 era la hija del molinero y su madre todavía la llama de noche\n2 conduce a los viajeros hacia un tesoro, no hacia la muerte\n3 son tres y se pelean por la misma víctima\n4 su cuerpo está en el fondo con una carta sin entregar\n5 solo aparece cuando alguien del grupo miente\n6 un brujo la ha atado a un frasco y la usa de cebo"
  },
  "arpia": {
   "nombre": "Arpía",
   "na": 3,
   "tipo": "monstruosidad",
   "tam": "mediano",
   "rol": "represor",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "espinas",
     "txt": "Sus plumas cortan a quien la apresa, 1d6 Perforante",
     "gratis": true
    },
    {
     "id": "garras_desgarradoras",
     "txt": "Si impacta superando la Guardia por 5 o más, o con un Crítico, aplica Sangrado (Ud6).",
     "especie": true
    },
    {
     "id": "vuelo",
     "txt": "Vuela a 40 pies.",
     "nota": "40 pies"
    },
    {
     "id": "voz_seductora",
     "txt": "2 PA · Ud6: una criatura a 30 pies, Salvación SAB CD 15 o Encantada (Ud6).",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "cobarde",
     "txt": "Moral 9; la tira en cuanto pierde un cuarto de sus PV."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Cortante",
   "ataqueNombre": "Garras",
   "fuertes": [
    "INT",
    "SAB"
   ],
   "debiles": [],
   "rolNota": "Represión (3 PA): chillido; Aterrado (Salvación SAB, Ud4).",
   "proteccion": "Cera en los oídos: Ventaja contra su canto, a cambio de quedar Ensordecido mientras la lleve.",
   "senal": "Un canto hermoso en los acantilados · restos de marineros al pie · gaviotas que no se acercan.",
   "contexto": "Encanta a uno y ataca desde el aire a quien intenta despertarlo. Es frágil y huye pronto, así que la pelea no se gana matándola, sino sacando al encantado del borde.",
   "impreso": {
    "pv": 66,
    "g": 13,
    "a": 1,
    "vel": 30,
    "atk": 3,
    "dano": "3d6-2",
    "cd": 15,
    "ini": 0,
    "moral": 9,
    "attrs": {
     "FUE": 0,
     "DES": 0,
     "CON": 0,
     "INT": 3,
     "SAB": 3,
     "CAR": 0
    },
    "enc": 3
   },
   "idea": "«El canto es lo único bello que tiene. Lo usa bien.»",
   "botin": "Restos de naufragios: 2d6 × 10 cr y un objeto curioso",
   "notas": "Infrecuente · Número: 1d4 (2d6 en el acantilado) · En su guarida: 30 % · Inteligencia: alta · Moral: 9\n\nLas arpías anidan en acantilados sobre el mar, donde el viento arrastra su canto hasta los barcos. Tienen cuerpo de buitre grande, alas pardas y una cara de mujer vieja y hermosa a la vez, y huelen a pescado podrido. Viven de lo que el mar les trae: marineros que saltan por la borda hacia la voz, y lo que llevaban en los bolsillos. Coleccionan objetos brillantes sin entender para qué sirven, y cantan entre ellas en un idioma que se parece a uno humano olvidado.\n\nGanchos (d6):\n1 su nido tiene la brújula de un barco que el grupo busca\n2 cantan una canción que uno de los personajes conoce de niño\n3 una de ellas quiere irse y ofrece guiar al grupo\n4 un capitán les paga para hundir a la competencia\n5 su canto se oye en la ciudad y la gente sale de noche\n6 el nido está sobre una cueva con un naufragio entero dentro"
  },
  "mimico": {
   "nombre": "Mímico",
   "na": 4,
   "tipo": "monstruosidad",
   "tam": "mediano",
   "rol": "acechador",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "sangre_acida",
     "txt": "Quien le hace daño Cortante o Perforante cuerpo a cuerpo recibe 1d6 de Ácido",
     "gratis": true
    },
    {
     "id": "arrastrar",
     "txt": "Arrastra a la criatura que tiene Apresada a su velocidad completa, sin provocar Ataques de Oportunidad.",
     "especie": true
    },
    {
     "id": "falsa_apariencia",
     "txt": "Inmóvil, es un cofre, una puerta o un taburete."
    },
    {
     "id": "mordisco_tenaz",
     "txt": "Al impactar, Apresa sin gastar PA: Salvación FUE o DES CD 16 o queda Apresado."
    },
    {
     "id": "emboscadora_nata",
     "txt": "En la primera ronda, sus ataques contra Desprevenidos suman el daño base otra vez.",
     "especie": true,
     "definitoria": true
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Contundente y Ácido",
   "ataqueNombre": "Pseudópodo",
   "fuertes": [
    "DES",
    "FUE"
   ],
   "debiles": [
    "CAR"
   ],
   "rolNota": "Primer Golpe: su primer impacto contra una criatura Desprevenida suma el daño base otra vez.",
   "proteccion": "Tantear muebles y cofres con un palo, o Percepción CD 16: descubierto, pierde su Primer Golpe. El alcohol o el fuego aflojan su adhesivo: Ventaja para escapar.",
   "senal": "Un cofre sin polvo en una sala abandonada · marcas de arrastre bajo él · un olor dulzón a pegamento.",
   "contexto": "El primer golpe es el peor. Después, el personaje pegado al mímico tiene que elegir entre forcejear y seguir recibiendo ácido o que sus compañeros lo golpeen de cerca y se quemen.",
   "impreso": {
    "pv": 84,
    "g": 16,
    "a": 2,
    "vel": 30,
    "atk": 6,
    "dano": "3d6+3",
    "cd": 16,
    "ini": 3,
    "moral": 14,
    "attrs": {
     "FUE": 3,
     "DES": 3,
     "CON": 1,
     "INT": 1,
     "SAB": 1,
     "CAR": -2
    },
    "enc": 4
   },
   "idea": "«El cofre no tenía polvo. Eso era lo único raro.»",
   "botin": "Lo que tragó y no pudo digerir: 3d6 × 10 cr y 1d3 objetos",
   "notas": "Infrecuente · Número: 1 · En su guarida: 100 % · Inteligencia: media · Moral: 14\n\nNadie sabe qué aspecto tiene un mímico cuando no imita nada, porque nunca deja de imitar algo. Copia lo que ve en una sala durante semanas, hasta que la madera, el hierro y hasta el polvo de su forma son perfectos; lo único que suele olvidar es ensuciarse. Habla, mal y con voces robadas, y a veces acepta comida a cambio de no comerse a nadie. Los mímicos viejos aprenden a imitar puertas, y una puerta que se come a quien la abre es la peor trampa de una mazmorra.\n\nGanchos (d6):\n1 es una puerta, no un cofre\n2 imita el ataúd del señor de la cripta\n3 habla y quiere salir de la mazmorra: se ofrece como cofre del grupo\n4 son dos, y uno imita al otro\n5 tragó la llave que el grupo necesita\n6 un mago lo usa de caja fuerte y vendrá a por él"
  },
  "ogro": {
   "nombre": "Ogro",
   "na": 4,
   "tipo": "gigante",
   "tam": "grande",
   "rol": "arrollador",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "gigantismo",
     "gratis": true
    },
    {
     "id": "dura_de_matar",
     "txt": "La primera vez en cada combate que llega a 0 PV, queda en 1 PV.",
     "especie": true
    },
    {
     "id": "golpe_aplastante",
     "txt": "Al impactar, Salvación FUE CD 17 o Derribado.",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "lanzar",
     "txt": "2 PA: en lugar de Empujar, arroja a una criatura que tenga Apresada hasta 20 pies; 3d6 para ella y para quien reciba el golpe."
    },
    {
     "id": "frenesi",
     "txt": "1 PA · 1/combate: hasta su siguiente turno, Ventaja en sus ataques y en los ataques contra él."
    },
    {
     "id": "credula",
     "txt": "Cae en cualquier finta: Engaño contra CD 12."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Contundente",
   "ataqueNombre": "Garrote",
   "fuertes": [
    "FUE",
    "CON"
   ],
   "debiles": [
    "DES",
    "INT"
   ],
   "rolNota": "Ataque Masivo: derriba al impactar, una vez por ronda.",
   "proteccion": "Un escudo plantado da Ventaja contra su Golpe Aplastante; una finta o un cebo lo sacan de la pelea un turno.",
   "senal": "Árboles tronchados a la altura del pecho · cabras desaparecidas · huellas del tamaño de un escudo.",
   "contexto": "Pega muchísimo y piensa muy poco. El grupo que lo engaña —una finta, un señuelo, un puente que no aguanta su peso— lo vence sin recibir un solo golpe.",
   "impreso": {
    "pv": 96,
    "g": 11,
    "a": 2,
    "vel": 30,
    "atk": 7,
    "dano": "4d6+4",
    "cd": 17,
    "ini": -2,
    "moral": null,
    "attrs": {
     "FUE": 4,
     "DES": -2,
     "CON": 3,
     "INT": -2,
     "SAB": 1,
     "CAR": 1
    },
    "enc": 4
   },
   "idea": "«Pega como una avalancha. Piensa como una cabra.»",
   "botin": "2d6 × 10 cr en un saco, y algo que robó sin saber lo que vale",
   "notas": "Común · Número: 1d3 (1d6 en su cueva) · En su guarida: 40 % · Inteligencia: baja · Moral: No la tira\n\nLos ogros miden el doble que una persona y comen el triple. Viven en cuevas junto a los caminos, solos o en familias pequeñas, y bajan a robar ganado cuando se acaba la caza. Tienen la piel parda y gruesa, el pelo apelmazado y los dientes de abajo más largos que los de arriba. No son malvados por convicción, sino por hambre y por pereza: un ogro bien alimentado puede pasarse una semana durmiendo. Se les puede contratar, engañar o asustar con cosas que no entienden, como un espejo o un fuego de colores.\n\nGanchos (d6):\n1 un señor local le paga en ganado para que guarde un paso\n2 está enamorado de una estatua y la defiende\n3 tiene un hijo pequeño que se ha perdido en el bosque\n4 robó un cofre del que no sabe sacar nada\n5 le duele una muela y está de muy mal humor\n6 un mago lo ha convencido de que el grupo es comida"
  },
  "bruja_del_pantano": {
   "nombre": "Bruja del Pantano",
   "na": 5,
   "tipo": "feerico",
   "tam": "mediano",
   "rol": "represor",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "voluntad_de_hierro",
     "gratis": true
    },
    {
     "id": "ilusion",
     "txt": "2 PA · Ud6: crea una imagen convincente de sí misma o de un peligro hasta 60 pies. Descubrir el engaño: Investigación o Perspicacia CD 16.",
     "especie": true
    },
    {
     "id": "maldicion",
     "txt": "2 PA · Ud6: Salvación SAB CD 16 o Maldito (Ud8), con Desventaja en el tipo de tirada que ella elija.",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "cambiaformas",
     "txt": "2 PA: adopta la forma de una anciana, una niña o un cuervo."
    },
    {
     "id": "pesadillas",
     "txt": "Quien duerma a menos de una milla no descansa bien."
    },
    {
     "id": "aversion",
     "txt": "No cruza hierro frío; las armas de hierro frío hacen Crítico con 19–20."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Cortante",
   "ataqueNombre": "Uñas",
   "fuertes": [
    "INT",
    "SAB"
   ],
   "debiles": [
    "FUE"
   ],
   "rolNota": "Represión (3 PA): Ralentizado (Salvación FUE, Ud4).",
   "proteccion": "Hierro frío encima: Ventaja contra su Maldición. Dormir en tierra consagrada aleja sus Pesadillas.",
   "senal": "Muñecos de paja en las puertas · los niños sueñan con una casa sobre patas · la leche se corta en toda la aldea.",
   "contexto": "Ataca antes de que el grupo sepa que está en guerra: con pesadillas que les quitan el descanso y maldiciones que llegan con la cena. Enfrentarla es encontrarla, y encontrarla es saber quién es.",
   "impreso": {
    "pv": 97,
    "g": 14,
    "a": 2,
    "vel": 30,
    "atk": 4,
    "dano": "4d6+1",
    "cd": 16,
    "ini": 1,
    "moral": 15,
    "attrs": {
     "FUE": -2,
     "DES": 1,
     "CON": 1,
     "INT": 3,
     "SAB": 3,
     "CAR": 1
    },
    "enc": 5
   },
   "idea": "«No la busques. Ella ya sabe dónde duermes.»",
   "botin": "Frascos, huesos y deudas: 4d6 × 10 cr y un objeto maldito",
   "notas": "Rara · Número: 1 (a veces un aquelarre de 3) · En su guarida: 70 % · Inteligencia: excepcional · Moral: 15\n\nLas brujas del pantano son feéricas viejas que se quedaron en este mundo cuando las demás se fueron, y se han vuelto amargas en el agua quieta. Viven en casas torcidas al borde de las ciénagas, llenas de frascos, raíces colgadas y muñecos de paja con pelo de verdad. Comercian: un remedio por un recuerdo, un niño sano por el próximo que nazca. Siempre cumplen la letra de un trato y nunca su espíritu. Su forma verdadera es la de una mujer muy alta, de piel verdosa y dedos largos como ramas, con los ojos del color del agua estancada.\n\nGanchos (d6):\n1 tiene un trato antiguo con la familia de uno de los personajes\n2 busca a dos hermanas para formar un aquelarre\n3 ha robado la voz de alguien y la guarda en un frasco\n4 ofrece curar a un aliado moribundo, y el precio parece barato\n5 está enferma y quiere que alguien le traiga un remedio de la ciudad\n6 su casa se mueve cada noche y nadie la encuentra dos veces"
  },
  "manticora": {
   "nombre": "Mantícora",
   "na": 5,
   "tipo": "monstruosidad",
   "tam": "grande",
   "rol": "artillero",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "cola_barredora",
     "txt": "Reacción, 1/ronda, ataque con la cola a quien la flanquee",
     "gratis": true
    },
    {
     "id": "aguijon_venenoso",
     "txt": "Al impactar, Salvación CON CD 16 o queda Envenenado (Ud8).",
     "especie": true
    },
    {
     "id": "vuelo",
     "txt": "Vuela a 50 pies.",
     "nota": "50 pies"
    },
    {
     "id": "andanada",
     "txt": "3 PA · Ud6: radio de 15 pies a 60 pies, Salvación DES CD 16, 4d6; la mitad si la supera.",
     "especie": true,
     "definitoria": true
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Perforante",
   "ataqueNombre": "Púas",
   "fuertes": [
    "DES",
    "SAB"
   ],
   "debiles": [
    "CON"
   ],
   "rolNota": "Posición: si no se ha movido, Ventaja en su primer ataque a distancia.",
   "proteccion": "Cobertura o separarse más de 15 pies: la Andanada no alcanza a todos, y un escudo da Ventaja en esa Salvación.",
   "encuentroTxt": "Su Andanada le suma 2: cuenta como NA 7 al calcular el encuentro.",
   "senal": "Cadáveres erizados de púas negras · un rugido que parece una risa · caballos que se niegan a seguir el camino.",
   "contexto": "Dispara desde donde nadie llega y baja solo cuando alguien se aísla. Obliga al grupo a buscar cobertura en campo abierto, o a encontrar la forma de traerla al suelo.",
   "impreso": {
    "pv": 75,
    "g": 16,
    "a": 2,
    "vel": 30,
    "atk": 6,
    "dano": "4d6+3",
    "cd": 16,
    "ini": 3,
    "moral": 15,
    "attrs": {
     "FUE": 2,
     "DES": 3,
     "CON": -2,
     "INT": 1,
     "SAB": 3,
     "CAR": 1
    },
    "enc": 7
   },
   "idea": "«Se ríe cuando dispara. Nadie sabe de qué.»",
   "botin": "Restos de viajeros: 4d6 × 10 cr y equipo roto",
   "notas": "Infrecuente · Número: 1d2 · En su guarida: 25 % · Inteligencia: baja, pero cruel · Moral: 15\n\nLa mantícora tiene cuerpo de león, alas de murciélago, una cola cubierta de púas negras y una cara casi humana, con tres filas de dientes. Habla, aunque solo para burlarse, y disfruta del miedo tanto como de la carne. Anida en riscos sobre los caminos de montaña y caza a los viajeros desde el aire, siempre de lejos, hasta que uno se queda solo. Sus púas vuelven a crecer en una noche; las caídas se venden en los mercados como agujas de veneno.\n\nGanchos (d6):\n1 caza en el único paso de montaña hacia donde va el grupo\n2 una caravana entera está atrapada bajo su risco\n3 un señor ofrece una fortuna por una mantícora viva\n4 está vieja y le quedan pocas púas: negocia\n5 tiene una cría en el nido y no se aleja de él\n6 alguien la ha marcado con un hierro: tuvo dueño"
  },
  "basilisco": {
   "nombre": "Basilisco",
   "na": 5,
   "tipo": "monstruosidad",
   "tam": "mediano",
   "rol": "represor",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "sangre_acida",
     "gratis": true
    },
    {
     "id": "aguijon_venenoso",
     "txt": "Su mordisco: al impactar, Salvación CON CD 16 o queda Envenenado (Ud8).",
     "especie": true
    },
    {
     "id": "mirada_petrificante",
     "txt": "2 PA · Ud6: cada criatura a 30 pies que lo mire hace una Salvación CON CD 16 o queda Ralentizada (Ud4); si ya lo estaba, queda Petrificada, y eso no se degrada con el Ud: dura hasta que un Axioma o un remedio la cure.",
     "definitoria": true,
     "especie": true
    },
    {
     "id": "piel_gruesa",
     "txt": "+2 de Armadura."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Perforante",
   "ataqueNombre": "Mordisco",
   "fuertes": [
    "INT",
    "SAB"
   ],
   "debiles": [
    "CAR"
   ],
   "rolNota": "Represión (3 PA): Aterrado (Salvación SAB, Ud4).",
   "proteccion": "Apartar la mirada cuando la usa: Ventaja en la Salvación. Quien la aparta durante todo el combate ataca con Desventaja. Un espejo pulido le devuelve la mirada: el basilisco hace la misma Salvación.",
   "senal": "Estatuas demasiado realistas, con cara de sorpresa · pájaros de piedra en las ramas · un silencio sin insectos.",
   "contexto": "La mirada no mata al primer intento: avisa. El grupo tiene un turno para decidir si pelea con los ojos cerrados (Desventaja) o se arriesga a una segunda mirada.",
   "impreso": {
    "pv": 97,
    "g": 14,
    "a": 4,
    "vel": 30,
    "atk": 4,
    "dano": "4d6+1",
    "cd": 16,
    "ini": 1,
    "moral": 15,
    "attrs": {
     "FUE": 1,
     "DES": 1,
     "CON": 1,
     "INT": 3,
     "SAB": 3,
     "CAR": -2
    },
    "enc": 5
   },
   "idea": "«Las estatuas del jardín tenían cara de sorpresa.»",
   "botin": "Lo que llevaban las estatuas: 5d6 × 10 cr en piedra y metal",
   "notas": "Rara · Número: 1 · En su guarida: 60 % · Inteligencia: media · Moral: 15\n\nEl basilisco es un lagarto de ocho patas del tamaño de un perro grande, de escamas verde oscuro y ojos amarillos y redondos como monedas. Es lento y paciente, y no necesita perseguir a nadie: su comida se queda quieta. Roe las estatuas que hace, piedra incluida, y sus guaridas son jardines de figuras rotas a medio comer. Los alquimistas pagan bien por su sangre, que en un frasco devuelve la carne a la piedra si se aplica a tiempo.\n\nGanchos (d6):\n1 una de las estatuas es alguien a quien el grupo busca\n2 un noble lo tiene encadenado en su jardín como guardia\n3 su sangre es lo único que puede salvar a un petrificado\n4 está ciego de un ojo: su mirada solo cubre un lado\n5 son una pareja con huevos a punto de abrirse\n6 un escultor vende como suyas las estatuas que hace"
  },
  "troll": {
   "nombre": "Troll",
   "na": 6,
   "tipo": "gigante",
   "tam": "grande",
   "rol": "arrollador",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "gigantismo",
     "gratis": true
    },
    {
     "id": "frenesi",
     "txt": "1 PA · 1/combate: hasta el final de su siguiente turno, sus ataques tienen Ventaja y los ataques contra él también.",
     "especie": true
    },
    {
     "id": "regeneracion",
     "txt": "Recupera 12 PV al inicio de su turno salvo si recibió Fuego o Ácido desde su turno anterior. A 0 PV cae, pero si ese turno no recibió Fuego ni Ácido, se levanta al inicio de su siguiente turno con 12 PV. Solo muere de verdad quemado o disuelto.",
     "especie": true,
     "definitoria": true
    },
    {
     "custom": true,
     "name": "Miembros que Siguen",
     "tipo": "Rasgo",
     "peso": 1,
     "txt": "Cuando un solo golpe le quita 20 PV o más, le arranca un miembro que sigue luchando: una criatura de NA 0 (4 PV) que actúa en su turno y ataca con 2d6. Mientras no se queme, el troll puede volver a unírselo con 1 PA.",
     "especie": true
    },
    {
     "id": "olor_de_la_sangre",
     "txt": "Percibe a las criaturas heridas a 120 pies."
    },
    {
     "id": "hambre",
     "txt": "Con un cadáver a la vista, Salvación SAB CD 12 o se detiene a comer."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Cortante",
   "ataqueNombre": "Garras",
   "fuertes": [
    "FUE",
    "CON"
   ],
   "debiles": [
    "DES",
    "INT"
   ],
   "rolNota": "Ataque Masivo: Sangrado al impactar, una vez por ronda.",
   "proteccion": "Fuego o ácido: cortan la Regeneración y lo rematan. Sin ellos, cada vez que cae vuelve a levantarse.",
   "senal": "Huesos de caballo mordidos · un hedor que se huele a una milla · una mano verde que se arrastra sola por el camino.",
   "contexto": "Se puede tumbar muchas veces y se levanta todas. La pelea contra un troll es una pelea por el fuego: quién lo lleva, cuánto queda y cómo aguantar hasta usarlo.",
   "impreso": {
    "pv": 138,
    "g": 12,
    "a": 3,
    "vel": 30,
    "atk": 9,
    "dano": "3d6+2 y 2d6+2",
    "cd": 20,
    "ini": -2,
    "moral": null,
    "attrs": {
     "FUE": 5,
     "DES": -2,
     "CON": 4,
     "INT": -2,
     "SAB": 1,
     "CAR": 1
    },
    "enc": 6
   },
   "idea": "«Lo matamos tres veces. A la cuarta trajimos aceite.»",
   "botin": "Lo que no se pudo comer: 5d6 × 10 cr y armaduras abolladas",
   "notas": "Infrecuente · Número: 1d3 · En su guarida: 40 % · Inteligencia: baja · Moral: No la tira\n\nLos trolls son altos, flacos y verdes como el moho, con brazos que les llegan a las rodillas y una nariz larga que lo huele todo. Comen sin parar porque se están curando sin parar: la carne les vuelve a crecer en minutos, y un troll hambriento se come sus propios miembros caídos. Viven bajo puentes, en cuevas húmedas y en las ruinas de los pueblos que vaciaron. La pelea contra un troll es una pelea por el fuego: quién lo lleva, cuánto queda y cómo aguantar hasta usarlo.\n\nGanchos (d6):\n1 vive bajo el único puente del río y cobra peaje en carne\n2 el pueblo le entrega un animal al mes y quiere que el grupo lo resuelva\n3 tiene un brazo que no es suyo: se lo cosió de otro troll\n4 un mago le ha implantado una gema que corta su Regeneración\n5 guarda la tumba de un rey que lo derrotó una vez\n6 son tres hermanos que discuten quién se come a quién"
  },
  "espectro": {
   "nombre": "Espectro",
   "na": 6,
   "tipo": "espiritu",
   "tam": "mediano",
   "rol": "hostigador",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "telepatia",
     "gratis": true
    },
    {
     "id": "pavor",
     "txt": "Aura de 30 pies: la primera vez que una criatura entra o empieza su turno dentro, Salvación SAB CD 19 o queda Aterrada mientras siga dentro. Quien la supera es inmune un día.",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "incorporeo",
     "txt": "Resistencia a todo daño no mágico; atraviesa paredes y criaturas."
    },
    {
     "id": "toque_necrotico",
     "txt": "El objetivo no recupera PV hasta el final de su siguiente turno."
    },
    {
     "id": "drenar_reserva",
     "txt": "Al impactar, el objetivo pierde 1d6 de su mayor Reserva."
    },
    {
     "id": "fotosensible",
     "txt": "En luz brillante, Desventaja en ataques y Percepción."
    },
    {
     "id": "ligada_al_lugar",
     "txt": "No se aleja más de 300 pies de la casa donde murió."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Necrótico",
   "ataqueNombre": "Toque",
   "fuertes": [
    "DES",
    "FUE"
   ],
   "debiles": [
    "CON"
   ],
   "rolNota": "Flanqueo: Ventaja si un aliado está adyacente al mismo objetivo.",
   "proteccion": "Luz brillante y armas mágicas. Un símbolo consagrado da Ventaja contra su Pavor.",
   "senal": "Frío en una sola habitación · los espejos se empañan desde dentro · la mesa puesta para alguien que no llega.",
   "contexto": "Sale de la pared, toca y vuelve a entrar. No se le puede acorralar, así que el grupo tiene que traer la luz a su terreno o sacarlo del lugar al que está ligado.",
   "impreso": {
    "pv": 84,
    "g": 18,
    "a": 3,
    "vel": 40,
    "atk": 8,
    "dano": "4d6+1",
    "cd": 19,
    "ini": 4,
    "moral": 16,
    "attrs": {
     "FUE": 4,
     "DES": 4,
     "CON": -2,
     "INT": 1,
     "SAB": 1,
     "CAR": 1
    },
    "enc": 6
   },
   "idea": "«No ha salido de esa casa. No va a dejar que salgas tú.»",
   "botin": "Lo que guardaba en vida, escondido en la casa",
   "notas": "Rara · Número: 1 · En su guarida: 100 % · Inteligencia: media · Moral: 16\n\nUn espectro es alguien que murió con algo pendiente en un lugar concreto y se quedó a vigilarlo. Tiene la forma que tenía al morir, pero gris y transparente, con los bordes deshilachados como humo. Repite las costumbres de su vida: pone la mesa, enciende chimeneas que no calientan, espera en la ventana. Se puede hablar con él, y a veces se le puede liberar terminando lo que dejó a medias; pero se enfurece con quien toca lo que era suyo.\n\nGanchos (d6):\n1 espera a un hijo que se fue a la guerra y nunca volvió\n2 guarda una carta que inculpa a alguien poderoso\n3 cree que el grupo son los ladrones que lo mataron\n4 solo quiere que alguien entierre bien su cuerpo, que sigue en el sótano\n5 son dos, marido y mujer, y no se hablan\n6 la casa se va a derribar mañana y él lo sabe"
  },
  "golem_de_arcilla": {
   "nombre": "Gólem de Arcilla",
   "na": 6,
   "tipo": "constructo",
   "tam": "grande",
   "rol": "arrollador",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "vigor_inagotable",
     "gratis": true
    },
    {
     "id": "inmunidad_a_estados",
     "nota": "Envenenado y Encantado",
     "gratis": true
    },
    {
     "id": "pisoton",
     "txt": "2 PA · Ud6: cada criatura a 10 pies, Salvación FUE CD 20 o Derribada; el suelo en ese radio pasa a ser terreno difícil.",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "resistencia_sobrenatural",
     "txt": "Resistencia al daño no mágico."
    },
    {
     "id": "piel_arcana",
     "txt": "Los Axiomas de Nivel 1 y 2 no le afectan, salvo su daño."
    },
    {
     "id": "golpe_aplastante",
     "txt": "Al impactar, Salvación FUE CD 20 o Derribado."
    },
    {
     "id": "mando_unico",
     "txt": "Sin su creador a la vista, pierde 1 PA y no puede usar Aptitudes."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Contundente",
   "ataqueNombre": "Puños",
   "fuertes": [
    "FUE",
    "CON"
   ],
   "debiles": [
    "DES",
    "INT",
    "CAR"
   ],
   "rolNota": "Ataque Masivo: derriba al impactar, una vez por ronda.",
   "proteccion": "Apartar a su creador: sin él, pierde 1 PA y sus Aptitudes. Quien se mantiene a más de 10 pies no recibe su Pisotón.",
   "senal": "Huellas profundas y exactas, siempre a la misma distancia · runas en una puerta · barro seco en el umbral de una sala limpia.",
   "contexto": "Casi nada le hace daño y todo lo que toca cae. La verdadera pelea es contra quien lo controla: encontrarlo y apartarlo convierte al gólem en una estatua lenta.",
   "impreso": {
    "pv": 138,
    "g": 12,
    "a": 3,
    "vel": 30,
    "atk": 9,
    "dano": "3d6+2 y 2d6+2",
    "cd": 20,
    "ini": -2,
    "moral": null,
    "attrs": {
     "FUE": 5,
     "DES": -2,
     "CON": 4,
     "INT": -2,
     "SAB": 1,
     "CAR": -2
    },
    "enc": 6
   },
   "idea": "«No odia. No teme. Obedece.»",
   "botin": "Ninguno; la tablilla de órdenes de su pecho vale 200 cr a un erudito",
   "notas": "Muy rara · Número: 1 · En su guarida: 90 % · Inteligencia: ninguna · Moral: No la tira\n\nUn gólem de arcilla es barro de río modelado con forma de hombre grande, cocido a medias y animado con una tablilla de órdenes escrita en su pecho. No tiene cara, solo dos huecos donde irían los ojos. Cumple su última orden hasta que se deshace, y la cumple al pie de la letra: un gólem al que le dijeron «que nadie entre» no impide que nadie salga. Borrar una palabra de la tablilla —que exige estar pegado a él y una tirada de Arcano CD 20— cambia la orden, y a veces la vuelve absurda.\n\nGanchos (d6):\n1 su creador murió y sigue cumpliendo una orden de hace un siglo\n2 la orden es proteger a un niño que ya es un anciano\n3 alguien ha borrado una letra y ahora ataca a quien lleve azul\n4 hay un segundo gólem a medio hacer en el taller\n5 su tablilla tiene escrito el nombre de uno de los personajes\n6 obedece a quien sepa la palabra que su creador decía al despertarlo"
  },
  "cazador_sintetico": {
   "nombre": "Cazador Sintético",
   "na": 6,
   "tipo": "maquina",
   "tam": "mediano",
   "rol": "hostigador",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "vigor_inagotable",
     "gratis": true
    },
    {
     "id": "sistemas_redundantes",
     "gratis": true
    },
    {
     "id": "sobrecarga",
     "txt": "1 PA · 1/combate: hasta el final de su siguiente turno gana +1 PA y su dado de daño sube un paso. Después queda Conmocionado (Ud4).",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "arma_montada",
     "txt": "2 PA: ataque a distancia hasta 120 pies."
    },
    {
     "id": "camuflaje",
     "txt": "Camuflaje óptico: inmóvil, Percepción CD 19 para verlo."
    },
    {
     "id": "autorreparacion",
     "txt": "Recupera 6 PV al inicio de su turno salvo si recibió Rayo."
    },
    {
     "id": "salto_depredador",
     "txt": "1 PA: salta hasta su velocidad sin provocar Ataques de Oportunidad."
    },
    {
     "id": "vulnerabilidad",
     "txt": "Recibe ×1,5 de daño de Rayo.",
     "nota": "Rayo"
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Energía",
   "ataqueNombre": "Rifle integrado",
   "fuertes": [
    "DES",
    "FUE"
   ],
   "debiles": [
    "CON",
    "CAR"
   ],
   "rolNota": "Flanqueo.",
   "proteccion": "Rayo, y cortarle la línea de visión: su Arma Montada necesita verte. Un pulso electromagnético le quita la Sobrecarga.",
   "senal": "Cámaras destruidas en orden · un objetivo marcado con un punto rojo que nadie más ve · pisadas que se detienen sin motivo.",
   "contexto": "Tiene un nombre en la lista y no se detiene hasta tacharlo. El grupo puede pelear, esconder a su objetivo o descubrir quién lo programó y cambiarle la lista.",
   "impreso": {
    "pv": 84,
    "g": 18,
    "a": 3,
    "vel": 40,
    "atk": 8,
    "dano": "4d6+1",
    "cd": 19,
    "ini": 4,
    "moral": null,
    "attrs": {
     "FUE": 4,
     "DES": 4,
     "CON": -2,
     "INT": 1,
     "SAB": 1,
     "CAR": -2
    },
    "enc": 6
   },
   "idea": "«Objetivo confirmado. Tiempo estimado: once minutos.»",
   "botin": "Rifle integrado (inutilizable sin taller) y 1d3 chips de Construido",
   "notas": "Rara · Número: 1 · Inteligencia: alta, sin voluntad propia · Moral: No la tira\n\nLos cazadores sintéticos se fabricaron para una guerra que terminó, y alguien sigue vendiendo sus servicios. Tienen forma humana, demasiado delgada y demasiado quieta, con una piel de polímero gris que cambia de color para confundirse con lo que tienen detrás. No hablan salvo para confirmar un objetivo. Llevan la lista grabada en un núcleo detrás del esternón: quien lo extraiga, con Tecnología CD 19 sobre el cazador inutilizado, sabe quién pagó y por quién.\n\nGanchos (d6):\n1 el nombre de la lista es el de uno de los personajes\n2 su objetivo es un niño que el grupo escolta\n3 está averiado y lleva tres nombres que ya están muertos\n4 alguien ofrece cambiarle la lista a cambio de un favor enorme\n5 hay otro cazador con la misma lista y compiten\n6 el que lo programó quiere detenerlo y no sabe cómo"
  },
  "wyvern": {
   "nombre": "Wyvern",
   "na": 6,
   "tipo": "draconido",
   "tam": "grande",
   "rol": "arrollador",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "vision_en_la_oscuridad",
     "gratis": true
    },
    {
     "id": "inmunidad",
     "nota": "Ácido",
     "gratis": true
    },
    {
     "id": "aguijon_venenoso",
     "txt": "Al impactar, 4d6 de Veneno (Salvación CON CD 20, la mitad) y, si falla, queda Envenenado (Ud8).",
     "definitoria": true,
     "especie": true
    },
    {
     "id": "aliento",
     "txt": "3 PA · Ud6: cono de 30 pies, Salvación DES CD 20, 6d6 de Ácido; la mitad si la supera. No lo repite en su turno siguiente."
    },
    {
     "id": "vuelo",
     "txt": "Vuela a 80 pies. Si queda Derribado, Aturdido o Paralizado en el aire, cae."
    },
    {
     "id": "hambre",
     "txt": "Con una presa caída a la vista, Salvación SAB CD 12 o baja a devorarla ese turno."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Perforante",
   "ataqueNombre": "Mordisco y aguijón",
   "fuertes": [
    "FUE",
    "CON"
   ],
   "debiles": [
    "DES",
    "INT",
    "CAR"
   ],
   "rolNota": "Ataque Masivo: derriba al impactar, una vez por ronda.",
   "proteccion": "Un antídoto bebido antes da Ventaja contra el aguijón, y quien la supera con Ventaja recibe solo la mitad del veneno sin quedar Envenenado. Cobertura o dispersarse contra el Aliento.",
   "encuentroTxt": "Su Aliento le suma 3: cuenta como NA 9 al calcular el encuentro.",
   "notas": "Infrecuente · Número: 1d2 · En su guarida: 30 % · Inteligencia: animal · Moral: No la tira\n\nEl wyvern es pariente lejano de los dragones: dos patas, alas enormes y una cola con un aguijón del tamaño de una espada. No habla, no negocia y no guarda tesoros: caza. Anida en riscos altos y baja sobre el ganado y los viajeros, abre con el ácido desde el aire, baja sobre el que quedó en pie y se lo lleva. Tiene la piel gris verdosa y los ojos amarillos, y huele a vinagre. Una cría es Mediana (plantilla Cría: NA 4); un wyvern viejo es Enorme (plantilla Anciana: NA 8).\n\nGanchos (d6):\n1 su nido tiene huevos que un noble quiere a cualquier precio\n2 un jinete lo montaba y ha muerto: lleva la silla puesta\n3 está herido por un rayo y caza de día, con rabia\n4 dos wyverns se disputan el valle\n5 un pueblo lo alimenta con condenados\n6 ha anidado en la torre de un mago muerto\n\nEdad. Una cría es Mediana (plantilla Cría: NA 4); un wyvern viejo, Enorme (plantilla Anciana: NA 8).",
   "senal": "Ganado arrancado del suelo · huesos con marcas de ácido en lo alto de un risco · rocas corroídas bajo el nido.",
   "contexto": "No habla, no negocia y no guarda tesoros: caza. Abre con el aliento desde el aire, baja sobre el que quedó en pie y se lo lleva. Es un dragón sin la mente de un dragón, y por eso se le puede engañar con un cebo.",
   "manual": {
    "vel": 20
   },
   "impreso": {
    "pv": 138,
    "g": 12,
    "a": 3,
    "vel": 20,
    "atk": 9,
    "dano": "3d6+2 y 2d6+2",
    "cd": 20,
    "ini": -2,
    "moral": null,
    "attrs": {
     "FUE": 5,
     "DES": -2,
     "CON": 4,
     "INT": -2,
     "SAB": 1,
     "CAR": -2
    },
    "enc": 9
   },
   "idea": "«Un dragón sin la mente de un dragón. Eso lo hace peor, no mejor.»",
   "botin": "Ninguno: no guarda nada; en el nido, restos con 3d6 × 10 cr"
  },
  "guardian_de_raiz": {
   "nombre": "Guardián de Raíz",
   "na": 7,
   "tipo": "planta_u_hongo",
   "tam": "grande",
   "rol": "guardian",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "inmunidad_a_estados",
     "nota": "Cegado y Ensordecido",
     "gratis": true
    },
    {
     "id": "camuflaje",
     "nota": "en el bosque",
     "gratis": true
    },
    {
     "id": "absorber_vida",
     "txt": "Sus raíces beben: recupera PV iguales a la mitad del daño que inflige con sus ramas.",
     "especie": true
    },
    {
     "id": "piel_gruesa",
     "txt": "+2 de Armadura."
    },
    {
     "id": "zona_de_control",
     "txt": "Quien empiece su turno adyacente a él no puede alejarse sin superar Salvación FUE o DES CD 20.",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "tentaculos",
     "txt": "Mantiene Apresadas hasta tres criaturas con sus raíces sin dejar de atacar."
    },
    {
     "id": "curacion_rapida",
     "txt": "Recupera 7 PV al inicio de su turno."
    },
    {
     "id": "pisoton",
     "txt": "2 PA · Ud6: cada criatura a 10 pies, Salvación FUE CD 20 o Derribada."
    },
    {
     "id": "vulnerabilidad",
     "txt": "Recibe ×1,5 de daño de Fuego.",
     "nota": "Fuego"
    },
    {
     "id": "lenta",
     "txt": "−10 pies de velocidad; actúa siempre el último."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Contundente",
   "ataqueNombre": "Ramas",
   "fuertes": [
    "CON",
    "FUE"
   ],
   "debiles": [
    "DES",
    "CAR"
   ],
   "rolNota": "Custodia (Reacción).",
   "proteccion": "Fuego. Quien empieza su turno a más de 10 pies no queda atrapado en su Zona de Control.",
   "senal": "Un claro donde los árboles miran hacia dentro · caminos que se cierran a la espalda · hojas verdes en pleno invierno.",
   "contexto": "No persigue: retiene. Mientras el guardián sujeta a dos personajes, lo que protege tiene tiempo de hacer lo que el grupo vino a impedir.",
   "impreso": {
    "pv": 156,
    "g": 12,
    "a": 6,
    "vel": 10,
    "atk": 9,
    "dano": "3d6+4 y 2d6+4",
    "cd": 20,
    "ini": -2,
    "moral": 17,
    "attrs": {
     "FUE": 5,
     "DES": -2,
     "CON": 4,
     "INT": 1,
     "SAB": 1,
     "CAR": -2
    },
    "enc": 7
   },
   "idea": "«El bosque no te impide pasar. Te pide que te quedes.»",
   "botin": "Lo que guarda: un santuario, una tumba o un árbol madre",
   "notas": "Rara · Número: 1 · En su guarida: 100 % · Inteligencia: media, lenta · Moral: 17\n\nLos guardianes de raíz son árboles viejos que algo despertó para proteger un lugar: una tumba, un manantial, el árbol madre de un bosque. Tienen la forma de un tronco grueso con dos ramas como brazos y una corteza agrietada donde a veces se adivina una cara. Hablan muy despacio, en una lengua que suena a madera crujiendo, y pueden tardar una hora en decir una frase. Mientras el guardián sujeta a dos personajes, lo que protege tiene tiempo de hacer lo que el grupo vino a impedir.\n\nGanchos (d6):\n1 protege la tumba de un druida que podría volver\n2 deja pasar a quien deje una semilla plantada\n3 está enfermo: un hongo lo pudre y suplica ayuda\n4 un leñador quiere que lo talen y paga bien\n5 protege a un niño que se perdió hace cien años y no envejece\n6 hay dos guardianes y uno quiere dejar de serlo"
  },
  "elemental_de_tormenta": {
   "nombre": "Elemental de Tormenta",
   "na": 7,
   "tipo": "elemental",
   "tam": "grande",
   "rol": "represor",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "inmunidad",
     "nota": "Rayo",
     "gratis": true
    },
    {
     "id": "fundirse_con_el_elemento",
     "nota": "en nubes de tormenta",
     "gratis": true
    },
    {
     "id": "desplazamiento",
     "txt": "1 PA · Ud6: se vuelve relámpago y reaparece hasta 30 pies, en un punto que pueda ver.",
     "especie": true
    },
    {
     "id": "vuelo",
     "txt": "Vuela a 60 pies.",
     "nota": "60 pies"
    },
    {
     "id": "tormenta_personal",
     "txt": "3 PA · Ud6: hasta tres objetivos en 30 pies reciben 5d6 de Rayo (Salvación DES CD 19, la mitad); el viento convierte el radio en terreno difícil.",
     "especie": true,
     "definitoria": true
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Rayo",
   "ataqueNombre": "Descarga",
   "fuertes": [
    "INT",
    "SAB"
   ],
   "debiles": [
    "CAR"
   ],
   "rolNota": "Represión (3 PA): Conmocionado (Salvación CON, Ud4).",
   "proteccion": "Resistencia al Rayo: Ventaja contra su Tormenta y la mitad de su daño. Una barra de hierro clavada en tierra le impide fundirse con las nubes.",
   "encuentroTxt": "Su Tormenta Personal le suma 3: cuenta como NA 10 al calcular el encuentro.",
   "senal": "Nubes que se mueven contra el viento · el pelo se eriza · un olor a hierro y a lluvia antes de la lluvia.",
   "contexto": "Convierte el campo en un lugar donde nadie avanza. Cada ronda que el grupo pasa bajo ella es una ronda de rayos; la decisión es cubrirse o correr hacia algo que la ancle.",
   "impreso": {
    "pv": 124,
    "g": 15,
    "a": 3,
    "vel": 30,
    "atk": 6,
    "dano": "3d6+1 y 2d6+1",
    "cd": 19,
    "ini": 1,
    "moral": 17,
    "attrs": {
     "FUE": 2,
     "DES": 1,
     "CON": 1,
     "INT": 4,
     "SAB": 4,
     "CAR": -2
    },
    "enc": 10
   },
   "idea": "«El cielo bajó a pelear, y trajo su propio clima.»",
   "botin": "Ninguno; tras la tormenta, a veces un fulgurita del tamaño de un brazo (100 cr)",
   "notas": "Rara · Número: 1 · Inteligencia: alta · Moral: 17\n\nUn elemental de tormenta es una nube negra del tamaño de una casa, con forma vagamente humana y rayos que le corren por dentro como venas. Llega con el viento contrario y se va cuando se cansa, y en su camino deja tejados levantados y árboles partidos. Algunos los invocan los magos para castigar a un pueblo; otros nacen solos, en las montañas, cuando chocan dos frentes. Convierte el campo en un lugar donde nadie avanza: la decisión es cubrirse o correr hacia algo que la ancle.\n\nGanchos (d6):\n1 un mago lo tiene atado a una torre y se le escapa\n2 persigue a un barco concreto por todo el mar\n3 es la tormenta que mató a los padres de alguien del grupo\n4 está atrapado en un valle y destruye lo que hay dentro\n5 un pueblo lo venera y le ofrece metales\n6 se debilita: alguien le está robando los rayos"
  },
  "tejedor_del_vacio": {
   "nombre": "Tejedor del Vacío",
   "na": 7,
   "tipo": "aberracion",
   "tam": "mediano",
   "rol": "represor",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "mente_ajena",
     "gratis": true
    },
    {
     "id": "vision_en_la_oscuridad",
     "gratis": true
    },
    {
     "id": "confundir",
     "txt": "2 PA · Ud6: radio de 10 pies a 60 pies, Salvación SAB CD 19 o Conmocionado (Ud6); mientras dure, con 1–2 en 1d6 ataca a la criatura más cercana, amiga o enemiga.",
     "especie": true
    },
    {
     "id": "voz_seductora",
     "txt": "2 PA · Ud6: una criatura a 30 pies, Salvación SAB CD 19 o Encantada (Ud6)."
    },
    {
     "id": "dominar",
     "txt": "3 PA · Ud4: una criatura Encantada, Salvación SAB CD 19 o actúa como él decida.",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "leer_mentes",
     "txt": "Una vez por ronda, pregunta a un jugador qué hará su personaje."
    },
    {
     "id": "fotosensible",
     "txt": "En luz brillante, Desventaja en ataques y Percepción."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Psíquico",
   "ataqueNombre": "Toque",
   "fuertes": [
    "INT",
    "SAB"
   ],
   "debiles": [
    "FUE"
   ],
   "rolNota": "Represión (3 PA): Conmocionado (Salvación SAB, Ud4).",
   "proteccion": "Luz brillante, y Voluntad de Hierro o un Axioma de protección mental: Ventaja contra su Voz y su Dominar; quien falla con Ventaja queda solo Encantado.",
   "senal": "Gente que repite frases que no son suyas · dibujos idénticos hechos por desconocidos · un alcalde que ya no parpadea.",
   "contexto": "Pelea con el grupo contra el grupo. Sabe lo que van a hacer y usa a uno de ellos para impedirlo. La luz y la distancia son las únicas armas que no puede volver en su contra.",
   "impreso": {
    "pv": 124,
    "g": 15,
    "a": 3,
    "vel": 30,
    "atk": 5,
    "dano": "3d6 y 2d6",
    "cd": 19,
    "ini": 1,
    "moral": 17,
    "attrs": {
     "FUE": -2,
     "DES": 1,
     "CON": 1,
     "INT": 4,
     "SAB": 4,
     "CAR": 1
    },
    "enc": 7
   },
   "idea": "«Ya sé lo que vas a hacer. Por eso lo harás por mí.»",
   "botin": "Lo que le traen sus siervos: 6d6 × 10 cr y secretos escritos",
   "notas": "Muy rara · Número: 1 (con 2d4 siervos dominados) · En su guarida: 60 % · Inteligencia: genial · Moral: 17\n\nNadie sabe de dónde vienen los tejedores del vacío; ellos tampoco lo dicen. Son altos y delgados, de piel violácea y sin boca, con una cabeza alargada que palpita levemente al pensar. Se instalan bajo las ciudades y tejen una red de personas dominadas que les traen comida, noticias y otras mentes. No tienen prisa: un tejedor puede pasar años convirtiendo a un consejo entero en sus manos sin que nadie note nada salvo que todos repiten las mismas frases.\n\nGanchos (d6):\n1 domina a alguien a quien el grupo quiere\n2 busca una mente concreta: la de uno de los personajes\n3 tiene a la guardia de la ciudad bajo su red\n4 huye de otro tejedor más viejo y ofrece una alianza\n5 su red se está rompiendo y sus siervos despiertan confusos\n6 lleva siglos dormido y acaba de despertar bajo la catedral"
  },
  "deva": {
   "nombre": "Deva",
   "na": 7,
   "tipo": "extraplanar",
   "tam": "mediano",
   "rol": "soporte",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "telepatia",
     "gratis": true
    },
    {
     "id": "resistencia",
     "nota": "Radiante y Necrótico",
     "gratis": true
    },
    {
     "id": "vision_verdadera",
     "txt": "Ve a través de ilusiones, invisibilidad y cambios de forma hasta 60 pies.",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "vuelo",
     "txt": "Vuela a 90 pies.",
     "nota": "90 pies"
    },
    {
     "id": "cambiaformas",
     "txt": "Adopta a voluntad una forma mortal corriente (0 PA), en la que conserva sus estadísticas."
    },
    {
     "custom": true,
     "name": "Toque Sanador",
     "tipo": "Aptitud",
     "peso": 0,
     "txt": "toca a una criatura y le devuelve 1 punto de Flesh; contra un no-muerto, el toque hace 4d6 Radiante (Salvación CON CD 19 mitad).",
     "coste": "3 PA",
     "frec": "Ud6"
    },
    {
     "id": "uso_de_axiomas",
     "txt": "Conoce tres Axiomas de Divinidad de hasta Nivel 4: Curar Heridas Graves, Protección del Mal 30 pies y Lenguas; CD 19, Reserva 35, Esfuerzo hasta 2.",
     "peso": 3
    },
    {
     "custom": true,
     "name": "El Mensaje",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Mientras no haya entregado su mensaje, no ataca primero ni abandona la escena: se defiende, cura y espera. Quien lo escucha entero, sin interrumpirlo, tiene Ventaja en su siguiente tirada relacionada con él."
    },
    {
     "id": "nombre_verdadero",
     "txt": "Quien pronuncia el nombre con que fue creado le hace una pregunta que debe responder con la verdad."
    },
    {
     "id": "aversion",
     "txt": "No puede herir a quien le ofrece hospitalidad sincera bajo su techo."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Radiante",
   "ataqueNombre": "Maza de luz",
   "fuertes": [
    "SAB",
    "CAR"
   ],
   "debiles": [
    "CON"
   ],
   "rolNota": "Restaurar (2 PA): un aliado a 30 pies recupera 1d8 PV o se libra de un estado.",
   "encuentroTxt": "Cuenta como NA 8 al calcular el encuentro: 7, más 1 por sus Axiomas.",
   "contexto": "No viene a pelear: viene a avisar. Si el grupo lo ataca antes de escucharlo, se defiende y cura a quien proteja, pero el mensaje sigue sin entregarse.",
   "impreso": {
    "pv": 93,
    "g": 15,
    "a": 3,
    "vel": 30,
    "atk": 5,
    "dano": "3d6 y 2d6",
    "cd": 19,
    "ini": 1,
    "moral": 17,
    "attrs": {
     "FUE": 1,
     "DES": 1,
     "CON": -2,
     "INT": 1,
     "SAB": 4,
     "CAR": 4
    },
    "enc": 8
   },
   "idea": "«Traigo un mensaje. Si no os gusta, no lo cambiéis conmigo: cambiad lo que lo provocó.»",
   "botin": "Ninguno; si cede una pluma, es un Foco de Divinidad",
   "senal": "Una luz sin fuente en una ventana · los animales se callan a la vez · dos vecinos soñaron la misma frase.",
   "notas": "Rara · Número: 1, o un coro de 1d3 · Inteligencia: excepcional · Moral: 17\n\nDeva es una palabra antigua para «los que brillan». Son los mensajeros del orden celeste, los más bajos de su escala y los únicos que caminan con frecuencia entre mortales. Tienen forma humana sin edad ni marcas, alas de luz que solo se ven cuando quieren y una voz que se entiende en cualquier lengua. No vienen a juzgar ni a combatir: vienen a avisar, y casi siempre llegan tarde para evitar lo que anuncian.\n\nGanchos (d6):\n1 trae un mensaje para uno de los personajes, de alguien que ya está muerto\n2 el mensaje es una advertencia, y el grupo es la amenaza\n3 olvidó su mensaje y teme volver sin él\n4 lo persigue alguien que quiere que el mensaje no llegue\n5 pide escolta hasta su destinatario, que vive en territorio hostil\n6 entregó el mensaje equivocado, y ya hay consecuencias"
  },
  "vampiro_senorial": {
   "nombre": "Vampiro Señorial",
   "na": 8,
   "tipo": "no_muerto",
   "tam": "mediano",
   "rol": "comandante",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "vigor_inagotable",
     "gratis": true
    },
    {
     "id": "inmunidad_a_estados",
     "nota": "Envenenado y Aterrado",
     "gratis": true
    },
    {
     "id": "cambiaformas",
     "txt": "2 PA: adopta la forma de una persona que haya visto, de un lobo o de un murciélago gigante. Descubrirlo exige Perspicacia CD 20.",
     "especie": true
    },
    {
     "custom": true,
     "name": "Hijos de la Noche",
     "tipo": "Aptitud",
     "peso": 0,
     "txt": "al final de la ronda siguiente acude un enjambre de murciélagos (horda de NA 4) o 1d4 lobos (NA 2) que obedecen su voz.",
     "coste": "1 PA",
     "frec": "1/combate",
     "especie": true
    },
    {
     "custom": true,
     "name": "Forma de Niebla",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "La primera vez que llega a 0 PV no cae: se vuelve niebla (Incorpórea, vuela 20 pies, no ataca) y huye a su ataúd, donde recupera 1 PV por hora. Solo muere a 0 PV dentro de su ataúd, con una estaca en el corazón o bajo la luz del sol.",
     "especie": true
    },
    {
     "id": "absorber_vida",
     "txt": "Recupera PV iguales a la mitad del daño que inflige con su mordisco."
    },
    {
     "id": "voz_seductora",
     "txt": "2 PA · Ud6: una criatura a 30 pies, Salvación SAB CD 20 o Encantada (Ud6)."
    },
    {
     "custom": true,
     "name": "Mirada Dominante",
     "tipo": "Aptitud",
     "peso": 3,
     "txt": "una criatura Encantada por él hace una Salvación SAB CD 20 o, en su siguiente turno, actúa como él decida (nunca contra sí misma); repite la Salvación al final de cada uno de sus turnos.",
     "coste": "3 PA",
     "frec": "Ud4",
     "definitoria": true,
     "especie": true
    },
    {
     "id": "curacion_rapida",
     "txt": "Recupera 8 PV al inicio de su turno mientras le quede al menos 1 PV."
    },
    {
     "id": "trepadora",
     "txt": "Trepa a su velocidad por muros y techos."
    },
    {
     "id": "aversion",
     "txt": "No cruza un umbral sin ser invitado ni el agua corriente; los símbolos sagrados presentados con fe lo frenan. Bajo la luz del sol directa recibe 3d6 de Radiante al inicio de su turno y no se cura.",
     "especie": true
    },
    {
     "id": "vulnerabilidad",
     "txt": "Recibe ×1,5 de daño Radiante.",
     "nota": "Radiante"
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Perforante y Necrótico",
   "ataqueNombre": "Mordisco",
   "fuertes": [
    "CAR",
    "FUE"
   ],
   "debiles": [],
   "rolNota": "Aura de Mando: +2 al ataque de sus aliados a 30 pies; un aliado ataca como Reacción.",
   "equipo": "Anillo de Sangre Antigua (Raro): +1 a la Guardia (ya incluido: Guardia 17) y +1d6 Necrótico a su mordisco. Si cae, es botín.",
   "proteccion": "Un símbolo sagrado presentado con fe, o un Axioma de protección mental: Ventaja contra su Voz y su Mirada, y quien falla con Ventaja queda solo Encantado. De día, en su ataúd, está indefenso.",
   "encuentroTxt": "Pasa en 3 su presupuesto de Potencial: cuenta como NA 9 al calcular el encuentro.",
   "senal": "Una familia noble que solo recibe de noche · sirvientes pálidos que no comen · ningún espejo en toda la casa.",
   "contexto": "Nunca pelea solo y nunca pelea donde no quiere. Encanta a quien más daño hace, se cura con quien más cerca está y se retira por el techo cuando pierde la ventaja.",
   "manual": {
    "guardia": 17
   },
   "impreso": {
    "pv": 150,
    "g": 17,
    "a": 4,
    "vel": 30,
    "atk": 8,
    "dano": "3d6+4 y 2d6+4",
    "cd": 20,
    "ini": 2,
    "moral": 18,
    "attrs": {
     "FUE": 4,
     "DES": 2,
     "CON": 2,
     "INT": 2,
     "SAB": 2,
     "CAR": 4
    },
    "enc": 9
   },
   "idea": "«Pasad. La casa es vuestra. Hace siglos que no recibo invitados.»",
   "botin": "Una fortuna antigua: 1.000 cr en arte y joyas, y su anillo",
   "notas": "Muy rara · Número: 1 (con 1d4 siervos y su jauría) · En su guarida: 80 % · Inteligencia: excepcional · Moral: 18\n\nUn vampiro señorial fue noble en vida y no ha dejado de serlo. Vive en la casa de su familia, rodeado de sirvientes que le temen y le adoran a partes iguales, y recibe de noche a quien considera digno. Es pálido, elegante y amable, y nunca pelea solo ni donde no quiere: encanta a quien más daño hace, se cura con quien más cerca está y se retira por el techo cuando pierde la ventaja. Lleva el Anillo de Sangre Antigua (Raro): +1 a la Guardia, ya incluido, y +1d6 Necrótico a su mordisco. Si cae, es botín.\n\nGanchos (d6):\n1 quiere casarse con alguien del grupo, y lo pide con cortesía\n2 su hijo es un vampiro joven que se le ha escapado de las manos\n3 gobierna el pueblo mejor que el señor vivo de al lado\n4 busca un remedio para dejar de serlo y pagará lo que sea\n5 otro vampiro le disputa la casa\n6 lleva un siglo esperando a que vuelva alguien, y ese alguien es un personaje"
  },
  "hidra": {
   "nombre": "Hidra",
   "na": 8,
   "tipo": "monstruosidad",
   "tam": "enorme",
   "rol": "arrollador",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "gigantismo",
     "gratis": true
    },
    {
     "id": "aguijon_venenoso",
     "txt": "Sus mordiscos: al impactar, Salvación CON CD 22 o queda Envenenado (Ud8).",
     "especie": true
    },
    {
     "id": "varias_cabezas",
     "txt": "+1 PA por turno (ya incluido): un mordisco más, de 3d6+6. Cada Crítico o golpe de 40 o más le arranca una cabeza y le quita ese PA hasta que crezca otra; si no recibe Fuego esa ronda, al final de su turno le crecen dos.",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "anfibia",
     "txt": "Nada a su velocidad y respira bajo el agua."
    },
    {
     "id": "ataque_barrido",
     "txt": "3 PA: una tirada contra cada criatura a su alcance; daño base a cada impactada."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Perforante",
   "ataqueNombre": "Mordiscos",
   "fuertes": [
    "FUE",
    "CON"
   ],
   "debiles": [
    "DES",
    "INT",
    "CAR"
   ],
   "rolNota": "Ataque Masivo: Sangrado al impactar, una vez por ronda.",
   "proteccion": "Fuego tras cada cabeza cortada. Pelear de dos en dos: uno corta, otro quema.",
   "encuentroTxt": "Su Ataque Barrido le suma 2 y su tamaño, 1: cuenta como NA 11 al calcular el encuentro.",
   "senal": "Un lago donde ya no beben los animales · dientes del tamaño de un puñal en la orilla · el agua huele amarga.",
   "contexto": "Cortarle la cabeza sin fuego la hace más peligrosa. El grupo necesita a alguien que corte y a alguien que queme, y que los dos estén en el mismo sitio a la vez.",
   "impreso": {
    "pv": 186,
    "g": 11,
    "a": 4,
    "vel": 30,
    "atk": 10,
    "dano": "3d6+6 y 3d6+6",
    "cd": 22,
    "ini": -3,
    "moral": null,
    "attrs": {
     "FUE": 6,
     "DES": -3,
     "CON": 5,
     "INT": -2,
     "SAB": 2,
     "CAR": -2
    },
    "enc": 11
   },
   "idea": "«Le cortamos una cabeza. Ahora tiene dos.»",
   "botin": "Lo que el lago se tragó: 8d6 × 10 cr en el fondo y huesos de héroes",
   "notas": "Rara · Número: 1 · En su guarida: 60 % · Inteligencia: animal · Moral: No la tira\n\nLa hidra es una serpiente gigante de cuerpo grueso como un tonel, con cinco cuellos largos que terminan en cinco cabezas que no se ponen de acuerdo. Vive en lagos y pantanos profundos, respira bajo el agua y sale a la orilla a cazar al amanecer. Su sangre es verde y amarga, y envenena el agua donde vive: los animales dejan de beber en su lago antes de que nadie la vea. Las hidras viejas tienen tantas cicatrices en los cuellos como cabezas han perdido, y algunas tienen nueve.\n\nGanchos (d6):\n1 tiene nueve cabezas y dos de ellas hablan\n2 vive en el lago que abastece a la ciudad\n3 un héroe muerto en su guarida lleva aún su espada mágica\n4 una de sus cabezas está ciega y es la más agresiva\n5 está criando: hay tres hidras pequeñas en el pantano\n6 un alquimista paga una fortuna por una cabeza intacta"
  },
  "serafin_ceniciento": {
   "nombre": "Serafín Ceniciento",
   "na": 9,
   "tipo": "extraplanar",
   "tam": "grande",
   "rol": "comandante",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "telepatia",
     "gratis": true
    },
    {
     "id": "resistencia",
     "nota": "Fuego y Necrótico",
     "gratis": true
    },
    {
     "id": "vision_verdadera",
     "txt": "Ve a través de ilusiones, invisibilidad y cambios de forma hasta 60 pies.",
     "especie": true
    },
    {
     "id": "vuelo",
     "txt": "Vuela a 60 pies.",
     "nota": "60 pies"
    },
    {
     "id": "cuerpo_igneo",
     "txt": "Quien lo toque o golpee cuerpo a cuerpo recibe 3d6 de Fuego.",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "presencia_consagrada",
     "txt": "Radio de 30 pies: sus aliados +1 a las Salvaciones; los no-muertos y los infernales atacan con Desventaja."
    },
    {
     "id": "resistencia_legendaria",
     "txt": "Ud6: cuando falla una Salvación, puede superarla."
    },
    {
     "custom": true,
     "name": "Palabra Atada",
     "tipo": "Debilidad",
     "peso": 0,
     "txt": "No puede mentir ni romper un juramento; si se le hace jurar, lo cumple."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Radiante y Fuego",
   "ataqueNombre": "Espada",
   "fuertes": [
    "CAR",
    "FUE"
   ],
   "debiles": [],
   "rolNota": "Aura de Mando.",
   "equipo": "Espada de la Sentencia (Muy Raro): +2 al ataque (ya incluido: Ataque +13) y +1d8 Radiante. Quien la empuñe no puede mentir.",
   "proteccion": "Saber qué juró y hacérselo cumplir. Resistencia al Fuego contra su Cuerpo Ígneo.",
   "senal": "Ceniza que cae de un cielo despejado · cánticos en una lengua que todos entienden · los perros de la ciudad aúllan a la vez.",
   "contexto": "Viene a cumplir una sentencia, no a pelear. Se le puede vencer, pero también se le puede hacer jurar: el grupo que entiende qué juró antes de llegar tiene una salida que no pasa por la espada.",
   "manual": {
    "ataque": 13
   },
   "impreso": {
    "pv": 165,
    "g": 17,
    "a": 4,
    "vel": 30,
    "atk": 13,
    "dano": "3d6+4 y 3d6+4",
    "cd": 23,
    "ini": 2,
    "moral": 19,
    "attrs": {
     "FUE": 6,
     "DES": 2,
     "CON": 2,
     "INT": 2,
     "SAB": 2,
     "CAR": 5
    },
    "enc": 9
   },
   "idea": "«No vengo a pelear. Vengo a cumplir una sentencia.»",
   "botin": "La Espada de la Sentencia (Muy Raro)",
   "notas": "Muy rara · Número: 1 · Inteligencia: excepcional · Moral: 19\n\nLos serafines cenicientos son los ejecutores de una corte que no está en este mundo. Tienen forma humana alta y alada, con la piel gris como la ceniza fría y los ojos llenos de brasas; donde pisan queda una huella negra. No odian a nadie: cumplen. Llevan la Espada de la Sentencia (Muy Raro), que da +2 al ataque, ya incluido, y +1d8 Radiante; quien la empuña no puede mentir. Un serafín que termina su sentencia se va sin mirar atrás, aunque la ciudad que lo rodea esté ardiendo.\n\nGanchos (d6):\n1 su sentencia es contra uno de los personajes, por algo que hizo un antepasado\n2 viene a por un culpable que el grupo sabe inocente\n3 ha jurado proteger una ciudad y la ciudad lo ha traicionado\n4 busca a otro serafín que desertó\n5 acepta un duelo de palabras en lugar de uno de espadas\n6 su sentencia ya se cumplió, pero nadie le ha dicho que se vaya"
  },
  "liche": {
   "nombre": "Liche",
   "na": 10,
   "tipo": "no_muerto",
   "tam": "mediano",
   "rol": "represor",
   "estructura": "jefe",
   "rasgos": [
    {
     "id": "vigor_inagotable",
     "gratis": true
    },
    {
     "id": "inmunidad_a_estados",
     "nota": "Envenenado y Aterrado",
     "gratis": true
    },
    {
     "id": "pavor",
     "txt": "Aura de 30 pies: la primera vez que una criatura entra o empieza su turno dentro, Salvación SAB CD 25 o queda Aterrada mientras siga dentro. Quien la supera es inmune un día.",
     "especie": true
    },
    {
     "id": "invocar_aliados",
     "txt": "3 PA · 1/combate: al final de su turno se levantan 1d4 no-muertos de NA 5, que actúan justo después de él. Se anuncia una ronda antes.",
     "racial": true,
     "especie": true
    },
    {
     "custom": true,
     "name": "Toque Paralizante",
     "tipo": "Modificador",
     "peso": 3,
     "txt": "Su toque obliga además a una Salvación CON CD 25 o queda Paralizado (Ud4).",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "resistencia_legendaria",
     "txt": "Ud6: cuando falla una Salvación, puede superarla igualmente."
    },
    {
     "id": "uso_de_axiomas",
     "txt": "Conoce seis Axiomas de hasta Nivel 5 (Erudición): Relámpago, Cono de Frío, Muro de Fuerza, Detener Monstruo, Animar Muerto y Puerta Dimensional; CD 25, Reserva 60, Esfuerzo hasta 3 (jefe).",
     "peso": 3,
     "especie": true
    },
    {
     "id": "contraaxioma",
     "txt": "Reacción · Ud6: anula un Axioma de Nivel 5 o menos usado a 60 pies."
    },
    {
     "custom": true,
     "name": "Filacteria",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Mientras no se destruya su filacteria, vuelve a formarse junto a ella en 1d4 días. Encontrarla y destruirla es la verdadera aventura.",
     "especie": true
    },
    {
     "id": "accion_de_jefe",
     "txt": "Al final del turno de cada personaje, gasta 1 PA de su siguiente turno (máx. 2 por ronda)."
    },
    {
     "id": "nombre_verdadero",
     "txt": "Pronunciar su nombre de vivo (2 PA) lo deja Aturdido (Ud4), una vez por combate."
    },
    {
     "id": "vulnerabilidad",
     "txt": "Recibe ×1,5 de daño Radiante.",
     "nota": "Radiante"
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Necrótico",
   "ataqueNombre": "Toque",
   "fuertes": [
    "INT",
    "SAB"
   ],
   "debiles": [
    "FUE"
   ],
   "rolNota": "Jefe: PV ×2. Represión (3 PA): Aterrado (Salvación SAB, Ud4).",
   "equipo": "Báculo de la Filacteria (Muy Raro): +2 a la CD de Axioma (ya incluido: CD 25) y +1d8 Necrótico a su toque. Si cae, el báculo es botín.",
   "proteccion": "Destruir la filacteria antes. Voluntad de Hierro o un Axioma contra la muerte: Ventaja contra su Toque Paralizante y su Pavor.",
   "encuentroTxt": "Pasa en 2 su presupuesto de Potencial: cuenta como NA 11; como jefe, 15, y por sus Axiomas, 16.",
   "senal": "Una biblioteca prohibida saqueada · un pueblo que dejó de envejecer · tumbas abiertas en orden alfabético.",
   "contexto": "Matarlo no es vencerlo. La pelea contra el liche es un paso del camino: el grupo que no sabe dónde está la filacteria solo consigue unos días.",
   "manual": {
    "cd": 25
   },
   "impreso": {
    "pv": 360,
    "g": 17,
    "a": 5,
    "vel": 30,
    "atk": 7,
    "dano": "3d6+2 y 3d6+2",
    "cd": 25,
    "ini": 2,
    "moral": 20,
    "attrs": {
     "FUE": -2,
     "DES": 2,
     "CON": 2,
     "INT": 5,
     "SAB": 5,
     "CAR": 2
    },
    "enc": 16
   },
   "idea": "«Matarme es fácil. Lo difícil es que dure.»",
   "botin": "Una biblioteca prohibida, 2.000 cr y el Báculo de la Filacteria",
   "notas": "Muy rara · Número: 1 (con sus no-muertos) · En su guarida: 90 % · Inteligencia: genial · Moral: 20\n\nUn liche fue un erudito que prefirió no morir. Encerró su vida en un objeto, la filacteria, y dejó que el cuerpo se secara alrededor de una mente que no para de estudiar. Es un esqueleto vestido con los ropajes de su orden, con dos luces frías donde tuvo los ojos. Lleva el Báculo de la Filacteria (Muy Raro): +2 a la CD de Axioma, ya incluido, y +1d8 Necrótico a su toque. El grupo que no sabe dónde está la filacteria solo consigue unos días.\n\nGanchos (d6):\n1 su filacteria es el colgante que lleva uno de los personajes\n2 busca un libro que el grupo encontró sin saber qué era\n3 quiere un aprendiz, y ha elegido\n4 fue el maestro de un personaje con Fuente\n5 su filacteria está en otra ciudad, en un museo\n6 duda: lleva un siglo pensando en morir de verdad"
  },
  "dragon_rojo_adulto": {
   "nombre": "Dragón Rojo Adulto",
   "na": 10,
   "tipo": "dragon",
   "tam": "colosal",
   "rol": "arrollador",
   "estructura": "jefe",
   "rasgos": [
    {
     "id": "vision_en_la_oscuridad",
     "gratis": true
    },
    {
     "id": "telepatia",
     "gratis": true
    },
    {
     "id": "inmunidad",
     "nota": "Fuego",
     "gratis": true
    },
    {
     "id": "pavor",
     "txt": "Aura de 30 pies: la primera vez que una criatura entra o empieza su turno dentro, Salvación SAB CD 26 o queda Aterrada mientras siga dentro. Quien la supera es inmune un día.",
     "especie": true
    },
    {
     "id": "uso_de_axiomas",
     "txt": "Conoce tres Axiomas de hasta Nivel 5 (Erudición): Muro de Fuego, Sugestión y Puerta Dimensional; CD 26, Reserva 50, Esfuerzo hasta 3 (jefe).",
     "peso": 3,
     "especie": true
    },
    {
     "id": "cuerpo_igneo",
     "txt": "Quien lo toque o lo golpee cuerpo a cuerpo recibe 3d6 de Fuego. Los objetos inflamables a su alcance prenden.",
     "racial": true,
     "especie": true
    },
    {
     "id": "aliento",
     "txt": "3 PA · Ud6: cono de 60 pies, Salvación DES CD 26, 9d6 de Fuego; la mitad si la supera. No lo repite en su turno siguiente.",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "vuelo",
     "txt": "Vuela a 80 pies.",
     "nota": "80 pies"
    },
    {
     "id": "accion_de_jefe",
     "txt": "Al final del turno de cada personaje, gasta 1 PA de su siguiente turno (máx. 2 por ronda)."
    },
    {
     "id": "represalia",
     "txt": "Reacción, 1/ronda: cuando falla un ataque cuerpo a cuerpo contra él, ataca a quien lo hizo."
    },
    {
     "id": "aversion",
     "txt": "No puede rechazar un trato sobre su tesoro; las armas forjadas con escamas de su madre ignoran su Resistencia."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Perforante",
   "ataqueNombre": "Mordisco y garras",
   "fuertes": [
    "FUE",
    "CON"
   ],
   "debiles": [],
   "rolNota": "Jefe: PV ×2. Ataque Masivo: derriba al impactar, una vez por ronda.",
   "equipo": "Coraza del Tesoro (Muy Raro): gemas y monedas fundidas en las escamas del pecho; +2 de Armadura (ya incluido: Armadura 7) y +1 a la Guardia (ya incluido: Guardia 14). Arrancarlas del cadáver lleva una hora.",
   "proteccion": "Resistencia al Fuego: Ventaja contra su Aliento y la mitad de su daño. Voluntad de Hierro contra su Pavor. Nunca pelear en su guarida.",
   "encuentroTxt": "Pasa en 2 su presupuesto de Potencial: cuenta como NA 11; como jefe, 15; con su Aliento, 17; por su tamaño, 18, y por sus Axiomas, 19.",
   "senal": "Una montaña que humea sin ser volcán · pueblos que pagan un tributo que nadie nombra · rebaños enteros desaparecidos en una noche.",
   "contexto": "Aliento, vuelo y acciones entre turnos: el dragón no deja al grupo quedarse quieto ni juntarse. Nadie debería pelear contra él sin haber pensado antes cómo bajarlo del cielo. Es más listo que el grupo: negocia, miente y usa sus Axiomas para que nadie llegue entero a su guarida.",
   "manual": {
    "armadura": 7,
    "guardia": 14
   },
   "impreso": {
    "pv": 510,
    "g": 14,
    "a": 7,
    "vel": 30,
    "atk": 13,
    "dano": "4d6+8 y 3d6+8",
    "cd": 26,
    "ini": -2,
    "moral": 20,
    "attrs": {
     "FUE": 8,
     "DES": -2,
     "CON": 7,
     "INT": 5,
     "SAB": 2,
     "CAR": 2
    },
    "enc": 19
   },
   "idea": "«Os habría quemado al entrar. Pero me aburro.»",
   "botin": "Su tesoro: 5.000 cr en monedas, 2d4 objetos mágicos y la Coraza del Tesoro",
   "notas": "Muy rara · Número: 1 · En su guarida: 95 % · Inteligencia: genial · Moral: 20\n\nUn dragón rojo adulto es la criatura más orgullosa del mundo y lo sabe. Mide lo que una iglesia, tiene escamas del color de la sangre seca y los cuernos negros, y huele a azufre y a monedas calientes. Es más listo que el grupo: negocia, miente y disfruta de la conversación tanto como del fuego. Duerme sobre su tesoro durante años y lo conoce moneda a moneda. Con el tiempo, las gemas y el oro se le funden en las escamas del pecho: la Coraza del Tesoro (Muy Raro) le da +2 de Armadura y +1 a la Guardia, ya incluidos, y arrancarla del cadáver lleva una hora.\n\nGanchos (d6):\n1 quiere contratar al grupo para robarle a otro dragón\n2 tiene en su tesoro la corona de un reino que la busca\n3 está viejo y busca a quién dejar su tesoro\n4 un culto le ofrece sacrificios y él los desprecia\n5 duerme, y lleva veinte años dormido\n6 su madre vive todavía, y es peor"
  },
  "arconte": {
   "nombre": "Arconte",
   "na": 11,
   "tipo": "extraplanar",
   "tam": "grande",
   "rol": "comandante",
   "estructura": "normal",
   "rasgos": [
    {
     "id": "telepatia",
     "gratis": true
    },
    {
     "id": "resistencia",
     "nota": "Radiante y Fuego",
     "gratis": true
    },
    {
     "id": "nunca_desprevenida",
     "txt": "Dentro de su tierra siente quién cruza sus fronteras y no puede ser sorprendido. Fuera de ella pierde esto y su Prohibición."
    },
    {
     "id": "vuelo",
     "txt": "Vuela a 60 pies.",
     "nota": "60 pies"
    },
    {
     "custom": true,
     "name": "Prohibición",
     "tipo": "Aptitud",
     "peso": 2,
     "txt": "declara una acción prohibida —atacar, mentir, huir o usar Axiomas de una escuela— en 60 pies, hasta el final de su próximo turno. Quien la haga recibe 4d6 Radiante (Salvación CAR CD 23 mitad). La anuncia en voz alta: siempre se sabe qué está prohibido.",
     "area": 2,
     "coste": "2 PA",
     "frec": "Ud6",
     "especie": true,
     "definitoria": true
    },
    {
     "id": "uso_de_axiomas",
     "txt": "Conoce tres Axiomas de Divinidad de hasta Nivel 6: Misión Divina, Disipar el Mal y Barrera de Cuchillas; CD 23, Reserva 55, Esfuerzo hasta 2.",
     "peso": 3
    },
    {
     "id": "nombre_verdadero",
     "txt": "Pronunciar su nombre verdadero (2 PA) lo deja Aturdido (Ud4), una vez por combate."
    },
    {
     "id": "aversion",
     "txt": "No puede dañar a quien esté bajo su protección legítima —un ciudadano de su tierra, un huésped con salvoconducto—, aunque luche contra él."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Radiante",
   "ataqueNombre": "Lanza de la ley",
   "fuertes": [
    "CAR",
    "FUE"
   ],
   "debiles": [],
   "rolNota": "Aura de Mando.",
   "encuentroTxt": "Cuenta como NA 14 al calcular el encuentro: 11, 13 por su Prohibición y 14 por sus Axiomas.",
   "contexto": "Pelear en su tierra es pelear con sus leyes: cada Prohibición cambia lo que el grupo puede hacer esa ronda. Sacarlo de su jurisdicción, o ponerse bajo su protección, desarma la mitad de su poder.",
   "manual": {
    "dano": "4d6+4 y 3d6+4",
    "cd": 23
   },
   "impreso": {
    "pv": 195,
    "g": 17,
    "a": 5,
    "vel": 30,
    "atk": 11,
    "dano": "4d6+4 y 3d6+4",
    "cd": 23,
    "ini": 2,
    "moral": 21,
    "attrs": {
     "FUE": 6,
     "DES": 2,
     "CON": 2,
     "INT": 2,
     "SAB": 2,
     "CAR": 5
    },
    "enc": 14
   },
   "idea": "«Esta tierra tiene ley. Yo soy lo que queda de ella cuando nadie mira.»",
   "botin": "El Sello de la Jurisdicción y los tributos de su tierra (3.000 cr)",
   "senal": "Leyes nuevas grabadas de la noche a la mañana · peajes donde nunca los hubo · todos los mendigos de la ciudad desaparecen el mismo día.",
   "notas": "Muy rara · Número: 1, con 1d3 devas · En su guarida: 60 % · Inteligencia: genial · Moral: 21\n\nLos antiguos llamaban arcontes a los que gobiernan. En el orden celeste son los príncipes de los pueblos: cada reino y cada ciudad con nombre tiene uno que vela por ella, la juzga y la defiende. Tienen forma humana de gran estatura, armadura de un metal que no existe en este mundo y un rostro que recuerda a las estatuas de los fundadores. Algunos sabios advierten que no todos son benignos: hay arcontes que confunden la ley con su voluntad y cobran tributo por dejar pasar. El Sello de la Jurisdicción (Muy Raro) es su emblema: quien lo porta es reconocido como autoridad en esa tierra por quien sepa leerlo.\n\nGanchos (d6):\n1 el grupo ha roto una ley de su tierra sin saberlo\n2 su ciudad cayó hace siglos y él sigue gobernando las ruinas\n3 dos arcontes reclaman la misma frontera\n4 exige el tributo de un pueblo que ya no puede pagarlo\n5 busca un juez mortal para un caso que él no puede juzgar\n6 ha empezado a creer que la ley es él"
  },
  "titan_mecanico": {
   "nombre": "Titán Mecánico",
   "na": 13,
   "tipo": "maquina",
   "tam": "colosal",
   "rol": "guardian",
   "estructura": "jefe",
   "rasgos": [
    {
     "id": "vigor_inagotable",
     "gratis": true
    },
    {
     "id": "sistemas_redundantes",
     "gratis": true
    },
    {
     "id": "sobrecarga",
     "txt": "1 PA · 1/combate: hasta el final de su siguiente turno gana +1 PA y su dado de daño sube un paso. Después queda Conmocionado (Ud4).",
     "especie": true
    },
    {
     "id": "tormenta_personal",
     "txt": "3 PA · Ud6: bobinas de alta tensión. Radio de 30 pies: hasta tres objetivos reciben 8d6 de Rayo (Salvación DES CD 29, la mitad); el viento convierte el radio en terreno difícil hasta su siguiente turno. Se anuncia una ronda antes.",
     "definitoria": true,
     "especie": true,
     "racial": true
    },
    {
     "id": "turno_doble",
     "txt": "Tira dos veces la Iniciativa y reparte sus PA entre ambos turnos."
    },
    {
     "id": "pisoton",
     "txt": "2 PA · Ud6: cada criatura a 10 pies, Salvación FUE CD 29 o Derribada."
    },
    {
     "id": "escudo_de_energia",
     "txt": "Absorbe los primeros 39 puntos de daño de cada combate."
    },
    {
     "id": "arma_montada",
     "txt": "2 PA: ataque a distancia hasta 120 pies con el daño base."
    },
    {
     "id": "fases",
     "txt": "Por debajo de la mitad de sus PV, el blindaje cae (+1 PA, −2 de Armadura) y se abre su núcleo (Cap. 5)."
    },
    {
     "id": "autodestruccion",
     "txt": "Al llegar a 0 PV, explota al final de la ronda siguiente en 20 pies; desactivarlo: Tecnología CD 29."
    },
    {
     "id": "vulnerabilidad",
     "txt": "Recibe ×1,5 de daño de Rayo.",
     "nota": "Rayo"
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Contundente",
   "ataqueNombre": "Puños",
   "fuertes": [
    "CON",
    "FUE"
   ],
   "debiles": [
    "CAR"
   ],
   "rolNota": "Jefe: PV ×2. Custodia (Reacción).",
   "equipo": "Núcleo del Primer Titán (Legendario): +3 de Armadura (ya incluido: Armadura 10). Único: la primera vez que baja de la mitad de sus PV, su Escudo de Energía se recarga entero. Si cae, el núcleo sigue latiendo.",
   "proteccion": "Subir hasta el núcleo; Rayo; dispersarse contra su Tormenta.",
   "encuentroTxt": "Como jefe cuenta como NA 17; con su Tormenta, 19, y por su tamaño, 20.",
   "senal": "El suelo tiembla a intervalos regulares · una ciudad entera evacuada sin explicación · engranajes del tamaño de una rueda de molino en el camino.",
   "contexto": "No se puede vencer desde fuera. El grupo tiene que subir, encontrar el núcleo que la fase deja al descubierto y salir antes de que la autodestrucción los alcance.",
   "manual": {
    "armadura": 10
   },
   "impreso": {
    "pv": 684,
    "g": 14,
    "a": 10,
    "vel": 20,
    "atk": 15,
    "dano": "4d6+12 y 4d6+12",
    "cd": 29,
    "ini": -2,
    "moral": null,
    "attrs": {
     "FUE": 9,
     "DES": -2,
     "CON": 8,
     "INT": 3,
     "SAB": 3,
     "CAR": -2
    },
    "enc": 20
   },
   "idea": "«No se le vence desde fuera. Hay que subir.»",
   "botin": "El Núcleo del Primer Titán (Legendario)",
   "notas": "Única · Número: 1 · Inteligencia: alta, sin voluntad propia · Moral: No la tira\n\nEl Titán Mecánico es una máquina de guerra del tamaño de una torre, con forma de hombre acorazado y una ciudad de engranajes por dentro. Se construyó para defender algo que ya no existe, y camina en círculos alrededor de sus ruinas. Su corazón es el Núcleo del Primer Titán (Legendario): +3 de Armadura, ya incluido, y la primera vez que baja de la mitad de sus PV, su escudo de energía se recarga entero. Si cae, el núcleo sigue latiendo, y quien lo tenga tendrá que decidir qué hacer con él.\n\nGanchos (d6):\n1 alguien vive dentro: una familia de chatarreros\n2 su núcleo es lo único que puede alimentar una ciudad\n3 camina hacia la capital y nadie sabe por qué\n4 un culto lo considera un dios y lo protege\n5 hay un segundo titán enterrado que empieza a moverse\n6 obedece a un niño que encontró su llave"
  },
  "seraph": {
   "nombre": "Seraph",
   "na": 15,
   "tipo": "extraplanar",
   "tam": "enorme",
   "rol": "represor",
   "estructura": "jefe",
   "rasgos": [
    {
     "id": "telepatia",
     "gratis": true
    },
    {
     "id": "inmunidad",
     "nota": "Fuego y Radiante",
     "gratis": true
    },
    {
     "custom": true,
     "name": "Seis Alas",
     "tipo": "Aptitud",
     "peso": 3,
     "txt": "Quien intente mirarle la cara hace Salvación CON CD 29 o queda Cegado (Ud6). 3 PA · 1/combate: descubre el rostro, y todas las criaturas a 60 pies que lo vean hacen esa Salvación con Desventaja.",
     "racial": true,
     "especie": true
    },
    {
     "id": "vuelo",
     "txt": "Vuela a 120 pies.",
     "nota": "120 pies"
    },
    {
     "custom": true,
     "name": "Fuego que Purifica",
     "tipo": "Aura",
     "peso": 3,
     "txt": "Radio de 30 pies: al inicio de su turno, cada enemigo dentro recibe 3d6 Radiante y Fuego; los no-muertos y los infernales, el doble.",
     "area": 3,
     "especie": true,
     "definitoria": true
    },
    {
     "custom": true,
     "name": "La Brasa",
     "tipo": "Aptitud",
     "peso": 0,
     "txt": "toca los labios de una criatura. Si es mortal, Salvación CAR CD 29; si falla, terminan sus maldiciones, posesiones y estados de Encantado, y durante un día no puede mentir. Si es un no-muerto o un infernal, recibe 10d6 Radiante, sin Salvación.",
     "coste": "3 PA",
     "frec": "1/combate"
    },
    {
     "id": "uso_de_axiomas",
     "txt": "Conoce tres Axiomas de Divinidad de hasta Nivel 8: Palabra Sagrada, Aura Sagrada y Juicio Flamígero; CD 29, Reserva 75, Esfuerzo hasta 4 (jefe).",
     "peso": 3
    },
    {
     "id": "accion_de_jefe",
     "txt": "Al final del turno de cada personaje, gasta 1 PA de su siguiente turno (máx. 2 por ronda)."
    },
    {
     "id": "resistencia_legendaria",
     "txt": "Ud6: cuando falla una Salvación, puede superarla igualmente."
    },
    {
     "id": "victoria_alternativa",
     "txt": "Vino a quemar algo —un pacto, un nombre, una mentira, un objeto—. Si el grupo se lo entrega o lo destruye ante él, el combate termina y se retira."
    }
   ],
   "fuente": "Manual de Monstruos",
   "danoTipo": "Radiante y Fuego",
   "ataqueNombre": "Llama",
   "fuertes": [
    "SAB",
    "CAR"
   ],
   "debiles": [],
   "rolNota": "Jefe: PV ×2. Represión (3 PA): Aterrado (Salvación SAB, Ud4).",
   "encuentroTxt": "Cuenta como NA 23 al calcular el encuentro: 15, 19 como jefe, 21 por su aura, 22 por su tamaño y 23 por sus Axiomas.",
   "contexto": "Ningún grupo de Nivel 10 puede vencerlo en combate: es una amenaza del Horizonte de Leyenda, o una escena que se resuelve descubriendo qué vino a quemar.",
   "manual": {
    "dano": "5d6+5 y 4d6+5"
   },
   "impreso": {
    "pv": 600,
    "g": 19,
    "a": 7,
    "vel": 30,
    "atk": 12,
    "dano": "5d6+5 y 4d6+5",
    "cd": 29,
    "ini": 2,
    "moral": 25,
    "attrs": {
     "FUE": 5,
     "DES": 2,
     "CON": 4,
     "INT": 3,
     "SAB": 7,
     "CAR": 7
    },
    "enc": 23
   },
   "idea": "«Santo, santo, santo. Lo que no lo sea, arde.»",
   "botin": "Ninguno: lo que toca, se purifica o se consume",
   "senal": "Las velas de todos los templos se encienden solas · el agua de las pilas hierve sin fuego · durante tres noches no hay sombras.",
   "notas": "Única · Número: 1 · Inteligencia: genial, más allá de lo mortal · Moral: 25\n\nLos serafines son el coro más alto, «los ardientes», los que están más cerca del trono y nunca se apartan de él. Casi nunca descienden, y cuando lo hacen el mundo lo recuerda durante siglos. Su forma es una figura de fuego blanco de dos veces la altura de un hombre, con seis alas que no dejan ver lo que hay debajo, y su voz canta siempre la misma palabra. No odian ni castigan: purifican, y no distinguen entre lo que debe arder y lo que solo estaba cerca. El serafín ceniciento de las cortes menores es un eco suyo, y lo sabe.\n\nGanchos (d6):\n1 viene a quemar un pacto que uno de los personajes firmó\n2 la ciudad que va a purificar es la del grupo\n3 ha descendido por error y no sabe volver\n4 un culto quiere atraerlo para usar su fuego contra sus enemigos\n5 trae de vuelta a alguien a quien purificó hace siglos\n6 su canto se ha detenido, y nadie sabe qué significa"
  },
  "colmena_xenomorfa": {
   "nombre": "Colmena Xenomorfa",
   "na": 3,
   "tipo": "monstruosidad",
   "tam": "mediano",
   "rol": "hostigador",
   "estructura": "horda",
   "rasgos": [
    {
     "id": "colmena",
     "txt": "Mientras viva la reina, no tiran Moral y comparten lo que perciben."
    },
    {
     "id": "olor_de_la_sangre",
     "txt": "Perciben a las criaturas heridas a 120 pies, aunque estén ocultas o sean invisibles.",
     "especie": true
    },
    {
     "id": "trepadora",
     "txt": "Trepan a su velocidad por muros y techos."
    },
    {
     "id": "sangre_acida",
     "txt": "Quien les hace daño Cortante o Perforante cuerpo a cuerpo recibe 1d6 de Ácido.",
     "especie": true,
     "definitoria": true
    }
   ],
   "fuente": "Manual de Monstruos",
   "miembros": 8,
   "danoTipo": "Perforante",
   "ataqueNombre": "Garras y colas",
   "fuertes": [
    "DES",
    "FUE"
   ],
   "debiles": [
    "CON"
   ],
   "proteccion": "Armas a distancia o armas que no importe perder, por su Sangre Ácida. Matar a la reina.",
   "senal": "Conductos de ventilación con marcas de ácido · los sensores de movimiento marcan una sola señal muy grande · un calor húmedo que sale de las paredes.",
   "contexto": "Parece un enemigo y son ocho. Llegan por el techo, rodean y se separan en dos cuando se les hiere. Matar a la reina es la única forma de que dejen de coordinarse.",
   "impreso": {
    "pv": 93,
    "g": 18,
    "a": 3,
    "vel": 40,
    "atk": 8,
    "dano": "3d6+3 y 2d6+3",
    "cd": 19,
    "ini": 4,
    "moral": null,
    "attrs": {
     "FUE": 4,
     "DES": 4,
     "CON": -2,
     "INT": 1,
     "SAB": 1,
     "CAR": 1
    },
    "enc": 7
   },
   "idea": "«En el sensor era una sola señal. Grande.»",
   "botin": "Ninguno; en el nido, el equipo de sus víctimas",
   "notas": "Muy rara · Número: Una banda de 8 xenos (NA 3) · En su guarida: 70 % · Inteligencia: animal; la reina, alta · Moral: No la tira mientras viva la reina\n\nLos xenos llegaron en algo que cayó del cielo, y no se han ido. Son negros y brillantes, alargados, con una cola segmentada que termina en una punta y una boca dentro de la boca. Construyen colmenas con lo que encuentran —metal, piedra, cuerpos— y las llenan de un calor húmedo. Llegan por el techo, rodean y se separan en dos cuando se les hiere: parece un enemigo y son ocho.\n\nGanchos (d6):\n1 la reina está poniendo huevos y la banda no se aleja\n2 alguien quiere un huevo vivo y paga por él\n3 un superviviente vive escondido en el nido\n4 la colmena está en la bodega de una nave que debe despegar\n5 hay dos colmenas y están en guerra\n6 uno de los personajes fue picado hace días y no lo sabe"
  },
  "enjambre_de_nanitos": {
   "nombre": "Enjambre de Nanitos",
   "na": 1,
   "tipo": "maquina",
   "tam": "diminuto",
   "rol": "",
   "estructura": "horda",
   "rasgos": [
    {
     "id": "vigor_inagotable",
     "gratis": true
    },
    {
     "id": "sistemas_redundantes",
     "gratis": true
    },
    {
     "id": "enjambre",
     "txt": "Ocupa el espacio de otras criaturas, Resistencia a ataques contra un solo objetivo, doble daño de área",
     "gratis": true
    },
    {
     "id": "autorreparacion",
     "txt": "Recupera 3 PV al inicio de su turno, salvo si recibió daño de Rayo desde su turno anterior.",
     "especie": true
    },
    {
     "id": "acido_corrosivo",
     "txt": "Su ataque añade 1d6 de Ácido y aplica Desgarro (Ud6): se comen la armadura.",
     "especie": true,
     "definitoria": true
    }
   ],
   "fuente": "Manual de Monstruos",
   "miembros": 6,
   "danoTipo": "Energía",
   "ataqueNombre": "",
   "fuertes": [
    "CON",
    "INT"
   ],
   "debiles": [],
   "proteccion": "Rayo o cualquier área. Una puerta estanca lo frena.",
   "senal": "Un brillo metálico en el aire · puertas de acero con agujeros como encaje · herramientas desmontadas pieza por pieza sobre una mesa.",
   "contexto": "No se le puede cortar ni golpear con eficacia. El grupo necesita un área —fuego, un pulso, una descarga— o una puerta que el enjambre no pueda atravesar a tiempo.",
   "impreso": {
    "pv": 75,
    "g": 14,
    "a": 1,
    "vel": 30,
    "atk": 4,
    "dano": "3d6-1",
    "cd": 15,
    "ini": 1,
    "moral": null,
    "attrs": {
     "FUE": -2,
     "DES": 1,
     "CON": 2,
     "INT": 3,
     "SAB": 0,
     "CAR": 0
    },
    "enc": 3
   },
   "idea": "«La puerta era de acero. Ahora es de encaje.»",
   "botin": "Ninguno; un frasco de nanitos inertes vale 100 cr a un ingeniero",
   "notas": "Rara; común en ruinas tecnológicas · Número: Un grupo de 6 nubes diminutas (NA 1) · Inteligencia: alta, colectiva · Moral: No la tira\n\nLos nanitos se hicieron para reparar: máquinas del tamaño de un grano de polvo que desmontan lo roto y lo vuelven a montar. Sin órdenes, desmontan todo y no montan nada. Se mueven como una nube de humo plateado que zumbea muy bajo, y dejan las superficies perforadas con un dibujo que parece encaje. Siguen buscando a su operador, y a veces obedecen a quien lleva una pieza de su antiguo equipo.\n\nGanchos (d6):\n1 están reparando algo enorme sin que nadie se lo pida\n2 obedecen a quien lleve la placa de su ingeniero muerto\n3 se han comido la única llave de la cámara\n4 han empezado a construir otro enjambre\n5 un mercader quiere un frasco lleno, vivos\n6 uno de los personajes tiene un implante que reconocen como suyo"
  },
  "lobo": {
   "nombre": "Lobo",
   "na": 1,
   "tipo": "bestia",
   "tam": "mediano",
   "rol": "hostigador",
   "estructura": "normal",
   "rasgos": [
    {
     "custom": true,
     "name": "Aullido de Llamada",
     "tipo": "Aptitud",
     "peso": 0,
     "txt": "Al final de la ronda siguiente llegan 1d4 lobos más.",
     "coste": "1 PA",
     "frec": "1/combate",
     "especie": true
    },
    {
     "custom": true,
     "name": "Caza en Manada",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Ventaja en todos los ataques si otro lobo está adyacente al mismo objetivo."
    },
    {
     "custom": true,
     "name": "Derribador",
     "tipo": "Reacción",
     "peso": 0,
     "txt": "Cuando un lobo impacta, el objetivo hace Salvación DES CD 12 o queda Derribado."
    }
   ],
   "fuente": "Guía del Director",
   "danoTipo": "Cortante",
   "ataqueNombre": "",
   "fuertes": [
    "DES",
    "FUE"
   ],
   "debiles": [
    "CON",
    "INT"
   ],
   "contexto": "Los lobos raramente están solos. El peligro no es el daño individual — es la combinación de Caza en Manada (Ventaja constante) y Derribador (los derribados son atacados con Ventaja por los demás). Un grupo de cinco lobos que tira con Ventaja sobre un personaje Derribado es amenaza seria incluso para un Audaz bien acorazado: son muchos golpes pequeños, y la Armadura los frena bien, pero el Derribo multiplica los impactos hasta que la aritmética se invierte. El Alfa del grupo (NA 2, +2 daño) actúa siempre último y apunta al objetivo ya Derribado. La táctica correcta: evitar el Derribo y eliminar al Alfa primero para desmoralizar a la manada (como toda bestia de INT Débil, la manada no tira Moral: se dispersa en cuanto cae el Alfa).",
   "impreso": {
    "pv": 39,
    "g": 14,
    "a": 0,
    "vel": 40,
    "atk": 4,
    "dano": "2d6+3",
    "cd": 12,
    "ini": 2,
    "moral": null,
    "attrs": {
     "FUE": 2,
     "DES": 2,
     "CON": -2,
     "INT": -2,
     "SAB": 0,
     "CAR": 0
    },
    "enc": 1
   },
   "idea": "«Uno se deja ver. Los otros cuatro, no.»",
   "botin": "Ninguno; pieles a 2 cr cada una",
   "senal": "Ovejas degolladas sin comer · aullidos que se contestan desde tres colinas · huellas que rodean el campamento.",
   "notas": "Común · Número: 2d4 (manada con un Alfa) · En su guarida: 15 % · Inteligencia: animal · Moral: No la tira: se dispersan si cae el Alfa\n\nLos lobos raramente están solos y nunca atacan sin motivo: hambre, crías o un territorio invadido. Son grises con el lomo oscuro y ojos amarillos que reflejan la luz del fuego. Siguen a los viajeros durante días antes de decidirse, y los pastores saben que un lobo que se deja ver es el que distrae.\n\nGanchos (d6):\n1 la manada tiene hambre porque algo grande les quitó la caza\n2 el Alfa es blanco y los aldeanos lo creen un espíritu\n3 una loba con crías bloquea el único camino\n4 un cazador ofrece buen dinero por las pieles\n5 uno de los lobos lleva un collar: fue de alguien\n6 huyen de un incendio y pasan a través del grupo"
  },
  "esqueleto": {
   "nombre": "Esqueleto",
   "na": 1,
   "tipo": "no_muerto",
   "tam": "mediano",
   "rol": "",
   "estructura": "normal",
   "rasgos": [
    {
     "custom": true,
     "name": "Inmune",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Inmune a Veneno, Enfermedad, Encantamiento y Miedo"
    },
    {
     "custom": true,
     "name": "Vulnerable al daño Contundente (×1,5)",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Vulnerable al daño Contundente (×1,5)"
    },
    {
     "custom": true,
     "name": "Formación",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "+1 a la Guardia por cada esqueleto adyacente, hasta +3.",
     "especie": true
    },
    {
     "custom": true,
     "name": "Muerto-Vivo",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "No necesita respirar, comer, dormir ni mantener Concentración para funcionar."
    }
   ],
   "fuente": "Guía del Director",
   "danoTipo": "Cortante",
   "ataqueNombre": "",
   "fuertes": [
    "DES",
    "CON"
   ],
   "debiles": [
    "INT",
    "CAR"
   ],
   "contexto": "Los esqueletos son obstáculos de desgaste, no amenazas individuales. Su valor táctico real es dos cosas: la inmunidad al Miedo (no tiran Moral) y la vulnerabilidad al Contundente (que los jugadores tienen que descubrir o deducir). Un DJ que coloca esqueletos armados con mazas y armados con espadas en el mismo pasillo está invitando a una pregunta táctica: ¿cómo atacarlos de forma eficiente? Los jugadores que descubren la vulnerabilidad al Contundente se sienten recompensados. Los que no la descubren aprenden que la información del entorno tiene valor.",
   "impreso": {
    "pv": 45,
    "g": 14,
    "a": 0,
    "vel": 30,
    "atk": 4,
    "dano": "2d6+3",
    "cd": 12,
    "ini": 2,
    "moral": null,
    "attrs": {
     "FUE": 0,
     "DES": 2,
     "CON": 2,
     "INT": -2,
     "SAB": 0,
     "CAR": -2
    },
    "enc": 1
   },
   "idea": "«No tiene miedo. No tiene prisa. No tiene carne.»",
   "botin": "Armas oxidadas y monedas de enterramiento: 1d6 cr cada uno",
   "senal": "Nichos vacíos en la cripta · huesos con armadura alineados en el suelo · un tintineo seco en la oscuridad.",
   "notas": "Común en criptas · Número: 2d6 · En su guarida: 80 % · Inteligencia: ninguna · Moral: No la tira\n\nLos esqueletos son los muertos de una cripta que alguien despertó para guardarla, y la siguen guardando cuando ese alguien ya no está. Conservan restos de lo que llevaron en vida —un yelmo, una hebilla, un anillo en un dedo de hueso— y repiten gestos viejos: forman en fila, saludan a una puerta, vuelven a su nicho al terminar. Son un obstáculo de desgaste, no una amenaza individual.\n\nGanchos (d6):\n1 uno de ellos lleva el anillo familiar de alguien del grupo\n2 están en fila ante una puerta y no atacan si nadie la toca\n3 repiten cada noche la batalla en la que murieron\n4 un nigromante los usa de obreros en una mina\n5 solo se mueven cuando suena una campana\n6 uno conserva la voz y pide que lo entierren"
  },
  "zombie": {
   "nombre": "Zombie",
   "na": 1,
   "tipo": "no_muerto",
   "tam": "mediano",
   "rol": "arrollador",
   "estructura": "normal",
   "rasgos": [
    {
     "custom": true,
     "name": "Inmune a Veneno, Enfermedad y Miedo",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Inmune a Veneno, Enfermedad y Miedo"
    },
    {
     "custom": true,
     "name": "Mordisco Tenaz",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Al impactar, Apresa sin gastar PA: Salvación FUE o DES CD 12 o queda Apresado. Mientras lo retiene, no puede morder a otro.",
     "especie": true
    },
    {
     "custom": true,
     "name": "Obstinación No-muerta",
     "tipo": "Reacción",
     "peso": 0,
     "txt": "Cuando llega a 0 PV, tira 1d20. Con resultado 8 o más, se mantiene en 1 PV en lugar de caer. Este efecto no puede activarse dos veces seguidas en el mismo zombie."
    }
   ],
   "fuente": "Guía del Director",
   "danoTipo": "Contundente",
   "ataqueNombre": "",
   "fuertes": [
    "FUE",
    "CON"
   ],
   "debiles": [
    "DES",
    "INT",
    "CAR"
   ],
   "contexto": "Los zombies son lentos, fáciles de golpear y difíciles de matar definitivamente en el primer intento. Su amenaza es el desgaste numérico y la imprevisibilidad de Obstinación No-muerta: el grupo que cree haber eliminado una amenaza puede encontrarla de pie al inicio del siguiente turno.\n\nEn grupos de 6–10 en un espacio cerrado —como esbirros o como una Horda, no como zombies sueltos—, los zombies convierten el combate en gestión de recursos más que en táctica individual. Útiles para enseñar al grupo la lección contraria a la que enseña un enemigo acorazado: con Guardia 10 y Armadura 0, el zombie es el objetivo ideal para los ataques ligeros y repetidos, que aquí rinden más que un único golpe pesado. Un grupo que aprende a leer Guardia y Armadura antes de elegir cómo pegar acierta el doble de veces.",
   "manual": {
    "vel": 20
   },
   "impreso": {
    "pv": 45,
    "g": 10,
    "a": 0,
    "vel": 20,
    "atk": 4,
    "dano": "3d6+3",
    "cd": 12,
    "ini": -2,
    "moral": null,
    "attrs": {
     "FUE": 2,
     "DES": -2,
     "CON": 2,
     "INT": -2,
     "SAB": 0,
     "CAR": -2
    },
    "enc": 1
   },
   "idea": "«Lento. Torpe. Y vuelve a levantarse.»",
   "botin": "Lo que llevaban en vida",
   "senal": "Puertas arañadas por fuera · un olor a tierra mojada · pisadas que arrastran un pie.",
   "notas": "Común · Número: 1d6 (horda de 6–10 en espacios cerrados) · Inteligencia: ninguna · Moral: No la tira\n\nLos zombies son cuerpos que se niegan a quedarse quietos: por una maldición, un Axioma o algo en el agua. Caminan arrastrando los pies, con la boca abierta y los ojos blancos, y huelen a tierra mojada mucho antes de verse. Con Guardia 10 y Armadura 0 son el blanco ideal para los ataques ligeros y repetidos, que aquí rinden más que un golpe pesado. En grupos de 6 a 10 en un espacio cerrado se juegan como esbirros o como una Horda, no como zombies sueltos, y convierten el combate en gestión de recursos.\n\nGanchos (d6):\n1 la plaga empezó en un pozo y sigue en el agua\n2 uno de ellos lleva una carta que nunca llegó a entregar\n3 un pueblo entero se levantó a la vez a medianoche\n4 alguien los alimenta para que no salgan del sótano\n5 obedecen al sonido de un silbato que alguien tiene\n6 uno camina hacia su casa cada noche, y su familia le abre"
  },
  "orco": {
   "nombre": "Orco",
   "na": 2,
   "tipo": "humanoide",
   "tam": "mediano",
   "rol": "arrollador",
   "estructura": "normal",
   "rasgos": [
    {
     "custom": true,
     "name": "Venganza del Grupo",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Cuando cae un orco a la vista, gana +2 al daño hasta el final del combate.",
     "especie": true
    },
    {
     "custom": true,
     "name": "Agresivo",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Una vez por turno, se mueve hasta su velocidad hacia un enemigo sin gastar PA, si termina adyacente a él."
    },
    {
     "custom": true,
     "name": "Tenacidad Orca",
     "tipo": "Reacción",
     "peso": 0,
     "txt": "La primera vez en el combate que llega a 0 PV, se mantiene en 1 PV y realiza un Ataque de Oportunidad gratuito contra quien lo redujo."
    }
   ],
   "fuente": "Guía del Director",
   "danoTipo": "Cortante",
   "ataqueNombre": "",
   "fuertes": [
    "FUE",
    "CON"
   ],
   "debiles": [
    "DES"
   ],
   "contexto": "Un orco solo es un encuentro menor. Un grupo de orcos con un Jefe de Tribu (NA 4, Rol Comandante) es una amenaza de diseño: los orcos comunes son Agresivos y Tenaces, el Jefe tiene Aura de Mando que hace que sus Ataques de Oportunidad sean especialmente dolorosos, y eliminar al Jefe cambia la Moral del grupo completo (Puntuación de Moral 12). Funcionan bien con Rol Arrollador (+1d6 al daño y Ataque Masivo) o Hostigador (+10 pies y Flanqueo).",
   "impreso": {
    "pv": 60,
    "g": 10,
    "a": 1,
    "vel": 30,
    "atk": 4,
    "dano": "3d6+5",
    "cd": 13,
    "ini": -2,
    "moral": 12,
    "attrs": {
     "FUE": 2,
     "DES": -2,
     "CON": 2,
     "INT": 0,
     "SAB": 0,
     "CAR": 0
    },
    "enc": 2
   },
   "idea": "«Si cae uno, los demás pegan más fuerte.»",
   "botin": "2d6 cr cada uno; trofeos de caza y de guerra",
   "senal": "Fogatas grandes con huesos alrededor · tambores al anochecer · troncos marcados con el signo del clan.",
   "notas": "Común · Número: 2d6 (banda con un Jefe de Tribu) · En su guarida: 30 % · Inteligencia: media · Moral: 12\n\nLos orcos viven en clanes que miden el honor en batallas, y entre batalla y batalla, en cicatrices. Son anchos, de piel verde grisácea y colmillos inferiores que asoman, y se pintan la cara con ceniza antes de pelear. Un orco solo es un encuentro menor; una banda con un Jefe de Tribu (NA 4) es una amenaza seria, porque abatir al Jefe obliga a toda la banda a tirar Moral. Respetan a quien les gana en duelo y comercian con quien les paga en hierro.\n\nGanchos (d6):\n1 el clan busca a un guerrero propio que se fue con los humanos\n2 un orco joven reta en duelo al más fuerte del grupo\n3 la banda escolta a su chamán hacia un lugar sagrado\n4 huyen de algo que ha destruido su campamento\n5 un señor humano les paga para hostigar a su vecino\n6 el Jefe de Tribu quiere un trato y lo cumplirá"
  },
  "oso_pardo": {
   "nombre": "Oso Pardo",
   "na": 3,
   "tipo": "bestia",
   "tam": "grande",
   "rol": "arrollador",
   "estructura": "normal",
   "rasgos": [
    {
     "custom": true,
     "name": "Trepar 30 pies",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Trepar 30 pies"
    },
    {
     "custom": true,
     "name": "Dura de Matar",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "La primera vez en cada combate que llega a 0 PV, queda en 1 PV.",
     "especie": true
    },
    {
     "custom": true,
     "name": "Garras y Mordida",
     "tipo": "Aptitud",
     "peso": 0,
     "txt": "El oso ataca con las garras y, si impacta, muerde sin tirada adicional: su daño por turno (4d6+2) se reparte entre los dos golpes: 2d6+2 las garras y 2d6 la mordida.",
     "coste": "3 PA"
    },
    {
     "custom": true,
     "name": "Abrazar",
     "tipo": "Reacción",
     "peso": 0,
     "txt": "Si las garras impactan, el objetivo hace una Salvación FUE o DES CD 16 o queda Apresado; escapa con las reglas normales del estado (Manual Básico, Cap. 10).",
     "definitoria": true,
     "especie": true
    }
   ],
   "fuente": "Guía del Director",
   "danoTipo": "Cortante y Perforante",
   "ataqueNombre": "",
   "fuertes": [
    "FUE",
    "CON"
   ],
   "debiles": [
    "DES",
    "INT"
   ],
   "proteccion": "No acercarse a las crías; un escudo plantado o una Fuerza alta dan Ventaja contra su Abrazar.",
   "contexto": "El oso es una amenaza de territorio, no de mazmorra. Aparece porque el grupo entró en su zona, porque hay crías cerca (lo que transforma el encuentro en un dilema moral: matar a un animal que defiende su progenie), o como custodio accidental de algo que el grupo necesita. Mecánicamente, la combinación de Abrazar y Garras-Mordida puede eliminar a un Sagaz en un turno si el oso lo elige como objetivo. La táctica del grupo debe ser romper la presa rápidamente antes de que el ciclo de daño se establezca.",
   "impreso": {
    "pv": 79,
    "g": 11,
    "a": 1,
    "vel": 30,
    "atk": 7,
    "dano": "4d6+2",
    "cd": 16,
    "ini": -2,
    "moral": null,
    "attrs": {
     "FUE": 4,
     "DES": -2,
     "CON": 3,
     "INT": -2,
     "SAB": 0,
     "CAR": 0
    },
    "enc": 3
   },
   "idea": "«No vino a por ti. Tú viniste a por él.»",
   "botin": "Ninguno; la piel vale 20 cr",
   "senal": "Cortezas arañadas a dos metros de altura · colmenas destrozadas · un olor fuerte a almizcle.",
   "notas": "Infrecuente · Número: 1 (con 1d2 crías) · En su guarida: 25 % · Inteligencia: animal · Moral: No la tira\n\nEl oso pardo es una amenaza de territorio, no de mazmorra. Aparece porque el grupo entró en su zona, porque hay crías cerca o porque guarda, sin saberlo, algo que el grupo necesita. Es enorme, de pelo castaño con las puntas plateadas, y se levanta sobre dos patas para mirar antes de cargar. Con crías cerca, el encuentro se vuelve un dilema: matar a un animal que defiende a los suyos. No acercarse a las crías es la mejor protección.\n\nGanchos (d6):\n1 tiene una flecha vieja clavada y ataca a cualquier humano\n2 duerme en la cueva que el grupo necesita atravesar\n3 sus crías están atrapadas en una trampa de cazador\n4 es el oso de un circo que escapó y sabe hacer trucos\n5 un druida lo protege y pide que no le hagan daño\n6 está enfermo y bajó al pueblo por hambre"
  },
  "azotamente": {
   "nombre": "Azotamente",
   "na": 7,
   "tipo": "aberracion",
   "tam": "mediano",
   "rol": "represor",
   "estructura": "normal",
   "rasgos": [
    {
     "custom": true,
     "name": "Volar 30 pies",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Volar 30 pies"
    },
    {
     "custom": true,
     "name": "Inmune a Encantamiento",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Inmune a Encantamiento"
    },
    {
     "custom": true,
     "name": "Resistente a daño Psíquico",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Resistente a daño Psíquico"
    },
    {
     "custom": true,
     "name": "Leer Mentes",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Oye los pensamientos superficiales a 30 pies. Una vez por ronda, pregunta a un jugador qué hará su personaje en su próximo turno.",
     "especie": true
    },
    {
     "custom": true,
     "name": "Explosión Mental",
     "tipo": "Aptitud",
     "peso": 0,
     "txt": "Cono de 60 pies. Todos en el cono hacen Salvación INT CD 19. Fallo: 5d6 de daño Psíquico y Aturdido (Ud4): la mente se apaga. Éxito: la mitad del daño, sin estado. Es su Aptitud definitoria: la usa en cuanto puede. Tras usarla, tira su Ud6 (Manual de Monstruos, Cap. 3).",
     "coste": "3 PA",
     "frec": "Ud6",
     "area": 3
    },
    {
     "custom": true,
     "name": "Tentáculos",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Al impactar a una criatura Paralizada o Aturdida, la apresa sin gastar PA.",
     "especie": true
    },
    {
     "custom": true,
     "name": "Extracción Cerebral",
     "tipo": "Aptitud",
     "peso": 0,
     "txt": "Contra una criatura Paralizada o Aturdida que tenga apresada con sus tentáculos: Salvación CON CD 19 o su Flesh cae a 0 —muere— y el Azotamente recupera 20 PV; si la supera, recibe 5d6 de daño Psíquico. El cuerpo queda como esclavo (zombie) al servicio del Azotamente.",
     "coste": "1 PA"
    },
    {
     "custom": true,
     "name": "Uso de Axiomas",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Conoce seis Axiomas de Psiónica de hasta Nivel 4, el doble que otras criaturas: Sondear, Desvío Mental, Paralización, Miedo Profundo, Confusión y Asesino Fantasmal. CD 19, Reserva 35.",
     "especie": true,
     "axiomas": true
    }
   ],
   "fuente": "Guía del Director",
   "danoTipo": "Psíquico",
   "ataqueNombre": "",
   "fuertes": [
    "INT",
    "SAB"
   ],
   "debiles": [
    "FUE"
   ],
   "proteccion": "Voluntad de Hierro, un Axioma que proteja la mente o un yelmo de plomo dan Ventaja contra la Explosión Mental y contra sus Axiomas. Separarse: el cono no alcanza a todos.",
   "encuentroTxt": "Su Explosión Mental le suma 3 y sus Axiomas, 1: cuenta como NA 11 al calcular el encuentro.",
   "contexto": "El Azotamente es una amenaza de conocimiento, no de estadísticas brutas. Abre con la Explosión Mental desde la sombra, apresa con los tentáculos a quien quedó Aturdido y, en su siguiente turno, le extrae el cerebro. Un grupo que no lo esperaba puede perder a un personaje en dos rondas; uno que trae protección mental, se separa y lo derriba antes de su segundo turno tiene una pelea dura, pero ganable. Vuela, lo que complica que el Audaz lo ancle.",
   "impreso": {
    "pv": 124,
    "g": 15,
    "a": 3,
    "vel": 30,
    "atk": 5,
    "dano": "3d6 y 2d6",
    "cd": 19,
    "ini": 1,
    "moral": 17,
    "attrs": {
     "FUE": -2,
     "DES": 1,
     "CON": 1,
     "INT": 4,
     "SAB": 4,
     "CAR": 1
    },
    "enc": 11
   },
   "idea": "«Sabía lo que ibas a hacer. Por eso ya no puedes hacerlo.»",
   "botin": "Objetos de sus víctimas: 5d6 × 10 cr y 1d2 objetos mágicos",
   "senal": "Gente que repite frases sin sentido · cadáveres con el cráneo abierto y vacío · un zumbido que solo oyen los que tienen Fuente.",
   "notas": "Muy rara · Número: 1 (con 1d4 esclavos) · En su guarida: 70 % · Inteligencia: genial · Moral: 17\n\nEl azotamente es una figura humana alta, de piel violácea y húmeda, con una cabeza de pulpo y cuatro tentáculos donde debería tener la boca. Vive bajo tierra, en ciudades de esclavos que no saben que lo son, y se alimenta de cerebros. Es una amenaza de conocimiento, no de fuerza: abre desde la sombra, apresa a quien quedó Aturdido y en su siguiente turno le extrae el cerebro. Un grupo que no lo esperaba puede perder a alguien en dos rondas; uno que trae protección mental, se separa y lo derriba antes de su segundo turno tiene una pelea dura pero ganable. Vuela, y eso complica que el Audaz lo ancle.\n\nGanchos (d6):\n1 uno de sus esclavos es alguien a quien el grupo busca\n2 ha perdido su colonia y busca una nueva\n3 quiere comerciar: secretos a cambio de cerebros de condenados\n4 lleva años dentro de la cabeza de un noble\n5 huye de otros de su especie\n6 ha leído la mente de un personaje y conoce su mayor secreto"
  },
  "gigante_de_la_tormenta": {
   "nombre": "Gigante de la Tormenta",
   "na": 8,
   "tipo": "gigante",
   "tam": "enorme",
   "rol": "arrollador",
   "estructura": "jefe",
   "rasgos": [
    {
     "custom": true,
     "name": "Inmune a Rayo",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Inmune a Rayo"
    },
    {
     "custom": true,
     "name": "Clima Hostil",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "En 60 pies a su alrededor ruge la tormenta: terreno difícil y visibilidad de 30 pies para todos salvo él.",
     "especie": true
    },
    {
     "custom": true,
     "name": "Tormenta Personal",
     "tipo": "Aptitud",
     "peso": 0,
     "txt": "Radio de 30 pies; hasta tres objetivos reciben 5d6 de daño de Rayo (Salvación DES CD 22, la mitad), y el viento convierte el radio en terreno difícil hasta su siguiente turno. Se anuncia una ronda antes.",
     "coste": "3 PA",
     "frec": "Ud6",
     "definitoria": true,
     "especie": true,
     "racial": true,
     "area": 3
    },
    {
     "custom": true,
     "name": "Lanzamiento de Rayo",
     "tipo": "Aptitud",
     "peso": 0,
     "txt": "Línea de 90 pies. Todos en la línea hacen Salvación DES CD 22. Fallo: 5d6 de daño de Rayo. Éxito: la mitad.",
     "coste": "3 PA",
     "frec": "Ud6"
    },
    {
     "custom": true,
     "name": "Aplastamiento",
     "tipo": "Reacción",
     "peso": 0,
     "txt": "Cuando el ataque de mazo impacta, el objetivo hace Salvación CON CD 22 o queda Aturdido hasta el inicio del turno del Gigante."
    }
   ],
   "fuente": "Guía del Director",
   "danoTipo": "Contundente",
   "ataqueNombre": "",
   "fuertes": [
    "FUE",
    "CON"
   ],
   "debiles": [
    "DES"
   ],
   "equipo": "Raro: Brazaletes del Trueno. +2 al ataque (ya incluido: Ataque +12) y su mazo suma 1d6 de Rayo. Si cae, son botín.",
   "proteccion": "Resistencia al Rayo, y no ponerse en fila contra su Lanzamiento. Hablar con él.",
   "encuentroTxt": "Como jefe cuenta como NA 12; con su Tormenta Personal, 14, y por su tamaño, 15 (Cap. 2).",
   "contexto": "Con 372 PV, Guardia 11, Armadura 4 y Ataque +12, el Gigante de la Tormenta es un jefe de arco, no un encuentro de pasillo. Su Armadura 4 castiga especialmente a los personajes que atacan muchas veces con dados pequeños.\n\nLo que lo hace interesante no son sus estadísticas — es que puede hablar y tiene motivaciones. Un Gigante que el grupo intenta matar directamente es un combate difícil. Un Gigante al que el grupo descubre que protege un valle de su tribu, y con el que pueden negociar, es un arco de campaña. El Lanzamiento de Rayo obliga al grupo a dispersarse (línea de 90 pies puede atravesar toda la formación). El Aplastamiento sobre el Audaz puede bloquearlo con Bloqueo Enfrentado, pero a un coste de Adrenalina significativo.",
   "manual": {
    "ataque": 12
   },
   "impreso": {
    "pv": 372,
    "g": 11,
    "a": 4,
    "vel": 30,
    "atk": 12,
    "dano": "3d6+6 y 3d6+6",
    "cd": 22,
    "ini": -3,
    "moral": 18,
    "attrs": {
     "FUE": 6,
     "DES": -3,
     "CON": 5,
     "INT": 2,
     "SAB": 2,
     "CAR": 2
    },
    "enc": 15
   },
   "idea": "«Puede aplastarte. Prefiere escucharte, si tienes algo que decir.»",
   "botin": "Los Brazaletes del Trueno (Raro) y 3.000 cr en la guarida",
   "senal": "Tormentas que nacen en un cielo despejado · árboles partidos por el rayo en línea recta · huellas que se llenan de agua de lluvia.",
   "notas": "Muy rara · Número: 1 · En su guarida: 60 % · Inteligencia: alta · Moral: 18\n\nLos gigantes de la tormenta viven en cumbres y en islas que nadie visita, y miden lo que una torre. Tienen la piel gris azulada, el pelo blanco y largo como espuma, y la voz suena como un trueno lejano. Es un jefe de arco, no un encuentro de pasillo. Lo que lo hace interesante no son sus números: puede hablar y tiene motivos. Un gigante al que el grupo intenta matar es un combate difícil; uno al que el grupo descubre protegiendo un valle de su tribu, y con el que puede negociar, es una campaña. Lleva los Brazaletes del Trueno (Raro): +2 al ataque, ya incluido, y +1d6 de Rayo a su mazo. Si cae, son botín.\n\nGanchos (d6):\n1 protege el valle de su tribu y cree que el grupo viene a robarlo\n2 busca a su hija, raptada por un mago\n3 un rey le debe un juramento roto hace un siglo\n4 está viejo y quiere un heredero digno de los brazaletes\n5 una flota naufragó en su isla y él guarda a los supervivientes\n6 la tormenta no es suya: alguien la provoca para que le echen la culpa"
  },
  "licantropo": {
   "nombre": "Licántropo",
   "na": 4,
   "tipo": "monstruosidad",
   "tam": "mediano",
   "rol": "hostigador",
   "estructura": "normal",
   "rasgos": [
    {
     "custom": true,
     "name": "Inmune a daño no mágico sin plata",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Inmune a daño no mágico sin plata"
    },
    {
     "custom": true,
     "name": "Regeneración",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Regeneración: 8 PV al inicio de cada turno (salvo daño de plata o Radiante)"
    },
    {
     "custom": true,
     "name": "Olor de la Sangre",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "En las dos formas, percibe a las criaturas heridas a 120 pies, aunque estén ocultas o sean invisibles.",
     "especie": true
    },
    {
     "custom": true,
     "name": "Maldición de la Luna",
     "tipo": "Reacción",
     "peso": 0,
     "txt": "Cuando la mordida inflige 8 o más puntos de daño, el objetivo hace Salvación CON CD 16. Fallo: contrae Licantropía incipiente (síntomas en la próxima luna llena).",
     "definitoria": true,
     "especie": true
    }
   ],
   "fuente": "Guía del Director",
   "danoTipo": "Cortante",
   "ataqueNombre": "",
   "fuertes": [
    "DES",
    "FUE"
   ],
   "debiles": [
    "CON"
   ],
   "notas": "Rara · Número: 1 (a veces una familia de 1d4) · En su guarida: 30 % · Inteligencia: media · Moral: 14 (12 en forma humana)\n\nEl hombre lobo funciona mejor cuando el grupo lo conoce como persona antes de saber lo que es: el herrero amable, la viuda del molino, el niño del posadero. En forma de lobo es una bestia alta y encorvada, de pelo del mismo color que su cabello humano. La presión real es de campaña: no si el grupo puede matarlo, sino si quiere, si puede curarlo y qué pasa si uno de ellos contrajo la maldición.\n\nGanchos (d6):\n1 es alguien que ayudó al grupo hace dos sesiones\n2 sabe lo que es y pide que lo encadenen antes de la luna\n3 una cura existe, pero está en el templo de otra fe\n4 su manada son los guardias del pueblo\n5 uno de los personajes ya tiene síntomas\n6 el cazador que lo persigue es peor que él\n\nForma humana (NA 2). PV 48 · Guardia 14 · Armadura 1 · Velocidad 40 pies · Iniciativa +2 · Ataque +4 · Daño 2d6+5 (arma) · CD 13 · Moral 12. Sin Regeneración, sin inmunidad y sin Maldición de la Luna. Cambiar de forma cuesta 2 PA; los PV perdidos se conservan.",
   "proteccion": "Plata o daño mágico para atravesar su inmunidad; acónito bebido antes da Ventaja contra la Maldición de la Luna.",
   "contexto": "El hombre lobo es el encuentro que funciona mejor cuando el grupo lo conoce como persona antes de saber que es lo que es. Mecánicamente, la combinación de Regeneración (8 PV por turno) e Inmunidad a daño no mágico sin plata obliga al grupo a tener la herramienta correcta o gestionar el combate de forma inusual: el daño de Axiomas y el daño mágico sí aplican, lo que convierte al Sagaz en el combatiente más efectivo por primera y probablemente única vez en el arco. La Maldición de la Luna es la presión de campaña real: la cuestión no es si el grupo puede matar al hombre lobo, sino si quiere hacerlo, si puede curarlo, y qué pasa si un miembro del grupo contrajo la Maldición.",
   "impreso": {
    "pv": 66,
    "g": 16,
    "a": 2,
    "vel": 40,
    "atk": 6,
    "dano": "3d6+3",
    "cd": 16,
    "ini": 3,
    "moral": 14,
    "attrs": {
     "FUE": 3,
     "DES": 3,
     "CON": -2,
     "INT": 1,
     "SAB": 1,
     "CAR": 1
    },
    "enc": 4
   },
   "idea": "«Era el herrero. Era amable. Era él.»",
   "botin": "Lo que tenga en su vida humana",
   "senal": "Ganado muerto en noches de luna llena · un vecino que siempre está enfermo esos días · huellas que cambian de pie a garra a mitad del camino."
  },
  "caballero_de_la_muerte": {
   "nombre": "Caballero de la Muerte",
   "na": 9,
   "tipo": "no_muerto",
   "tam": "mediano",
   "rol": "comandante",
   "estructura": "normal",
   "rasgos": [
    {
     "custom": true,
     "name": "Inmune a Veneno y Frío",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Inmune a Veneno y Frío"
    },
    {
     "custom": true,
     "name": "Resistente",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Resistente a Necrótico y a daño físico no mágico"
    },
    {
     "custom": true,
     "name": "Pavor",
     "tipo": "Aura",
     "peso": 0,
     "txt": "Radio de 30 pies: la primera vez que una criatura entra o empieza su turno dentro, Salvación SAB CD 22 o queda Aterrada mientras siga dentro. Quien la supera es inmune un día.",
     "especie": true
    },
    {
     "custom": true,
     "name": "Aura de Conquista",
     "tipo": "Aura",
     "peso": 0,
     "txt": "Radio de 30 pies: las criaturas dentro del aura que reciben daño del Caballero tienen Desventaja en todas las Salvaciones contra Miedo y en sus tiradas de Moral."
    },
    {
     "custom": true,
     "name": "Llamada Infernal",
     "tipo": "Aptitud",
     "peso": 0,
     "txt": "Se alzan 1d4 guerreros esqueleto de NA 4, con armadura y espada, en espacios vacíos a su lado; actúan justo después de él.",
     "coste": "3 PA",
     "frec": "1/combate",
     "especie": true
    },
    {
     "custom": true,
     "name": "Marca Espectral",
     "tipo": "Reacción",
     "peso": 0,
     "txt": "Cuando el Caballero impacta a un objetivo, ese objetivo queda Marcado. El Caballero tiene Ventaja en todos los ataques contra objetivos Marcados y puede teletransportarse (2 PA) a un espacio adyacente a cualquier objetivo Marcado en su línea de visión."
    },
    {
     "custom": true,
     "name": "Orbe Infernal",
     "tipo": "Aptitud",
     "peso": 0,
     "txt": "Esfera de 15 pies de radio a 60 pies; Salvación DES CD 22, 6d6 de Fuego y Necrótico, la mitad si la supera. No la repite en su turno siguiente.",
     "coste": "3 PA",
     "frec": "Ud6",
     "definitoria": true,
     "especie": true,
     "area": 2
    },
    {
     "custom": true,
     "name": "Señor de la Tumba",
     "tipo": "Aura",
     "peso": 0,
     "txt": "Radio de 30 pies: los no-muertos aliados tienen +2 al ataque y no tiran Moral.",
     "especie": true
    },
    {
     "custom": true,
     "name": "Juramento Roto",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Si cae sin haber sido redimido, se alza de nuevo en su tumba al cabo de 1d4 días.",
     "especie": true
    }
   ],
   "fuente": "Guía del Director",
   "danoTipo": "Cortante y Necrótico",
   "ataqueNombre": "",
   "fuertes": [
    "CAR",
    "FUE"
   ],
   "debiles": [],
   "equipo": "Muy Raro: Placas Negras, el +2 de Armadura de su ficha. Si cae, son botín: una armadura de placas que susurra el juramento que él rompió.",
   "proteccion": "Un símbolo consagrado o Voluntad de Hierro dan Ventaja contra su Pavor y su Aura de Conquista; separarse contra el Orbe.",
   "encuentroTxt": "Su Orbe le suma 2: cuenta como NA 11 al calcular el encuentro (Cap. 2). Sus guerreros quedan a más de cuatro NA de él y no cuentan.",
   "contexto": "El Caballero de la Muerte (Guardia 17, Armadura 6, 165 PV, Ataque +10) es un desafío de diseño de encuentro. Con Guardia 17, un Audaz de Nivel 9 con PB +4 y FUE +3 impacta con 10 o más en 1d20 —alrededor del 55 %— pero su Armadura 6 se come buena parte de cada golpe. Contra él, el Esfuerzo volcado en daño y las armas Penetrantes rinden mucho más que acumular ataques pequeños. La Llamada Infernal genera presión de área que obliga al grupo a dividir la atención. La Marca Espectral convierte la movilidad del Caballero en una amenaza adicional: puede teletransportarse al Sagaz al fondo de la sala si lo Marcó en el primer turno.\n\nPero lo más poderoso del Caballero de la Muerte como elemento de diseño es su historia: fue un héroe. Tiene un nombre, una tumba, una razón por la que no está en paz. El grupo que descubre esa historia puede tener una vía alternativa: no destruirlo, sino redimirlo o liberarlo. Si lo intenta y falla, el combate es más tenso porque las apuestas eran mayores.",
   "manual": {
    "armadura": 6
   },
   "impreso": {
    "pv": 165,
    "g": 17,
    "a": 6,
    "vel": 30,
    "atk": 10,
    "dano": "3d6+3 y 3d6+3",
    "cd": 22,
    "ini": 2,
    "moral": 19,
    "attrs": {
     "FUE": 5,
     "DES": 2,
     "CON": 2,
     "INT": 2,
     "SAB": 2,
     "CAR": 5
    },
    "enc": 11
   },
   "idea": "«Fue un héroe. Juró algo. Lo rompió.»",
   "botin": "Las Placas Negras (Muy Raro) y el tesoro de su antigua orden",
   "senal": "Una orden de caballería extinguida · flores frescas en una tumba que nadie visita · un caballo negro sin jinete en el camino.",
   "notas": "Muy rara · Número: 1 (con su guardia de esqueletos) · En su guarida: 80 % · Inteligencia: alta · Moral: 19\n\nUn caballero de la muerte fue un héroe: tiene nombre, tumba y una razón por la que no está en paz. Viste unas placas negras que susurran el juramento que rompió —las Placas Negras (Muy Raro), +2 de Armadura, ya incluido— y sus ojos son dos brasas frías dentro del yelmo. Con Guardia 17 y Armadura 6, el Esfuerzo volcado en daño y las armas Penetrantes rinden mucho más que los ataques pequeños. El grupo que descubre su historia tiene otra salida: redimirlo o liberarlo. Si lo intenta y falla, el combate pesa más.\n\nGanchos (d6):\n1 juró proteger una ciudad que lo traicionó\n2 su espada rota está en manos de un personaje\n3 busca a alguien que le recuerde su nombre\n4 su antigua orden quiere ocultar lo que pasó\n5 solo pelea de noche y de día es una estatua en su capilla\n6 quiere que alguien termine lo que él no pudo"
  },
  "jefe_de_tribu": {
   "nombre": "Jefe de Tribu",
   "na": 4,
   "tipo": "humanoide",
   "tam": "mediano",
   "rol": "comandante",
   "estructura": "normal",
   "rasgos": [
    {
     "custom": true,
     "name": "Voz de Mando",
     "tipo": "Aptitud",
     "peso": 0,
     "txt": "Hasta tres aliados que lo oigan se mueven de inmediato la mitad de su velocidad sin provocar Ataques de Oportunidad.",
     "coste": "1 PA",
     "especie": true
    },
    {
     "custom": true,
     "name": "Aura de Mando",
     "tipo": "Aura",
     "peso": 0,
     "txt": "Radio de 30 pies: los aliados dentro del aura ganan +2 al ataque. Una vez por ronda, como Reacción, ordena a un aliado del aura que ataque.",
     "definitoria": true,
     "especie": true
    },
    {
     "custom": true,
     "name": "Voz de Guerra",
     "tipo": "Reacción",
     "peso": 0,
     "txt": "La primera vez que un aliado cae dentro del aura, los demás no tiran Moral hasta el final del siguiente turno del Jefe."
    }
   ],
   "fuente": "Guía del Director",
   "danoTipo": "Cortante",
   "ataqueNombre": "",
   "fuertes": [
    "CAR",
    "FUE"
   ],
   "debiles": [],
   "equipo": "Infrecuente: Hacha del Clan, +1 al ataque (ya incluido: Ataque +7). Quien la lleve después habla por el clan, le guste o no.",
   "proteccion": "Llegar hasta él en el primer turno: abatirlo apaga el Aura y rompe la Moral de la banda.",
   "contexto": "El Jefe no está para ganar el duelo: está para que su banda pelee mejor. Se queda un paso por detrás de la primera línea y dirige el ataque hacia quien quede expuesto. Abatirlo apaga el Aura y obliga a toda la banda a tirar Moral; por eso un grupo listo gasta su primer turno en llegar hasta él, y un Jefe listo lo sabe.",
   "manual": {
    "ataque": 7
   },
   "impreso": {
    "pv": 84,
    "g": 14,
    "a": 2,
    "vel": 30,
    "atk": 7,
    "dano": "3d6+3",
    "cd": 16,
    "ini": 1,
    "moral": 14,
    "attrs": {
     "FUE": 3,
     "DES": 1,
     "CON": 1,
     "INT": 1,
     "SAB": 1,
     "CAR": 3
    },
    "enc": 4
   },
   "idea": "«No vino a ganar el duelo. Vino a que su banda gane la batalla.»",
   "botin": "El Hacha del Clan (Infrecuente) y el tesoro del clan: 4d6 × 10 cr",
   "senal": "Un tótem nuevo en la entrada del valle · la banda canta su nombre al marchar · cabezas de rivales en estacas.",
   "notas": "Infrecuente · Número: 1 (con su banda) · En su guarida: 50 % · Inteligencia: media · Moral: 14\n\nEl Jefe de Tribu se queda un paso por detrás de la primera línea y dirige el ataque hacia quien quede expuesto. Lleva el Hacha del Clan (Infrecuente): +1 al ataque, ya incluido; quien la lleve después habla por el clan, le guste o no. Ganó su puesto en un duelo y lo defiende cada invierno, y la mitad de su banda espera que alguien lo mate para ocupar su lugar.\n\nGanchos (d6):\n1 su rival dentro del clan ofrece ayuda al grupo para derribarlo\n2 busca una alianza contra un enemigo común\n3 su hijo está prisionero en la ciudad\n4 el clan pasa hambre y él no sabe cómo decírselo\n5 quiere retar en duelo al líder del grupo\n6 el hacha del clan fue robada y la busca"
  },
  "acolito_de_la_ceniza": {
   "nombre": "Acólito de la Ceniza",
   "na": 3,
   "tipo": "humanoide",
   "tam": "mediano",
   "rol": "soporte",
   "estructura": "normal",
   "rasgos": [
    {
     "custom": true,
     "name": "Presencia Consagrada",
     "tipo": "Aura",
     "peso": 0,
     "txt": "Radio de 30 pies: sus aliados tienen +1 a las Salvaciones, y las criaturas sagradas atacan con Desventaja.",
     "especie": true
    },
    {
     "custom": true,
     "name": "Bálsamo de Ceniza",
     "tipo": "Aptitud",
     "peso": 0,
     "txt": "Un aliado a 30 pies recupera 1d8 PV o se libra de un estado.",
     "coste": "2 PA"
    },
    {
     "custom": true,
     "name": "Tras la Línea",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Mientras un aliado esté entre él y el atacante, los ataques a distancia contra el Acólito se hacen con Desventaja.",
     "definitoria": true,
     "especie": true
    }
   ],
   "fuente": "Guía del Director",
   "danoTipo": "Contundente",
   "ataqueNombre": "",
   "fuertes": [
    "SAB",
    "CAR"
   ],
   "debiles": [
    "CON"
   ],
   "proteccion": "Rodear la primera línea o atacar desde arriba: sin aliados delante pierde Tras la Línea.",
   "contexto": "El Acólito no pega: sostiene a los suyos. Su trabajo es que nadie llegue hasta él. Colócalo detrás de dos Arrolladores y deja que cure cada ronda: el grupo aprende enseguida que el enemigo que no ataca es el que más importa.",
   "impreso": {
    "pv": 57,
    "g": 13,
    "a": 1,
    "vel": 30,
    "atk": 3,
    "dano": "3d6-2",
    "cd": 15,
    "ini": 0,
    "moral": 13,
    "attrs": {
     "FUE": 0,
     "DES": 0,
     "CON": -2,
     "INT": 0,
     "SAB": 3,
     "CAR": 3
    },
    "enc": 3
   },
   "idea": "«No pega. Sostiene a los que pegan.»",
   "botin": "Ofrendas del culto: 2d6 × 10 cr y un símbolo de hierro",
   "senal": "Marcas de ceniza en las puertas · hogueras apagadas en círculo · gente con la frente sucia que no se lava.",
   "notas": "Infrecuente · Número: 1d3 (con guerreros de su culto) · En su guarida: 40 % · Inteligencia: media · Moral: 13\n\nLos acólitos de la ceniza sirven a un fuego que no calienta: un culto que cree que el mundo debe arder para empezar limpio. Visten túnicas grises, se marcan la frente con ceniza cada mañana y no hablan con quien no lleva la marca. Colócalo detrás de dos Arrolladores y deja que cure cada ronda: el grupo aprende enseguida que el enemigo que no ataca es el que más importa.\n\nGanchos (d6):\n1 el culto ha captado a alguien de la familia de un personaje\n2 preparan una quema en la plaza del pueblo\n3 uno de ellos quiere dejar el culto y pide protección\n4 su sumo sacerdote es un noble respetado\n5 buscan una reliquia que el grupo lleva sin saberlo\n6 el fuego que adoran existe, y está despertando"
  },
  "batidor": {
   "nombre": "Batidor",
   "na": 2,
   "tipo": "humanoide",
   "tam": "mediano",
   "rol": "explorador",
   "estructura": "normal",
   "rasgos": [
    {
     "custom": true,
     "name": "Retirada Ágil",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "No provoca Ataques de Oportunidad al alejarse.",
     "especie": true
    },
    {
     "custom": true,
     "name": "Primero en Llegar",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Ventaja en todas sus tiradas durante su primer turno de combate."
    },
    {
     "custom": true,
     "name": "Dar la Alarma",
     "tipo": "Aptitud",
     "peso": 0,
     "txt": "Si ve al grupo antes de ser visto, puede renunciar a atacar y marcharse. Si llega a los suyos, el Reloj de Amenaza de la zona avanza un paso.",
     "coste": "1 PA"
    }
   ],
   "fuente": "Guía del Director",
   "danoTipo": "Perforante",
   "ataqueNombre": "Arco",
   "fuertes": [
    "DES",
    "SAB"
   ],
   "debiles": [],
   "contexto": "El Batidor casi nunca es el combate: es lo que decide si hay combate. Ponlo antes del encuentro principal y deja que los jugadores decidan si lo persiguen (p. 42), lo dejan ir o lo esperan en una emboscada.",
   "impreso": {
    "pv": 54,
    "g": 14,
    "a": 1,
    "vel": 45,
    "atk": 4,
    "dano": "2d6+5",
    "cd": 13,
    "ini": 6,
    "moral": 12,
    "attrs": {
     "FUE": 0,
     "DES": 2,
     "CON": 0,
     "INT": 0,
     "SAB": 2,
     "CAR": 0
    },
    "enc": 2
   },
   "idea": "«No vino a pelear. Vino a ver cuántos sois.»",
   "botin": "1d6 cr y un mapa de la zona con marcas",
   "senal": "Ramas rotas a la altura de los ojos · una hoguera apagada con tierra · un pájaro que no deja de chillar en la misma rama.",
   "notas": "Común · Número: 1d2 · Inteligencia: media · Moral: 12\n\nEl Batidor casi nunca es el combate: es lo que decide si hay combate. Viste de pardo, lleva arco corto y poca carga, y conoce la zona mejor que nadie. Ponlo antes del encuentro principal y deja que el grupo decida si lo persigue (p. 42), lo deja ir o lo espera en una emboscada. Un batidor capturado sabe mucho y dice poco, salvo que le ofrezcan algo mejor que su paga.\n\nGanchos (d6):\n1 trabaja para el enemigo del grupo y lleva su sello\n2 es un niño que hace de explorador para su aldea\n3 busca al grupo para entregarle un mensaje\n4 huye de su propio bando y quiere desertar\n5 lleva días siguiendo al grupo y sabe sus nombres\n6 es el único superviviente de una patrulla"
  },
  "enjambre_de_ratas": {
   "nombre": "Enjambre de Ratas",
   "na": 1,
   "tipo": "bestia",
   "tam": "diminuto",
   "rol": "hostigador",
   "estructura": "horda",
   "rasgos": [
    {
     "custom": true,
     "name": "Trepar 20 pies",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Trepar 20 pies"
    },
    {
     "custom": true,
     "name": "Inmune a Derribado y Apresado",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Inmune a Derribado y Apresado"
    },
    {
     "custom": true,
     "name": "Resistencia",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Resistencia al daño de ataques contra un solo objetivo"
    },
    {
     "custom": true,
     "name": "Olor de la Sangre",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Percibe a las criaturas heridas a 120 pies, aunque estén ocultas o sean invisibles.",
     "especie": true
    },
    {
     "custom": true,
     "name": "Horda",
     "tipo": "Rasgo",
     "peso": 0,
     "txt": "Actúa como una sola criatura con un solo turno. Recibe el doble de daño de área. Cada cuarta parte de PV que pierde, su daño baja un dado, hasta un mínimo de uno. A la mitad de sus PV se divide en dos enjambres de NA 1 que actúan por separado, cada uno con la mitad de los PV que le queden y la mitad de sus dados, redondeando hacia arriba."
    },
    {
     "custom": true,
     "name": "Mordisco Sucio",
     "tipo": "Reacción",
     "peso": 0,
     "txt": "Quien reciba daño del enjambre hace Salvación CON CD 16 o sufre +1 escalón de Fatiga al terminar la escena."
    }
   ],
   "fuente": "Guía del Director",
   "danoTipo": "Perforante",
   "ataqueNombre": "",
   "miembros": 6,
   "fuertes": [
    "DES",
    "FUE"
   ],
   "debiles": [
    "CON",
    "INT",
    "CAR"
   ],
   "proteccion": "Fuego o cualquier área; ropa gruesa y un antídoto dan Ventaja contra el Mordisco Sucio.",
   "contexto": "El enjambre enseña el valor del área: una antorcha o un Axioma bien colocado vale más que tres espadas. En un pasillo estrecho es un obstáculo; en una bodega con víveres, son 1d6 Raciones perdidas si nadie lo espanta a tiempo.",
   "impreso": {
    "pv": 52,
    "g": 17,
    "a": 1,
    "vel": 40,
    "atk": 7,
    "dano": "3d6+2",
    "cd": 16,
    "ini": 4,
    "moral": null,
    "attrs": {
     "FUE": -2,
     "DES": 4,
     "CON": -3,
     "INT": -2,
     "SAB": 0,
     "CAR": -2
    },
    "enc": 3
   },
   "idea": "«Una rata es una molestia. Mil son un problema de Raciones.»",
   "botin": "Ninguno",
   "senal": "Sacos de grano roídos · un chillido que sube por las paredes · gatos que se niegan a bajar al sótano.",
   "notas": "Común · Número: Una horda de seis ratas (NA 1) · Inteligencia: animal · Moral: No la tira\n\nEl enjambre enseña el valor del área: una antorcha o un Axioma bien colocado vale más que tres espadas. En un pasillo estrecho es un obstáculo; en una bodega con víveres son 1d6 Raciones perdidas si nadie lo espanta a tiempo. Salen de las cloacas cuando sube el agua o cuando algo más grande caza ahí abajo.\n\nGanchos (d6):\n1 huyen de algo que caza en las cloacas\n2 un flautista ofrece librar al pueblo de ellas a cambio de un precio\n3 llevan una enfermedad que ya tiene a tres enfermos\n4 una rata enorme las dirige\n5 se han comido las provisiones del grupo esa noche\n6 un alquimista las cría para sus experimentos"
  }
 },
 "tablas": {
  "fases": {
   "name": "Fases de jefe (d12)",
   "filas": [
    "Se libera: rompe sus cadenas, su armadura cae, su forma real aparece. +1 PA, −2 de Armadura.",
    "Cambia de terreno: el suelo se hunde, el techo se abre, el agua entra. Todo el campo pasa a ser terreno difícil salvo donde él está.",
    "Llama a los suyos: aparecen 1d4 criaturas de NA igual a la mitad del suyo.",
    "Se aferra a algo: un pilar, un altar, un rehén. Mientras lo toque, Resistencia a todo daño.",
    "Se desespera: pierde Represalia y cualquier Reacción defensiva, pero su daño sube un paso.",
    "Se divide: se separa en dos con la mitad de sus PV restantes cada uno.",
    "Huye hacia su núcleo: intenta llegar a un lugar donde regenerarse. El combate se convierte en persecución.",
    "Recupera su Aptitud más poderosa: su Ud vuelve a Ud6.",
    "Revela una verdad: dice o muestra algo que cambia por qué el grupo está luchando.",
    "Se vuelve contra su propio bando: ataca a sus aliados para alimentarse o por furia.",
    "Aura nueva: gana Pavor, Aura Tóxica u Oscuridad Viva durante el resto del combate.",
    "Ofrece un trato: se detiene y negocia. Si el grupo se niega, recupera 1d4 × NA PV."
   ]
  },
  "guarida": {
   "name": "Acciones de Guarida (d12)",
   "filas": [
    "Derrumbe: un área de 10 pies a su elección; Salvación DES contra la CD o la mitad del daño base y Derribado.",
    "Oscuridad: todas las fuentes de luz no mágica se apagan hasta el final de la ronda siguiente.",
    "Corriente: el agua, el viento o el vapor empuja 10 pies a cada criatura en una línea.",
    "Ecos: la criatura sabe dónde está cada personaje; ninguno puede ocultarse hasta la siguiente ronda.",
    "Grietas: una zona de 15 pies se convierte en terreno difícil o se abre un paso nuevo para la criatura.",
    "Nido: 1d4 criaturas de NA 0 o 1 salen de las paredes.",
    "Gas: nube de 10 pies; Salvación CON contra la CD o Envenenado (Ud4).",
    "Sellado: una salida se cierra (puerta, reja, derrumbe). Abrirla: Proeza Física contra la CD.",
    "Resonancia: los Axiomas usados esta ronda cuestan 2 puntos más de Reserva.",
    "Latido: la criatura recupera NA PV.",
    "Ilusión del lugar: una parte de la sala parece distinta de lo que es hasta que alguien la toca.",
    "Calor o frío extremo: cada personaje hace Salvación CON contra la CD o sufre 1 escalón de Fatiga."
   ]
  },
  "victoria": {
   "name": "Victoria alternativa (d10): el combate termina si el grupo…",
   "filas": [
    "…rompe los tres sellos que lo atan al lugar.",
    "…saca al rehén de la sala.",
    "…apaga el ritual antes de que se complete el Reloj.",
    "…lo convence de que su amo ha muerto.",
    "…destruye el objeto que lleva al cuello.",
    "…lo obliga a salir a la luz del día.",
    "…sobrevive hasta que se derrumba la sala o llega el alba.",
    "…pronuncia su nombre verdadero tres veces en la misma ronda.",
    "…le devuelve lo que se le robó.",
    "…lo derrota en su propio juego: un duelo, un acertijo, una apuesta."
   ]
  },
  "bandas": {
   "name": "Composición de bandas (d12)",
   "filas": [
    "Un Comandante y dos grupos de esbirros.",
    "Un Arrollador y un Represor que lo cubre.",
    "Tres Hostigadores y un Explorador que avisa.",
    "Un Guardián y dos Artilleros detrás de él.",
    "Una horda y un Soporte que la mantiene unida.",
    "Dos Acechadores y un señuelo que atrae al grupo.",
    "Un jefe solo en su guarida.",
    "Un jefe y cuatro esbirros que se sacrifican por él.",
    "Dos Arrolladores rivales que se detestan (Moral −2 si uno cae).",
    "Un Represor invisible y una bestia que somete.",
    "Un enjambre y la criatura que lo pastorea.",
    "Una Anomalía y sus fieles (Cap. 8)."
   ]
  },
  "forma": {
   "name": "Aspecto: forma base (d20)",
   "filas": [
    "Felina",
    "Reptil",
    "Insecto",
    "Arácnida",
    "Ave",
    "Pez o anfibio",
    "Canina",
    "Humana, casi",
    "Serpentina",
    "Cefalópodo",
    "Hongo",
    "Árbol o raíz",
    "Estatua",
    "Autómata",
    "Nube o niebla",
    "Fuego o luz",
    "Líquido",
    "Sombra",
    "Geométrica",
    "Dos animales cosidos"
   ]
  },
  "rasgoVisible": {
   "name": "Aspecto: rasgo visible (d20)",
   "filas": [
    "Demasiados ojos",
    "Piel translúcida",
    "Cubierta de pelo blanco",
    "Huesos por fuera",
    "Cristales que crecen de la espalda",
    "Máscara que no se quita",
    "Una segunda boca",
    "Cables bajo la piel",
    "Brilla en la oscuridad",
    "Siempre mojada",
    "Sin sombra",
    "Huele a flores",
    "Cicatrices de runas",
    "Coronada de humo",
    "Extremidades de más",
    "Voz de niño",
    "Ropa de otra época",
    "Metálica y oxidada",
    "Parpadea al moverse",
    "Tira dos veces"
   ]
  },
  "mueve": {
   "name": "Aspecto: se mueve… (d12)",
   "filas": [
    "a cuatro patas",
    "reptando",
    "volando",
    "bajo tierra",
    "por las paredes",
    "nadando",
    "flotando",
    "a saltos",
    "sobre ruedas u orugas",
    "rodando",
    "a través de las sombras",
    "no se mueve: espera"
   ]
  },
  "ataca": {
   "name": "Aspecto: ataca con… (d12)",
   "filas": [
    "garras",
    "mordisco",
    "aguijón o cola",
    "tentáculos",
    "un arma",
    "escupitajo o proyectiles",
    "aplastamiento",
    "la mirada",
    "la voz",
    "energía",
    "toque",
    "no ataca: atrapa"
   ]
  },
  "quiere": {
   "name": "Comportamiento: qué quiere (d20)",
   "filas": [
    "Comer",
    "Proteger sus crías",
    "Defender su territorio",
    "Cumplir una orden",
    "Recuperar algo robado",
    "Vengarse",
    "Escapar",
    "Coleccionar",
    "Reproducirse",
    "Jugar",
    "Ser adorada",
    "Saber",
    "Terminar una tarea antigua",
    "Volver a casa",
    "Que nadie cruce",
    "Negociar",
    "Nada: está enferma",
    "Dormir",
    "Convertir a otros en lo que es",
    "Morir, y no puede"
   ]
  },
  "pelea": {
   "name": "Comportamiento: cómo pelea (d12)",
   "filas": [
    "Carga contra el más grande",
    "Busca al que está solo",
    "Huye y vuelve",
    "Solo pelea acorralada",
    "Ataca a quien la hirió primero",
    "Se ceba con el caído",
    "Desarma y se lleva cosas",
    "Usa a sus aliados como escudo",
    "Espera a que se separen",
    "Grita y avisa a otros",
    "Se retira a su guarida",
    "No se detiene hasta morir"
   ]
  },
  "habitat": {
   "name": "Hábitat (d20)",
   "filas": [
    "Bosque viejo",
    "Pantano",
    "Cavernas",
    "Ruinas",
    "Montaña",
    "Desierto",
    "Costa",
    "Alcantarillas",
    "Ciudad",
    "Cementerio",
    "Mina",
    "Nave o estación",
    "Laboratorio",
    "Templo",
    "Mar abierto",
    "Tundra",
    "Volcán",
    "Cielo",
    "Otro plano",
    "Donde nadie mira"
   ]
  },
  "senal": {
   "name": "La señal (d20)",
   "filas": [
    "Huesos roídos y ordenados",
    "Silencio total: ni pájaros",
    "Marcas de garras a tres metros",
    "Un olor dulce, a fruta pasada",
    "Hilos o secreciones",
    "Ganado desaparecido",
    "Un canto por la noche",
    "Frío repentino",
    "Estatuas que no estaban",
    "Aparatos quemados",
    "Un superviviente que no habla",
    "Huellas que empiezan de la nada",
    "Plantas muertas en círculo",
    "Sangre que no se seca",
    "Símbolos rayados en las puertas",
    "Una ofrenda reciente",
    "Los perros no se acercan",
    "Un sonido metálico rítmico",
    "Todos sueñan lo mismo",
    "Ninguna: eso es la señal"
   ]
  },
  "botinCae": {
   "name": "Lo que deja al caer (d12)",
   "filas": [
    "Nada útil, pero sí una pista sobre quién la envió.",
    "Un órgano valioso para un alquimista (NA × 20 cr).",
    "Piel o placas para una armadura (Artesanía; NA × 50 cr de ahorro).",
    "Veneno o glándula (1d4 dosis de su Aguijón o su Aliento).",
    "Objetos de sus víctimas: 1d6 × NA × 10 cr.",
    "Un objeto Infrecuente (Guía del Director, Cap. 13).",
    "Un mapa, un diario o una orden escrita.",
    "Un huevo, una cría o un núcleo que sigue vivo.",
    "Un componente que sirve de Foco (Guía del Director, Cap. 13).",
    "Un trofeo que abre puertas sociales (Reputación +1 en una Facción).",
    "Una maldición (Guía del Director, Cap. 13) para quien se lo lleve.",
    "Un objeto Raro, y alguien que lo reclama."
   ]
  },
  "nomNucleo": {
   "name": "Nombres: artículo y núcleo (d20)",
   "filas": [
    "el Tejedor",
    "la Madre",
    "el Devorador",
    "la Viuda",
    "el Coro",
    "la Boca",
    "el Heraldo",
    "la Reina",
    "el Guardián",
    "la Sombra",
    "el Paciente",
    "la Hija",
    "el Sin Nombre",
    "la Voz",
    "el Pastor",
    "la Cosecha",
    "el Engranaje",
    "la Espina",
    "el Eco",
    "la Llaga"
   ]
  },
  "nomRaiz": {
   "name": "Nombres: raíz sonora (d20)",
   "filas": [
    "Mórd-",
    "Vesk-",
    "Úl-",
    "Karr-",
    "Sith-",
    "Ozh-",
    "Brenn-",
    "Ithr-",
    "Gael-",
    "Drah-",
    "Tzil-",
    "Quor-",
    "Nhem-",
    "Arv-",
    "Zeph-",
    "Olm-",
    "Hesk-",
    "Vorr-",
    "Lir-",
    "Crax-"
   ]
  },
  "nomEpiteto": {
   "name": "Nombres: epíteto (d20)",
   "filas": [
    "del Pozo",
    "de las Horas",
    "Carroñera",
    "sin Rostro",
    "de Ceniza",
    "que Espera",
    "del Último Invierno",
    "de Óxido",
    "Hambrienta",
    "del Umbral",
    "de Mil Ojos",
    "Silenciosa",
    "de la Marea",
    "Rota",
    "del Cristal",
    "que no Duerme",
    "de Sal",
    "Antigua",
    "del Norte Muerto",
    "de Todos"
   ]
  },
  "nomFin": {
   "name": "Nombres: terminaciones",
   "filas": [
    "ax",
    "ith",
    "ora",
    "un",
    "esh",
    "ul"
   ]
  },
  "trampaDisp": {
   "name": "Trampa: disparador (d12)",
   "filas": [
    "Pisar una losa",
    "Abrir una puerta",
    "Tocar un objeto",
    "Cruzar un hilo",
    "Leer una inscripción",
    "Hablar en voz alta",
    "Llevar luz",
    "Sacar un tesoro",
    "Pasar demasiado tiempo",
    "Usar un Axioma",
    "Mentir",
    "Ser el último en pasar"
   ]
  },
  "trampaEfecto": {
   "name": "Trampa: efecto (d12)",
   "filas": [
    "Dardos (daño base, Envenenado)",
    "Foso (caída y Apresado)",
    "Gas (Inconsciente o Envenenado)",
    "Red (Apresado)",
    "Estallido de energía",
    "Derrumbe (daño y bloqueo)",
    "Alarma (llegan guardianes)",
    "La sala se inunda",
    "El techo desciende",
    "El Axioma rebota",
    "Maldición (Maldito)",
    "La puerta se cierra detrás"
   ]
  },
  "trampaSenal": {
   "name": "Trampa: señal (d12)",
   "filas": [
    "Una junta más limpia",
    "Polvo sin huellas",
    "Olor dulzón o metálico",
    "Un brillo a la altura del tobillo",
    "Tinta que brilla",
    "Grietas en el techo",
    "Un mecanismo de latón visible",
    "Marcas de agua en las paredes",
    "Marcas de roce",
    "Runas de contención",
    "Una estatua que observa",
    "Bisagras sin polvo"
   ]
  },
  "riesgo": {
   "name": "Dado de Riesgo (d6)",
   "filas": [
    "Encuentro — Aparece una amenaza. Tira Reacción (2d10) para la actitud inicial. No necesariamente hostil.",
    "Indicio — Huellas, ruidos, olor, rastro visual. Avisa de peligro sin desencadenarlo.",
    "Recurso — Pierde 1 Ración o 1d4 proyectiles si son lo que más importa (se mojan, se estropean, se caen); si no, tira el Ud del recurso más relevante (agua, luz, herramientas).",
    "Entorno — Cambio climático, trampa ambiental, fluctuación del poder.",
    "Luz — Tira el Ud de la fuente de luz activa del grupo.",
    "Calma — El tiempo transcurre sin incidentes. El grupo avanza."
   ]
  },
  "reaccion": {
   "name": "Reacción de PNJ (2d10): 2–5 · 6–10 · 11–15 · 16–19 · 20",
   "filas": [
    "Hostil: ataca de inmediato o prepara emboscada.",
    "Desfavorable: amenazante o desconfiado. Escucha solo con oferta tangible.",
    "Neutral: indiferente o cauteloso. Dispuesto a parlamentar.",
    "Amistoso: ofrece ayuda, información o comercio.",
    "Aliado: ayuda activamente sin compensación inmediata."
   ]
  },
  "objFaccion": {
   "name": "Objetivos de Facción (d8)",
   "filas": [
    "Eliminar a una Facción rival",
    "Controlar un recurso o localización clave",
    "Reclutar a un personaje o grupo específico",
    "Obtener un objeto o información",
    "Expandir su influencia a una nueva zona",
    "Sobrevivir a una amenaza que la está presionando",
    "Recuperarse de una derrota reciente",
    "Mantener el statu quo ante una amenaza emergente"
   ]
  },
  "objTipo": {
   "name": "Objeto mágico: tipo (d12)",
   "filas": [
    "Arma cuerpo a cuerpo",
    "Arma a distancia",
    "Armadura",
    "Escudo",
    "Capa o vestimenta",
    "Accesorio (anillo, amuleto, brazalete)",
    "Consumible (poción, pergamino)",
    "Joya o gema",
    "Herramienta especializada",
    "Foco",
    "Documento o mapa arcano",
    "Objeto extraño (no identificable a primera vista)"
   ]
  },
  "objHistoria": {
   "name": "Objeto mágico: las tres preguntas",
   "filas": [
    "¿Quién lo creó y con qué propósito?",
    "¿Cuál fue su momento de mayor poder o infamia?",
    "¿Qué quiere ahora el objeto, o qué creen los que lo conocen que «quiere» hacer?"
   ]
  },
  "revision": {
   "name": "Revisión final de una criatura",
   "filas": [
    "¿Se puede ver venir? Tiene una señal, y sus Aptitudes más peligrosas se anuncian.",
    "¿Obliga a decidir? Si la respuesta óptima es siempre «pegarle más fuerte», le falta algo.",
    "¿Se puede descubrir su punto débil? Si tiene una Debilidad, el grupo tiene forma de averiguarla antes o durante el encuentro.",
    "¿Sabe cuándo huir? Anota su Moral o la condición en la que abandona la pelea."
   ]
  },
  "moralMods": {
   "name": "Modificadores de Moral",
   "filas": [
    "+2 · Líder especialmente carismático o intimidante",
    "+3 · Defienden algo que no pueden abandonar",
    "−2 · Han sufrido un Golpe Crítico devastador",
    "−2 · Su líder acaba de caer",
    "−1 · El terreno ofrece una huida fácil y visible"
   ]
  },
  "moralCuando": {
   "name": "Cuándo comprobar la Moral",
   "filas": [
    "Cae el líder visible del grupo enemigo.",
    "La mitad o más del grupo ha sido incapacitada o muerta.",
    "Aparece un terror sobrenatural o una amenaza desproporcionada.",
    "Un enemigo recibe un golpe que supera la mitad de sus PV de una vez."
   ]
  },
  "danos": {
   "name": "Tipos de daño",
   "filas": [
    "Cortante",
    "Perforante",
    "Contundente",
    "Fuego",
    "Frío",
    "Rayo",
    "Ácido",
    "Veneno",
    "Energía",
    "Sónico",
    "Fuerza",
    "Psíquico",
    "Necrótico",
    "Radiante"
   ]
  }
 },
 "encuentros": {
  "1-2": {
   "name": "Nivel 1–2",
   "f": 4,
   "e": 5,
   "p": 6,
   "m": 7
  },
  "3-4": {
   "name": "Nivel 3–4",
   "f": 4,
   "e": 5,
   "p": 7,
   "m": 8
  },
  "5-6": {
   "name": "Nivel 5–6",
   "f": 6,
   "e": 7,
   "p": 8,
   "m": 10
  },
  "7-8": {
   "name": "Nivel 7–8",
   "f": 6,
   "e": 8,
   "p": 9,
   "m": 11
  },
  "9-10": {
   "name": "Nivel 9–10",
   "f": 8,
   "e": 10,
   "p": 12,
   "m": 14
  }
 },
 "grupoAjuste": {
  "1": -2,
  "2": -1,
  "3": -1,
  "4": 0,
  "5": 1,
  "6": 1
 },
 "riqueza": {
  "1": {
   "name": "Nivel 1",
   "acum": "100–300 cr",
   "sesion": "50–100 cr",
   "sesMin": 50,
   "sesMax": 100,
   "objetos": "0–1 Comunes"
  },
  "2": {
   "name": "Nivel 2",
   "acum": "300–600 cr",
   "sesion": "100–200 cr",
   "sesMin": 100,
   "sesMax": 200,
   "objetos": "1–2 Comunes"
  },
  "3": {
   "name": "Nivel 3",
   "acum": "600–1.200 cr",
   "sesion": "150–300 cr",
   "sesMin": 150,
   "sesMax": 300,
   "objetos": "1–2 Infrecuentes"
  },
  "4": {
   "name": "Nivel 4",
   "acum": "1.200–2.500 cr",
   "sesion": "200–400 cr",
   "sesMin": 200,
   "sesMax": 400,
   "objetos": "1–2 Infrecuentes"
  },
  "5": {
   "name": "Nivel 5",
   "acum": "2.500–5.000 cr",
   "sesion": "300–600 cr",
   "sesMin": 300,
   "sesMax": 600,
   "objetos": "1–2 Raros"
  },
  "6": {
   "name": "Nivel 6",
   "acum": "5.000–10.000 cr",
   "sesion": "500–1.000 cr",
   "sesMin": 500,
   "sesMax": 1000,
   "objetos": "1–2 Raros"
  },
  "7": {
   "name": "Nivel 7",
   "acum": "10.000–20.000 cr",
   "sesion": "800–1.500 cr",
   "sesMin": 800,
   "sesMax": 1500,
   "objetos": "1 Muy Raro"
  },
  "8": {
   "name": "Nivel 8",
   "acum": "20.000–40.000 cr",
   "sesion": "1.000–2.500 cr",
   "sesMin": 1000,
   "sesMax": 2500,
   "objetos": "1–2 Muy Raros"
  },
  "9": {
   "name": "Nivel 9",
   "acum": "40.000–80.000 cr",
   "sesion": "2.000–4.000 cr",
   "sesMin": 2000,
   "sesMax": 4000,
   "objetos": "1–2 Muy Raros o 1 Legendario"
  },
  "10": {
   "name": "Nivel 10",
   "acum": "80.000+ cr",
   "sesion": "3.000–6.000 cr",
   "sesMin": 3000,
   "sesMax": 6000,
   "objetos": "1 Legendario o recompensa especial"
  }
 },
 "costes": {
  "informacion_de_calidad": {
   "name": "Información de calidad",
   "coste": "50–500 cr",
   "txt": "Un contacto revela la Moneda de un PNJ, el plano de un edificio, o el punto débil de una facción."
  },
  "soborno_menor": {
   "name": "Soborno menor",
   "coste": "50–500 cr",
   "txt": "+1 escalón de actitud con un PNJ o facción."
  },
  "soborno_mayor": {
   "name": "Soborno mayor",
   "coste": "1.000–5.000 cr",
   "txt": "+2 escalones. Solo funciona una vez por relación sin acción narrativa adicional."
  },
  "entrenamiento_especializado": {
   "name": "Entrenamiento especializado",
   "coste": "300 cr × Nivel",
   "txt": "Equivale a 1 PD extra entre sesiones (no más de 1 vez por Nivel). No puede gastarse en Vigor ni en Reserva."
  },
  "curacion_avanzada": {
   "name": "Curación avanzada",
   "coste": "100 cr",
   "txt": "Restaura 1 punto de Flesh o elimina un estado persistente básico —elige uno— (el Flesh se recupera muy despacio: ver Manual Básico, Cap. 10)."
  },
  "mercenarios_100_soldados_1_mes": {
   "name": "Mercenarios (100 soldados, 1 mes)",
   "coste": "60.000 cr",
   "txt": "Fuerza disponible para una operación de Escala Planetaria."
  },
  "fortaleza_basica": {
   "name": "Fortaleza básica",
   "coste": "10.000–50.000 cr",
   "txt": "Base de Poder física con F 1, A 1 y R 2."
  },
  "nave_estelar_usada": {
   "name": "Nave estelar usada",
   "coste": "50.000–150.000 cr",
   "txt": "Vehículo con Ud de Integridad degradado; requiere reparación."
  }
 },
 "rarezas": {
  "comun": {
   "name": "Común",
   "d6": "1–2",
   "na": "0–2",
   "sintonia": "No requiere",
   "nivel": "Cualquier nivel. Consumibles, herramientas menores, munición encantada.",
   "props": 0,
   "atk": "—",
   "def": "—",
   "cd": "—",
   "dano": "—",
   "precio": "consumibles menores"
  },
  "infrecuente": {
   "name": "Infrecuente",
   "d6": "3–4",
   "na": "3–5",
   "sintonia": "Sí (1 slot)",
   "nivel": "Nivel 3–4. Mejoras significativas sin romper el balance.",
   "props": 1,
   "atk": "+1",
   "def": "+1 / +1",
   "cd": "—",
   "dano": "+1d4",
   "precio": "400–1.200 cr"
  },
  "raro": {
   "name": "Raro",
   "d6": "5",
   "na": "6–8",
   "sintonia": "Sí (1 slot)",
   "nivel": "Nivel 5–6. Objetos con mecánicas propias, no solo bonos.",
   "props": 2,
   "atk": "+2",
   "def": "+2 / +2",
   "cd": "+1",
   "dano": "+1d6",
   "precio": "3.000–8.000 cr"
  },
  "muy_raro": {
   "name": "Muy Raro",
   "d6": "6",
   "na": "9–11",
   "sintonia": "Sí (1 slot)",
   "nivel": "Nivel 7–8. Cambios cualitativos en cómo el personaje opera.",
   "props": 3,
   "atk": "+3",
   "def": "+2 / +3",
   "cd": "+2",
   "dano": "+1d8",
   "precio": "15.000–30.000 cr"
  },
  "legendario": {
   "name": "Legendario",
   "d6": "7",
   "na": "12+",
   "sintonia": "Sí (requiere Nivel 9+)",
   "nivel": "Nivel 9–10, en juego épico. Objetos que alteran el mundo, no solo al personaje.",
   "props": 4,
   "atk": "+3 y único",
   "def": "+2 / +3 y único",
   "cd": "+3",
   "dano": "+1d10",
   "precio": "no comprable"
  },
  "artefacto_unico": {
   "name": "Artefacto Único",
   "d6": "8",
   "na": "Escala Cósmica",
   "sintonia": "Sí (requiere Nivel 10)",
   "nivel": "Objetos con voluntad propia y agenda.",
   "props": 5,
   "atk": "+3 y único",
   "def": "+3 y único",
   "cd": "+3",
   "dano": "+1d10",
   "precio": "no comprable"
  }
 },
 "propiedades": {
  "bono_de_ataque": {
   "name": "Bono de Ataque",
   "d20": "1–2",
   "min": 1,
   "max": 2,
   "txt": "+1 (Infrecuente), +2 (Raro) o +3 (Muy Raro o Legendario) al ataque.",
   "bono": "atk"
  },
  "bono_defensivo": {
   "name": "Bono defensivo",
   "d20": "3–4",
   "min": 3,
   "max": 4,
   "txt": "+1 a la Guardia (+2 si es Muy Raro o Legendario), o +1, +2 o +3 de Armadura con la escala del ataque, mientras se lleva. Qué eje toca lo decide lo que el objeto hace en la ficción: un campo de fuerza, una capa que desvía o un escudo bien equilibrado suben la Guardia; una pieza que endurece el cuerpo o refuerza el blindaje sube la Armadura. Un mismo objeto puede tocar los dos ejes a la vez, pero entonces cada bono se cuenta por separado. El límite de +2 en Guardia es el del bono sostenido: un objeto que solo se activa una ronda, o contra un único ataque, puede llegar más alto: hasta +3 o +4 si dura una sola ronda, y hasta +5 si solo afecta a un único ataque.",
   "bono": "def"
  },
  "dano_elemental": {
   "name": "Daño elemental",
   "d20": "5–6",
   "min": 5,
   "max": 6,
   "txt": "Añade 1d4 (Infrecuente), 1d6 (Raro) o 1d8 (Muy Raro o Legendario) de daño del tipo elegido.",
   "bono": "dano"
  },
  "propulsion_tactica": {
   "name": "Propulsión táctica",
   "d20": "7–8",
   "min": 7,
   "max": 8,
   "txt": "Una vez por turno, desplaza al objetivo 10 pies en cualquier dirección al impactar."
  },
  "deposito_de_poder": {
   "name": "Depósito de poder",
   "d20": "9–10",
   "min": 9,
   "max": 10,
   "txt": "Contiene 4d6 puntos de Ingenio recargables (1 Descanso Largo). Solo pueden gastarse en capacidades que consuman esa Reserva."
  },
  "resistencia_elemental": {
   "name": "Resistencia elemental",
   "d20": "11",
   "min": 11,
   "max": 11,
   "txt": "El portador tiene Resistencia a un tipo de daño."
  },
  "absorcion_de_axiomas": {
   "name": "Absorción de Axiomas",
   "d20": "12",
   "min": 12,
   "max": 12,
   "txt": "Una vez por Descanso Largo, al recibir un Axioma, lo absorbe en lugar de recibir el efecto."
  },
  "telepatico": {
   "name": "Telepático",
   "d20": "13",
   "min": 13,
   "max": 13,
   "txt": "Permite comunicación sin palabras en 30 pies con alguien sintonizado."
  },
  "sigiloso": {
   "name": "Sigiloso",
   "d20": "14",
   "min": 14,
   "max": 14,
   "txt": "El portador no deja rastro físico (huellas, olor) mientras lo lleva."
  },
  "detectar": {
   "name": "Detectar",
   "d20": "15",
   "min": 15,
   "max": 15,
   "txt": "Vibra o emite luz tenue al detectar una condición específica en 60 pies."
  },
  "regenerativo": {
   "name": "Regenerativo",
   "d20": "16",
   "min": 16,
   "max": 16,
   "txt": "El portador recupera 1 PV al inicio de cada turno si tiene menos de la mitad."
  },
  "vinculo_de_alma": {
   "name": "Vínculo de alma",
   "d20": "17",
   "min": 17,
   "max": 17,
   "txt": "Si el portador muere, el objeto puede absorber su alma y liberarla en un lugar seguro (1 vez)."
  },
  "voluntad_propia": {
   "name": "Voluntad propia",
   "d20": "18–19",
   "min": 18,
   "max": 19,
   "txt": "El objeto tiene una personalidad definida y puede comunicarse. Puede resistirse si va contra sus valores."
  },
  "propiedad_unica": {
   "name": "Propiedad única",
   "d20": "20",
   "min": 20,
   "max": 20,
   "txt": "El DJ define algo que no aparece en esta tabla, específico de la historia del objeto."
  }
 },
 "maldiciones": {
  "licantropia": {
   "name": "Licantropía",
   "txt": "Transformación forzada en luna llena (sin control). Tiradas secretas de SAB en situaciones de estrés para controlar los impulsos.",
   "cura": "Menor: Axioma Curar Maldición Nv3 en los primeros tres días. Grave (ya transformado): sangre del licántropo original + ritual de purificación Nv5."
  },
  "maldicion_del_no_muerto": {
   "name": "Maldición del No-muerto",
   "txt": "El personaje no puede recuperar PV mediante Axiomas ni Talentos. Solo recupera 1 PV por Vigilia de reposo.",
   "cura": "Destruir el objeto o ser que ancla la maldición al personaje, o un sacerdote de alta autoridad de la orden correspondiente."
  },
  "geas": {
   "name": "Geas",
   "txt": "Obligación compulsiva definida al usarse. Mientras la incumple: +1 escalón de Fatiga por día (efecto del Axioma Geas, Catálogo).",
   "cura": "Axioma Romper Geas (Nv5, Divinidad), o que la entidad que la impuso la levante voluntariamente."
  },
  "corrupcion_arcana": {
   "name": "Corrupción Arcana",
   "txt": "El Ud de todos los Focos del personaje degrada 1 escalón de forma permanente.",
   "cura": "Ritual de limpieza en un lugar de alta energía natural pura durante 3 Vigilias. No puede hacerse en zonas corruptas."
  }
 },
 "focos": {
  "foco_de_erudicion": {
   "name": "Foco de Erudición",
   "ud": "Ud8",
   "fuente": "Erudición",
   "txt": "El siguiente Axioma del turno no requiere Concentración aunque normalmente la necesite.",
   "coste": "200 cr"
  },
  "foco_de_devocion": {
   "name": "Foco de Devoción",
   "ud": "Ud8",
   "fuente": "Divinidad",
   "txt": "Restaura 1d6 PV a ti o a un aliado adyacente inmediatamente.",
   "coste": "200 cr"
  },
  "foco_de_pacto": {
   "name": "Foco de Pacto",
   "ud": "Ud6",
   "fuente": "Pacto",
   "txt": "Tu Patrono bloquea 1 ataque dirigido a ti como Reacción en el próximo turno enemigo.",
   "coste": "250 cr"
  },
  "foco_natural": {
   "name": "Foco Natural",
   "ud": "Ud8",
   "fuente": "Naturaleza",
   "txt": "Un aliado adyacente recupera 4 puntos de Adrenalina.",
   "coste": "175 cr"
  },
  "foco_psionico": {
   "name": "Foco Psiónico",
   "ud": "Ud10",
   "fuente": "Psiónica",
   "txt": "El siguiente Axioma de esa Fuente afecta a 1 objetivo adicional sin coste extra de Reserva.",
   "coste": "300 cr"
  },
  "foco_indefinido": {
   "name": "Foco Indefinido",
   "ud": "Ud6",
   "fuente": "Cualquier Fuente",
   "txt": "Sin Resonancia especial. Reduce el Coste en 3 puntos (no 2) mientras activo.",
   "coste": "350 cr"
  }
 },
 "modulos": {
  "filo_sonico": {
   "name": "Filo Sónico",
   "cd": "12",
   "tipo": "Ofensivo",
   "txt": "+1d4 de daño de Energía (sónico) en cada impacto; ignora 2 puntos de Armadura no mágica.",
   "coste": "500 cr"
  },
  "carga_de_plasma": {
   "name": "Carga de Plasma",
   "cd": "15",
   "tipo": "Ofensivo",
   "txt": "1 vez por combate: +2d6 daño de plasma en un Ataque Normal.",
   "coste": "1.800 cr"
  },
  "modulador_de_frecuencia": {
   "name": "Modulador de Frecuencia",
   "cd": "12",
   "tipo": "Ofensivo",
   "txt": "Como 0 PA al inicio del turno: cambia el tipo de daño del arma al tipo declarado.",
   "coste": "600 cr"
  },
  "capa_ablativa": {
   "name": "Capa Ablativa",
   "cd": "12",
   "tipo": "Defensivo",
   "txt": "RD 2 permanente. Al inicio de cada combate tira Ud8; en 1–2, la RD baja a 1 hasta repararse.",
   "coste": "800 cr"
  },
  "disipador_de_energia": {
   "name": "Disipador de Energía",
   "cd": "15",
   "tipo": "Defensivo",
   "txt": "Resistencia al tipo energético elegido al instalar. Tira Ud8 tras cada impacto resistido.",
   "coste": "2.500 cr"
  },
  "refuerzo_de_articulaciones": {
   "name": "Refuerzo de Articulaciones",
   "cd": "12",
   "tipo": "Defensivo",
   "txt": "Elimina la penalización de Sigilo de armaduras medias.",
   "coste": "1.000 cr"
  },
  "receptor_de_datos": {
   "name": "Receptor de Datos",
   "cd": "10",
   "tipo": "Utilitario",
   "txt": "Comunicación con dispositivos en red; enviar mensajes cuesta 0 PA.",
   "coste": "200 cr"
  },
  "visor_termo_espectral": {
   "name": "Visor Termo-espectral",
   "cd": "12",
   "tipo": "Utilitario",
   "txt": "Visión en oscuridad total mediante calor residual.",
   "coste": "700 cr"
  }
 },
 "etiquetas": {
  "1": {
   "name": "Cicatriz Mágica",
   "txt": "Un poder desbordado estalló aquí. La tierra está marcada. Algo mutó, algo aún sangra.",
   "enemigo": "Carroñero que extrae de la cicatriz cualquier cosa que resuene, al precio que sea.",
   "aliado": "Investigadora de una orden erudita que estudia la anomalía y necesita escolta.",
   "complicacion": "El área distorsiona tu Fuente: cada Axioma usado aquí tiene un 20 % de probabilidades (1–4 en 1d20) de ver alterado su alcance o su efecto.",
   "objeto": "Foco de calidad excepcional, inestable si se saca de la zona.",
   "lugar": "El epicentro de la cicatriz — un cráter vitrificado donde el tiempo parece lento."
  },
  "2": {
   "name": "Tecnología Olvidada",
   "txt": "Los constructores murieron o se fueron. Sus máquinas siguen funcionando. Nadie entiende por qué.",
   "enemigo": "Coleccionista que envía mercenarios a «recuperar» piezas; su empleador tiene planes peores.",
   "aliado": "Técnico local que ha aprendido a mantener una máquina sin entenderla.",
   "complicacion": "La tecnología responde a usuarios con una Fuente; los demás la activan por accidente.",
   "objeto": "Componente de función desconocida por el que varios grupos están dispuestos a matar.",
   "lugar": "La instalación sellada: cuatro niveles, suministro de energía propio, un sistema de seguridad todavía activo."
  },
  "3": {
   "name": "Culto del Vacío",
   "txt": "Alguien escuchó algo en la oscuridad. Algunos creyeron. La mayoría de los que se unieron no salieron.",
   "enemigo": "El Portavoz — un converso de alto rango que antes era alguien respetado.",
   "aliado": "Familiar de un miembro que quiere rescatarlo antes de que complete la iniciación final.",
   "complicacion": "El culto tiene informantes en la guardia local; cualquier investigación llega a sus oídos.",
   "objeto": "El texto fundacional del culto — peligroso de leer, valioso de destruir o estudiar.",
   "lugar": "El Santuario Interior — solo accesible en la luna nueva, bajo una estructura pública conocida."
  },
  "4": {
   "name": "Hegemonía Decadente",
   "txt": "El poder todavía existe. Las instituciones todavía funcionan. Pero algo se está pudriendo desde dentro.",
   "enemigo": "El Inspector — un funcionario corrupto que extrae tributos informales a todo el que pasa.",
   "aliado": "Un reformista que tiene pruebas pero no brazo ejecutor.",
   "complicacion": "Las leyes locales favorecen al que tiene más monedas; el grupo puede ser criminalizado sin previo aviso.",
   "objeto": "Sello oficial robado que legitima órdenes falsas.",
   "lugar": "La Cámara de Registros — donde está todo el pasado de la hegemonía, si alguien sabe buscar."
  },
  "5": {
   "name": "Criatura Ancestral",
   "txt": "Lleva aquí más tiempo que cualquier civilización. No es malvada. Tampoco es segura.",
   "enemigo": "Cazador de trofeos que quiere la cabeza de la criatura y no entiende lo que eso rompería.",
   "aliado": "Guardián de la tradición que conoce los términos del viejo acuerdo con la criatura.",
   "complicacion": "La criatura tiene territorio marcado; los personajes ya lo han cruzado sin saberlo.",
   "objeto": "Una ofrenda ritual que apacigua a la criatura — escasa y difícil de conseguir.",
   "lugar": "El Territorio Sagrado — la criatura no entra en él; tampoco los que la sirven."
  },
  "6": {
   "name": "Tierra Maldita",
   "txt": "Algo ocurrió aquí. Quizá fue merecido. Quizá no. El suelo todavía lo recuerda.",
   "enemigo": "El que causó la maldición, vivo o no, que no quiere que nadie descubra la verdad.",
   "aliado": "Superviviente del suceso original, marcado, que sabe lo que pasó.",
   "complicacion": "Quien pasa más de una Vigilia en la zona hace una Salvación CON CD 13 o contrae un estado persistente.",
   "objeto": "El artefacto o acto que podría levantar la maldición — está en manos equivocadas.",
   "lugar": "El punto cero de la maldición: un edificio, una tumba, un campo, irreconociblemente deformado."
  },
  "7": {
   "name": "Ruinas de una era anterior",
   "txt": "Estuvieron aquí antes que nosotros. Sus muros duran más que nuestra memoria.",
   "enemigo": "Saqueador organizado con una empresa financiando la extracción — legal en el papel.",
   "aliado": "Académico que quiere documentar antes de que los saqueadores lo destruyan todo.",
   "complicacion": "Parte de las ruinas sigue habitada — por algo que no sabe que el mundo exterior cambió.",
   "objeto": "Un registro en un idioma que nadie vivo domina del todo.",
   "lugar": "La Cámara Sellada — los saqueadores no han llegado aún; hay razones para que esté sellada."
  },
  "8": {
   "name": "Guerra Civil Fría",
   "txt": "Dos facciones. Una ciudad. Una economía. La tensión es tan densa que se corta.",
   "enemigo": "El agente provocador — trabaja para escalar el conflicto porque alguien externo lo quiere.",
   "aliado": "El mediador agotado que necesita información concreta para evitar el estallido.",
   "complicacion": "El grupo es percibido como aliado de una facción en cuanto llega; su neutralidad no se cree.",
   "objeto": "La prueba de que el conflicto fue fabricado desde fuera.",
   "lugar": "La Zona Neutral — mercado o templo donde las reglas del conflicto no aplican, todavía."
  },
  "9": {
   "name": "Comercio de Secretos",
   "txt": "Aquí todo tiene precio. La información es la moneda más dura. Y alguien siempre sabe más de lo que vende.",
   "enemigo": "El Archivista — tiene lo que el grupo necesita pero lo vende al mejor postor, incluyendo a sus enemigos.",
   "aliado": "Corredor de información que debe un favor al grupo o lo necesita.",
   "complicacion": "El grupo ya es mercancía: alguien ha puesto precio a información sobre ellos.",
   "objeto": "Fragmento de información que varias facciones quieren suprimir.",
   "lugar": "La Casa de la Balanza — el mercado de secretos, neutral por norma y por violencia."
  },
  "10": {
   "name": "Orden en Declive",
   "txt": "Fueron poderosos. Creen que todavía lo son. No todos sus miembros están equivocados.",
   "enemigo": "El Guardián de la Pureza — purga a los que cuestionan la relevancia de la Orden.",
   "aliado": "Miembro joven que ve la realidad y quiere cambiarla desde dentro.",
   "complicacion": "La Orden tiene jurisdicción legal en esta zona; su cooperación o su hostilidad cambia todo.",
   "objeto": "El Archivo Sellado — registros de lo que hizo la Orden cuando todavía importaba.",
   "lugar": "La Sede Central — imponente, parcialmente abandonada, con secciones que nadie visita ya."
  },
  "11": {
   "name": "Refugiados del Colapso",
   "txt": "Llegaron huyendo de algo. Lo que los persiguió podría seguirlos.",
   "enemigo": "El oficial que los persigue todavía, con papeles que lo legalizan.",
   "aliado": "Líder de la comunidad refugiada que sabe exactamente qué causó el colapso de donde vienen.",
   "complicacion": "Lo que causó el colapso original ya llegó aquí; nadie lo ha reconocido todavía.",
   "objeto": "El registro del colapso — prueba de quién fue responsable y por qué.",
   "lugar": "El Campamento Exterior — entre el muro y el mundo; ni dentro ni fuera."
  },
  "12": {
   "name": "Frontera en Disputa",
   "txt": "El mapa dice una cosa. La gente que vive aquí dice otra. Ambos están dispuestos a morir por su versión.",
   "enemigo": "El comandante de frontera que tiene órdenes de «estabilizar» y las interpreta liberalmente.",
   "aliado": "Habitante local que solo quiere que su granja siga en pie y conoce cada piedra del terreno.",
   "complicacion": "Cualquier acción del grupo será interpretada como toma de partido por alguien.",
   "objeto": "El tratado original — interpretado de forma incompatible por ambas partes, con razón.",
   "lugar": "El Paso — el único acceso práctico entre los dos lados, actualmente cerrado y vigilado."
  },
  "13": {
   "name": "Plaga Latente",
   "txt": "Los síntomas aún no son evidentes para todos. Los que los tienen intentan ocultarlos.",
   "enemigo": "El curandero charlatán que vende curas falsas y suprime las reales para mantener el negocio.",
   "aliado": "Médica que tiene el diagnóstico correcto pero no los medios para tratarlo a escala.",
   "complicacion": "El grupo puede ser portador sin saberlo — la incubación es larga; la propagación, silenciosa.",
   "objeto": "Muestra del agente original — cura potencial o arma biológica dependiendo de quién la tenga.",
   "lugar": "El Hospital Provisional — hacinado, con pacientes que no se atreven a decir sus síntomas reales."
  },
  "14": {
   "name": "Recurso Codiciado",
   "txt": "Hay algo aquí que el mundo necesita. Eso significa que el mundo viene a buscarlo, con o sin permiso.",
   "enemigo": "El representante de la empresa extractora — legal, bien financiado, dispuesto a ser flexible en ética.",
   "aliado": "Comunidad local que vive del recurso y lo gestiona desde hace generaciones.",
   "complicacion": "El recurso tiene una propiedad no documentada que lo hace más peligroso de lo que nadie calculó.",
   "objeto": "El contrato de explotación — tiene una cláusula que nadie leyó bien.",
   "lugar": "La Veta Principal — el acceso está disputado; llegar requiere pasar por territorio de al menos dos partes."
  },
  "15": {
   "name": "Red de Contrabando",
   "txt": "Hay cosas que la ley no permite mover. Alguien siempre las mueve de todas formas.",
   "enemigo": "El recaudador corrupto que toma su parte y elimina a los que no pagan.",
   "aliado": "Contrabandista con principios que traficó algo que no debía y ahora tiene consecuencias.",
   "complicacion": "El grupo necesita un servicio que solo la red puede proveer — el precio es un favor.",
   "objeto": "El cargamento problemático — lo que contiene no es lo que nadie esperaba.",
   "lugar": "El Almacén de Tránsito — oficialmente abandonado, oficiosamente el nudo de la red."
  },
  "16": {
   "name": "Facción Fanática",
   "txt": "Creen tener razón. Probablemente tienen razón en algo. Su método es el problema.",
   "enemigo": "El Ideólogo — incapaz de imaginar que los medios puedan invalidar el fin.",
   "aliado": "Desertor reciente que se fue cuando vio lo que la facción estaba dispuesta a hacer.",
   "complicacion": "La facción tiene apoyo popular genuino; atacarla frontalmente crearía mártires.",
   "objeto": "El Manifiesto — el documento fundacional que el Ideólogo ya no sigue aunque lo invoca.",
   "lugar": "El Bastión — la sede de la facción en esta zona, accesible pero no sin consecuencias."
  },
  "17": {
   "name": "Portal Inestable",
   "txt": "Abre. Cierra. A veces lo que sale no debería estar aquí.",
   "enemigo": "El que quiere estabilizarlo con propósitos que no son públicos.",
   "aliado": "El que sobrevivió a lo que salió la última vez y sabe cómo sellarlo.",
   "complicacion": "El portal tiene un ciclo — la próxima apertura es en horas o días. El grupo puede no querer estar cerca.",
   "objeto": "El Ancla — el artefacto que podría estabilizarlo o sellarlo permanentemente.",
   "lugar": "La Zona de Exclusión — el área alrededor del portal donde las reglas físicas son sugerencias."
  },
  "18": {
   "name": "Colonia Aislada",
   "txt": "Se separaron del resto por elección o por fuerza. Lo que construyeron funciona. Hasta cierto punto.",
   "enemigo": "El Fundador o su sucesor, que no acepta que el aislamiento tiene costes que ya no pueden pagar.",
   "aliado": "La generación joven, que quiere contacto exterior y tiene buenas razones.",
   "complicacion": "La colonia tiene algo que el mundo exterior quiere; ese conocimiento llegará pronto.",
   "objeto": "Los Registros Fundacionales — explican por qué se aislaron; la razón sigue siendo válida.",
   "lugar": "El Límite — la frontera física o simbólica que los colonos no cruzan; los forasteros tampoco deberían."
  },
  "19": {
   "name": "Bestia de Escala",
   "txt": "Es tan grande que el terreno que ocupa es, en la práctica, su cuerpo.",
   "enemigo": "El Cazador de Renombre — quiere la hazaña; no le importa el coste colateral.",
   "aliado": "El Ecólogo — ha estudiado la bestia años; sabe que matarla rompería algo.",
   "complicacion": "La bestia no es agresiva salvo bajo una condición específica — que alguien ya cumplió sin saberlo.",
   "objeto": "La Escama/Garra/Fragmento — tiene propiedades alquímicas únicas; hay demanda.",
   "lugar": "El Corazón del Territorio — donde la bestia descansa; se puede llegar allí sin provocarla si se sabe cómo."
  },
  "20": {
   "name": "Anomalía Cósmica",
   "txt": "Las leyes físicas aquí son… sugerencias. Algo más antiguo que el mundo local dejó una marca.",
   "enemigo": "El Investigador sin escrúpulos que experimenta con personas para entender la anomalía.",
   "aliado": "El Nativo — alguien nacido en la zona, adaptado a sus reglas, que las entiende instintivamente.",
   "complicacion": "Los Axiomas se comportan de forma impredecible; tu poder puede amplificarse o bloquearse sin previo aviso.",
   "objeto": "El Artefacto de Origen — lo que causó la anomalía; activo, antiguo, y aún funcionando.",
   "lugar": "El Centro Quieto — el único punto de la zona donde todo es completamente normal. Nadie sabe por qué."
  }
 },
 "faccionesEj": {
  "guardia_de_la_ciudad": {
   "name": "Guardia de la Ciudad",
   "f": 4,
   "a": 2,
   "r": 3,
   "activos": "Milicia urbana (F3), Red de informantes (A2)"
  },
  "gremio_de_mercaderes": {
   "name": "Gremio de Mercaderes",
   "f": 1,
   "a": 3,
   "r": 5,
   "activos": "Caravana armada (F1), Sobornos (A3), Almacén (R4)"
  },
  "culto_del_vacio": {
   "name": "Culto del Vacío",
   "f": 2,
   "a": 5,
   "r": 2,
   "activos": "Fanáticos (F2), Célula infiltrada (A5), Fondo oculto (R2)"
  },
  "orden_en_declive": {
   "name": "Orden en Declive",
   "f": 3,
   "a": 3,
   "r": 2,
   "activos": "Veteranos (F3), Archivo secreto (A3), Sede regional (R2)"
  },
  "senor_de_la_guerra": {
   "name": "Señor de la Guerra",
   "f": 5,
   "a": 2,
   "r": 1,
   "activos": "Ejército (F5), Explorador (A2)"
  }
 },
 "accionesFaccion": {
  "atacar": {
   "name": "Atacar",
   "attr": "F",
   "txt": "Inflige daño a otra Facción: 1d6 + F al PG del objetivo. El objetivo puede resistir (véase «Conflicto entre Facciones»)."
  },
  "defender": {
   "name": "Defender",
   "attr": "F",
   "txt": "Añade +2 a las tiradas de resistencia esta ronda."
  },
  "infiltrar": {
   "name": "Infiltrar",
   "attr": "A",
   "txt": "Obtiene información sobre otra Facción o planta un agente. Siguiente Ataque de esta Facción gana Ventaja."
  },
  "sabotear": {
   "name": "Sabotear",
   "attr": "A",
   "txt": "Destruye un Activo del objetivo si supera A del objetivo (2d10 + A propia vs. CD 10 + A objetivo)."
  },
  "crecer": {
   "name": "Crecer",
   "attr": "R",
   "txt": "Añade un nuevo Activo de NA ≤ R actual. Tarda 1d4 Turnos."
  },
  "recuperar": {
   "name": "Recuperar",
   "attr": "R",
   "txt": "Recupera 1d6 + R PG. No se puede hacer si fue Atacada este Turno."
  },
  "moverse": {
   "name": "Moverse",
   "attr": "—",
   "txt": "Expande o contrae su zona de influencia en el mapa de campaña."
  },
  "contratar": {
   "name": "Contratar",
   "attr": "R",
   "txt": "Intenta reclutar a un PNJ o grupo neutral (incluyendo al grupo de PJ, si lo aceptan)."
  }
 },
 "estados": {
  "sangrado": {
   "name": "Sangrado",
   "ud": "Ud6",
   "txt": "1d4 Cortante por turno. Las curaciones recibidas solo restauran la mitad de sus PV."
  },
  "desgarro": {
   "name": "Desgarro",
   "ud": "Ud6",
   "txt": "2 Cortante (fijo) por turno. −1 de Armadura del afectado mientras dure (mínimo 0). Si no lleva armadura, en su lugar −1 a su Guardia."
  },
  "trauma": {
   "name": "Trauma",
   "ud": "Ud4",
   "txt": "1d6 Contundente por turno. Desventaja en todas las tiradas que usen FUE."
  },
  "envenenado": {
   "name": "Envenenado",
   "ud": "Ud8",
   "txt": "1d6 Veneno por turno. Desventaja en tiradas de ataque y de habilidad mientras dure. Si un efecto lo impone sin daño ni Ud, aplica solo la Desventaja durante lo que ese efecto indique."
  },
  "ignicion": {
   "name": "Ignición",
   "ud": "Ud6",
   "txt": "1d10 Fuego por turno. Se tira aparte: con 1–2 termina. Cada turno que sigue activa: +1 daño acumulativo (turno 3: 1d10+2; turno 5: 1d10+4)."
  },
  "ralentizado": {
   "name": "Ralentizado",
   "ud": "Ud6",
   "txt": "Movimiento reducido a la mitad. Sin Paso Táctico gratuito."
  },
  "aturdido": {
   "name": "Aturdido",
   "ud": "Ud4",
   "txt": "No puede moverse, gastar PA, hablar ni usar Reacciones, y falla las Salvaciones de FUE y DES. Los ataques contra él tienen Ventaja, y todo impacto cuerpo a cuerpo desde 5 pies es Golpe Crítico automático. (El estado de control más severo del sistema.)"
  },
  "conmocionado": {
   "name": "Conmocionado",
   "ud": "Ud6",
   "txt": "Desventaja en la primera tirada de ataque, habilidad o Salvación de cada turno, sea el suyo o el de otro. Las fuentes de Ventaja del afectado quedan canceladas mientras dure."
  },
  "cegado": {
   "name": "Cegado",
   "ud": "Ud4",
   "txt": "Desventaja en todos los ataques propios. Ventaja para todos los que ataquen al afectado. Falla tiradas que dependan de la vista."
  },
  "aterrado": {
   "name": "Aterrado",
   "ud": "",
   "txt": "Desventaja en todas sus tiradas mientras perciba la fuente de su miedo. No puede acercarse voluntariamente a ella ni tomar acciones cuyo único fin sea aproximarse. (Su Ud, el de la fuente.)"
  },
  "paralizado": {
   "name": "Paralizado",
   "ud": "Ud4",
   "txt": "No puede moverse ni hacer nada físico (atacar, maniobrar, usar objetos) ni usar Reacciones; sí puede hablar, hacer Salvaciones y usar Trucos y Axiomas que no exijan moverse. Los ataques contra él tienen Ventaja."
  },
  "apresado": {
   "name": "Apresado",
   "ud": "",
   "txt": "Velocidad 0; Desventaja en sus ataques y en sus Salvaciones de DES; quien lo ataque tiene Ventaja. Termina si el captor queda Aturdido, Paralizado o Inconsciente, si suelta la presa o si el apresado escapa (1 PA, Proeza Física vs. CD 8 + PB + ½ Nivel + MOD FUE del captor, o la tirada que indique el efecto)."
  },
  "encantado": {
   "name": "Encantado",
   "ud": "",
   "txt": "El afectado percibe a la fuente como un aliado de confianza y no puede atacarla; recibir daño de la fuente o de sus aliados rompe el efecto. Se resuelve con Salvación SAB. No es un estado de Aflicción: dura lo que el efecto indique, no se degrada con Ud."
  },
  "ensordecido": {
   "name": "Ensordecido",
   "ud": "",
   "txt": "No oye. Desventaja en Percepción auditiva, falla automática en las tiradas que dependan del oído e inmunidad a los efectos basados en el sonido. Dura lo que el efecto indique."
  },
  "maldito": {
   "name": "Maldito",
   "ud": "",
   "txt": "Desventaja en un tipo de tirada, determinado por la fuente que lo impuso; por defecto, las Salvaciones. Si la fuente le asigna un Ud, cuenta para el Ud de Aflicción como los demás estados, pero ningún efecto que retire estados ordinarios lo elimina: hace falta un Axioma o un procedimiento específico contra maldiciones. No lo confundas con las maldiciones de campaña de la Guía del Director, que no tienen Ud y no caducan."
  },
  "petrificado": {
   "name": "Petrificado",
   "ud": "Ud4",
   "txt": "Como Aturdido, y además Resistencia a todo el daño e inmunidad a Veneno y Enfermedad mientras dure. Ud4 por defecto. Solo lo imponen efectos poderosos, y siempre con Salvación."
  },
  "derribado": {
   "name": "Derribado",
   "ud": "",
   "txt": "Desventaja en todos sus ataques y Salvaciones de DES; los aliados adyacentes atacan con Ventaja; levantarse cuesta 1 PA."
  },
  "desprevenido": {
   "name": "Desprevenido",
   "ud": "",
   "txt": "Quien recibe un ataque sin haber podido prepararse (sorpresa, sueño, atacante oculto). Su Guardia pierde el PB y el escudo, no el atributo ni la Armadura. En una sorpresa dura hasta el final de su primer turno; frente a un atacante oculto, solo su primer ataque."
  }
 }
};
