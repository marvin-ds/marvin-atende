var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/qrcode/lib/can-promise.js
var require_can_promise = __commonJS({
  "node_modules/qrcode/lib/can-promise.js"(exports, module) {
    module.exports = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
  }
});

// node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "node_modules/qrcode/lib/core/utils.js"(exports) {
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = function getSymbolSize(version) {
      if (!version) throw new Error('"version" cannot be null or undefined');
      if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
      return version * 4 + 17;
    };
    exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
      return CODEWORDS_COUNT[version];
    };
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    };
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    exports.isValid = function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    };
    exports.from = function from(value2, defaultValue) {
      if (exports.isValid(value2)) {
        return value2;
      }
      try {
        return fromString(value2);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    BitBuffer.prototype = {
      get: function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      },
      put: function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module.exports = BitBuffer;
  }
});

// node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    BitMatrix.prototype.set = function(row, col, value2, reserved) {
      const index = row * this.size + col;
      this.data[index] = value2;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value2) {
      this.data[row * this.size + col] ^= value2;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module.exports = BitMatrix;
  }
});

// node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    exports.getRowColCoords = function getRowColCoords(version) {
      if (version === 1) return [];
      const posCount = Math.floor(version / 7) + 2;
      const size = getSymbolSize(version);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    };
    exports.getPositions = function getPositions(version) {
      const coords = [];
      const pos = exports.getRowColCoords(version);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    };
  }
});

// node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = function getPositions(version) {
      const size = getSymbolSize(version);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    };
  }
});

// node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    };
    exports.from = function from(value2) {
      return exports.isValid(value2) ? parseInt(value2, 10) : void 0;
    };
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size; col++) {
          let module2 = data.get(row, col);
          if (module2 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module2;
            sameCountCol = 1;
          }
          module2 = data.get(col, row);
          if (module2 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module2;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    };
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      const size = data.size;
      let points = 0;
      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    };
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    };
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    };
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    exports.applyMask = function applyMask(pattern, data) {
      const size = data.size;
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
  }
});

// node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "node_modules/qrcode/lib/core/galois-field.js"(exports) {
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();
    exports.log = function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    };
    exports.exp = function exp(n) {
      return EXP_TABLE[n];
    };
    exports.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
  }
});

// node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "node_modules/qrcode/lib/core/polynomial.js"(exports) {
    var GF = require_galois_field();
    exports.mul = function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    };
    exports.mod = function mod(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    };
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    };
  }
});

// node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };
    ReedSolomonEncoder.prototype.encode = function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    };
    module.exports = ReedSolomonEncoder;
  }
});

// node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "node_modules/qrcode/lib/core/version-check.js"(exports) {
    exports.isValid = function isValid(version) {
      return !isNaN(version) && version >= 1 && version <= 40;
    };
  }
});

// node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "node_modules/qrcode/lib/core/regex.js"(exports) {
    var numeric = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };
    exports.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };
    exports.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
  }
});

// node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "node_modules/qrcode/lib/core/mode.js"(exports) {
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid version: " + version);
      }
      if (version >= 1 && version < 10) return mode.ccBits[0];
      else if (version < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    };
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    };
    exports.toString = function toString(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    };
    exports.isValid = function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    exports.from = function from(value2, defaultValue) {
      if (exports.isValid(value2)) {
        return value2;
      }
      try {
        return fromString(value2);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "node_modules/qrcode/lib/core/version.js"(exports) {
    var Utils = require_utils();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    function getReservedBitsCount(mode, version) {
      return Mode.getCharCountIndicator(mode, version) + 4;
    }
    function getTotalBitsFromDataArray(segments, version) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    exports.from = function from(value2, defaultValue) {
      if (VersionCheck.isValid(value2)) {
        return parseInt(value2, 10);
      }
      return defaultValue;
    };
    exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };
    exports.getEncodedBits = function getEncodedBits(version) {
      if (!VersionCheck.isValid(version) || version < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version << 12 | d;
    };
  }
});

// node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "node_modules/qrcode/lib/core/format-info.js"(exports) {
    var Utils = require_utils();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    };
  }
});

// node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };
    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };
    NumericData.prototype.write = function write(bitBuffer) {
      let i, group, value2;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value2 = parseInt(group, 10);
        bitBuffer.put(value2, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value2 = parseInt(group, 10);
        bitBuffer.put(value2, remainingNum * 3 + 1);
      }
    };
    module.exports = NumericData;
  }
});

// node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };
    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };
    AlphanumericData.prototype.write = function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value2 = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value2 += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value2, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };
    module.exports = AlphanumericData;
  }
});

// node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };
    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module.exports = ByteData;
  }
});

// node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
    var Mode = require_mode();
    var Utils = require_utils();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };
    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value2 = Utils.toSJIS(this.data[i]);
        if (value2 >= 33088 && value2 <= 40956) {
          value2 -= 33088;
        } else if (value2 >= 57408 && value2 <= 60351) {
          value2 -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value2 = (value2 >>> 8 & 255) * 192 + (value2 & 255);
        bitBuffer.put(value2, 13);
      }
    };
    module.exports = KanjiData;
  }
});

// node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "node_modules/dijkstrajs/dijkstra.js"(exports, module) {
    "use strict";
    var dijkstra = {
      single_source_shortest_paths: function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      },
      extract_shortest_path_from_predecessor_list: function(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },
      find_path: function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(
          predecessors,
          d
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(opts) {
          var T = dijkstra.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },
        default_sorter: function(a, b) {
          return a.cost - b.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(value2, cost) {
          var item = { value: value2, cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    if (typeof module !== "undefined") {
      module.exports = dijkstra;
    }
  }
});

// node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "node_modules/qrcode/lib/core/segments.js"(exports) {
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    function buildGraph(nodes, version) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return { map: graph, table };
    }
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    exports.fromArray = function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    };
    exports.fromString = function fromString(data, version) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version);
      const path = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    };
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils.isKanjiModeEnabled())
      );
    };
  }
});

// node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "node_modules/qrcode/lib/core/qrcode.js"(exports) {
    var Utils = require_utils();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value2 = r % 2 === 0;
        matrix.set(r, 6, value2, true);
        matrix.set(6, r, value2, true);
      }
    }
    function setupAlignmentPattern(matrix, version) {
      const pos = AlignmentPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupVersionInfo(matrix, version) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version);
      let row, col, mod;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;
        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod;
      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    function createData(version, errorCorrectionLevel, segments) {
      const buffer = new BitBuffer();
      segments.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version, errorCorrectionLevel);
    }
    function createCodewords(bitBuffer, version, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version) {
        version = bestVersion;
      } else if (version < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version >= 7) {
        setupVersionInfo(modules, version);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel)
        );
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    exports.create = function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version, errorCorrectionLevel, mask);
    };
  }
});

// node_modules/qrcode/lib/renderer/utils.js
var require_utils2 = __commonJS({
  "node_modules/qrcode/lib/renderer/utils.js"(exports) {
    function hex2rgba(hex) {
      if (typeof hex === "number") {
        hex = hex.toString();
      }
      if (typeof hex !== "string") {
        throw new Error("Color should be defined as hex string");
      }
      let hexCode = hex.slice().replace("#", "").split("");
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error("Invalid hex color: " + hex);
      }
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
          return [c, c];
        }));
      }
      if (hexCode.length === 6) hexCode.push("F", "F");
      const hexValue = parseInt(hexCode.join(""), 16);
      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: "#" + hexCode.slice(0, 6).join("")
      };
    }
    exports.getOptions = function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};
      const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
      const width = options.width && options.width >= 21 ? options.width : void 0;
      const scale = options.scale || 4;
      return {
        width,
        scale: width ? 4 : scale,
        margin,
        color: {
          dark: hex2rgba(options.color.dark || "#000000ff"),
          light: hex2rgba(options.color.light || "#ffffffff")
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    };
    exports.getScale = function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    };
    exports.getImageWidth = function getImageWidth(qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    };
    exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
      const size = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size, opts);
      const symbolSize = Math.floor((size + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];
      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;
          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
          }
          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    };
  }
});

// node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = __commonJS({
  "node_modules/qrcode/lib/renderer/canvas.js"(exports) {
    var Utils = require_utils2();
    function clearCanvas(ctx, canvas, size) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!canvas.style) canvas.style = {};
      canvas.height = size;
      canvas.width = size;
      canvas.style.height = size + "px";
      canvas.style.width = size + "px";
    }
    function getCanvasElement() {
      try {
        return document.createElement("canvas");
      } catch (e) {
        throw new Error("You need to specify a canvas element");
      }
    }
    exports.render = function render(qrData, canvas, options) {
      let opts = options;
      let canvasEl = canvas;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!canvas) {
        canvasEl = getCanvasElement();
      }
      opts = Utils.getOptions(opts);
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      const ctx = canvasEl.getContext("2d");
      const image = ctx.createImageData(size, size);
      Utils.qrToImageData(image.data, qrData, opts);
      clearCanvas(ctx, canvasEl, size);
      ctx.putImageData(image, 0, 0);
      return canvasEl;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
      let opts = options;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!opts) opts = {};
      const canvasEl = exports.render(qrData, canvas, opts);
      const type = opts.type || "image/png";
      const rendererOpts = opts.rendererOpts || {};
      return canvasEl.toDataURL(type, rendererOpts.quality);
    };
  }
});

// node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = __commonJS({
  "node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
    var Utils = require_utils2();
    function getColorAttrib(color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';
      return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }
    function svgCmd(cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== "undefined") str += " " + y;
      return str;
    }
    function qrToPath(data, size, margin) {
      let path = "";
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size);
        const row = Math.floor(i / size);
        if (!col && !newRow) newRow = true;
        if (data[i]) {
          lineLength++;
          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
            moveBy = 0;
            newRow = false;
          }
          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd("h", lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }
      return path;
    }
    exports.render = function render(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size + opts.margin * 2;
      const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
      const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
      const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
      const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
      const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
      if (typeof cb === "function") {
        cb(null, svgTag);
      }
      return svgTag;
    };
  }
});

// node_modules/qrcode/lib/browser.js
var require_browser = __commonJS({
  "node_modules/qrcode/lib/browser.js"(exports) {
    var canPromise = require_can_promise();
    var QRCode = require_qrcode();
    var CanvasRenderer = require_canvas();
    var SvgRenderer = require_svg_tag();
    function renderCanvas(renderFunc, canvas, text, opts, cb) {
      const args = [].slice.call(arguments, 1);
      const argsNum = args.length;
      const isLastArgCb = typeof args[argsNum - 1] === "function";
      if (!isLastArgCb && !canPromise()) {
        throw new Error("Callback required as last argument");
      }
      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 2) {
          cb = text;
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === "undefined") {
            cb = opts;
            opts = void 0;
          } else {
            cb = opts;
            opts = text;
            text = canvas;
            canvas = void 0;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 1) {
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text;
          text = canvas;
          canvas = void 0;
        }
        return new Promise(function(resolve, reject) {
          try {
            const data = QRCode.create(text, opts);
            resolve(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode.create(text, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }
    exports.create = QRCode.create;
    exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
    exports.toString = renderCanvas.bind(null, function(data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
  }
});

// node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  "node_modules/base64-js/index.js"(exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    var i;
    var len;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len2 = b64.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1) validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts2 = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts2.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts2.push(
          lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
        );
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts2.push(
          lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
        );
      }
      return parts2.join("");
    }
  }
});

// node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  "node_modules/ieee754/index.js"(exports) {
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value2, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value2 < 0 || value2 === 0 && 1 / value2 < 0 ? 1 : 0;
      value2 = Math.abs(value2);
      if (isNaN(value2) || value2 === Infinity) {
        m = isNaN(value2) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value2) / Math.LN2);
        if (value2 * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value2 += rt / c;
        } else {
          value2 += rt * Math.pow(2, 1 - eBias);
        }
        if (value2 * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value2 * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value2 * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer[offset + i - d] |= s * 128;
    };
  }
});

// node_modules/buffer/index.js
var require_buffer = __commonJS({
  "node_modules/buffer/index.js"(exports) {
    "use strict";
    var base64 = require_base64_js();
    var ieee754 = require_ieee754();
    var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
    exports.Buffer = Buffer2;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    var K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
    }
    function typedArraySupport() {
      try {
        const arr = new Uint8Array(1);
        const proto = { foo: function() {
          return 42;
        } };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    Object.defineProperty(Buffer2.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer2.isBuffer(this)) return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer2.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer2.isBuffer(this)) return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      }
      const buf = new Uint8Array(length);
      Object.setPrototypeOf(buf, Buffer2.prototype);
      return buf;
    }
    function Buffer2(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        }
        return allocUnsafe(arg);
      }
      return from(arg, encodingOrOffset, length);
    }
    Buffer2.poolSize = 8192;
    function from(value2, encodingOrOffset, length) {
      if (typeof value2 === "string") {
        return fromString(value2, encodingOrOffset);
      }
      if (ArrayBuffer.isView(value2)) {
        return fromArrayView(value2);
      }
      if (value2 == null) {
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value2
        );
      }
      if (isInstance(value2, ArrayBuffer) || value2 && isInstance(value2.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value2, encodingOrOffset, length);
      }
      if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value2, SharedArrayBuffer) || value2 && isInstance(value2.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value2, encodingOrOffset, length);
      }
      if (typeof value2 === "number") {
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      }
      const valueOf = value2.valueOf && value2.valueOf();
      if (valueOf != null && valueOf !== value2) {
        return Buffer2.from(valueOf, encodingOrOffset, length);
      }
      const b = fromObject(value2);
      if (b) return b;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value2[Symbol.toPrimitive] === "function") {
        return Buffer2.from(value2[Symbol.toPrimitive]("string"), encodingOrOffset, length);
      }
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value2
      );
    }
    Buffer2.from = function(value2, encodingOrOffset, length) {
      return from(value2, encodingOrOffset, length);
    };
    Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer2, Uint8Array);
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }
    function alloc(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    Buffer2.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer2.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer2.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer2.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      const length = byteLength(string, encoding) | 0;
      let buf = createBuffer(length);
      const actual = buf.write(string, encoding);
      if (actual !== length) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    function fromArrayLike(array) {
      const length = array.length < 0 ? 0 : checked(array.length) | 0;
      const buf = createBuffer(length);
      for (let i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
      }
      return buf;
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        const copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
      }
      return fromArrayLike(arrayView);
    }
    function fromArrayBuffer(array, byteOffset, length) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      let buf;
      if (byteOffset === void 0 && length === void 0) {
        buf = new Uint8Array(array);
      } else if (length === void 0) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      }
      Object.setPrototypeOf(buf, Buffer2.prototype);
      return buf;
    }
    function fromObject(obj) {
      if (Buffer2.isBuffer(obj)) {
        const len = checked(obj.length) | 0;
        const buf = createBuffer(len);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }
        return fromArrayLike(obj);
      }
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }
    function checked(length) {
      if (length >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length | 0;
    }
    function SlowBuffer(length) {
      if (+length != length) {
        length = 0;
      }
      return Buffer2.alloc(+length);
    }
    Buffer2.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer2.prototype;
    };
    Buffer2.compare = function compare(a, b) {
      if (isInstance(a, Uint8Array)) a = Buffer2.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array)) b = Buffer2.from(b, b.offset, b.byteLength);
      if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      }
      if (a === b) return 0;
      let x = a.length;
      let y = b.length;
      for (let i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    Buffer2.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer2.concat = function concat(list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer2.alloc(0);
      }
      let i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }
      const buffer = Buffer2.allocUnsafe(length);
      let pos = 0;
      for (i = 0; i < list.length; ++i) {
        let buf = list[i];
        if (isInstance(buf, Uint8Array)) {
          if (pos + buf.length > buffer.length) {
            if (!Buffer2.isBuffer(buf)) buf = Buffer2.from(buf);
            buf.copy(buffer, pos);
          } else {
            Uint8Array.prototype.set.call(
              buffer,
              buf,
              pos
            );
          }
        } else if (!Buffer2.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf.copy(buffer, pos);
        }
        pos += buf.length;
      }
      return buffer;
    };
    function byteLength(string, encoding) {
      if (Buffer2.isBuffer(string)) {
        return string.length;
      }
      if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength;
      }
      if (typeof string !== "string") {
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
        );
      }
      const len = string.length;
      const mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0) return 0;
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len;
          case "utf8":
          case "utf-8":
            return utf8ToBytes(string).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len * 2;
          case "hex":
            return len >>> 1;
          case "base64":
            return base64ToBytes(string).length;
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes(string).length;
            }
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer2.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      let loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding) encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer2.prototype._isBuffer = true;
    function swap(b, n, m) {
      const i = b[n];
      b[n] = b[m];
      b[m] = i;
    }
    Buffer2.prototype.swap16 = function swap16() {
      const len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (let i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer2.prototype.swap32 = function swap32() {
      const len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (let i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer2.prototype.swap64 = function swap64() {
      const len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (let i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer2.prototype.toString = function toString() {
      const length = this.length;
      if (length === 0) return "";
      if (arguments.length === 0) return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
    Buffer2.prototype.equals = function equals(b) {
      if (!Buffer2.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
      if (this === b) return true;
      return Buffer2.compare(this, b) === 0;
    };
    Buffer2.prototype.inspect = function inspect() {
      let str = "";
      const max = exports.INSPECT_MAX_BYTES;
      str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max) str += " ... ";
      return "<Buffer " + str + ">";
    };
    if (customInspectSymbol) {
      Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
    }
    Buffer2.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer2.from(target, target.offset, target.byteLength);
      }
      if (!Buffer2.isBuffer(target)) {
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
        );
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target) return 0;
      let x = thisEnd - thisStart;
      let y = end - start;
      const len = Math.min(x, y);
      const thisCopy = this.slice(thisStart, thisEnd);
      const targetCopy = target.slice(start, end);
      for (let i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
      if (buffer.length === 0) return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer.length - 1;
      }
      if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
      if (byteOffset >= buffer.length) {
        if (dir) return -1;
        else byteOffset = buffer.length - 1;
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
      }
      if (typeof val === "string") {
        val = Buffer2.from(val, encoding);
      }
      if (Buffer2.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      let indexSize = 1;
      let arrLength = arr.length;
      let valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read(buf, i2) {
        if (indexSize === 1) {
          return buf[i2];
        } else {
          return buf.readUInt16BE(i2 * indexSize);
        }
      }
      let i;
      if (dir) {
        let foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          let found = true;
          for (let j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
          }
          if (found) return i;
        }
      }
      return -1;
    }
    Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string, offset, length) {
      offset = Number(offset) || 0;
      const remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      const strLen = string.length;
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      let i;
      for (i = 0; i < length; ++i) {
        const parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
      }
      return i;
    }
    function utf8Write(buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
    }
    function asciiWrite(buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length);
    }
    function base64Write(buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length);
    }
    function ucs2Write(buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
    }
    Buffer2.prototype.write = function write(string, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
          length = length >>> 0;
          if (encoding === void 0) encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      const remaining = this.length - offset;
      if (length === void 0 || length > remaining) length = remaining;
      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding) encoding = "utf8";
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, string, offset, length);
          case "base64":
            return base64Write(this, string, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer2.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      const res = [];
      let i = start;
      while (i < end) {
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          let secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    var MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      const len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      let res = "";
      let i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res;
    }
    function asciiSlice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret;
    }
    function hexSlice(buf, start, end) {
      const len = buf.length;
      if (!start || start < 0) start = 0;
      if (!end || end < 0 || end > len) end = len;
      let out = "";
      for (let i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
      }
      return out;
    }
    function utf16leSlice(buf, start, end) {
      const bytes = buf.slice(start, end);
      let res = "";
      for (let i = 0; i < bytes.length - 1; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res;
    }
    Buffer2.prototype.slice = function slice(start, end) {
      const len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start) end = start;
      const newBuf = this.subarray(start, end);
      Object.setPrototypeOf(newBuf, Buffer2.prototype);
      return newBuf;
    };
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
      if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      let val = this[offset + --byteLength2];
      let mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer2.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
      const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
      return BigInt(lo) + (BigInt(hi) << BigInt(32));
    });
    Buffer2.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
      return (BigInt(hi) << BigInt(32)) + BigInt(lo);
    });
    Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let i = byteLength2;
      let mul = 1;
      let val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128)) return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer2.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
      return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
    });
    Buffer2.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = (first << 24) + // Overflow
      this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
    });
    Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, true, 23, 4);
    };
    Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, false, 23, 4);
    };
    Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, true, 52, 8);
    };
    Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value2, offset, ext, max, min) {
      if (!Buffer2.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value2 > max || value2 < min) throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
    }
    Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE = function writeUIntLE(value2, offset, byteLength2, noAssert) {
      value2 = +value2;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value2, offset, byteLength2, maxBytes, 0);
      }
      let mul = 1;
      let i = 0;
      this[offset] = value2 & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value2 / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE = function writeUIntBE(value2, offset, byteLength2, noAssert) {
      value2 = +value2;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value2, offset, byteLength2, maxBytes, 0);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      this[offset + i] = value2 & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value2 / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 = function writeUInt8(value2, offset, noAssert) {
      value2 = +value2;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value2, offset, 1, 255, 0);
      this[offset] = value2 & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value2, offset, noAssert) {
      value2 = +value2;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value2, offset, 2, 65535, 0);
      this[offset] = value2 & 255;
      this[offset + 1] = value2 >>> 8;
      return offset + 2;
    };
    Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value2, offset, noAssert) {
      value2 = +value2;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value2, offset, 2, 65535, 0);
      this[offset] = value2 >>> 8;
      this[offset + 1] = value2 & 255;
      return offset + 2;
    };
    Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value2, offset, noAssert) {
      value2 = +value2;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value2, offset, 4, 4294967295, 0);
      this[offset + 3] = value2 >>> 24;
      this[offset + 2] = value2 >>> 16;
      this[offset + 1] = value2 >>> 8;
      this[offset] = value2 & 255;
      return offset + 4;
    };
    Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value2, offset, noAssert) {
      value2 = +value2;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value2, offset, 4, 4294967295, 0);
      this[offset] = value2 >>> 24;
      this[offset + 1] = value2 >>> 16;
      this[offset + 2] = value2 >>> 8;
      this[offset + 3] = value2 & 255;
      return offset + 4;
    };
    function wrtBigUInt64LE(buf, value2, offset, min, max) {
      checkIntBI(value2, min, max, buf, offset, 7);
      let lo = Number(value2 & BigInt(4294967295));
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      let hi = Number(value2 >> BigInt(32) & BigInt(4294967295));
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      return offset;
    }
    function wrtBigUInt64BE(buf, value2, offset, min, max) {
      checkIntBI(value2, min, max, buf, offset, 7);
      let lo = Number(value2 & BigInt(4294967295));
      buf[offset + 7] = lo;
      lo = lo >> 8;
      buf[offset + 6] = lo;
      lo = lo >> 8;
      buf[offset + 5] = lo;
      lo = lo >> 8;
      buf[offset + 4] = lo;
      let hi = Number(value2 >> BigInt(32) & BigInt(4294967295));
      buf[offset + 3] = hi;
      hi = hi >> 8;
      buf[offset + 2] = hi;
      hi = hi >> 8;
      buf[offset + 1] = hi;
      hi = hi >> 8;
      buf[offset] = hi;
      return offset + 8;
    }
    Buffer2.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value2, offset = 0) {
      return wrtBigUInt64LE(this, value2, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer2.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value2, offset = 0) {
      return wrtBigUInt64BE(this, value2, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer2.prototype.writeIntLE = function writeIntLE(value2, offset, byteLength2, noAssert) {
      value2 = +value2;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value2, offset, byteLength2, limit - 1, -limit);
      }
      let i = 0;
      let mul = 1;
      let sub = 0;
      this[offset] = value2 & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value2 < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value2 / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeIntBE = function writeIntBE(value2, offset, byteLength2, noAssert) {
      value2 = +value2;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value2, offset, byteLength2, limit - 1, -limit);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      let sub = 0;
      this[offset + i] = value2 & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value2 < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value2 / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeInt8 = function writeInt8(value2, offset, noAssert) {
      value2 = +value2;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value2, offset, 1, 127, -128);
      if (value2 < 0) value2 = 255 + value2 + 1;
      this[offset] = value2 & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeInt16LE = function writeInt16LE(value2, offset, noAssert) {
      value2 = +value2;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value2, offset, 2, 32767, -32768);
      this[offset] = value2 & 255;
      this[offset + 1] = value2 >>> 8;
      return offset + 2;
    };
    Buffer2.prototype.writeInt16BE = function writeInt16BE(value2, offset, noAssert) {
      value2 = +value2;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value2, offset, 2, 32767, -32768);
      this[offset] = value2 >>> 8;
      this[offset + 1] = value2 & 255;
      return offset + 2;
    };
    Buffer2.prototype.writeInt32LE = function writeInt32LE(value2, offset, noAssert) {
      value2 = +value2;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value2, offset, 4, 2147483647, -2147483648);
      this[offset] = value2 & 255;
      this[offset + 1] = value2 >>> 8;
      this[offset + 2] = value2 >>> 16;
      this[offset + 3] = value2 >>> 24;
      return offset + 4;
    };
    Buffer2.prototype.writeInt32BE = function writeInt32BE(value2, offset, noAssert) {
      value2 = +value2;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value2, offset, 4, 2147483647, -2147483648);
      if (value2 < 0) value2 = 4294967295 + value2 + 1;
      this[offset] = value2 >>> 24;
      this[offset + 1] = value2 >>> 16;
      this[offset + 2] = value2 >>> 8;
      this[offset + 3] = value2 & 255;
      return offset + 4;
    };
    Buffer2.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value2, offset = 0) {
      return wrtBigUInt64LE(this, value2, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    Buffer2.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value2, offset = 0) {
      return wrtBigUInt64BE(this, value2, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function checkIEEE754(buf, value2, offset, ext, max, min) {
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
      if (offset < 0) throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value2, offset, littleEndian, noAssert) {
      value2 = +value2;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value2, offset, 4, 34028234663852886e22, -34028234663852886e22);
      }
      ieee754.write(buf, value2, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer2.prototype.writeFloatLE = function writeFloatLE(value2, offset, noAssert) {
      return writeFloat(this, value2, offset, true, noAssert);
    };
    Buffer2.prototype.writeFloatBE = function writeFloatBE(value2, offset, noAssert) {
      return writeFloat(this, value2, offset, false, noAssert);
    };
    function writeDouble(buf, value2, offset, littleEndian, noAssert) {
      value2 = +value2;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value2, offset, 8, 17976931348623157e292, -17976931348623157e292);
      }
      ieee754.write(buf, value2, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value2, offset, noAssert) {
      return writeDouble(this, value2, offset, true, noAssert);
    };
    Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value2, offset, noAssert) {
      return writeDouble(this, value2, offset, false, noAssert);
    };
    Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer2.isBuffer(target)) throw new TypeError("argument should be a Buffer");
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target.length) targetStart = target.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start;
      if (end === start) return 0;
      if (target.length === 0 || this.length === 0) return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
      if (end < 0) throw new RangeError("sourceEnd out of bounds");
      if (end > this.length) end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      const len = end - start;
      if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start, end);
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, end),
          targetStart
        );
      }
      return len;
    };
    Buffer2.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          const code = val.charCodeAt(0);
          if (encoding === "utf8" && code < 128 || encoding === "latin1") {
            val = code;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      } else if (typeof val === "boolean") {
        val = Number(val);
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val) val = 0;
      let i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        const bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
        const len = bytes.length;
        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }
      return this;
    };
    var errors = {};
    function E(sym, getMessage, Base) {
      errors[sym] = class NodeError extends Base {
        constructor() {
          super();
          Object.defineProperty(this, "message", {
            value: getMessage.apply(this, arguments),
            writable: true,
            configurable: true
          });
          this.name = `${this.name} [${sym}]`;
          this.stack;
          delete this.name;
        }
        get code() {
          return sym;
        }
        set code(value2) {
          Object.defineProperty(this, "code", {
            configurable: true,
            enumerable: true,
            value: value2,
            writable: true
          });
        }
        toString() {
          return `${this.name} [${sym}]: ${this.message}`;
        }
      };
    }
    E(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(name) {
        if (name) {
          return `${name} is outside of buffer bounds`;
        }
        return "Attempt to access memory outside buffer bounds";
      },
      RangeError
    );
    E(
      "ERR_INVALID_ARG_TYPE",
      function(name, actual) {
        return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
      },
      TypeError
    );
    E(
      "ERR_OUT_OF_RANGE",
      function(str, range, input) {
        let msg = `The value of "${str}" is out of range.`;
        let received = input;
        if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
          received = addNumericalSeparator(String(input));
        } else if (typeof input === "bigint") {
          received = String(input);
          if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
            received = addNumericalSeparator(received);
          }
          received += "n";
        }
        msg += ` It must be ${range}. Received ${received}`;
        return msg;
      },
      RangeError
    );
    function addNumericalSeparator(val) {
      let res = "";
      let i = val.length;
      const start = val[0] === "-" ? 1 : 0;
      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`;
      }
      return `${val.slice(0, i)}${res}`;
    }
    function checkBounds(buf, offset, byteLength2) {
      validateNumber(offset, "offset");
      if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
        boundsError(offset, buf.length - (byteLength2 + 1));
      }
    }
    function checkIntBI(value2, min, max, buf, offset, byteLength2) {
      if (value2 > max || value2 < min) {
        const n = typeof min === "bigint" ? "n" : "";
        let range;
        if (byteLength2 > 3) {
          if (min === 0 || min === BigInt(0)) {
            range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
          } else {
            range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
          }
        } else {
          range = `>= ${min}${n} and <= ${max}${n}`;
        }
        throw new errors.ERR_OUT_OF_RANGE("value", range, value2);
      }
      checkBounds(buf, offset, byteLength2);
    }
    function validateNumber(value2, name) {
      if (typeof value2 !== "number") {
        throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value2);
      }
    }
    function boundsError(value2, length, type) {
      if (Math.floor(value2) !== value2) {
        validateNumber(value2, type);
        throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value2);
      }
      if (length < 0) {
        throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
      }
      throw new errors.ERR_OUT_OF_RANGE(
        type || "offset",
        `>= ${type ? 1 : 0} and <= ${length}`,
        value2
      );
    }
    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = str.split("=")[0];
      str = str.trim().replace(INVALID_BASE64_RE, "");
      if (str.length < 2) return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    function utf8ToBytes(string, units) {
      units = units || Infinity;
      let codePoint;
      const length = string.length;
      let leadSurrogate = null;
      const bytes = [];
      for (let i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            } else if (i + 1 === length) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0) break;
          bytes.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0) break;
          bytes.push(
            codePoint >> 6 | 192,
            codePoint & 63 | 128
          );
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0) break;
          bytes.push(
            codePoint >> 12 | 224,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0) break;
          bytes.push(
            codePoint >> 18 | 240,
            codePoint >> 12 & 63 | 128,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes;
    }
    function asciiToBytes(str) {
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      let c, hi, lo;
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }
    function blitBuffer(src, dst, offset, length) {
      let i;
      for (i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
      }
      return i;
    }
    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }
    function numberIsNaN(obj) {
      return obj !== obj;
    }
    var hexSliceLookupTable = (function() {
      const alphabet = "0123456789abcdef";
      const table = new Array(256);
      for (let i = 0; i < 16; ++i) {
        const i16 = i * 16;
        for (let j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i] + alphabet[j];
        }
      }
      return table;
    })();
    function defineBigIntMethod(fn) {
      return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
    }
    function BufferBigIntNotDefined() {
      throw new Error("BigInt not supported");
    }
  }
});

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/buffer.js
var bufferToFormData = (arrayBuffer, contentType) => {
  const response = new Response(arrayBuffer, {
    headers: {
      // Normalize the media type (case-insensitive) while keeping parameters like the boundary
      "Content-Type": contentType.replace(/^[^;]+/, (mediaType) => mediaType.toLowerCase())
    }
  });
  return response.formData();
};

// node_modules/hono/dist/utils/body.js
var MAX_NESTING_DEPTH = 32;
var MAX_NESTED_OBJECTS = 1e4;
var isRawRequest = (request) => "headers" in request;
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const contentType = headers.get("Content-Type");
  const mediaType = contentType?.split(";")[0].trim().toLowerCase();
  if (mediaType === "multipart/form-data" || mediaType === "application/x-www-form-urlencoded") {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  if (!isRawRequest(request) && request.bodyCache.formData) {
    return convertFormDataToBodyData(
      await request.bodyCache.formData,
      options
    );
  }
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const arrayBuffer = await request.arrayBuffer();
  const formDataPromise = bufferToFormData(arrayBuffer, headers.get("Content-Type") || "");
  if (!isRawRequest(request)) {
    request.bodyCache.formData = formDataPromise;
  }
  const formData = await formDataPromise;
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  const nestingState = { count: 0 };
  formData.forEach((value2, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value2;
    } else {
      handleParsingAllValues(form, key, value2);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value2]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value2, nestingState);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value2) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value2);
    } else {
      form[key] = [form[key], value2];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value2;
    } else {
      form[key] = [value2];
    }
  }
};
var handleParsingNestedValues = (form, key, value2, state) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".", MAX_NESTING_DEPTH + 2);
  if (keys.length > MAX_NESTING_DEPTH + 1) {
    throwNestingLimitExceeded();
  }
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value2;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        if (state.count++ >= MAX_NESTED_OBJECTS) {
          throwNestingLimitExceeded();
        }
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};
var throwNestingLimitExceeded = () => {
  throw new Error("Nesting limit exceeded");
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (segment.charCodeAt(segment.length - 1) === 63) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.slice(0, -1);
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var tryDecodeURIComponent = (str) => str.indexOf("%") !== -1 ? tryDecode(str, decodeURIComponent_) : str;
var _decodeURI = (value2) => {
  if (value2.indexOf("+") !== -1) {
    value2 = value2.replace(/\+/g, " ");
  }
  return tryDecodeURIComponent(value2);
};
var _getQueryParam = (url, key, multiple) => {
  const hashIndex = url.indexOf("#", 8);
  if (hashIndex !== -1) {
    url = url.slice(0, hashIndex);
  }
  let encoded;
  if (!multiple && key && key.indexOf("%") === -1 && key.indexOf("+") === -1) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = /* @__PURE__ */ Object.create(null);
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value2;
    if (valueIndex === -1) {
      value2 = "";
    } else {
      value2 = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value2 = _decodeURI(value2);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value2);
    } else {
      results[name] ??= value2;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var HonoRequest = class {
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex]?.[1][key];
    const param = this.#getParamValue(paramKey);
    return param && tryDecodeURIComponent(param);
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex]?.[1] ?? {});
    for (const key of keys) {
      const value2 = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value2 !== void 0) {
        decoded[key] = tryDecodeURIComponent(value2);
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = /* @__PURE__ */ Object.create(null);
    this.raw.headers.forEach((value2, key) => {
      headerData[key] = value2;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    for (const anyCachedKey in bodyCache) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        const contentType = anyCachedKey === "formData" ? void 0 : raw2.headers.get("content-type");
        return new Response(body, {
          headers: contentType ? { "Content-Type": contentType } : void 0
        })[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  };
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    ;
    (this.#validatedData ??= {})[target] = data;
  }
  valid(target) {
    return this.#validatedData?.[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value2, callbacks) => {
  const escapedString = new String(value2);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context = class {
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = (layout) => this.#layout = layout;
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = () => this.#layout;
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   // Append multiple headers using the append option (e.g. Vary)
   *   c.header('Vary', 'Accept-Encoding', { append: true })
   *   c.header('Vary', 'User-Agent', { append: true })
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = (name, value2, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value2 === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value2);
    } else {
      headers.set(name, value2);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = (key, value2) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value2);
  };
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    let responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders;
    if (typeof arg === "object" && arg.headers) {
      responseHeaders ??= new Headers();
      for (const [key, value2] of new Headers(arg.headers)) {
        if (key === "set-cookie") {
          responseHeaders.append(key, value2);
        } else {
          responseHeaders.set(key, value2);
        }
      }
    }
    if (headers) {
      if (!responseHeaders) {
        let count = 0;
        for (const k in headers) {
          if (++count > 1 || typeof headers[k] !== "string") {
            responseHeaders = new Headers();
            break;
          }
        }
      }
      if (responseHeaders) {
        for (const k in headers) {
          const v = headers[k];
          if (typeof v === "string") {
            responseHeaders.set(k, v);
          } else {
            responseHeaders.delete(k);
            for (const v2 of v) {
              responseHeaders.append(k, v2);
            }
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, {
      status,
      headers: responseHeaders ?? headers
    });
  }
  newResponse = (...args) => this.#newResponse(...args);
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  };
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = (object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = (location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibytes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  };
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = () => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch", "query"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class _Hono {
  get;
  post;
  put;
  delete;
  options;
  patch;
  query;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        const methodName = method.toUpperCase();
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(methodName, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(methodName, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          const methodName = m.toUpperCase();
          for (const handler of handlers) {
            this.#addRoute(methodName, this.#path, handler);
          }
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} env - env Object
   * @param {ExecutionContext} executionCtx - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/utils.js
var createNullObject = () => /* @__PURE__ */ Object.create(null);

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = ((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  });
  this.match = match2;
  return match2(method, path);
}

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return b === TAIL_WILDCARD_REG_EXP_STR ? -1 : 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class _Node {
  // handler index of a dynamic path, or -1 for a static path terminal
  #index;
  #varIndex;
  #children = createNullObject();
  insert(tokens, index, paramMap, context, isStatic) {
    let node = this;
    for (let i = 0, len = tokens.length; i < len; i++) {
      const token = tokens[i];
      const pattern = token.length === 1 ? token === "*" ? i === len - 1 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : null : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
      let nextNode;
      if (pattern) {
        const name = pattern[1];
        let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
        if (name && pattern[2]) {
          if (regexpStr === ".*") {
            throw PATH_ERROR;
          }
          regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
          if (/\((?!\?:)/.test(regexpStr)) {
            throw PATH_ERROR;
          }
          if (regexpStr.length === 1 && regExpMetaChars.has(regexpStr)) {
            throw PATH_ERROR;
          }
        }
        nextNode = node.#children[regexpStr];
        if (!nextNode) {
          if (regexpStr !== ONLY_WILDCARD_REG_EXP_STR && regexpStr !== TAIL_WILDCARD_REG_EXP_STR) {
            for (const k in node.#children) {
              if (
                // a single-char pattern coexists with single-char literals as a literal does
                (regexpStr.length > 1 || k.length > 1) && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
              ) {
                throw PATH_ERROR;
              }
            }
          }
          nextNode = node.#children[regexpStr] = new _Node();
        }
        if (name !== "") {
          nextNode.#varIndex ??= context.varIndex++;
          paramMap.push([name, nextNode.#varIndex]);
        }
      } else {
        nextNode = node.#children[token];
        if (!nextNode) {
          for (const k in node.#children) {
            if (k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR) {
              throw PATH_ERROR;
            }
          }
          nextNode = node.#children[token] = new _Node();
        }
      }
      node = nextNode;
    }
    if (node.#index !== void 0) {
      throw PATH_ERROR;
    }
    node.#index = isStatic ? -1 : index;
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      const childStr = c.buildRegExpStr();
      return childStr === "" ? "" : (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + childStr;
    }).filter(Boolean);
    if (typeof this.#index === "number" && this.#index !== -1) {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node();
  #index = 0;
  // dynamic path -> [handler index, param assoc]; static paths are not registered
  paths = createNullObject();
  insert(path, isStatic) {
    if (isStatic) {
      this.#root.insert(path.split(""), 0, [], this.#context, true);
      return;
    }
    const paramAssoc = [];
    const groups = [];
    let markedPath = path;
    for (let i = 0; ; ) {
      let replaced = false;
      markedPath = markedPath.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = markedPath.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, this.#index, paramAssoc, this.#context, false);
    this.paths[path] = [this.#index++, paramAssoc];
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var wildcardRegExpCache = createNullObject();
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    `^${path.replace(
      /\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g,
      (match2, metaChar) => metaChar ? `\\${metaChar}` : match2 === "/*" ? TAIL_WILDCARD_REG_EXP_STR : match2 === "*" ? ONLY_WILDCARD_REG_EXP_STR : `/:${LABEL_REG_EXP_STR}`
    )}$`
  );
}
function findMiddleware(middleware, path) {
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  #tries;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: createNullObject() };
    this.#routes = { [METHOD_NAME_ALL]: createNullObject() };
    this.#tries = { [METHOD_NAME_ALL]: new Trie() };
  }
  #insertPath(method, path) {
    try {
      this.#tries[method].insert(path, !/\*|\/:/.test(path));
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      this.#tries[method] = new Trie();
      for (const handlerMap of [middleware, routes]) {
        handlerMap[method] = createNullObject();
        for (const p in handlerMap[METHOD_NAME_ALL]) {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
          this.#insertPath(method, p);
        }
      }
    }
    if (path === "/*") {
      path = "*";
    }
    const methods = method === METHOD_NAME_ALL ? Object.keys(middleware) : [method];
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      for (const m of methods) {
        if (!middleware[m][path]) {
          this.#insertPath(m, path);
          middleware[m][path] = findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        }
      }
      for (const handlerMap of [middleware, routes]) {
        for (const m of methods) {
          for (const p in handlerMap[m]) {
            re.test(p) && handlerMap[m][p].push([handler, path]);
          }
        }
      }
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (const path2 of paths) {
      for (const m of methods) {
        if (!routes[m][path2]) {
          this.#insertPath(m, path2);
          routes[m][path2] = findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || [];
        }
        routes[m][path2].push([handler, path2]);
      }
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = createNullObject();
    for (const method of Object.keys(this.#routes)) {
      matchers[method] = this.#buildMatcher(method);
    }
    this.#middleware = this.#routes = this.#tries = void 0;
    wildcardRegExpCache = createNullObject();
    return matchers;
  }
  #buildMatcher(method) {
    const middleware = this.#middleware[method];
    const routes = this.#routes[method];
    const trie = this.#tries[method];
    const staticMap = createNullObject();
    const handlerData = [];
    const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
    for (const r of [middleware, routes]) {
      for (const path in r) {
        const handlers = r[path];
        const pathData = trie.paths[path];
        if (!pathData) {
          staticMap[path] = [handlers.map(([h]) => [h, createNullObject()]), emptyParam];
          continue;
        }
        handlerData[pathData[0]] = handlers.map(([h, handlerPath]) => [
          h,
          trie.paths[handlerPath][1].reduceRight((map, [key], i) => {
            map[key] = paramReplacementMap[pathData[1][i][1]];
            return map;
          }, createNullObject())
        ]);
      }
    }
    return [regexp, indexReplacementMap.map((i) => handlerData[i]), staticMap];
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = createNullObject();
var order = 0;
var Node2 = class _Node2 {
  #methods = [];
  #children = createNullObject();
  #patterns = [];
  #pattern;
  #params = emptyParams;
  insert(method, path, handler) {
    let curNode = this;
    const parts2 = splitRoutingPath(path);
    const possibleKeys = /* @__PURE__ */ new Set();
    let i = 0;
    for (const p of parts2) {
      const nextP = parts2[++i];
      const pattern = getPattern(p, nextP) || (nextP === void 0 && p && p.indexOf("*") === p.length - 1 ? p : null);
      const isParam = Array.isArray(pattern);
      const key = isParam ? pattern[0] : pattern || p;
      const child = curNode.#children[key] ||= new _Node2();
      if (pattern && !child.#pattern) {
        child.#pattern = pattern;
        curNode.#patterns.push(child);
      }
      curNode = child;
      if (isParam) {
        possibleKeys.add(pattern[1]);
      }
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: [...possibleKeys],
        score: ++order
      }
    });
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      if (handlerSet) {
        handlerSet.params = createNullObject();
        handlerSets.push(handlerSet);
        for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
          const key = handlerSet.possibleKeys[i2];
          handlerSet.params[key] = params?.[key] && !i2 ? params[key] : nodeParams[key] ?? params?.[key];
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts2 = splitPath(path);
    const curNodesQueue = [];
    const len = parts2.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts2[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (const child of node.#patterns) {
          const pattern = child.#pattern;
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (typeof pattern === "string") {
            if (pattern === "*" || part.startsWith(pattern.slice(0, -1))) {
              this.#pushHandlerSets(handlerSets, child, method, node.#params);
              if (pattern === "*") {
                child.#params = params;
                tempNodes.push(child);
              }
            }
            continue;
          }
          const [, name, matcher] = pattern;
          if (!part && matcher === true) {
            continue;
          }
          if (matcher !== true) {
            if (!partOffsets) {
              partOffsets = [];
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts2[p].length + 1;
              }
            }
            const restPathString = path.slice(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (m[0].length === restPathString.length && child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  node.#params,
                  params
                );
              }
              for (const _ in child.#children) {
                child.#params = params;
                const componentCount = m[0].match(/\//g)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
                break;
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets[1]) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node = new Node2();
  add(method, path, handler) {
    for (const result of checkOptionalParameter(path) || [path]) {
      this.#node.insert(method, result, handler);
    }
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/middleware/cors/index.js
var cors = (options) => {
  const opts = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH", "QUERY"],
    allowHeaders: [],
    exposeHeaders: [],
    ...options
  };
  const exposeHeadersStr = opts.exposeHeaders?.length ? opts.exposeHeaders.join(",") : void 0;
  const allowHeadersStr = opts.allowHeaders?.length ? opts.allowHeaders.join(",") : void 0;
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return async (origin, c) => (await optsAllowMethods(origin, c)).join(",");
    } else if (Array.isArray(optsAllowMethods)) {
      const methodsStr = optsAllowMethods.join(",");
      return () => methodsStr;
    } else {
      return () => "";
    }
  })(opts.allowMethods);
  return async function cors2(c, next) {
    function set(key, value2) {
      c.res.headers.set(key, value2);
    }
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (exposeHeadersStr) {
      set("Access-Control-Expose-Headers", exposeHeadersStr);
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        c.res.headers.append("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods) {
        set("Access-Control-Allow-Methods", allowMethods);
      }
      let headersStr = allowHeadersStr;
      if (!headersStr) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headersStr = requestHeaders.split(",").map((h) => h.trim()).join(",");
        }
      }
      if (headersStr) {
        set("Access-Control-Allow-Headers", headersStr);
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  };
};

// server/native/sql-adapter.ts
var rowsToColumns = (rows = []) => rows.map((row) => Object.fromEntries(Object.entries(row).map(([key, value2]) => [key.replace(/[A-Z]/g, (letter) => "_" + letter.toLowerCase()), value2])));
function adaptBlinkSql(client) {
  return {
    async sql(query, args) {
      const result = await client.sql(query, args);
      return { ...result, rows: rowsToColumns(result.rows) };
    },
    async batch(statements, mode) {
      const result = await client.batch(statements, mode);
      return { ...result, results: (result.results || []).map((item) => ({ ...item, rows: rowsToColumns(item.rows) })) };
    }
  };
}

// server/native/owner.ts
async function ownerEligible(auth, env, sql) {
  if (!auth.userId || !env.BLINK_PROJECT_ID || env.OWNER_PROJECT_ID !== env.BLINK_PROJECT_ID) return false;
  if (env.OWNER_USER_ID && auth.userId === env.OWNER_USER_ID) return true;
  const ownerEmail = env.OWNER_EMAIL?.trim().toLowerCase();
  if (!ownerEmail || auth.email?.trim().toLowerCase() !== ownerEmail) return false;
  const row = (await sql.sql("SELECT email,email_verified FROM users WHERE id=? LIMIT 1", [auth.userId])).rows[0];
  return !!row && Number(row.email_verified) === 1 && String(row.email).trim().toLowerCase() === ownerEmail;
}

// server/native/context.ts
import { createClient } from "@blinkdotnew/sdk";

// shared/query.ts
var Query = class {
  constructor(table, execute) {
    this.execute = execute;
    this.spec = { table, action: "select", columns: "*", filters: [], orders: [] };
  }
  execute;
  spec;
  select(columns = "*", options = {}) {
    this.spec.columns = columns;
    this.spec.head = !!options.head;
    return this;
  }
  filter(key, op, value2) {
    this.spec.filters.push({ key, op, value: value2 });
    return this;
  }
  eq(k, v) {
    return this.filter(k, "eq", v);
  }
  neq(k, v) {
    return this.filter(k, "neq", v);
  }
  is(k, v) {
    return this.filter(k, "is", v);
  }
  gt(k, v) {
    return this.filter(k, "gt", v);
  }
  gte(k, v) {
    return this.filter(k, "gte", v);
  }
  lt(k, v) {
    return this.filter(k, "lt", v);
  }
  lte(k, v) {
    return this.filter(k, "lte", v);
  }
  ilike(k, v) {
    return this.filter(k, "ilike", v);
  }
  in(k, v) {
    return this.filter(k, "in", v);
  }
  not(k, op, v) {
    if (op !== "is" || v !== null) throw new Error("Filtro n\xE3o suportado");
    return this.filter(k, "notnull", null);
  }
  order(key, opts = {}) {
    this.spec.orders.push({ key, ascending: opts.ascending !== false });
    return this;
  }
  limit(n) {
    this.spec.limit = n;
    return this;
  }
  range(a, b) {
    this.spec.offset = a;
    this.spec.limit = b - a + 1;
    return this;
  }
  insert(v) {
    this.spec.action = "insert";
    this.spec.payload = v;
    return this;
  }
  upsert(v, opts = {}) {
    this.spec.action = "upsert";
    this.spec.payload = v;
    this.spec.conflict = opts.onConflict;
    return this;
  }
  update(v) {
    this.spec.action = "update";
    this.spec.payload = v;
    return this;
  }
  delete() {
    this.spec.action = "delete";
    return this;
  }
  single() {
    this.spec.cardinality = "one";
    return this;
  }
  maybeSingle() {
    this.spec.cardinality = "maybe";
    return this;
  }
  then(ok, fail) {
    return this.execute(this.spec).then(ok, fail);
  }
};

// server/native/schema.ts
var schema = {
  "company": {
    "id": "TEXT",
    "nome": "TEXT",
    "slug": "TEXT",
    "primary_color": "TEXT",
    "logo_url": "TEXT",
    "telefone": "TEXT",
    "status_cobranca": "TEXT",
    "trial_ate": "TEXT",
    "created_by": "TEXT",
    "created_at": "TEXT",
    "updated_at": "TEXT",
    "tipo_pessoa": "TEXT",
    "cnpj_cpf": "TEXT",
    "razao_social": "TEXT",
    "nome_fantasia": "TEXT",
    "inscricao_estadual": "TEXT",
    "segmento": "TEXT",
    "porte": "TEXT",
    "site": "TEXT",
    "email_corporativo": "TEXT",
    "cep": "TEXT",
    "rua": "TEXT",
    "numero": "TEXT",
    "complemento": "TEXT",
    "bairro": "TEXT",
    "cidade": "TEXT",
    "estado": "TEXT",
    "pais": "TEXT",
    "onboarding_completed": "BOOLEAN",
    "onboarding_step": "INTEGER",
    "selected_plan_slug": "TEXT",
    "financeiro_ativo": "BOOLEAN",
    "financeiro_dias_vencimento_padrao": "INTEGER",
    "creditos_saldo": "INTEGER",
    "creditos_resetam_em": "TEXT",
    "creditos_origem": "TEXT"
  },
  "company_user": {
    "id": "TEXT",
    "user_id": "TEXT",
    "company_id": "TEXT",
    "role": "TEXT",
    "ativo": "BOOLEAN",
    "forcar_troca_senha": "BOOLEAN",
    "convite_token": "TEXT",
    "created_at": "TEXT",
    "updated_at": "TEXT"
  },
  "user_roles": {
    "id": "TEXT",
    "user_id": "TEXT",
    "role": "TEXT",
    "created_at": "TEXT"
  },
  "app_config": {
    "id": "TEXT",
    "super_admin_emails": "TEXT",
    "updated_at": "TEXT"
  },
  "profiles": {
    "user_id": "TEXT",
    "email": "TEXT",
    "nome": "TEXT",
    "nome_completo": "TEXT",
    "cpf": "TEXT",
    "cargo": "TEXT",
    "telefone": "TEXT",
    "created_at": "TEXT",
    "updated_at": "TEXT"
  },
  "agent_config": {
    "id": "TEXT",
    "user_id": "TEXT",
    "company_id": "TEXT",
    "nome_agente": "TEXT",
    "nome_empresa": "TEXT",
    "papel_objetivo": "TEXT",
    "estilo_comunicacao": "TEXT",
    "sobre_empresa": "TEXT",
    "produtos_servicos": "TEXT",
    "pode_fazer": "TEXT",
    "nao_pode_fazer": "TEXT",
    "telefone_transferencia": "TEXT",
    "palavra_pausar": "TEXT",
    "palavra_despausar": "TEXT",
    "segmento": "TEXT",
    "descricao_negocio": "TEXT",
    "diferenciais": "TEXT",
    "publico_alvo": "TEXT",
    "regiao_horario": "TEXT",
    "ofertas": "TEXT",
    "cupom": "TEXT",
    "como_vender": "TEXT",
    "objecoes": "TEXT",
    "formas_pagamento": "TEXT",
    "ticket_medio": "TEXT",
    "faq": "TEXT",
    "politicas": "TEXT",
    "posvenda_msg": "TEXT",
    "pedir_avaliacao": "BOOLEAN",
    "reativar_cliente": "BOOLEAN",
    "tom": "TEXT",
    "horarios_atendimento": "TEXT",
    "mensagem_fora_horario": "TEXT",
    "responder_em_partes": "BOOLEAN",
    "segundos_buffer": "INTEGER",
    "personalidade": "TEXT",
    "foco_atendimento": "TEXT",
    "emoji_intensidade": "TEXT",
    "usar_girias": "BOOLEAN",
    "chamar_por_nome": "BOOLEAN",
    "perguntar_uma_por_vez": "BOOLEAN",
    "pode_brincar": "BOOLEAN",
    "assinar_mensagens": "BOOLEAN",
    "proatividade": "INTEGER",
    "velocidade_resposta": "TEXT",
    "evitar_palavras": "TEXT",
    "idioma": "TEXT",
    "ai_provider": "TEXT",
    "ai_model": "TEXT",
    "openai_api_key": "TEXT",
    "anthropic_api_key": "TEXT",
    "updated_at": "TEXT"
  },
  "whatsapp_instances": {
    "id": "TEXT",
    "user_id": "TEXT",
    "company_id": "TEXT",
    "instance_name": "TEXT",
    "numero": "TEXT",
    "status": "TEXT",
    "webhook_token": "TEXT",
    "webhook_configured_at": "TEXT",
    "updated_at": "TEXT"
  },
  "mensagens": {
    "id": "TEXT",
    "user_id": "TEXT",
    "company_id": "TEXT",
    "numero": "TEXT",
    "contato_nome": "TEXT",
    "direcao": "TEXT",
    "autor": "TEXT",
    "texto": "TEXT",
    "whatsapp_message_id": "TEXT",
    "created_at": "TEXT"
  },
  "crm_cards": {
    "id": "TEXT",
    "user_id": "TEXT",
    "company_id": "TEXT",
    "numero": "TEXT",
    "nome": "TEXT",
    "status": "TEXT",
    "ultima_mensagem": "TEXT",
    "ultima_em": "TEXT",
    "observacao": "TEXT",
    "updated_at": "TEXT",
    "created_at": "TEXT",
    "stage_id": "TEXT",
    "valor": "REAL",
    "origem": "TEXT",
    "owner_id": "TEXT",
    "tags": "TEXT",
    "proxima_acao": "TEXT",
    "follow_up": "TEXT",
    "utm_source": "TEXT",
    "utm_medium": "TEXT",
    "utm_campaign": "TEXT"
  },
  "contact_pause": {
    "id": "TEXT",
    "user_id": "TEXT",
    "company_id": "TEXT",
    "numero": "TEXT",
    "pausado": "BOOLEAN",
    "updated_at": "TEXT"
  },
  "crm_stage": {
    "id": "TEXT",
    "company_id": "TEXT",
    "nome": "TEXT",
    "ordem": "INTEGER",
    "cor": "TEXT",
    "tipo": "TEXT",
    "created_at": "TEXT"
  },
  "produto": {
    "id": "TEXT",
    "company_id": "TEXT",
    "nome": "TEXT",
    "preco": "REAL",
    "descricao": "TEXT",
    "ativo": "BOOLEAN",
    "ordem": "INTEGER",
    "created_at": "TEXT"
  },
  "lead_nota": {
    "id": "TEXT",
    "company_id": "TEXT",
    "card_id": "TEXT",
    "autor_id": "TEXT",
    "texto": "TEXT",
    "created_at": "TEXT"
  },
  "lead_evento": {
    "id": "TEXT",
    "company_id": "TEXT",
    "card_id": "TEXT",
    "tipo": "TEXT",
    "descricao": "TEXT",
    "created_at": "TEXT"
  },
  "agendamento": {
    "id": "TEXT",
    "company_id": "TEXT",
    "card_id": "TEXT",
    "titulo": "TEXT",
    "inicio": "TEXT",
    "fim": "TEXT",
    "google_event_id": "TEXT",
    "status": "TEXT",
    "created_at": "TEXT"
  },
  "google_integration": {
    "company_id": "TEXT",
    "email": "TEXT",
    "access_token": "TEXT",
    "refresh_token": "TEXT",
    "expiry": "TEXT",
    "calendar_id": "TEXT",
    "conectado": "BOOLEAN",
    "updated_at": "TEXT"
  },
  "plan": {
    "id": "TEXT",
    "slug": "TEXT",
    "nome": "TEXT",
    "descricao": "TEXT",
    "preco_cents": "INTEGER",
    "moeda": "TEXT",
    "intervalo": "TEXT",
    "trial_days": "INTEGER",
    "limite_mensagens": "INTEGER",
    "limite_instancias": "INTEGER",
    "limite_usuarios": "INTEGER",
    "limite_contatos": "INTEGER",
    "features": "TEXT",
    "destaque": "BOOLEAN",
    "ativo": "BOOLEAN",
    "ordem": "INTEGER",
    "paddle_product_id": "TEXT",
    "paddle_price_id": "TEXT",
    "stripe_product_id": "TEXT",
    "stripe_price_id": "TEXT",
    "checkout_url": "TEXT",
    "creditos_mensais": "INTEGER",
    "creditos_trial": "INTEGER",
    "created_at": "TEXT",
    "updated_at": "TEXT"
  },
  "subscription": {
    "id": "TEXT",
    "company_id": "TEXT",
    "plan_id": "TEXT",
    "status": "TEXT",
    "provider": "TEXT",
    "external_subscription_id": "TEXT",
    "external_customer_id": "TEXT",
    "buyer_email": "TEXT",
    "current_period_start": "TEXT",
    "current_period_end": "TEXT",
    "trial_start": "TEXT",
    "trial_end": "TEXT",
    "canceled_at": "TEXT",
    "cancel_at_period_end": "BOOLEAN",
    "next_billing_amount_cents": "INTEGER",
    "metadata": "TEXT",
    "created_at": "TEXT",
    "updated_at": "TEXT"
  },
  "company_billing": {
    "id": "TEXT",
    "company_id": "TEXT",
    "tipo_pessoa": "TEXT",
    "cnpj_cpf": "TEXT",
    "razao_social": "TEXT",
    "nome_responsavel": "TEXT",
    "email_cobranca": "TEXT",
    "telefone": "TEXT",
    "inscricao_estadual": "TEXT",
    "cep": "TEXT",
    "rua": "TEXT",
    "numero": "TEXT",
    "complemento": "TEXT",
    "cidade": "TEXT",
    "estado": "TEXT",
    "pais": "TEXT",
    "created_at": "TEXT",
    "updated_at": "TEXT"
  },
  "campaign": {
    "id": "TEXT",
    "company_id": "TEXT",
    "created_by": "TEXT",
    "nome": "TEXT",
    "mensagem": "TEXT",
    "media_url": "TEXT",
    "status": "TEXT",
    "agendado_para": "TEXT",
    "filtro_tags": "TEXT",
    "intervalo_min": "INTEGER",
    "intervalo_max": "INTEGER",
    "pausa_apos": "INTEGER",
    "pausa_minutos": "INTEGER",
    "total_destinatarios": "INTEGER",
    "enviados": "INTEGER",
    "falhas": "INTEGER",
    "proximo_envio_em": "TEXT",
    "iniciado_em": "TEXT",
    "concluido_em": "TEXT",
    "created_at": "TEXT",
    "updated_at": "TEXT"
  },
  "campaign_target": {
    "id": "TEXT",
    "campaign_id": "TEXT",
    "company_id": "TEXT",
    "contato_numero": "TEXT",
    "contato_nome": "TEXT",
    "status": "TEXT",
    "enviado_em": "TEXT",
    "erro": "TEXT",
    "processing_token": "TEXT",
    "processing_started_at": "TEXT",
    "created_at": "TEXT"
  },
  "message_template": {
    "id": "TEXT",
    "company_id": "TEXT",
    "user_id": "TEXT",
    "atalho": "TEXT",
    "texto": "TEXT",
    "created_at": "TEXT",
    "updated_at": "TEXT"
  },
  "csat_response": {
    "id": "TEXT",
    "company_id": "TEXT",
    "numero": "TEXT",
    "contato_nome": "TEXT",
    "token": "TEXT",
    "score": "INTEGER",
    "comentario": "TEXT",
    "enviado_por": "TEXT",
    "enviado_em": "TEXT",
    "respondido_em": "TEXT",
    "created_at": "TEXT",
    "updated_at": "TEXT"
  },
  "audit_log": {
    "id": "TEXT",
    "company_id": "TEXT",
    "user_id": "TEXT",
    "actor_email": "TEXT",
    "acao": "TEXT",
    "recurso": "TEXT",
    "detalhes": "TEXT",
    "ip": "TEXT",
    "user_agent": "TEXT",
    "created_at": "TEXT"
  },
  "webhook_endpoint": {
    "id": "TEXT",
    "company_id": "TEXT",
    "nome": "TEXT",
    "url": "TEXT",
    "secret": "TEXT",
    "eventos": "TEXT",
    "ativo": "BOOLEAN",
    "created_at": "TEXT",
    "updated_at": "TEXT"
  },
  "api_token": {
    "id": "TEXT",
    "company_id": "TEXT",
    "label": "TEXT",
    "token": "TEXT",
    "criado_por": "TEXT",
    "ultimo_uso_em": "TEXT",
    "revogado": "BOOLEAN",
    "created_at": "TEXT",
    "updated_at": "TEXT"
  },
  "webhook_delivery_log": {
    "id": "TEXT",
    "company_id": "TEXT",
    "endpoint_id": "TEXT",
    "evento": "TEXT",
    "status_code": "INTEGER",
    "erro": "TEXT",
    "created_at": "TEXT"
  },
  "billing_event_log": {
    "id": "TEXT",
    "provider": "TEXT",
    "event_type": "TEXT",
    "external_id": "TEXT",
    "buyer_email": "TEXT",
    "matched_company_id": "TEXT",
    "processed": "BOOLEAN",
    "error": "TEXT",
    "payload": "TEXT",
    "event_key": "TEXT",
    "created_at": "TEXT"
  },
  "fin_categoria": {
    "id": "TEXT",
    "company_id": "TEXT",
    "nome": "TEXT",
    "tipo": "TEXT",
    "cor": "TEXT",
    "ativo": "BOOLEAN",
    "created_at": "TEXT"
  },
  "fin_lancamento": {
    "id": "TEXT",
    "company_id": "TEXT",
    "categoria_id": "TEXT",
    "card_id": "TEXT",
    "tipo": "TEXT",
    "descricao": "TEXT",
    "valor": "REAL",
    "vencimento": "TEXT",
    "pagamento_em": "TEXT",
    "status": "TEXT",
    "competencia": "TEXT",
    "observacao": "TEXT",
    "created_at": "TEXT",
    "updated_at": "TEXT"
  },
  "credit_ledger": {
    "id": "TEXT",
    "company_id": "TEXT",
    "delta": "INTEGER",
    "saldo_apos": "INTEGER",
    "motivo": "TEXT",
    "ref": "TEXT",
    "created_by": "TEXT",
    "created_at": "TEXT"
  }
};

// server/native/database.ts
var jsonFields = /* @__PURE__ */ new Set(["tags", "features", "metadata", "detalhes", "eventos", "filtro_tags", "horarios_atendimento", "super_admin_emails", "payload"]);
var adminTables = /* @__PURE__ */ new Set(["app_config", "billing_event_log", "credit_ledger"]);
var secretFields = /* @__PURE__ */ new Set(["openai_api_key", "anthropic_api_key", "access_token", "refresh_token", "webhook_token", "convite_token"]);
var readOnly = /* @__PURE__ */ new Set(["company_user", "user_roles", "subscription", "credit_ledger", "audit_log", "billing_event_log", "api_token", "google_integration"]);
var attendantWrites = /* @__PURE__ */ new Set(["crm_cards", "lead_nota", "lead_evento", "contact_pause", "message_template", "agendamento"]);
var quote = (s) => '"' + s + '"';
var value = (v) => typeof v === "boolean" ? Number(v) : v !== null && typeof v === "object" ? JSON.stringify(v) : v ?? null;
function column(table, key) {
  if (!schema[table]?.[key]) throw new Error("Coluna inv\xE1lida: " + key);
  return quote(key);
}
function parts(input) {
  let depth = 0, start = 0;
  const out = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "(") depth++;
    if (input[i] === ")") depth--;
    if (depth < 0) throw new Error("Sele\xE7\xE3o inv\xE1lida");
    if (input[i] === "," && depth === 0) {
      out.push(input.slice(start, i).trim());
      start = i + 1;
    }
  }
  if (depth !== 0) throw new Error("Sele\xE7\xE3o inv\xE1lida");
  out.push(input.slice(start).trim());
  return out;
}
function decode(table, row) {
  return Object.fromEntries(Object.entries(row).map(([k, v]) => {
    if (schema[table]?.[k] === "BOOLEAN") return [k, v === true || v === 1 || v === "1" || v === "true"];
    if (v !== null && v !== "" && ["INTEGER", "REAL", "NUMERIC"].includes(schema[table]?.[k]) && Number.isFinite(Number(v))) return [k, Number(v)];
    if (jsonFields.has(k) && typeof v === "string") {
      try {
        return [k, JSON.parse(v)];
      } catch {
      }
    }
    return [k, v];
  }));
}
var Database = class {
  constructor(sql, identity, internal = false, trusted = false) {
    this.sql = sql;
    this.identity = identity;
    this.internal = internal;
    this.trusted = trusted;
  }
  sql;
  identity;
  internal;
  trusted;
  auth;
  rpc;
  from(table) {
    return new Query(table, (s) => this.execute(s));
  }
  async scope(table, write) {
    if (!schema[table]) throw new Error("Tabela indispon\xEDvel");
    const u = this.identity;
    if (this.internal || u.master) return { clause: "1=1", args: [] };
    if (table === "plan" && !write) return { clause: "1=1", args: [] };
    if (!u.userId) throw new Error("Autentica\xE7\xE3o necess\xE1ria");
    if (adminTables.has(table)) throw new Error("Acesso restrito");
    if (write && readOnly.has(table) && !this.trusted) throw new Error("Use a opera\xE7\xE3o autorizada para esta altera\xE7\xE3o");
    if (table === "profiles") return { clause: "user_id = ?", args: [u.userId] };
    if (table === "user_roles") return { clause: "user_id = ?", args: [u.userId] };
    if (table === "company_user" && !u.companyId) return { clause: "user_id = ?", args: [u.userId] };
    if (!u.companyId) throw new Error("Empresa n\xE3o encontrada");
    if (write && !["owner", "admin"].includes(u.role || "") && !attendantWrites.has(table)) throw new Error("Permiss\xE3o insuficiente");
    if (["api_token", "webhook_endpoint", "webhook_delivery_log", "google_integration"].includes(table) && !["owner", "admin"].includes(u.role || "")) throw new Error("Acesso restrito");
    return { clause: (table === "company" ? "id" : "company_id") + " = ?", args: [u.companyId] };
  }
  async project(table, rows, selection, depth = 0) {
    if (depth > 2) throw new Error("Relacionamento muito profundo");
    const fields = parts(selection), all = fields.includes("*");
    const result = [];
    for (const raw2 of rows) {
      const row = decode(table, raw2), out = {};
      if (all) {
        for (const [k, v] of Object.entries(row)) if (this.internal || !secretFields.has(k)) out[k] = v;
      }
      for (const field of fields) {
        if (field === "*") continue;
        const match2 = /^(\w+)(?::(\w+))?\((.*)\)$/.exec(field);
        if (match2) {
          const alias = match2[1], target = alias === "profiles" ? "profiles" : match2[2] || alias;
          if (!["company", "plan", "profiles", "crm_stage", "fin_categoria"].includes(target)) throw new Error("Relacionamento inv\xE1lido");
          const fk = target === "profiles" ? "user_id" : target === "crm_stage" ? "stage_id" : target === "fin_categoria" ? "categoria_id" : target + "_id", pk = target === "profiles" ? "user_id" : "id";
          if (raw2[fk] == null) {
            out[alias] = null;
            continue;
          }
          const related = (await this.sql.sql("SELECT * FROM " + quote(target) + " WHERE " + quote(pk) + " = ? LIMIT 1", [raw2[fk]])).rows;
          if (target === "profiles" && !this.internal) {
            out[alias] = related[0] ? Object.fromEntries(["user_id", "nome", "email"].filter((k) => match2[3] === "*" || parts(match2[3]).includes(k)).map((k) => [k, related[0][k]])) : null;
          } else out[alias] = (await this.project(target, related, match2[3], depth + 1))[0] ?? null;
        } else {
          column(table, field);
          if (!this.internal && secretFields.has(field)) throw new Error("Campo protegido");
          out[field] = row[field];
        }
      }
      result.push(out);
    }
    return result;
  }
  async execute(input) {
    try {
      const s = structuredClone(input), table = s.table, write = s.action !== "select";
      if (!["select", "insert", "upsert", "update", "delete"].includes(s.action)) throw new Error("Opera\xE7\xE3o inv\xE1lida");
      const scope = await this.scope(table, write), args = [...scope.args], conditions = [scope.clause];
      if (!Array.isArray(s.filters) || s.filters.length > 30) throw new Error("Filtros inv\xE1lidos");
      for (const f of s.filters) {
        const key = column(table, f.key);
        if (f.op === "in") {
          if (!Array.isArray(f.value) || f.value.length > 1e3) throw new Error("Filtro inv\xE1lido");
          conditions.push(f.value.length ? key + " IN (" + f.value.map(() => "?").join(",") + ")" : "0=1");
          args.push(...f.value.map(value));
          continue;
        }
        if (f.op === "notnull") {
          conditions.push(key + " IS NOT NULL");
          continue;
        }
        const op = { eq: "=", neq: "!=", gt: ">", gte: ">=", lt: "<", lte: "<=", is: "IS", ilike: "LIKE" };
        if (!op[f.op]) throw new Error("Operador inv\xE1lido");
        conditions.push(key + " " + op[f.op] + " ?" + (f.op === "ilike" ? " COLLATE NOCASE" : ""));
        args.push(value(f.value));
      }
      const where = conditions.join(" AND "), limit = Math.min(5e3, Math.max(0, Number(s.limit ?? 1e3))), offset = Math.max(0, Number(s.offset ?? 0));
      if (!Number.isInteger(limit) || !Number.isInteger(offset)) throw new Error("Pagina\xE7\xE3o inv\xE1lida");
      const order2 = s.orders?.length ? " ORDER BY " + s.orders.map((o) => column(table, o.key) + (o.ascending ? " ASC" : " DESC")).join(",") : "";
      let rows = [], count = 0;
      if (!write) {
        count = Number((await this.sql.sql("SELECT COUNT(*) AS total FROM " + quote(table) + " WHERE " + where, args)).rows[0]?.total || 0);
        if (!s.head) rows = (await this.sql.sql("SELECT * FROM " + quote(table) + " WHERE " + where + order2 + " LIMIT ? OFFSET ?", [...args, limit, offset])).rows;
      } else {
        if (!["insert", "upsert"].includes(s.action) && s.filters.length === 0) throw new Error("Altera\xE7\xE3o exige filtro expl\xEDcito");
        if (s.action === "delete") {
          rows = (await this.sql.sql("DELETE FROM " + quote(table) + " WHERE " + where + " RETURNING *", args)).rows;
        } else {
          const payloads = Array.isArray(s.payload) ? s.payload : [s.payload];
          if (payloads.length > 1e3) throw new Error("Lote muito grande");
          for (const raw2 of payloads) {
            if (!raw2 || typeof raw2 !== "object") throw new Error("Dados inv\xE1lidos");
            const row = { ...raw2 };
            if ("trial_ends_at" in row && table === "subscription") {
              row.trial_end = row.trial_ends_at;
              delete row.trial_ends_at;
            }
            if (!this.internal && !this.identity.master) {
              for (const k of Object.keys(row)) if (secretFields.has(k) || ["created_by", "creditos_saldo", "creditos_origem", "creditos_resetam_em", "status_cobranca", "trial_ate", "selected_plan_slug"].includes(k)) throw new Error("Campo protegido: " + k);
              if (table === "profiles") {
                if (row.user_id && row.user_id !== this.identity.userId) throw new Error("Usu\xE1rio inv\xE1lido");
                row.user_id = this.identity.userId;
              } else if (table !== "company") {
                if (row.company_id && row.company_id !== this.identity.companyId) throw new Error("Empresa inv\xE1lida");
                row.company_id = this.identity.companyId;
              }
              if (row.user_id && row.user_id !== this.identity.userId) throw new Error("Usu\xE1rio inv\xE1lido");
              if (s.action === "update") delete row.id;
              for (const [fk, target] of [["stage_id", "crm_stage"], ["card_id", "crm_cards"], ["categoria_id", "fin_categoria"]]) if (row[fk]) {
                const r = await this.sql.sql("SELECT id FROM " + target + " WHERE id = ? AND company_id = ?", [row[fk], this.identity.companyId]);
                if (!r.rows.length) throw new Error("Refer\xEAncia de outra empresa");
              }
              if (s.action === "insert" && row.id) {
                const existing = await this.sql.sql("SELECT id FROM " + quote(table) + " WHERE id = ?", [row.id]);
                if (existing.rows.length) throw new Error("Registro j\xE1 existe");
              }
            }
            if (s.action !== "update" && schema[table].id && !row.id) row.id = crypto.randomUUID();
            if (s.action === "update" && schema[table].updated_at) row.updated_at = (/* @__PURE__ */ new Date()).toISOString();
            const keys = Object.keys(row);
            keys.forEach((k) => column(table, k));
            if (!keys.length) throw new Error("Dados vazios");
            let statement, params;
            if (s.action === "update") {
              statement = "UPDATE " + quote(table) + " SET " + keys.map((k) => quote(k) + " = ?").join(",") + " WHERE " + where + " RETURNING *";
              params = [...keys.map((k) => value(row[k])), ...args];
            } else {
              statement = "INSERT INTO " + quote(table) + " (" + keys.map(quote).join(",") + ") VALUES (" + keys.map(() => "?").join(",") + ")";
              params = keys.map((k) => value(row[k]));
              if (s.action === "upsert") {
                const conflict = (s.conflict || (schema[table].id ? "id" : table === "profiles" ? "user_id" : "company_id")).split(",").map((k) => k.trim());
                conflict.forEach((k) => column(table, k));
                const updates = keys.filter((k) => !conflict.includes(k) && k !== "id");
                if (!this.internal && !this.identity.master && table !== "profiles" && !conflict.includes("company_id")) throw new Error("Upsert exige chave da empresa");
                statement += " ON CONFLICT (" + conflict.map(quote).join(",") + ") " + (updates.length ? "DO UPDATE SET " + updates.map((k) => quote(k) + "=excluded." + quote(k)).join(",") : "DO NOTHING");
              }
              statement += " RETURNING *";
            }
            rows.push(...(await this.sql.sql(statement, params)).rows);
          }
        }
        count = rows.length;
      }
      const projected = await this.project(table, rows, s.columns || "*");
      if (s.cardinality === "one" && projected.length !== 1) throw new Error("Esperado exatamente um registro");
      if (s.cardinality === "maybe" && projected.length > 1) throw new Error("Mais de um registro encontrado");
      return { data: s.head ? null : s.cardinality ? projected[0] ?? null : projected, error: null, count };
    } catch (error) {
      return { data: null, error: { message: error.message || String(error) }, count: 0 };
    }
  }
};

// server/native/context.ts
async function makeContext(request, env, publicWebhook = false) {
  const blink = createClient({ projectId: env.BLINK_PROJECT_ID, secretKey: env.BLINK_SECRET_KEY, auth: { mode: "headless" } });
  const sql = adaptBlinkSql(blink.db);
  const header = publicWebhook ? null : request.headers.get("authorization");
  const auth = header ? await blink.auth.verifyToken(header) : { valid: false };
  if (header && (!auth.valid || !("userId" in auth) || !auth.userId || auth.projectId !== env.BLINK_PROJECT_ID)) throw new Error("Sess\xE3o inv\xE1lida");
  const userId = auth.valid && "userId" in auth ? auth.userId || "" : "";
  const email = auth.valid && "email" in auth ? auth.email || "" : "";
  if (userId) {
    await sql.sql("INSERT INTO profiles(user_id,email) VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET email=excluded.email", [userId, email]);
    if (await ownerEligible({ userId, email }, env, sql)) {
      await sql.batch([
        { sql: "INSERT INTO template_owner(id,user_id) VALUES(?,?) ON CONFLICT(id) DO NOTHING", args: ["owner", userId] },
        { sql: "INSERT INTO user_roles(id,user_id,role) SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM template_owner WHERE id='owner' AND user_id=?) ON CONFLICT(user_id,role) DO NOTHING", args: ["owner:" + userId, userId, "super_admin", userId] }
      ], "write");
    }
  }
  const member = userId ? (await sql.sql("SELECT company_id,role FROM company_user WHERE user_id=? AND ativo=1 ORDER BY created_at LIMIT 1", [userId])).rows[0] : null;
  const master = userId ? !!(await sql.sql("SELECT 1 FROM user_roles WHERE user_id=? AND role='super_admin' LIMIT 1", [userId])).rows.length : false;
  const identity = { userId, email, master, companyId: member?.company_id, role: member?.role };
  const admin = new Database(sql, identity, true, true), scoped = new Database(sql, identity, false, true);
  admin.auth = { admin: {
    async createUser(input) {
      try {
        if (!identity.master && !["owner", "admin"].includes(identity.role || "")) throw new Error("Acesso negado");
        const client = createClient({ projectId: env.BLINK_PROJECT_ID, auth: { mode: "headless" }, authRequired: false });
        const user = await client.auth.signUp({ email: input.email, password: input.password });
        return { data: { user }, error: null };
      } catch (error) {
        return { data: { user: null }, error: { message: error.message } };
      }
    },
    async updateUserById() {
      return { error: { message: "Na Blink, a senha deve ser alterada pelo titular em Esqueci minha senha." } };
    },
    async getUserById(id) {
      const row = (await sql.sql("SELECT user_id,email FROM profiles WHERE user_id=?", [id])).rows[0];
      return { data: { user: row ? { id: row.user_id, email: row.email } : null }, error: null };
    }
  } };
  for (const db of [admin, scoped]) db.rpc = async (name, args = {}) => {
    try {
      const cid = args._company_id;
      if (name === "is_super_admin") return { data: identity.master, error: null };
      if (name === "grant_credits") {
        if (!identity.master) throw new Error("Acesso restrito ao administrador");
        const amount = Number(args._qtd);
        if (!Number.isInteger(amount) || Math.abs(amount) > 1e7) throw new Error("Quantidade inv\xE1lida");
        const id = crypto.randomUUID();
        await sql.batch([{ sql: "UPDATE company SET creditos_saldo=MAX(0,COALESCE(creditos_saldo,0)+?) WHERE id=?", args: [amount, cid] }, { sql: "INSERT INTO credit_ledger(id,company_id,delta,saldo_apos,motivo,created_by) SELECT ?,id,?,creditos_saldo,?,? FROM company WHERE id=?", args: [id, amount, args._motivo || "bonus_admin", userId, cid] }], "write");
        return { data: (await sql.sql("SELECT creditos_saldo FROM company WHERE id=?", [cid])).rows[0]?.creditos_saldo, error: null };
      }
      if (name === "fin_enable_for_company") {
        if (!identity.master && (cid !== identity.companyId || !["owner", "admin"].includes(identity.role || ""))) throw new Error("Acesso negado");
        await sql.sql("UPDATE company SET financeiro_ativo=? WHERE id=?", [Number(!!args._enable), cid]);
        return { data: true, error: null };
      }
      if (db.internal && name === "claim_campaign_targets") {
        const limit = Math.max(1, Math.min(50, Number(args._limit) || 5));
        if (!args._token || !args._campaign_id) throw new Error("Reserva inv\xE1lida");
        const rows = (await sql.sql("UPDATE campaign_target SET processing_token=?,processing_started_at=? WHERE id IN (SELECT id FROM campaign_target WHERE campaign_id=? AND status='pendente' AND processing_token IS NULL ORDER BY created_at,id LIMIT ?) RETURNING *", [args._token, (/* @__PURE__ */ new Date()).toISOString(), args._campaign_id, limit])).rows;
        return { data: rows, error: null };
      }
      if (db.internal && name === "consume_ai_credit") {
        const rows = (await sql.sql("UPDATE company SET creditos_saldo=creditos_saldo-1 WHERE id=? AND creditos_saldo>0 RETURNING creditos_saldo", [cid])).rows;
        return { data: rows.length > 0, error: null };
      }
      if (db.internal && name === "refund_ai_credit") {
        await sql.sql("UPDATE company SET creditos_saldo=creditos_saldo+1 WHERE id=?", [cid]);
        return { data: true, error: null };
      }
      if (db.internal && name === "topup_plan_credits") {
        await sql.sql("UPDATE company SET creditos_saldo=COALESCE((SELECT creditos_mensais FROM plan WHERE slug=?),0),creditos_origem=? WHERE id=?", [args._plan_slug, "plano", cid]);
        return { data: true, error: null };
      }
      throw new Error("Opera\xE7\xE3o n\xE3o dispon\xEDvel: " + name);
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };
  return { blink, sql, identity, admin, scoped, request, env };
}

// server/native/domain.ts
var external0 = __toESM(require_browser(), 1);
var external1 = __toESM(require_buffer(), 1);

// node_modules/@noble/hashes/sha2.js
var sha2_exports = {};
__export(sha2_exports, {
  _SHA224: () => _SHA224,
  _SHA256: () => _SHA256,
  _SHA384: () => _SHA384,
  _SHA512: () => _SHA512,
  _SHA512_224: () => _SHA512_224,
  _SHA512_256: () => _SHA512_256,
  sha224: () => sha224,
  sha256: () => sha2562,
  sha384: () => sha384,
  sha512: () => sha512,
  sha512_224: () => sha512_224,
  sha512_256: () => sha512_256
});

// node_modules/@noble/hashes/_u64.js
var U32_MASK64 = /* @__PURE__ */ (() => BigInt(2 ** 32 - 1))();
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
var fromNumH = (n) => n / 2 ** 32 | 0;
var fromNumL = (n) => n >>> 0;
function setU64FromNum(view, byteOffset, n, isLE) {
  const h = fromNumH(n);
  const l = fromNumL(n);
  view.setUint32(byteOffset, isLE ? l : h, isLE);
  view.setUint32(byteOffset + 4, isLE ? h : l, isLE);
}
var shrSH = (h, _l, s) => h >>> s;
var shrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;

// node_modules/@noble/hashes/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
var atitle = (title) => title ? `"${title}" ` : "";
function anumber(n, title = "") {
  if (typeof n !== "number")
    throw new TypeError(atitle(title) + "expected number, got " + typeof n);
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError(atitle(title) + "expected integer >= 0, got " + n);
  return n;
}
function abytes(value2, length, title = "") {
  if (isBytes(value2) && (length === void 0 || value2.length === length))
    return value2;
  if (length !== void 0)
    anumber(length, "length");
  const bytes = isBytes(value2);
  const ofLen = length !== void 0 ? ` of length ${length}` : "";
  const got = bytes ? `length=${value2.length}` : `type=${typeof value2}`;
  const message = atitle(title) + "expected Uint8Array" + ofLen + ", got " + got;
  if (!bytes)
    throw new TypeError(message);
  throw new RangeError(message);
}
function ahash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new TypeError("expected hash wrapped by utils.createHasher");
  anumber(h.outputLen);
  anumber(h.blockLen);
  if (h.outputLen < 1 || h.blockLen < 1)
    throw new Error("hash blockLen / outputLen must be >= 1");
}
var aobject = (value2, label) => {
  if (value2 === null || typeof value2 !== "object" || Array.isArray(value2))
    throw new TypeError((label === "object" ? "" : `"${label}" `) + "expected object, got type=" + typeof value2);
};
var aopts = (value2, label) => {
  aobject(value2, label);
  const proto = Object.getPrototypeOf(value2);
  if (proto !== Object.prototype && proto !== null)
    throw new TypeError(`"${label}" expected plain object`);
  if (Object.hasOwn(value2, "__proto__"))
    throw new TypeError(`"${label}.__proto__" is not allowed`);
};
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("hash was destroyed");
  if (checkFinished && instance.finished)
    throw new Error("digest() was already called");
}
function aoutput(out, instance) {
  abytes(out, void 0, "output");
  const min = instance.outputLen;
  if (!(out.length >= min)) {
    throw new RangeError('"output" expected length >= ' + min);
  }
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function checkOpts(defaults, opts, title = "opts") {
  aopts(defaults, "defaults");
  if (opts !== void 0)
    aopts(opts, title);
  const merged = Object.assign(/* @__PURE__ */ Object.create(null), defaults, opts);
  return merged;
}
function createHasher(hashCons, info = {}) {
  if (typeof hashCons !== "function")
    throw new TypeError('"hashCons" expected function, got type=' + typeof hashCons);
  info = checkOpts({}, info, "info");
  const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.canXOF = tmp.canXOF;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
var oidNist = (suffix) => ({
  // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
  // Larger suffix values would need base-128 OID encoding and a different length byte.
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
});

// node_modules/@noble/hashes/_md.js
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD = class {
  blockLen;
  outputLen;
  canXOF = false;
  padOffset;
  isLE;
  // For partial updates less than block size
  buffer;
  view;
  finished = false;
  length = 0;
  pos = 0;
  destroyed = false;
  constructor(blockLen, outputLen, padOffset, isLE) {
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    abytes(data);
    const { view, buffer, blockLen } = this;
    const len = data.length;
    let processed = false;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        processed = true;
        continue;
      }
      buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
        processed = true;
      }
    }
    this.length += data.length;
    if (processed)
      this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    buffer.fill(0, pos);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      buffer.fill(0);
    }
    setU64FromNum(view, blockLen - 8, this.length * 8, isLE);
    this.process(view, 0);
    this.roundClean();
    const oview = out === buffer ? view : createView(out);
    const len = this.outputLen;
    const outLen = len / 4;
    const state = this.get();
    if (len % 4 || outLen > state.length)
      throw new Error("invalid outputLen");
    for (let i = 0; i < outLen; i++)
      oview.setUint32(4 * i, state[i], isLE);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneIntoMeta(to) {
    const { buffer, length, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (pos)
      to.buffer.set(buffer);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA224_IV = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]);
var SHA384_IV = /* @__PURE__ */ Uint32Array.from([
  3418070365,
  3238371032,
  1654270250,
  914150663,
  2438529370,
  812702999,
  355462360,
  4144912697,
  1731405415,
  4290775857,
  2394180231,
  1750603025,
  3675008525,
  1694076839,
  1203062813,
  3204075428
]);
var SHA512_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  4089235720,
  3144134277,
  2227873595,
  1013904242,
  4271175723,
  2773480762,
  1595750129,
  1359893119,
  2917565137,
  2600822924,
  725511199,
  528734635,
  4215389547,
  1541459225,
  327033209
]);

// node_modules/@noble/hashes/sha2.js
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA2_32B = class extends HashMD {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  // Numeric initializers matter: starting the fields as `undefined` changes
  // V8's field representation and makes sha256 3x slower (measured).
  A = 0;
  B = 0;
  C = 0;
  D = 0;
  E = 0;
  F = 0;
  G = 0;
  H = 0;
  constructor(outputLen, IV) {
    super(64, outputLen, 8, false);
    this.A = IV[0] | 0;
    this.B = IV[1] | 0;
    this.C = IV[2] | 0;
    this.D = IV[3] | 0;
    this.E = IV[4] | 0;
    this.F = IV[5] | 0;
    this.G = IV[6] | 0;
    this.H = IV[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  _cloneInto(to) {
    (to ||= new this.constructor()).set(...this.get());
    return this._cloneIntoMeta(to);
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      SHA256_W[i] = view.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    clean(SHA256_W);
  }
  destroy() {
    this.destroyed = true;
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean(this.buffer);
  }
};
var _SHA256 = class extends SHA2_32B {
  constructor() {
    super(32, SHA256_IV);
  }
};
var _SHA224 = class extends SHA2_32B {
  constructor() {
    super(28, SHA224_IV);
  }
};
var K512 = /* @__PURE__ */ (() => split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
var SHA2_64B = class extends HashMD {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  // h -- high 32 bits, l -- low 32 bits
  // Numeric initializers matter: starting the fields as `undefined` changes
  // V8's field representation and slows hashing down (measured on sha256).
  Ah = 0;
  Al = 0;
  Bh = 0;
  Bl = 0;
  Ch = 0;
  Cl = 0;
  Dh = 0;
  Dl = 0;
  Eh = 0;
  El = 0;
  Fh = 0;
  Fl = 0;
  Gh = 0;
  Gl = 0;
  Hh = 0;
  Hl = 0;
  constructor(outputLen, IV) {
    super(128, outputLen, 16, false);
    this.Ah = IV[0] | 0;
    this.Al = IV[1] | 0;
    this.Bh = IV[2] | 0;
    this.Bl = IV[3] | 0;
    this.Ch = IV[4] | 0;
    this.Cl = IV[5] | 0;
    this.Dh = IV[6] | 0;
    this.Dl = IV[7] | 0;
    this.Eh = IV[8] | 0;
    this.El = IV[9] | 0;
    this.Fh = IV[10] | 0;
    this.Fl = IV[11] | 0;
    this.Gh = IV[12] | 0;
    this.Gl = IV[13] | 0;
    this.Hh = IV[14] | 0;
    this.Hl = IV[15] | 0;
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  _cloneInto(to) {
    (to ||= new this.constructor()).set(...this.get());
    return this._cloneIntoMeta(to);
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) {
      SHA512_W_H[i] = view.getUint32(offset);
      SHA512_W_L[i] = view.getUint32(offset += 4);
    }
    for (let i = 16; i < 80; i++) {
      const W15h = SHA512_W_H[i - 15] | 0;
      const W15l = SHA512_W_L[i - 15] | 0;
      const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
      const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i - 2] | 0;
      const W2l = SHA512_W_L[i - 2] | 0;
      const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
      const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
      const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
      const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
      SHA512_W_H[i] = SUMh | 0;
      SHA512_W_L[i] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i = 0; i < 80; i++) {
      const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
      const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
      const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
      const T1l = T1ll | 0;
      const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
      const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = add3L(T1l, sigma0l, MAJl);
      Ah = add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    clean(SHA512_W_H, SHA512_W_L);
  }
  destroy() {
    this.destroyed = true;
    clean(this.buffer);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var _SHA512 = class extends SHA2_64B {
  constructor() {
    super(64, SHA512_IV);
  }
};
var _SHA384 = class extends SHA2_64B {
  constructor() {
    super(48, SHA384_IV);
  }
};
var T224_IV = /* @__PURE__ */ Uint32Array.from([
  2352822216,
  424955298,
  1944164710,
  2312950998,
  502970286,
  855612546,
  1738396948,
  1479516111,
  258812777,
  2077511080,
  2011393907,
  79989058,
  1067287976,
  1780299464,
  286451373,
  2446758561
]);
var T256_IV = /* @__PURE__ */ Uint32Array.from([
  573645204,
  4230739756,
  2673172387,
  3360449730,
  596883563,
  1867755857,
  2520282905,
  1497426621,
  2519219938,
  2827943907,
  3193839141,
  1401305490,
  721525244,
  746961066,
  246885852,
  2177182882
]);
var _SHA512_224 = class extends SHA2_64B {
  constructor() {
    super(28, T224_IV);
  }
};
var _SHA512_256 = class extends SHA2_64B {
  constructor() {
    super(32, T256_IV);
  }
};
var sha2562 = /* @__PURE__ */ createHasher(
  () => new _SHA256(),
  /* @__PURE__ */ oidNist(1)
);
var sha224 = /* @__PURE__ */ createHasher(
  () => new _SHA224(),
  /* @__PURE__ */ oidNist(4)
);
var sha512 = /* @__PURE__ */ createHasher(
  () => new _SHA512(),
  /* @__PURE__ */ oidNist(3)
);
var sha384 = /* @__PURE__ */ createHasher(
  () => new _SHA384(),
  /* @__PURE__ */ oidNist(2)
);
var sha512_256 = /* @__PURE__ */ createHasher(
  () => new _SHA512_256(),
  /* @__PURE__ */ oidNist(6)
);
var sha512_224 = /* @__PURE__ */ createHasher(
  () => new _SHA512_224(),
  /* @__PURE__ */ oidNist(5)
);

// node_modules/@noble/hashes/hmac.js
var hmac_exports = {};
__export(hmac_exports, {
  _HMAC: () => _HMAC,
  hmac: () => hmac
});
var _HMAC = class {
  oHash;
  iHash;
  blockLen;
  outputLen;
  canXOF = false;
  finished = false;
  destroyed = false;
  constructor(hash, key) {
    ahash(hash);
    abytes(key, void 0, "key");
    this.iHash = hash.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("expected Hash instance");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash.create();
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54 ^ 92;
    this.oHash.update(pad);
    clean(pad);
  }
  update(buf) {
    aexists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const buf = out.subarray(0, this.outputLen);
    this.iHash.digestInto(buf);
    this.oHash.update(buf);
    this.oHash.digestInto(buf);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to ||= Object.create(Object.getPrototypeOf(this), {});
    const { oHash, iHash, finished, destroyed, blockLen, outputLen, canXOF } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.canXOF = canXOF;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac = /* @__PURE__ */ (() => {
  const hmac_ = ((hash, key, message) => new _HMAC(hash, key).update(message).digest());
  hmac_.create = (hash, key) => new _HMAC(hash, key);
  return hmac_;
})();

// server/native/domain.ts
var publicRoutes = { "/api/public/google-callback": "src/routes/api/public/google-callback", "/api/public/whatsapp-webhook": "src/routes/api/public/whatsapp-webhook", "/api/public/billing/webhook": "src/routes/api/public/billing/webhook", "/api/public/hooks/process-campaigns": "src/routes/api/public/hooks/process-campaigns", "/api/public/v1/$": "src/routes/api/public/v1/$" };
var rpcAllowlist = { "src/lib/agent-ai.functions": ["analyzeBusinessBrief", "generateAgentConfig"], "src/lib/billing.functions": ["getBillingWebhookInfo", "listRecentBillingEvents"], "src/lib/campaigns.functions": ["listCampaigns", "getCampaign", "listAvailableTags", "previewAudience", "saveCampaign", "deleteCampaign", "startCampaign", "pauseCampaign", "cancelCampaign"], "src/lib/checkout.functions": ["createCheckoutCompany"], "src/lib/credits.functions": ["getMyCredits", "adminGrantCredits"], "src/lib/csat.functions": ["sendCsat", "submitCsat", "getCsatByToken"], "src/lib/evolution.functions": ["connectWhatsapp", "checkWhatsappStatus", "disconnectWhatsapp", "sendWhatsappText", "setContactIaActive", "testAiReply"], "src/lib/financeiro.functions": ["enableFinanceiro", "finKpis", "listLancamentos", "listCategorias", "upsertLancamento", "marcarPago", "deleteLancamento", "upsertCategoria", "deleteCategoria", "finStatus"], "src/lib/google.functions": ["startGoogleOAuth", "disconnectGoogle", "createGoogleCalendarEvent"], "src/lib/integrations.functions": ["listWebhooks", "saveWebhook", "deleteWebhook", "listWebhookLogs", "listApiTokens", "createApiToken", "revokeApiToken"], "src/lib/master.functions": ["masterKpis", "listMasterSubscriptions", "listCompanies", "suspendCompany", "extendTrial", "createCompanyWithOwner", "listPlansBasic", "getSuperAdminEmails", "setSuperAdminEmails", "resetCompanyOwnerPassword", "getCompanyDetails"], "src/lib/plan.functions": ["getPlanUsage", "createContact", "importContacts"], "src/lib/security.functions": ["listAuditLog", "exportLgpd"], "src/lib/team.functions": ["listTeam", "inviteMember", "setMemberActive", "setMemberRole"], "src/lib/templates.functions": ["listTemplates", "saveTemplate", "deleteTemplate", "saveBusinessHours", "getBusinessHours"] };
var factories = {
  "src/lib/agent-ai.functions": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.generateAgentConfig = exports.analyzeBusinessBrief = void 0;
    const react_start_1 = require2("@tanstack/react-start");
    const auth_middleware_1 = require2("@/integrations/supabase/auth-middleware");
    const FIELDS = [
      "nome_agente",
      "nome_empresa",
      "segmento",
      "regiao_horario",
      "descricao_negocio",
      "diferenciais",
      "publico_alvo",
      "sobre_empresa",
      "produtos_servicos",
      "papel_objetivo",
      "estilo_comunicacao",
      "apresentacao",
      "ofertas",
      "como_vender",
      "objecoes",
      "formas_pagamento",
      "faq",
      "politicas",
      "posvenda_msg",
      "pode_fazer",
      "nao_pode_fazer"
    ];
    function extractJson(raw2) {
      const trimmed = (raw2 || "").trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "");
      try {
        return JSON.parse(trimmed);
      } catch {
      }
      const m = trimmed.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          return JSON.parse(m[0]);
        } catch {
        }
      }
      throw new Error("A IA n\xE3o retornou JSON v\xE1lido. Tente novamente.");
    }
    exports.analyzeBusinessBrief = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => {
      const desc = (d?.descricao || "").trim();
      if (desc.length < 10)
        throw new Error("Conte um pouco mais sobre o neg\xF3cio.");
      return {
        descricao: desc.slice(0, 8e3),
        respostas: d?.respostas && typeof d.respostas === "object" ? d.respostas : {}
      };
    }).handler(async ({ data }) => {
      const { lovableAiChat } = await Promise.resolve().then(() => __importStar(require2("src/lib/lovable-ai.server")));
      const respostasTxt = Object.entries(data.respostas).filter(([, v]) => v && String(v).trim()).map(([k, v]) => `- ${k}: ${v}`).join("\n");
      const system = `Voc\xEA \xE9 um Product Manager s\xEAnior + consultor de vendas, especialista em montar agentes de WhatsApp para pequenos neg\xF3cios brasileiros (donos leigos, topo de funil).

Sua tarefa: ANALISAR a descri\xE7\xE3o do neg\xF3cio e identificar o que FALTA para um agente atender bem sem dar respostas tortas.

Pense como PRD: o agente precisa saber NO M\xCDNIMO:
1) O que vende (produtos/servi\xE7os com pre\xE7o ou faixa de pre\xE7o)
2) Como o cliente recebe/recebe atendimento (entrega, retirada, agendamento, online)
3) Regi\xE3o e hor\xE1rio de atendimento
4) Formas de pagamento
5) Pol\xEDtica b\xE1sica (troca, cancelamento, garantia)
6) O que o agente N\xC3O pode prometer/fazer
7) Diferencial / motivo pra comprar dali
8) Pr\xF3ximo passo da venda (agendar? pedir endere\xE7o? enviar link?)

REGRAS DAS PERGUNTAS:
- Fa\xE7a NO M\xC1XIMO 6 perguntas \u2014 s\xF3 as CR\xCDTICAS que faltam.
- Linguagem de gente, n\xE3o de formul\xE1rio. O dono \xE9 leigo, topo de funil.
- Cada pergunta tem um EXEMPLO concreto, plaus\xEDvel pro segmento dele, pra destravar.
- NUNCA pergunte coisa que j\xE1 est\xE1 clara na descri\xE7\xE3o ou nas respostas anteriores.
- Se o neg\xF3cio \xE9 simples e j\xE1 tem o essencial (produtos + como vender + regi\xE3o OU hor\xE1rio), marque "pronto: true" e devolva perguntas: [].
- Se faltar pouco mas cr\xEDtico (ex: pre\xE7os, formas de pagamento), marque "pronto: false".

Responda APENAS JSON v\xE1lido neste formato:
{
  "pronto": boolean,
  "resumo": "string curta do que entendeu do neg\xF3cio",
  "cobertura": number,   // 0-100, quanto da info essencial j\xE1 temos
  "perguntas": [
    {
      "id": "snake_case_estavel",
      "pergunta": "pergunta curta em PT-BR",
      "porque": "1 frase de por que isso importa pro atendimento",
      "exemplo": "exemplo concreto e espec\xEDfico pro segmento",
      "campo": "uma das chaves: nome_empresa|segmento|regiao_horario|produtos_servicos|formas_pagamento|politicas|diferenciais|publico_alvo|como_vender|nao_pode_fazer|ofertas|extra",
      "obrigatoria": boolean
    }
  ]
}`;
      const user = `DESCRI\xC7\xC3O DO NEG\xD3CIO:
${data.descricao}

${respostasTxt ? `RESPOSTAS J\xC1 DADAS PELO DONO:
${respostasTxt}` : ""}

Analise e devolva o JSON.`;
      const raw2 = await lovableAiChat([
        { role: "system", content: system },
        { role: "user", content: user }
      ], { provider: "gemini", model: "google/gemini-2.5-flash" });
      const parsed = extractJson(raw2);
      const perguntas = Array.isArray(parsed?.perguntas) ? parsed.perguntas.slice(0, 6).map((q, i) => ({
        id: String(q?.id || `q_${i}`).slice(0, 60),
        pergunta: String(q?.pergunta || "").slice(0, 240),
        porque: String(q?.porque || "").slice(0, 240),
        exemplo: String(q?.exemplo || "").slice(0, 320),
        campo: typeof q?.campo === "string" ? q.campo : "extra",
        obrigatoria: !!q?.obrigatoria
      })).filter((q) => q.pergunta) : [];
      const analysis = {
        pronto: !!parsed?.pronto && perguntas.filter((p) => p.obrigatoria).length === 0,
        resumo: String(parsed?.resumo || "").slice(0, 400),
        cobertura: Math.max(0, Math.min(100, Number(parsed?.cobertura) || 0)),
        perguntas
      };
      return analysis;
    });
    exports.generateAgentConfig = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => {
      if (!d?.descricao || d.descricao.trim().length < 20) {
        throw new Error("Descreva seu neg\xF3cio com pelo menos algumas frases (m\xEDn. 20 caracteres).");
      }
      return {
        descricao: d.descricao.trim().slice(0, 8e3),
        respostas: d?.respostas && typeof d.respostas === "object" ? d.respostas : {}
      };
    }).handler(async ({ data }) => {
      const { lovableAiChat } = await Promise.resolve().then(() => __importStar(require2("src/lib/lovable-ai.server")));
      const { buildSystemPrompt } = await Promise.resolve().then(() => __importStar(require2("src/lib/ai-prompt")));
      const respostasTxt = Object.entries(data.respostas).filter(([, v]) => v && String(v).trim()).map(([k, v]) => `- ${k}: ${v}`).join("\n");
      const system = `Voc\xEA \xE9 um Product Manager s\xEAnior + copywriter de vendas, montando um AGENTE DE WHATSAPP para um pequeno neg\xF3cio brasileiro.

Voc\xEA recebe: (1) descri\xE7\xE3o livre do dono (leigo) e (2) respostas dele para perguntas espec\xEDficas.
Sua tarefa: gerar a configura\xE7\xE3o COMPLETA do agente, no padr\xE3o de um PRD enxuto e ACION\xC1VEL \u2014 nada gen\xE9rico, nada "bl\xE1-bl\xE1 de IA".

Responda APENAS com JSON v\xE1lido (sem markdown), com EXATAMENTE estas chaves (todas strings, PT-BR):
${FIELDS.map((f) => `- ${f}`).join("\n")}

DIRETRIZES (siga \xE0 risca):
- "nome_agente": curto, humano, brasileiro (ex: Lia, Bia, Tom, Rafa). N\xE3o use "Assistente", "Bot", "IA".
- "papel_objetivo": 1-2 frases. O QUE o agente faz e PRA QUE (qualificar, vender, agendar).
- "estilo_comunicacao": tom espec\xEDfico pro segmento (ex: padaria de bairro = caloroso e direto; cl\xEDnica = cordial e seguro).
- "apresentacao": 1\xAA mensagem real que o agente envia. Curta, humana, 1 emoji s\xF3 se combinar. Nada de "Ol\xE1! Como posso ajud\xE1-lo hoje?".
- "sobre_empresa": par\xE1grafo curto que o agente pode usar quando o cliente perguntar "quem \xE9 voc\xEAs".
- "produtos_servicos": liste itens com pre\xE7o/faixa SEMPRE que o dono informou. Se n\xE3o informou, use categorias e marque "(consultar)". NUNCA invente pre\xE7o.
- "como_vender": passo a passo NUMERADO (3-6 passos) espec\xEDfico desse neg\xF3cio \u2014 n\xE3o gen\xE9rico. Ex: "1. Pergunte se \xE9 retirada ou entrega. 2. Se entrega, pe\xE7a CEP..."
- "objecoes": 3-5 obje\xE7\xF5es REAIS daquele segmento + resposta curta cada. Ex: "T\xE1 caro" \u2192 resposta concreta.
- "faq": 4-6 perguntas que clientes daquele segmento REALMENTE fazem + resposta direta.
- "politicas": troca, cancelamento, garantia, prazo \u2014 coerentes com o segmento. Se o dono n\xE3o falou, escreva uma pol\xEDtica padr\xE3o razo\xE1vel e marcada como "(confirmar com o time)".
- "posvenda_msg": mensagem curta de p\xF3s-venda alinhada ao tom.
- "pode_fazer": lista (1 por linha) do que o agente pode prometer/fazer.
- "nao_pode_fazer": lista (1 por linha) do que N\xC3O pode \u2014 inclua sempre "N\xE3o inventar pre\xE7o, prazo ou pol\xEDtica que n\xE3o esteja aqui" e "N\xE3o fechar venda sem confirmar dado essencial (endere\xE7o, hor\xE1rio, forma de pagamento)".
- "ofertas": s\xF3 preencha se o dono mencionou promo\xE7\xE3o/cupom. Sen\xE3o, "".
- "formas_pagamento": s\xF3 o que o dono disse (ou "(consultar)").
- Use "" (string vazia) quando faltar info \u2014 NUNCA omita chaves.
- N\xC3O invente: pre\xE7o, endere\xE7o, hor\xE1rio, telefone, prazo, estoque. Se faltar, deixe vazio ou marque "(consultar)".

Retorne S\xD3 o JSON.`;
      const user = `DESCRI\xC7\xC3O DO DONO:
${data.descricao}

${respostasTxt ? `RESPOSTAS ESPEC\xCDFICAS DO DONO:
${respostasTxt}` : ""}

Gere o JSON do agente.`;
      const raw2 = await lovableAiChat([
        { role: "system", content: system },
        { role: "user", content: user }
      ], { provider: "gemini", model: "google/gemini-2.5-flash" });
      const parsed = extractJson(raw2);
      const config = {};
      for (const k of FIELDS) {
        const v = parsed?.[k];
        config[k] = typeof v === "string" ? v : v == null ? "" : String(v);
      }
      const promptPreview = buildSystemPrompt(config, {
        responderEmPartes: true,
        produtos: []
      });
      return { config, promptPreview };
    });
  },
  "src/lib/lovable-ai.server": (module, exports, require2, process) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.lovableAiChat = lovableAiChat;
    const client_1 = require2("@/blink/client");
    async function lovableAiChat(messages, modelOrConfig = "gemini-2.5-flash") {
      const cfg = typeof modelOrConfig === "string" ? { provider: "gemini", model: modelOrConfig } : modelOrConfig;
      const provider = (cfg.provider || "gemini").toLowerCase();
      if (provider === "openai") {
        const key = cfg.openaiKey?.trim();
        if (!key)
          throw new Error("Chave OpenAI n\xE3o configurada na sua empresa.");
        const model = cfg.model || "gpt-4o-mini";
        return openAiChat(key, model, messages);
      }
      if (provider === "anthropic") {
        const key = cfg.anthropicKey?.trim();
        if (!key)
          throw new Error("Chave Anthropic (Claude) n\xE3o configurada na sua empresa.");
        const model = cfg.model || "claude-3-5-sonnet-latest";
        return anthropicChat(key, model, messages);
      }
      const result = await client_1.blink.ai.generateText({ messages, model: cfg.model || "gpt-4.1-mini" });
      return result.text.trim();
    }
    async function openAiChat(key, model, messages) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages })
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`OpenAI: ${res.status} ${t.slice(0, 200)}`);
      }
      const data = await res.json();
      return data?.choices?.[0]?.message?.content?.toString().trim() || "";
    }
    async function anthropicChat(key, model, messages) {
      const system = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
      const conv = messages.filter((m) => m.role !== "system").map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ model, max_tokens: 1024, system, messages: conv })
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Anthropic: ${res.status} ${t.slice(0, 200)}`);
      }
      const data = await res.json();
      const txt = (data?.content || []).filter((p) => p?.type === "text").map((p) => p.text).join("\n").trim();
      return txt;
    }
  },
  "src/lib/ai-prompt": (module, exports, require2, process) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PART_SEPARATOR = void 0;
    exports.buildSystemPrompt = buildSystemPrompt;
    exports.parseAiOutput = parseAiOutput;
    exports.classifyStagePromptInstruction = classifyStagePromptInstruction;
    exports.PART_SEPARATOR = "|||";
    const DEFAULT_STAGES = [
      { nome: "Conversas", tipo: "normal" },
      { nome: "Negociando", tipo: "normal" },
      { nome: "Ganho", tipo: "ganho" },
      { nome: "Perda", tipo: "perda" }
    ];
    function describeTom(tom) {
      const n = typeof tom === "number" ? tom : 70;
      if (n <= 25)
        return "tom mais s\xE9rio e contido";
      if (n <= 55)
        return "tom equilibrado, atencioso";
      if (n <= 80)
        return "tom caloroso e simp\xE1tico";
      return "tom muito caloroso, pr\xF3ximo, quase de amigo";
    }
    function describeFormalidade(f) {
      const n = typeof f === "number" ? f : 40;
      if (n <= 25)
        return "linguagem informal (voc\xEA, oi, beleza)";
      if (n <= 55)
        return "linguagem semi-formal (voc\xEA, com cordialidade)";
      if (n <= 80)
        return "linguagem formal (senhor/senhora, prezado)";
      return "linguagem muito formal (cerimoniosa)";
    }
    function describeTamanho(t) {
      switch ((t || "curtas").toLowerCase()) {
        case "longas":
          return "respostas mais longas e explicativas quando fizer sentido";
        case "medias":
        case "m\xE9dias":
          return "respostas de tamanho m\xE9dio";
        default:
          return "respostas curtas, no estilo WhatsApp";
      }
    }
    function describePersonalidade(p) {
      switch ((p || "padrao").toLowerCase()) {
        case "extrovertido":
          return "personalidade EXTROVERTIDA: animado, entusiasmado, usa exclama\xE7\xF5es com naturalidade, transmite energia positiva sem soar artificial";
        case "serio":
        case "s\xE9rio":
          return "personalidade S\xC9RIA: postura profissional, objetivo, direto ao ponto, sem brincadeiras, transmite compet\xEAncia e seguran\xE7a";
        case "divertido":
          return "personalidade DIVERTIDA: bem-humorado, leve, pode fazer brincadeiras inteligentes sem perder o profissionalismo";
        case "consultivo":
          return "personalidade CONSULTIVA: age como especialista/consultor, faz perguntas inteligentes, recomenda com fundamento";
        case "amigavel":
        case "amig\xE1vel":
          return "personalidade AMIG\xC1VEL: acolhedor, pr\xF3ximo, demonstra interesse genu\xEDno, parece um amigo prestativo";
        default:
          return "personalidade EQUILIBRADA: simp\xE1tico sem exageros, profissional sem ser frio";
      }
    }
    function describeFoco(f) {
      switch ((f || "ambos").toLowerCase()) {
        case "vendas":
          return "FOCO PRINCIPAL = VENDAS. Qualifique, gere interesse e conduza pro fechamento. N\xE3o seja agressivo, mas n\xE3o perca oportunidade.";
        case "suporte":
          return "FOCO PRINCIPAL = SUPORTE. Resolva problemas e tire d\xFAvidas com clareza e paci\xEAncia. N\xE3o force venda.";
        default:
          return "FOCO H\xCDBRIDO: identifique a inten\xE7\xE3o. Se for d\xFAvida/problema \u2192 resolva primeiro. Se for interesse de compra \u2192 conduza pra venda. Fa\xE7a os dois com naturalidade.";
      }
    }
    function describeEmojis(intensidade, legacy) {
      const i = (intensidade || (legacy === false ? "nenhum" : "pouco")).toLowerCase();
      switch (i) {
        case "nenhum":
          return "NUNCA use emojis";
        case "moderado":
          return "use emojis com frequ\xEAncia moderada (1 por mensagem quando combinar)";
        case "muito":
          return "use emojis com liberdade pra dar vida \xE0 conversa, sem exagerar";
        default:
          return "use no m\xE1ximo 1 emoji ocasional, s\xF3 quando combinar muito";
      }
    }
    function describeProatividade(p) {
      const n = typeof p === "number" ? p : 50;
      if (n <= 25)
        return "seja REATIVO: s\xF3 responda o que o cliente perguntar, n\xE3o antecipe ofertas";
      if (n <= 60)
        return "seja MODERADAMENTE PROATIVO: sugira o pr\xF3ximo passo quando fizer sentido";
      return "seja MUITO PROATIVO: antecipe necessidades, sugira upsell/cross-sell, conduza ativamente pro fechamento";
    }
    function montaPersonalidade(c) {
      return [
        describePersonalidade(c.personalidade),
        describeTom(c.tom),
        describeFormalidade(c.formalidade),
        describeTamanho(c.tamanho_resposta),
        describeEmojis(c.emoji_intensidade, c.usar_emojis),
        describeProatividade(c.proatividade),
        c.usar_girias ? "pode usar g\xEDrias leves do cotidiano brasileiro" : "evite g\xEDrias e express\xF5es muito informais",
        c.pode_brincar ? "pode fazer brincadeiras pontuais e leves" : "evite brincadeiras",
        c.chamar_por_nome === false ? "N\xC3O chame o cliente pelo nome a cada mensagem" : "chame o cliente pelo nome quando souber, sem repetir em toda mensagem",
        c.perguntar_uma_por_vez === false ? "" : "fa\xE7a SEMPRE uma pergunta por vez (nunca dispare v\xE1rias juntas)"
      ].filter(Boolean).join("; ");
    }
    function buildSystemPrompt(c, opts) {
      const partes = opts?.responderEmPartes ?? c.responder_em_partes ?? true;
      const stages = opts?.stages && opts.stages.length > 0 ? opts.stages : DEFAULT_STAGES;
      const produtos = opts?.produtos ?? [];
      const personalidade = montaPersonalidade(c);
      const produtosBloco = produtos.length ? "PRODUTOS / SERVI\xC7OS (cat\xE1logo real \u2014 use SOMENTE estes pre\xE7os/itens):\n" + produtos.map((p) => {
        const preco = p.preco !== void 0 && p.preco !== null && p.preco !== "" ? ` \u2014 R$ ${p.preco}` : "";
        const desc = p.descricao ? ` (${p.descricao})` : "";
        return `\u2022 ${p.nome}${preco}${desc}`;
      }).join("\n") : "";
      const stageNames = stages.map((s) => s.nome).join(" | ");
      const stagesFinaisNomes = stages.filter((s) => s.tipo === "ganho" || s.tipo === "perda").map((s) => s.nome);
      const blocos = [
        `Voc\xEA \xE9 ${c.nome_agente || "um atendente virtual"}, atendendo no WhatsApp da empresa ${c.nome_empresa || "(empresa)"}.`,
        c.apresentacao ? `Como se apresenta na primeira mensagem: ${c.apresentacao}` : "",
        `Objetivo: ${c.papel_objetivo || "atender clientes com cordialidade, descobrir o que precisam e ajudar a fechar a venda."}`,
        describeFoco(c.foco_atendimento),
        `Personalidade: ${personalidade}.`,
        c.evitar_palavras ? `PALAVRAS / EXPRESS\xD5ES PROIBIDAS (nunca use): ${c.evitar_palavras}` : "",
        c.assinar_mensagens ? `Assine a primeira mensagem do dia com "\u2014 ${c.nome_agente || "Atendente"}".` : "",
        c.estilo_comunicacao ? `Estilo de comunica\xE7\xE3o extra: ${c.estilo_comunicacao}` : "",
        c.segmento ? `Segmento da empresa: ${c.segmento}.` : "",
        c.sobre_empresa ? `Sobre a empresa:
${c.sobre_empresa}` : "",
        c.descricao_negocio ? `Descri\xE7\xE3o do neg\xF3cio:
${c.descricao_negocio}` : "",
        c.diferenciais ? `Diferenciais:
${c.diferenciais}` : "",
        c.publico_alvo ? `P\xFAblico-alvo: ${c.publico_alvo}` : "",
        c.regiao_horario ? `Regi\xE3o / hor\xE1rio de atendimento: ${c.regiao_horario}` : "",
        c.produtos_servicos ? `Produtos/servi\xE7os (descri\xE7\xE3o livre):
${c.produtos_servicos}` : "",
        produtosBloco,
        c.ofertas ? `OFERTAS ATIVAS:
${c.ofertas}` : "",
        c.cupom ? `Cupom dispon\xEDvel: ${c.cupom} (s\xF3 ofere\xE7a quando fizer sentido pra fechar)` : "",
        c.formas_pagamento ? `Formas de pagamento aceitas: ${c.formas_pagamento}` : "",
        c.ticket_medio ? `Ticket m\xE9dio de refer\xEAncia: ${c.ticket_medio}` : "",
        c.como_vender ? `COMO VENDER (passo a passo de vendas da empresa):
${c.como_vender}` : "",
        c.objecoes ? `OBJE\xC7\xD5ES COMUNS E COMO RESPONDER:
${c.objecoes}` : "",
        c.faq ? `FAQ:
${c.faq}` : "",
        c.politicas ? `POL\xCDTICAS (troca/cancelamento/garantia):
${c.politicas}` : "",
        c.posvenda_msg ? `Mensagem padr\xE3o de p\xF3s-venda: ${c.posvenda_msg}` : "",
        c.pedir_avaliacao ? "Quando uma venda for conclu\xEDda, pe\xE7a uma avalia\xE7\xE3o de forma natural." : "",
        c.reativar_cliente ? "Pode reativar clientes inativos com mensagens leves e relevantes." : "",
        c.pode_fazer ? `O QUE VOC\xCA PODE FAZER:
${c.pode_fazer}` : "",
        c.nao_pode_fazer ? `O QUE VOC\xCA N\xC3O PODE FAZER:
${c.nao_pode_fazer}` : "",
        c.agendamento_ativo ? `AGENDAMENTO ATIVO: voc\xEA pode propor hor\xE1rios para ${c.servicos_agendaveis || "os servi\xE7os agend\xE1veis"}. Dura\xE7\xE3o padr\xE3o: ${c.duracao_padrao || "30 min"}. Janelas dispon\xEDveis: ${c.horarios_disponiveis || "(n\xE3o informado)"}. Anteced\xEAncia m\xEDnima: ${c.antecedencia_min || "2 horas"}. Sempre confirme nome e o melhor hor\xE1rio antes de fechar o agendamento.` : "",
        c.telefone_transferencia ? `Se o cliente pedir atendimento humano, reclamar de algo sens\xEDvel, ou precisar de algo fora do seu escopo, oriente a falar com ${c.telefone_transferencia} e diga que vai transferir.` : "Se o cliente pedir atendimento humano ou for algo sens\xEDvel, diga educadamente que vai chamar algu\xE9m do time.",
        opts?.resumoContato ? `Contexto do contato: ${opts.resumoContato}` : "",
        opts?.estagioAtual ? `Est\xE1gio atual no CRM: ${opts.estagioAtual}.` : "",
        `M\xC9TODO DE ATENDIMENTO (siga sempre):
1. Cumprimente com naturalidade s\xF3 na PRIMEIRA mensagem da conversa. Depois N\xC3O repita sauda\xE7\xE3o.
2. Antes de oferecer qualquer coisa, ENTENDA a necessidade do cliente. Fa\xE7a UMA pergunta por vez (nunca v\xE1rias juntas).
3. Qualifique aos poucos: nome (se n\xE3o souber), o que precisa, para quando, contexto/urg\xEAncia.
4. S\xF3 fale de produto/servi\xE7o/pre\xE7o/condi\xE7\xE3o quando o cliente perguntar OU quando voc\xEA j\xE1 souber o suficiente pra recomendar com sentido.
5. NUNCA invente pre\xE7o, prazo, pol\xEDtica, estoque, endere\xE7o ou qualquer info que n\xE3o est\xE1 no prompt. Se n\xE3o tiver a info: diga que vai confirmar e, se fizer sentido, transfira pro humano.
6. Conduza pro pr\xF3ximo passo concreto: agendar, enviar proposta, confirmar pedido, marcar visita, etc.
7. Respeite SEMPRE o que est\xE1 em "N\xC3O pode fazer".

ESTILO DE MENSAGEM (WhatsApp humano):
- Portugu\xEAs do Brasil, tom pr\xF3ximo, sem ser formal demais e sem ser infantil.
- Mensagens CURTAS, frases naturais, como gente digita no WhatsApp. Nada de text\xE3o.
- Sem markdown pesado, sem listas com bullets, sem emojis em excesso.
- N\xE3o repita o nome do cliente em toda mensagem. N\xE3o repita o que ele acabou de dizer.
- N\xE3o soe como rob\xF4 ("Como posso ajud\xE1-lo hoje?"). Soe como um atendente real e atencioso.`
      ];
      if (partes) {
        blocos.push(`FORMATO DA RESPOSTA (OBRIGAT\xD3RIO):
Responda em 1 a 3 mensagens curtas, separadas pelo marcador "${exports.PART_SEPARATOR}" (tr\xEAs pipes).
Cada parte \xE9 uma "bolha" curta, como se voc\xEA estivesse digitando uma de cada vez no WhatsApp.
Exemplo: "oi, tudo bem? ${exports.PART_SEPARATOR} aqui \xE9 a Ana da Padaria do Bairro ${exports.PART_SEPARATOR} me conta, \xE9 pra retirar ou entrega?"
Se uma frase s\xF3 j\xE1 resolve, use UMA parte e pronto (sem o marcador). Nunca mais de 3 partes.`);
      } else {
        blocos.push(`FORMATO DA RESPOSTA: uma mensagem s\xF3, curta e natural.`);
      }
      if (c.agendamento_ativo && opts?.googleConectado) {
        const nowIso = (/* @__PURE__ */ new Date()).toISOString();
        blocos.push(`AGENDAMENTO REAL (Google Agenda conectado):
Hoje \xE9 ${nowIso} (UTC, fuso America/Sao_Paulo). Quando o cliente CONFIRMAR um hor\xE1rio espec\xEDfico (dia + hora) para um servi\xE7o agend\xE1vel, na MESMA resposta, em uma nova linha, escreva exatamente:
[AGENDAR: AAAA-MM-DDTHH:MM | AAAA-MM-DDTHH:MM | t\xEDtulo curto]
A primeira data \xE9 o in\xEDcio, a segunda \xE9 o fim (use ${c.duracao_padrao || "30 min"} se o cliente n\xE3o disser). Use o fuso -03:00 nos hor\xE1rios (ex.: 2026-06-20T15:00:00-03:00). Esse marcador \xE9 interno e N\xC3O aparece pro cliente. S\xF3 emita o marcador quando o cliente confirmou claramente. Nunca invente hor\xE1rios que o cliente n\xE3o disse.`);
      }
      blocos.push(`AO FINAL DA RESPOSTA, em uma nova linha, escreva exatamente:
[ESTAGIO: ${stageNames}]
Escolha 1 entre as etapas reais do CRM da empresa listadas acima. ` + (stagesFinaisNomes.length ? `Use uma etapa final (${stagesFinaisNomes.join(" / ")}) APENAS se o cliente confirmou (ganho) ou recusou claramente (perda). ` : "") + `Esse marcador \xE9 interno, N\xC3O aparece pro cliente.`);
      return blocos.filter(Boolean).join("\n\n");
    }
    function parseAiOutput(raw2, stages) {
      let text = raw2 || "";
      let stage = null;
      let agendar = null;
      const agMatch = text.match(/\[\s*AGENDAR\s*:\s*([^\]]+)\]/i);
      if (agMatch) {
        const parts3 = agMatch[1].split("|").map((s) => s.trim());
        if (parts3.length >= 2) {
          agendar = {
            inicio: parts3[0],
            fim: parts3[1],
            titulo: (parts3[2] || "Agendamento").slice(0, 120)
          };
        }
        text = text.replace(agMatch[0], "").trim();
      }
      const stageMatch = text.match(/\[\s*ESTAGIO\s*:\s*([^\]]+)\]/i);
      if (stageMatch) {
        const candidate = stageMatch[1].trim().toLowerCase();
        if (stages && stages.length) {
          const found = stages.find((s) => s.nome.toLowerCase() === candidate);
          if (found)
            stage = found.nome;
          else {
            const starts = stages.find((s) => candidate.startsWith(s.nome.toLowerCase()));
            if (starts)
              stage = starts.nome;
          }
        } else {
          stage = stageMatch[1].trim();
        }
        text = text.replace(stageMatch[0], "").trim();
      }
      const parts2 = text.split(exports.PART_SEPARATOR).map((p) => p.trim()).filter((p) => p.length > 0).slice(0, 3);
      return { parts: parts2.length ? parts2 : [text.trim()].filter(Boolean), stage, agendar };
    }
    function classifyStagePromptInstruction() {
      return "Voc\xEA \xE9 um classificador. Dado o hist\xF3rico curto de mensagens entre um vendedor e um lead pelo WhatsApp, responda APENAS com UMA palavra correspondente ao nome de uma etapa do CRM.";
    }
  },
  "src/lib/billing.functions": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.listRecentBillingEvents = exports.getBillingWebhookInfo = void 0;
    const react_start_1 = require2("@tanstack/react-start");
    const auth_middleware_1 = require2("@/integrations/supabase/auth-middleware");
    async function assertSuperAdmin(supabase, userId) {
      const { data, error } = await supabase.rpc("is_super_admin");
      if (error)
        throw new Error(error.message);
      if (!data)
        throw new Error("Acesso negado");
      void userId;
    }
    exports.getBillingWebhookInfo = (0, react_start_1.createServerFn)({ method: "GET" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      await assertSuperAdmin(context.supabase, context.userId);
      return {
        kiwify: !!process.env.KIWIFY_WEBHOOK_TOKEN,
        cakto: !!process.env.CAKTO_WEBHOOK_TOKEN,
        perfectpay: !!process.env.PERFECTPAY_WEBHOOK_TOKEN
      };
    });
    exports.listRecentBillingEvents = (0, react_start_1.createServerFn)({ method: "GET" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      await assertSuperAdmin(context.supabase, context.userId);
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { data, error } = await supabaseAdmin.from("billing_event_log").select("id, provider, event_type, buyer_email, processed, error, matched_company_id, created_at").order("created_at", { ascending: false }).limit(20);
      if (error)
        throw new Error(error.message);
      return data ?? [];
    });
  },
  "src/lib/campaigns.functions": (module, exports, require2, process) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cancelCampaign = exports.pauseCampaign = exports.startCampaign = exports.deleteCampaign = exports.saveCampaign = exports.previewAudience = exports.listAvailableTags = exports.getCampaign = exports.listCampaigns = void 0;
    const react_start_1 = require2("@tanstack/react-start");
    const auth_middleware_1 = require2("@/integrations/supabase/auth-middleware");
    async function resolveCompanyId(supabase, userId) {
      const { data, error } = await supabase.from("company_user").select("company_id").eq("user_id", userId).eq("ativo", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      if (error)
        throw error;
      if (!data)
        throw new Error("Sem empresa.");
      return data.company_id;
    }
    exports.listCampaigns = (0, react_start_1.createServerFn)({ method: "GET" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const { supabase, userId } = context;
      const companyId = await resolveCompanyId(supabase, userId);
      const { data, error } = await supabase.from("campaign").select("*").eq("company_id", companyId).order("created_at", { ascending: false });
      if (error)
        throw new Error(error.message);
      return data ?? [];
    });
    exports.getCampaign = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const { supabase, userId } = context;
      const companyId = await resolveCompanyId(supabase, userId);
      const { data: c } = await supabase.from("campaign").select("*").eq("id", data.id).eq("company_id", companyId).maybeSingle();
      if (!c)
        throw new Error("Campanha n\xE3o encontrada.");
      const { data: targets } = await supabase.from("campaign_target").select("*").eq("campaign_id", data.id).order("created_at", { ascending: true }).limit(500);
      return { campaign: c, targets: targets ?? [] };
    });
    exports.listAvailableTags = (0, react_start_1.createServerFn)({ method: "GET" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const { supabase, userId } = context;
      const companyId = await resolveCompanyId(supabase, userId);
      const { data } = await supabase.from("crm_cards").select("tags").eq("company_id", companyId);
      const set = /* @__PURE__ */ new Set();
      for (const row of data ?? []) {
        for (const t of row.tags ?? [])
          if (t)
            set.add(t);
      }
      return Array.from(set).sort();
    });
    exports.previewAudience = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const { supabase, userId } = context;
      const companyId = await resolveCompanyId(supabase, userId);
      let q = supabase.from("crm_cards").select("numero, contato_nome, tags").eq("company_id", companyId);
      if (data.tags && data.tags.length)
        q = q.overlaps("tags", data.tags);
      const { data: rows, error } = await q;
      if (error)
        throw new Error(error.message);
      const map = /* @__PURE__ */ new Map();
      for (const r of rows ?? []) {
        const num = String(r.numero || "").replace(/\D/g, "");
        if (!num)
          continue;
        if (!map.has(num))
          map.set(num, { numero: num, nome: r.contato_nome ?? null });
      }
      return { total: map.size, sample: Array.from(map.values()).slice(0, 10) };
    });
    exports.saveCampaign = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const { supabase, userId } = context;
      const companyId = await resolveCompanyId(supabase, userId);
      const payload = {
        company_id: companyId,
        created_by: userId,
        nome: data.nome,
        mensagem: data.mensagem,
        agendado_para: data.agendado_para || null,
        filtro_tags: data.filtro_tags ?? [],
        intervalo_min_seg: Math.max(2, data.intervalo_min_seg ?? 5),
        intervalo_max_seg: Math.max(data.intervalo_min_seg ?? 5, data.intervalo_max_seg ?? 20),
        pausa_apos_envios: Math.max(10, data.pausa_apos_envios ?? 50),
        pausa_duracao_min: Math.max(1, data.pausa_duracao_min ?? 10)
      };
      if (data.id) {
        const { data: row2, error: error2 } = await supabase.from("campaign").update(payload).eq("id", data.id).eq("company_id", companyId).select("*").maybeSingle();
        if (error2)
          throw new Error(error2.message);
        return row2;
      }
      const { data: row, error } = await supabase.from("campaign").insert(payload).select("*").maybeSingle();
      if (error)
        throw new Error(error.message);
      return row;
    });
    exports.deleteCampaign = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const { supabase, userId } = context;
      const companyId = await resolveCompanyId(supabase, userId);
      const { error } = await supabase.from("campaign").delete().eq("id", data.id).eq("company_id", companyId);
      if (error)
        throw new Error(error.message);
      return { ok: true };
    });
    exports.startCampaign = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const { supabase, userId } = context;
      const companyId = await resolveCompanyId(supabase, userId);
      const { data: c } = await supabase.from("campaign").select("*").eq("id", data.id).eq("company_id", companyId).maybeSingle();
      if (!c)
        throw new Error("Campanha n\xE3o encontrada.");
      if (c.status === "enviando" || c.status === "agendada")
        throw new Error("Campanha j\xE1 est\xE1 em execu\xE7\xE3o.");
      let q = supabase.from("crm_cards").select("numero, contato_nome, tags").eq("company_id", companyId);
      if ((c.filtro_tags ?? []).length)
        q = q.overlaps("tags", c.filtro_tags);
      const { data: rows } = await q;
      const map = /* @__PURE__ */ new Map();
      for (const r of rows ?? []) {
        const num = String(r.numero || "").replace(/\D/g, "");
        if (!num)
          continue;
        if (!map.has(num))
          map.set(num, r.contato_nome ?? null);
      }
      if (map.size === 0)
        throw new Error("Nenhum contato bate com os filtros.");
      await supabase.from("campaign_target").delete().eq("campaign_id", c.id);
      const inserts = Array.from(map.entries()).map(([numero, nome]) => ({
        campaign_id: c.id,
        company_id: companyId,
        contato_numero: numero,
        contato_nome: nome,
        status: "pendente"
      }));
      for (let i = 0; i < inserts.length; i += 500) {
        const { error: error2 } = await supabase.from("campaign_target").insert(inserts.slice(i, i + 500));
        if (error2)
          throw new Error(error2.message);
      }
      const proximo = c.agendado_para && new Date(c.agendado_para) > /* @__PURE__ */ new Date() ? c.agendado_para : (/* @__PURE__ */ new Date()).toISOString();
      const status = c.agendado_para && new Date(c.agendado_para) > /* @__PURE__ */ new Date() ? "agendada" : "enviando";
      const { error } = await supabase.from("campaign").update({
        status,
        total_destinatarios: inserts.length,
        total_enviados: 0,
        total_falhas: 0,
        iniciado_em: (/* @__PURE__ */ new Date()).toISOString(),
        proximo_envio_em: proximo,
        concluido_em: null
      }).eq("id", c.id);
      if (error)
        throw new Error(error.message);
      return { ok: true, total: inserts.length };
    });
    exports.pauseCampaign = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const { supabase, userId } = context;
      const companyId = await resolveCompanyId(supabase, userId);
      const status = data.pause ? "pausada" : "enviando";
      const update = { status };
      if (!data.pause)
        update.proximo_envio_em = (/* @__PURE__ */ new Date()).toISOString();
      const { error } = await supabase.from("campaign").update(update).eq("id", data.id).eq("company_id", companyId);
      if (error)
        throw new Error(error.message);
      return { ok: true };
    });
    exports.cancelCampaign = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const { supabase, userId } = context;
      const companyId = await resolveCompanyId(supabase, userId);
      const { error } = await supabase.from("campaign").update({ status: "cancelada", concluido_em: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", data.id).eq("company_id", companyId);
      if (error)
        throw new Error(error.message);
      return { ok: true };
    });
  },
  "src/lib/checkout.functions": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createCheckoutCompany = void 0;
    const react_start_1 = require2("@tanstack/react-start");
    const auth_middleware_1 = require2("@/integrations/supabase/auth-middleware");
    const tenant_1 = require2("src/lib/tenant");
    exports.createCheckoutCompany = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => {
      const nome = String(d.nome || "").trim();
      if (nome.length < 2)
        throw new Error("Informe o nome da sua empresa.");
      const plano_slug = d.plano_slug ? String(d.plano_slug).toLowerCase().trim() : null;
      return { nome, plano_slug };
    }).handler(async ({ context, data }) => {
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { data: existing, error: existingErr } = await supabaseAdmin.from("company_user").select("company_id").eq("user_id", context.userId).eq("ativo", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      if (existingErr)
        throw existingErr;
      if (existing?.company_id)
        return { companyId: existing.company_id };
      const requestedPlan = data.plano_slug || "starter";
      const { data: plan, error: planErr } = await supabaseAdmin.from("plan").select("id, trial_days, slug").eq("slug", requestedPlan).eq("ativo", true).maybeSingle();
      if (planErr)
        throw planErr;
      if (!plan)
        throw new Error("Plano selecionado n\xE3o est\xE1 dispon\xEDvel.");
      const trialDays = Math.max(0, Number(plan.trial_days) || 0);
      const planSlug = plan.slug;
      const slug = `${(0, tenant_1.slugify)(data.nome)}-${Math.random().toString(36).slice(2, 6)}`;
      const trialAte = new Date(Date.now() + trialDays * 864e5).toISOString();
      const { data: company, error: companyErr } = await supabaseAdmin.from("company").insert({
        nome: data.nome,
        slug,
        primary_color: "#25D366",
        created_by: context.userId,
        status_cobranca: "trial",
        onboarding_completed: false,
        onboarding_step: 0,
        trial_ate: trialAte,
        selected_plan_slug: planSlug
      }).select("id").single();
      if (companyErr || !company)
        throw new Error(companyErr?.message || "Falha ao criar empresa");
      const { error: memberErr } = await supabaseAdmin.from("company_user").insert({
        user_id: context.userId,
        company_id: company.id,
        role: "owner",
        ativo: true
      });
      if (memberErr) {
        await supabaseAdmin.from("company").delete().eq("id", company.id);
        throw memberErr;
      }
      const { error: subscriptionErr } = await supabaseAdmin.from("subscription").insert({
        company_id: company.id,
        plan_id: plan.id,
        status: "trialing",
        trial_ends_at: trialAte,
        current_period_end: trialAte,
        metadata: { source: "self_service_trial" }
      });
      if (subscriptionErr) {
        await supabaseAdmin.from("company").delete().eq("id", company.id);
        throw subscriptionErr;
      }
      return { companyId: company.id };
    });
  },
  "src/lib/tenant": (module, exports, require2, process) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.trialDaysLeft = trialDaysLeft;
    exports.slugify = slugify;
    function trialDaysLeft(trialAte) {
      const end = new Date(trialAte).getTime();
      const ms = end - Date.now();
      return Math.ceil(ms / (1e3 * 60 * 60 * 24));
    }
    function slugify(s) {
      return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48) || "empresa";
    }
  },
  "src/lib/credits.functions": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.adminGrantCredits = exports.getMyCredits = void 0;
    const react_start_1 = require2("@tanstack/react-start");
    const auth_middleware_1 = require2("@/integrations/supabase/auth-middleware");
    exports.getMyCredits = (0, react_start_1.createServerFn)({ method: "GET" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const { data: cu } = await context.supabase.from("company_user").select("company_id").eq("user_id", context.userId).eq("ativo", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      if (!cu)
        return { saldo: 0, origem: "trial", resetam_em: null, ledger: [] };
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const [comp, led] = await Promise.all([
        supabaseAdmin.from("company").select("creditos_saldo, creditos_origem, creditos_resetam_em").eq("id", cu.company_id).maybeSingle(),
        supabaseAdmin.from("credit_ledger").select("delta, saldo_apos, motivo, ref, created_at").eq("company_id", cu.company_id).order("created_at", { ascending: false }).limit(20)
      ]);
      return {
        saldo: comp.data?.creditos_saldo ?? 0,
        origem: comp.data?.creditos_origem ?? "trial",
        resetam_em: comp.data?.creditos_resetam_em ?? null,
        ledger: led.data ?? []
      };
    });
    exports.adminGrantCredits = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ data, context }) => {
      const { data: novo, error } = await context.supabase.rpc("grant_credits", {
        _company_id: data.companyId,
        _qtd: data.qtd,
        _motivo: data.motivo || "bonus_admin"
      });
      if (error)
        throw new Error(error.message);
      return { saldo: novo };
    });
  },
  "src/lib/csat.functions": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCsatByToken = exports.submitCsat = exports.sendCsat = void 0;
    const react_start_1 = require2("@tanstack/react-start");
    const auth_middleware_1 = require2("@/integrations/supabase/auth-middleware");
    async function resolveCompanyId(supabase, userId) {
      const { data } = await supabase.from("company_user").select("company_id").eq("user_id", userId).eq("ativo", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      if (!data)
        throw new Error("Sem empresa.");
      return data.company_id;
    }
    function appOrigin() {
      return (process.env.PUBLIC_APP_URL || `https://${process.env.BLINK_PROJECT_ID}.blinkpowered.com`).replace(/\/$/, "");
    }
    exports.sendCsat = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const { supabase, userId } = context;
      const companyId = await resolveCompanyId(supabase, userId);
      const numero = String(data.numero).replace(/\D/g, "");
      if (!numero)
        throw new Error("N\xFAmero inv\xE1lido.");
      const { data: row, error } = await supabase.from("csat_response").insert({ company_id: companyId, numero, token: crypto.randomUUID(), enviado_em: (/* @__PURE__ */ new Date()).toISOString(), contato_nome: data.contatoNome ?? null, enviado_por: userId }).select("token").maybeSingle();
      if (error || !row)
        throw new Error(error?.message ?? "Falha ao registrar CSAT.");
      const { data: inst } = await supabase.from("whatsapp_instances").select("instance_name,status").eq("company_id", companyId).maybeSingle();
      let sent = false;
      if (inst && inst.status === "connected") {
        const link = `${appOrigin()}/csat/${row.token}`;
        const texto = `Ol\xE1! Como foi nosso atendimento? Avalie em 1 minuto: ${link}`;
        try {
          const { evoSendText } = await Promise.resolve().then(() => __importStar(require2("src/lib/evolution.server")));
          await evoSendText(inst.instance_name, numero, texto);
          sent = true;
          await supabase.from("mensagens").insert({
            company_id: companyId,
            user_id: userId,
            numero,
            contato_nome: data.contatoNome ?? null,
            direcao: "saida",
            autor: "sistema",
            texto
          });
        } catch (e) {
          console.warn("[csat send]", e);
        }
      }
      return { ok: true, token: row.token, sent };
    });
    exports.submitCsat = (0, react_start_1.createServerFn)({ method: "POST" }).inputValidator((d) => d).handler(async ({ data }) => {
      if (!data.token || data.score < 1 || data.score > 5)
        throw new Error("Dados inv\xE1lidos.");
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { data: row } = await supabaseAdmin.from("csat_response").select("id, respondido_em").eq("token", data.token).maybeSingle();
      if (!row)
        throw new Error("Pesquisa n\xE3o encontrada.");
      if (row.respondido_em)
        throw new Error("Pesquisa j\xE1 respondida.");
      const { error } = await supabaseAdmin.from("csat_response").update({
        score: data.score,
        comentario: data.comentario ?? null,
        respondido_em: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", row.id);
      if (error)
        throw new Error(error.message);
      return { ok: true };
    });
    exports.getCsatByToken = (0, react_start_1.createServerFn)({ method: "POST" }).inputValidator((d) => d).handler(async ({ data }) => {
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { data: row } = await supabaseAdmin.from("csat_response").select("token, respondido_em, company_id").eq("token", data.token).maybeSingle();
      if (!row)
        return { found: false };
      const { data: comp } = await supabaseAdmin.from("company").select("nome, primary_color").eq("id", row.company_id).maybeSingle();
      return { found: true, respondido: !!row.respondido_em, empresa: comp?.nome ?? "", primaryColor: comp?.primary_color ?? "#22C55E" };
    });
  },
  "src/lib/evolution.server": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.evoCreateInstance = evoCreateInstance;
    exports.evoConnect = evoConnect;
    exports.evoGetQr = evoGetQr;
    exports.evoState = evoState;
    exports.evoSetWebhook = evoSetWebhook;
    exports.evoSendText = evoSendText;
    exports.evoSendPresence = evoSendPresence;
    exports.evoLogout = evoLogout;
    exports.evoDelete = evoDelete;
    exports.evoFetchNumberFromInstance = evoFetchNumberFromInstance;
    const QRCode = __importStar(require2("qrcode"));
    const supportNumber = String(process.env.SUPPORT_WHATSAPP || "").replace(/\D/g, "");
    const SUPPORT_SUFFIX = supportNumber ? ` Se persistir, fale com o suporte: https://wa.me/${supportNumber}` : "";
    function env() {
      const url = process.env.EVOLUTION_API_URL;
      const key = process.env.EVOLUTION_API_KEY;
      if (!url || !key) {
        throw new Error(`Servidor do WhatsApp n\xE3o configurado. Configure EVOLUTION_API_URL e EVOLUTION_API_KEY nos segredos do backend.${SUPPORT_SUFFIX}`);
      }
      return { url: url.replace(/\/+$/, ""), key };
    }
    async function evo(path, init = {}) {
      const { url, key } = env();
      const headers = {
        apikey: key,
        "Content-Type": "application/json",
        ...init.headers
      };
      let res;
      try {
        res = await fetch(`${url}${path}`, {
          ...init,
          headers,
          body: init.json !== void 0 ? JSON.stringify(init.json) : init.body
        });
      } catch (e) {
        throw new Error(`Evolution API indispon\xEDvel: ${e?.message || "falha de rede"}.${SUPPORT_SUFFIX}`);
      }
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = { raw: text };
      }
      if (!res.ok) {
        const msg = data?.message || data?.error || text || `HTTP ${res.status}`;
        throw new Error(`Evolution API: ${msg}.${SUPPORT_SUFFIX}`);
      }
      return data;
    }
    async function evoCreateInstance(instanceName, webhookUrl) {
      const body = {
        instanceName,
        integration: "WHATSAPP-BAILEYS",
        qrcode: true
      };
      if (webhookUrl) {
        body.webhook = {
          url: webhookUrl,
          byEvents: false,
          base64: false,
          events: ["MESSAGES_UPSERT"]
        };
      }
      return evo(`/instance/create`, { method: "POST", json: body });
    }
    async function evoConnect(instanceName) {
      return evo(`/instance/connect/${encodeURIComponent(instanceName)}`, { method: "GET" });
    }
    function asImageDataUrl(value2, allowRawBase64 = false) {
      const text = typeof value2 === "string" ? value2.trim() : "";
      if (!text)
        return null;
      if (text.startsWith("data:image/"))
        return text;
      const base64 = text.includes("base64,") ? text.split("base64,").pop()?.trim() : text;
      if (allowRawBase64 && base64 && base64.length > 120 && /^[A-Za-z0-9+/=\s]+$/.test(base64) && looksLikeImageBase64(base64)) {
        return `data:image/png;base64,${base64.replace(/\s/g, "")}`;
      }
      return null;
    }
    function looksLikeImageBase64(base64) {
      try {
        const bin = atob(base64.replace(/\s/g, "").slice(0, 64));
        return bin.charCodeAt(0) === 137 && bin.slice(1, 4) === "PNG" || bin.charCodeAt(0) === 255 && bin.charCodeAt(1) === 216 || bin.slice(0, 4) === "RIFF" && bin.slice(8, 12) === "WEBP";
      } catch {
        return false;
      }
    }
    function extractQrCode(payload) {
      const candidates = [
        payload?.code,
        payload?.qrcode?.code,
        payload?.qrCode,
        payload?.qrcode,
        payload?.qr
      ];
      for (const value2 of candidates) {
        if (typeof value2 === "string" && value2.trim() && !asImageDataUrl(value2, false))
          return value2.trim();
      }
      return null;
    }
    async function evoGetQr(instanceName) {
      const payload = await evoConnect(instanceName);
      const image = asImageDataUrl(payload?.base64, true) || asImageDataUrl(payload?.qrcode?.base64, true) || asImageDataUrl(payload?.qr?.base64, true) || asImageDataUrl(payload?.qrcode, true) || asImageDataUrl(payload?.qr, true);
      const code = extractQrCode(payload);
      if (image)
        return { qrBase64: image, code, pairingCode: payload?.pairingCode ?? payload?.qrcode?.pairingCode ?? null };
      if (code) {
        const qrBase64 = await QRCode.toDataURL(code, { width: 320, margin: 2, errorCorrectionLevel: "M" });
        return { qrBase64, code, pairingCode: payload?.pairingCode ?? payload?.qrcode?.pairingCode ?? null };
      }
      return { qrBase64: null, code: null, pairingCode: payload?.pairingCode ?? payload?.qrcode?.pairingCode ?? null };
    }
    async function evoState(instanceName) {
      return evo(`/instance/connectionState/${encodeURIComponent(instanceName)}`, { method: "GET" });
    }
    async function evoSetWebhook(instanceName, webhookUrl) {
      return evo(`/webhook/set/${encodeURIComponent(instanceName)}`, {
        method: "POST",
        json: {
          webhook: {
            enabled: true,
            url: webhookUrl,
            byEvents: false,
            base64: false,
            events: ["MESSAGES_UPSERT"]
          }
        }
      });
    }
    async function evoSendText(instanceName, number, text) {
      return evo(`/message/sendText/${encodeURIComponent(instanceName)}`, {
        method: "POST",
        json: { number, text }
      });
    }
    async function evoSendPresence(instanceName, number, presence, delayMs = 1500) {
      try {
        await evo(`/chat/sendPresence/${encodeURIComponent(instanceName)}`, {
          method: "POST",
          json: { number, presence, delay: delayMs }
        });
      } catch {
      }
    }
    async function evoLogout(instanceName) {
      return evo(`/instance/logout/${encodeURIComponent(instanceName)}`, { method: "DELETE" });
    }
    async function evoDelete(instanceName) {
      return evo(`/instance/delete/${encodeURIComponent(instanceName)}`, { method: "DELETE" });
    }
    async function evoFetchNumberFromInstance(instanceName) {
      try {
        const data = await evo(`/instance/fetchInstances?instanceName=${encodeURIComponent(instanceName)}`, {
          method: "GET"
        });
        const inst = Array.isArray(data) ? data[0] : data?.[0] ?? data;
        return inst?.instance?.owner || inst?.owner || inst?.number || null;
      } catch {
        return null;
      }
    }
  },
  "src/lib/evolution.functions": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.testAiReply = exports.setContactIaActive = exports.sendWhatsappText = exports.disconnectWhatsapp = exports.checkWhatsappStatus = exports.connectWhatsapp = void 0;
    const react_start_1 = require2("@tanstack/react-start");
    const auth_middleware_1 = require2("@/integrations/supabase/auth-middleware");
    const server_1 = require2("@tanstack/react-start/server");
    function deriveInstanceName(companyId) {
      return `atendezap_${companyId.replace(/-/g, "").slice(0, 16)}`;
    }
    function buildWebhookUrl(token) {
      try {
        const req = (0, server_1.getRequest)();
        const url = new URL(req.url);
        const tokenQuery = token ? `?t=${encodeURIComponent(token)}` : "";
        return `${url.protocol}//${url.host}/api/public/whatsapp-webhook${tokenQuery}`;
      } catch {
        return "";
      }
    }
    async function resolveCompanyId(supabase, userId) {
      const { data, error } = await supabase.from("company_user").select("company_id").eq("user_id", userId).eq("ativo", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      if (error)
        throw error;
      if (!data)
        throw new Error("Voc\xEA ainda n\xE3o possui uma empresa. Finalize o onboarding.");
      return data.company_id;
    }
    exports.connectWhatsapp = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const { supabase, userId } = context;
      const companyId = await resolveCompanyId(supabase, userId);
      const { evoCreateInstance, evoGetQr, evoSetWebhook, evoState } = await Promise.resolve().then(() => __importStar(require2("src/lib/evolution.server")));
      const { data: existing } = await supabase.from("whatsapp_instances").select("instance_name,status,numero,webhook_token").eq("company_id", companyId).maybeSingle();
      const instanceName = existing?.instance_name || deriveInstanceName(companyId);
      const webhookToken = existing?.webhook_token || crypto.randomUUID();
      const webhookUrl = buildWebhookUrl(webhookToken);
      if (existing?.instance_name) {
        try {
          const s = await evoState(existing.instance_name);
          const existingState = s?.instance?.state || s?.state;
          if (existingState === "open") {
            if (webhookUrl) {
              try {
                await evoSetWebhook(existing.instance_name, webhookUrl);
              } catch (e) {
                console.warn("[evolution.setWebhook]", e);
              }
            }
            if (existing.status !== "connected") {
              await supabase.from("whatsapp_instances").update({ status: "connected", webhook_token: webhookToken, webhook_configured_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("company_id", companyId);
            }
            return { instanceName: existing.instance_name, qrBase64: null, code: null, state: "open", webhookUrl };
          }
        } catch {
        }
      }
      await supabase.from("whatsapp_instances").upsert({ company_id: companyId, user_id: userId, instance_name: instanceName, status: "connecting", webhook_token: webhookToken }, { onConflict: "company_id" });
      try {
        await evoCreateInstance(instanceName, webhookUrl);
      } catch (e) {
        const msg = String(e?.message || "");
        if (!/exists|already/i.test(msg))
          console.warn("[evolution.create]", msg);
        if (!/exists|already/i.test(msg))
          throw e;
      }
      if (webhookUrl) {
        try {
          await evoSetWebhook(instanceName, webhookUrl);
        } catch (e) {
          console.warn("[evolution.setWebhook]", e);
        }
      }
      let qrBase64 = null;
      let code = null;
      let lastQrError = null;
      for (let i = 0; i < 6; i++) {
        try {
          const qr = await evoGetQr(instanceName);
          qrBase64 = qr.qrBase64;
          code = qr.code;
          if (qrBase64 || code)
            break;
        } catch (e) {
          lastQrError = e;
          console.warn("[evolution.connect]", e);
        }
        await new Promise((r) => setTimeout(r, 800));
      }
      if (!qrBase64 && !code && lastQrError) {
        throw lastQrError;
      }
      let state;
      try {
        const s = await evoState(instanceName);
        state = s?.instance?.state || s?.state;
      } catch {
      }
      return { instanceName, qrBase64, code, state, webhookUrl };
    });
    exports.checkWhatsappStatus = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const { supabase, userId } = context;
      const companyId = await resolveCompanyId(supabase, userId);
      const { evoState, evoFetchNumberFromInstance, evoSetWebhook } = await Promise.resolve().then(() => __importStar(require2("src/lib/evolution.server")));
      const { data: row } = await supabase.from("whatsapp_instances").select("instance_name,status,numero,webhook_token,webhook_configured_at").eq("company_id", companyId).maybeSingle();
      if (!row)
        return { status: "disconnected", state: null, numero: null, qrBase64: null, code: null };
      let state = null;
      let stateError = false;
      try {
        const s = await evoState(row.instance_name);
        state = s?.instance?.state || s?.state || null;
      } catch (e) {
        stateError = true;
        console.warn("[evolution.state]", e);
      }
      if (stateError) {
        return {
          status: row.status || "disconnected",
          state: null,
          numero: row.numero ?? null,
          qrBase64: null,
          code: null
        };
      }
      const newStatus = state === "open" ? "connected" : state === "connecting" ? "connecting" : "disconnected";
      let numero = row.numero ?? null;
      if (newStatus === "connected" && !numero) {
        try {
          numero = await evoFetchNumberFromInstance(row.instance_name);
        } catch {
        }
      }
      if (newStatus === "connected" && row.webhook_token && !row.webhook_configured_at) {
        const webhookUrl = buildWebhookUrl(row.webhook_token);
        if (webhookUrl) {
          try {
            await evoSetWebhook(row.instance_name, webhookUrl);
            await supabase.from("whatsapp_instances").update({ webhook_configured_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("company_id", companyId);
          } catch (e) {
            console.warn("[evolution.setWebhook]", e);
          }
        }
      }
      if (newStatus !== row.status || numero && numero !== row.numero) {
        await supabase.from("whatsapp_instances").update({ status: newStatus, ...numero ? { numero } : {} }).eq("company_id", companyId);
      }
      return { status: newStatus, state, numero, qrBase64: null, code: null };
    });
    exports.disconnectWhatsapp = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const { supabase, userId } = context;
      const companyId = await resolveCompanyId(supabase, userId);
      const { evoLogout } = await Promise.resolve().then(() => __importStar(require2("src/lib/evolution.server")));
      const { data: row } = await supabase.from("whatsapp_instances").select("instance_name").eq("company_id", companyId).maybeSingle();
      if (row) {
        try {
          await evoLogout(row.instance_name);
        } catch (e) {
          console.warn("[evolution.logout]", e);
        }
        await supabase.from("whatsapp_instances").update({ status: "disconnected" }).eq("company_id", companyId);
      }
      return { ok: true };
    });
    exports.sendWhatsappText = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const { supabase, userId } = context;
      const companyId = await resolveCompanyId(supabase, userId);
      const { data: inst } = await supabase.from("whatsapp_instances").select("instance_name,status").eq("company_id", companyId).maybeSingle();
      if (!inst?.instance_name)
        throw new Error("WhatsApp n\xE3o conectado");
      const { data: recentInbound } = await supabase.from("mensagens").select("id").eq("company_id", companyId).eq("numero", data.numero).eq("direcao", "entrada").gte("created_at", new Date(Date.now() - 24 * 60 * 6e4).toISOString()).limit(1);
      if (!recentInbound?.length) {
        throw new Error("Por seguran\xE7a, s\xF3 \xE9 poss\xEDvel responder contatos que mandaram mensagem nas \xFAltimas 24h. Para iniciar conversa, use a API oficial com template aprovado.");
      }
      const { data: recentOutbound } = await supabase.from("mensagens").select("id").eq("company_id", companyId).eq("numero", data.numero).eq("direcao", "saida").gte("created_at", new Date(Date.now() - 10 * 6e4).toISOString()).limit(6);
      if ((recentOutbound?.length ?? 0) >= 6) {
        throw new Error("Envio pausado por alguns minutos para proteger a qualidade do n\xFAmero.");
      }
      const { assertWithinLimit } = await Promise.resolve().then(() => __importStar(require2("src/lib/plan-limits.server")));
      await assertWithinLimit(companyId, "mensagens");
      const { evoSendText } = await Promise.resolve().then(() => __importStar(require2("src/lib/evolution.server")));
      try {
        await evoSendText(inst.instance_name, data.numero, data.texto);
      } catch (e) {
        throw new Error(`Falha ao enviar: ${e?.message ?? e}`);
      }
      const { error } = await supabase.from("mensagens").insert({
        company_id: companyId,
        user_id: userId,
        numero: data.numero,
        contato_nome: data.contatoNome ?? null,
        direcao: "saida",
        autor: "humano",
        texto: data.texto
      });
      if (error)
        throw new Error(error.message);
      await supabase.from("contact_pause").upsert({ company_id: companyId, user_id: userId, numero: data.numero, pausado: true }, { onConflict: "company_id,numero" });
      return { ok: true };
    });
    exports.setContactIaActive = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const { supabase, userId } = context;
      const companyId = await resolveCompanyId(supabase, userId);
      const { error } = await supabase.from("contact_pause").upsert({ company_id: companyId, user_id: userId, numero: data.numero, pausado: !data.ativa }, { onConflict: "company_id,numero" });
      if (error)
        throw new Error(error.message);
      return { ok: true };
    });
    exports.testAiReply = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const { supabase, userId } = context;
      const companyId = await resolveCompanyId(supabase, userId);
      const { lovableAiChat } = await Promise.resolve().then(() => __importStar(require2("src/lib/lovable-ai.server")));
      const { buildSystemPrompt, parseAiOutput } = await Promise.resolve().then(() => __importStar(require2("src/lib/ai-prompt")));
      const [{ data: cfg }, { data: stagesRows }, { data: prodRows }] = await Promise.all([
        supabase.from("agent_config").select("*").eq("company_id", companyId).maybeSingle(),
        supabase.from("crm_stage").select("nome, tipo, ordem").eq("company_id", companyId).order("ordem", { ascending: true }),
        supabase.from("produto").select("nome, preco, descricao, ordem").eq("company_id", companyId).eq("ativo", true).order("ordem", { ascending: true })
      ]);
      const stages = (stagesRows ?? []).map((s) => ({ nome: s.nome, tipo: s.tipo }));
      const produtos = (prodRows ?? []).map((p) => ({ nome: p.nome, preco: p.preco, descricao: p.descricao }));
      const system = buildSystemPrompt(cfg ?? {}, {
        responderEmPartes: cfg?.responder_em_partes ?? true,
        stages,
        produtos
      });
      const { getCompanyPlan } = await Promise.resolve().then(() => __importStar(require2("src/lib/plan-limits.server")));
      const { allowsProvider, PLAN_LABEL } = await Promise.resolve().then(() => __importStar(require2("src/lib/plan-features")));
      const plan = await getCompanyPlan(companyId);
      let provider = cfg?.ai_provider || "gemini";
      let model = cfg?.ai_model || "google/gemini-2.5-flash";
      if (!allowsProvider(plan.slug, provider)) {
        throw new Error(`O provedor ${provider.toUpperCase()} n\xE3o est\xE1 incluso no plano ${PLAN_LABEL[plan.slug]}. Fa\xE7a upgrade para Pro para usar GPT/Claude.`);
      }
      const raw2 = await lovableAiChat([
        { role: "system", content: system },
        { role: "user", content: data.message }
      ], {
        provider,
        model,
        openaiKey: cfg?.openai_api_key || "",
        anthropicKey: cfg?.anthropic_api_key || ""
      });
      const { parts: parts2, stage } = parseAiOutput(raw2, stages);
      return { reply: parts2.join("\n\n"), parts: parts2, stage, system };
    });
  },
  "src/lib/plan-limits.server": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCompanyPlan = getCompanyPlan;
    exports.getCompanyUsage = getCompanyUsage;
    exports.getCompanyPlanUsage = getCompanyPlanUsage;
    exports.assertWithinLimit = assertWithinLimit;
    exports.isWithinLimit = isWithinLimit;
    const plan_features_1 = require2("src/lib/plan-features");
    function startOfMonthISO() {
      const d = /* @__PURE__ */ new Date();
      return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString();
    }
    async function getCompanyPlan(companyId) {
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { data: sub } = await supabaseAdmin.from("subscription").select("plan_id, status, plan:plan(slug, nome, limite_instancias, limite_mensagens, limite_usuarios, limite_contatos)").eq("company_id", companyId).in("status", ["active", "trialing", "past_due"]).order("created_at", { ascending: false }).limit(1).maybeSingle();
      let row = sub?.plan ?? null;
      if (!row) {
        const { data: company } = await supabaseAdmin.from("company").select("selected_plan_slug, status_cobranca, trial_ate").eq("id", companyId).maybeSingle();
        const trialValid = company?.status_cobranca === "trial" && !!company?.trial_ate && new Date(company.trial_ate).getTime() > Date.now();
        if (trialValid && company?.selected_plan_slug) {
          const { data: selected } = await supabaseAdmin.from("plan").select("slug, nome, limite_instancias, limite_mensagens, limite_usuarios, limite_contatos").eq("slug", company.selected_plan_slug).eq("ativo", true).maybeSingle();
          row = selected;
        }
      }
      if (!row) {
        const { data: fallback } = await supabaseAdmin.from("plan").select("slug, nome, limite_instancias, limite_mensagens, limite_usuarios, limite_contatos").eq("slug", "starter").maybeSingle();
        row = fallback;
      }
      const slug = (0, plan_features_1.normalizePlanSlug)(row?.slug);
      return {
        slug,
        nome: row?.nome || plan_features_1.PLAN_LABEL[slug],
        limites: {
          instancias: Number(row?.limite_instancias ?? 1),
          usuarios: Number(row?.limite_usuarios ?? 1),
          contatos: Number(row?.limite_contatos ?? 1e3),
          mensagens: Number(row?.limite_mensagens ?? 1500)
        }
      };
    }
    async function getCompanyUsage(companyId) {
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const monthStart = startOfMonthISO();
      const [inst, users, contatos, msgs] = await Promise.all([
        supabaseAdmin.from("whatsapp_instances").select("instance_name", { count: "exact", head: true }).eq("company_id", companyId),
        supabaseAdmin.from("company_user").select("id", { count: "exact", head: true }).eq("company_id", companyId).eq("ativo", true),
        supabaseAdmin.from("crm_cards").select("id", { count: "exact", head: true }).eq("company_id", companyId),
        supabaseAdmin.from("mensagens").select("id", { count: "exact", head: true }).eq("company_id", companyId).eq("direcao", "saida").gte("created_at", monthStart)
      ]);
      return {
        instancias: inst.count ?? 0,
        usuarios: users.count ?? 0,
        contatos: contatos.count ?? 0,
        mensagens: msgs.count ?? 0
      };
    }
    async function getCompanyPlanUsage(companyId) {
      const [plan, usage] = await Promise.all([getCompanyPlan(companyId), getCompanyUsage(companyId)]);
      return { plan, usage };
    }
    const LIMIT_MSG = {
      instancias: (p, n) => `Seu plano ${p} permite at\xE9 ${n} n\xFAmero${n === 1 ? "" : "s"} de WhatsApp. Fa\xE7a upgrade para conectar mais.`,
      usuarios: (p, n) => `Seu plano ${p} permite at\xE9 ${n} usu\xE1rio${n === 1 ? "" : "s"} na equipe. Fa\xE7a upgrade para adicionar mais.`,
      contatos: (p, n) => `Seu plano ${p} permite at\xE9 ${n.toLocaleString("pt-BR")} contatos. Fa\xE7a upgrade para cadastrar mais.`,
      mensagens: (p, n) => `Seu plano ${p} permite at\xE9 ${n.toLocaleString("pt-BR")} mensagens enviadas por m\xEAs. Fa\xE7a upgrade para continuar respondendo.`
    };
    async function assertWithinLimit(companyId, tipo, delta = 1) {
      const [plan, usage] = await Promise.all([getCompanyPlan(companyId), getCompanyUsage(companyId)]);
      const limite = plan.limites[tipo];
      const atual = usage[tipo];
      if (atual + delta > limite) {
        throw new Error(LIMIT_MSG[tipo](plan.nome, limite));
      }
    }
    async function isWithinLimit(companyId, tipo, delta = 1) {
      const [plan, usage] = await Promise.all([getCompanyPlan(companyId), getCompanyUsage(companyId)]);
      return usage[tipo] + delta <= plan.limites[tipo];
    }
  },
  "src/lib/plan-features": (module, exports, require2, process) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PLAN_LABEL = exports.PLAN_FEATURES = void 0;
    exports.normalizePlanSlug = normalizePlanSlug;
    exports.featuresFor = featuresFor;
    exports.allowsProvider = allowsProvider;
    exports.PLAN_FEATURES = {
      starter: {
        providersIA: ["gemini"],
        googleCalendar: false,
        automacoes: false,
        apiWebhooks: false,
        relatoriosAvancados: false,
        suportePrioritario: false,
        financeiro: false
      },
      pro: {
        providersIA: ["gemini", "openai", "anthropic"],
        googleCalendar: true,
        automacoes: true,
        apiWebhooks: false,
        relatoriosAvancados: true,
        suportePrioritario: true,
        financeiro: true
      },
      business: {
        providersIA: ["gemini", "openai", "anthropic"],
        googleCalendar: true,
        automacoes: true,
        apiWebhooks: true,
        relatoriosAvancados: true,
        suportePrioritario: true,
        financeiro: true
      }
    };
    exports.PLAN_LABEL = {
      starter: "Starter",
      pro: "Pro",
      business: "Business"
    };
    function normalizePlanSlug(slug) {
      const s = String(slug || "").toLowerCase();
      if (s === "pro" || s === "business" || s === "starter")
        return s;
      return "starter";
    }
    function featuresFor(slug) {
      return exports.PLAN_FEATURES[normalizePlanSlug(slug)];
    }
    function allowsProvider(slug, provider) {
      const f = featuresFor(slug);
      return f.providersIA.includes(provider);
    }
  },
  "src/lib/financeiro.functions": (module, exports, require2, process) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.finStatus = exports.deleteCategoria = exports.upsertCategoria = exports.deleteLancamento = exports.marcarPago = exports.upsertLancamento = exports.listCategorias = exports.listLancamentos = exports.finKpis = exports.enableFinanceiro = void 0;
    const react_start_1 = require2("@tanstack/react-start");
    const auth_middleware_1 = require2("@/integrations/supabase/auth-middleware");
    async function getCompanyAndPlan(supabase, userId) {
      const { data: cu } = await supabase.from("company_user").select("company_id, role, company:company(*)").eq("user_id", userId).eq("ativo", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      if (!cu)
        throw new Error("Sem empresa vinculada");
      const { data: sub } = await supabase.from("subscription").select("plan:plan(nome)").eq("company_id", cu.company_id).order("created_at", { ascending: false }).limit(1).maybeSingle();
      const planSlug = String(sub?.plan?.nome || "starter").toLowerCase();
      return { companyId: cu.company_id, role: cu.role, company: cu.company, planSlug };
    }
    function planAllowsFin(planSlug) {
      const s = planSlug.toLowerCase();
      return s === "pro" || s === "business";
    }
    async function assertCanWrite(supabase, userId) {
      const ctx = await getCompanyAndPlan(supabase, userId);
      if (!planAllowsFin(ctx.planSlug))
        throw new Error("Plano n\xE3o permite m\xF3dulo financeiro");
      if (!ctx.company?.financeiro_ativo)
        throw new Error("M\xF3dulo financeiro desativado");
      return ctx;
    }
    exports.enableFinanceiro = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => ({
      enable: !!d.enable,
      diasVencimentoPadrao: Math.max(0, Math.min(60, Math.floor(d.diasVencimentoPadrao ?? 7)))
    })).handler(async ({ context, data }) => {
      const ctx = await getCompanyAndPlan(context.supabase, context.userId);
      if (data.enable && !planAllowsFin(ctx.planSlug)) {
        throw new Error("Dispon\xEDvel nos planos Pro e Business");
      }
      if (!["owner", "admin"].includes(ctx.role))
        throw new Error("Apenas dono ou admin");
      const { error } = await context.supabase.rpc("fin_enable_for_company", {
        _company_id: ctx.companyId,
        _enable: data.enable
      });
      if (error)
        throw new Error(error.message);
      if (data.enable) {
        await context.supabase.from("company").update({ financeiro_dias_vencimento_padrao: data.diasVencimentoPadrao }).eq("id", ctx.companyId);
      }
      return { ok: true };
    });
    exports.finKpis = (0, react_start_1.createServerFn)({ method: "GET" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const ctx = await assertCanWrite(context.supabase, context.userId);
      const sb = context.supabase;
      const now = /* @__PURE__ */ new Date();
      const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
      const fimMes = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
      const hoje = now.toISOString().slice(0, 10);
      const baseSel = "tipo, valor_cents, status, vencimento, competencia, categoria:categoria_id(nome,cor)";
      const { data: all } = await sb.from("fin_lancamento").select(baseSel).eq("company_id", ctx.companyId).gte("competencia", new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().slice(0, 10));
      const rows = all ?? [];
      const receitaMes = rows.filter((r) => r.tipo === "receita" && r.status === "pago" && r.competencia >= inicioMes && r.competencia <= fimMes).reduce((s, r) => s + Number(r.valor_cents), 0);
      const despesaMes = rows.filter((r) => r.tipo === "despesa" && r.status === "pago" && r.competencia >= inicioMes && r.competencia <= fimMes).reduce((s, r) => s + Number(r.valor_cents), 0);
      const aReceber = rows.filter((r) => r.tipo === "receita" && (r.status === "pendente" || r.status === "atrasado")).reduce((s, r) => s + Number(r.valor_cents), 0);
      const aPagar = rows.filter((r) => r.tipo === "despesa" && (r.status === "pendente" || r.status === "atrasado")).reduce((s, r) => s + Number(r.valor_cents), 0);
      const atrasados = rows.filter((r) => (r.status === "pendente" || r.status === "atrasado") && r.vencimento < hoje).length;
      const series = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const ini = d.toISOString().slice(0, 10);
        const fim = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10);
        const r = rows.filter((x) => x.tipo === "receita" && x.status === "pago" && x.competencia >= ini && x.competencia <= fim).reduce((s, x) => s + Number(x.valor_cents), 0);
        const p = rows.filter((x) => x.tipo === "despesa" && x.status === "pago" && x.competencia >= ini && x.competencia <= fim).reduce((s, x) => s + Number(x.valor_cents), 0);
        series.push({ mes: d.toLocaleDateString("pt-BR", { month: "short" }), receita: r, despesa: p });
      }
      const catMap = {};
      for (const r of rows) {
        if (r.tipo !== "despesa")
          continue;
        const k = r.categoria?.nome ?? "Sem categoria";
        catMap[k] ??= { nome: k, cor: r.categoria?.cor ?? "#999", valor: 0 };
        catMap[k].valor += Number(r.valor_cents);
      }
      const topCategorias = Object.values(catMap).sort((a, b) => b.valor - a.valor).slice(0, 5);
      const d7 = new Date(now.getTime() + 7 * 864e5).toISOString().slice(0, 10);
      const { data: prox } = await sb.from("fin_lancamento").select("id, tipo, descricao, valor_cents, vencimento, status").eq("company_id", ctx.companyId).in("status", ["pendente", "atrasado"]).lte("vencimento", d7).order("vencimento", { ascending: true }).limit(10);
      return {
        receitaMes,
        despesaMes,
        saldoMes: receitaMes - despesaMes,
        aReceber,
        aPagar,
        atrasados,
        series,
        topCategorias,
        proximos: prox ?? []
      };
    });
    exports.listLancamentos = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const ctx = await assertCanWrite(context.supabase, context.userId);
      let q = context.supabase.from("fin_lancamento").select("*, categoria:categoria_id(id,nome,cor,tipo)").eq("company_id", ctx.companyId).order("vencimento", { ascending: false }).limit(500);
      if (data.tipo)
        q = q.eq("tipo", data.tipo);
      if (data.status && data.status !== "todos")
        q = q.eq("status", data.status);
      if (data.from)
        q = q.gte("vencimento", data.from);
      if (data.to)
        q = q.lte("vencimento", data.to);
      if (data.q)
        q = q.ilike("descricao", `%${data.q}%`);
      const { data: rows, error } = await q;
      if (error)
        throw new Error(error.message);
      return rows ?? [];
    });
    exports.listCategorias = (0, react_start_1.createServerFn)({ method: "GET" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const ctx = await assertCanWrite(context.supabase, context.userId);
      const { data } = await context.supabase.from("fin_categoria").select("*").eq("company_id", ctx.companyId).order("tipo").order("nome");
      return data ?? [];
    });
    exports.upsertLancamento = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => {
      const valor = Math.round(Number(d.valor_reais ?? 0) * 100);
      if (!d.descricao || String(d.descricao).trim().length < 2)
        throw new Error("Descri\xE7\xE3o obrigat\xF3ria");
      if (!d.vencimento)
        throw new Error("Vencimento obrigat\xF3rio");
      if (!["receita", "despesa"].includes(d.tipo))
        throw new Error("Tipo inv\xE1lido");
      if (valor < 0)
        throw new Error("Valor inv\xE1lido");
      return {
        id: d.id ?? null,
        tipo: d.tipo,
        descricao: String(d.descricao).trim(),
        valor_cents: valor,
        categoria_id: d.categoria_id || null,
        forma_pagamento: d.forma_pagamento || null,
        status: d.status || "pendente",
        vencimento: d.vencimento,
        pago_em: d.pago_em || null,
        competencia: d.competencia || d.vencimento,
        observacao: d.observacao || null
      };
    }).handler(async ({ context, data }) => {
      const ctx = await assertCanWrite(context.supabase, context.userId);
      if (data.id) {
        const { id, ...rest2 } = data;
        const { error: error2 } = await context.supabase.from("fin_lancamento").update(rest2).eq("id", id).eq("company_id", ctx.companyId);
        if (error2)
          throw new Error(error2.message);
        return { ok: true, id };
      }
      const { id: _i, ...rest } = data;
      const { data: ins, error } = await context.supabase.from("fin_lancamento").insert({ ...rest, company_id: ctx.companyId, created_by: context.userId }).select("id").single();
      if (error)
        throw new Error(error.message);
      return { ok: true, id: ins.id };
    });
    exports.marcarPago = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const ctx = await assertCanWrite(context.supabase, context.userId);
      const patch = data.pago ? { status: "pago", pago_em: data.pagoEm || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) } : { status: "pendente", pago_em: null };
      const { error } = await context.supabase.from("fin_lancamento").update(patch).eq("id", data.id).eq("company_id", ctx.companyId);
      if (error)
        throw new Error(error.message);
      return { ok: true };
    });
    exports.deleteLancamento = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const ctx = await assertCanWrite(context.supabase, context.userId);
      const { error } = await context.supabase.from("fin_lancamento").delete().eq("id", data.id).eq("company_id", ctx.companyId);
      if (error)
        throw new Error(error.message);
      return { ok: true };
    });
    exports.upsertCategoria = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => {
      if (!d.nome || d.nome.trim().length < 2)
        throw new Error("Nome inv\xE1lido");
      if (!["receita", "despesa"].includes(d.tipo))
        throw new Error("Tipo inv\xE1lido");
      return d;
    }).handler(async ({ context, data }) => {
      const ctx = await assertCanWrite(context.supabase, context.userId);
      if (data.id) {
        const { error: error2 } = await context.supabase.from("fin_categoria").update({ nome: data.nome.trim(), tipo: data.tipo, cor: data.cor ?? "#8AA89A", ativo: data.ativo ?? true }).eq("id", data.id).eq("company_id", ctx.companyId);
        if (error2)
          throw new Error(error2.message);
        return { ok: true };
      }
      const { error } = await context.supabase.from("fin_categoria").insert({ company_id: ctx.companyId, nome: data.nome.trim(), tipo: data.tipo, cor: data.cor ?? "#8AA89A" });
      if (error)
        throw new Error(error.message);
      return { ok: true };
    });
    exports.deleteCategoria = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const ctx = await assertCanWrite(context.supabase, context.userId);
      const { error } = await context.supabase.from("fin_categoria").delete().eq("id", data.id).eq("company_id", ctx.companyId);
      if (error)
        throw new Error(error.message);
      return { ok: true };
    });
    exports.finStatus = (0, react_start_1.createServerFn)({ method: "GET" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const ctx = await getCompanyAndPlan(context.supabase, context.userId);
      return {
        ativo: !!ctx.company?.financeiro_ativo,
        diasVencimento: Number(ctx.company?.financeiro_dias_vencimento_padrao ?? 7),
        planoPermite: planAllowsFin(ctx.planSlug),
        planSlug: ctx.planSlug,
        role: ctx.role
      };
    });
  },
  "src/lib/google.functions": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createGoogleCalendarEvent = exports.disconnectGoogle = exports.startGoogleOAuth = void 0;
    const buffer_1 = require2("buffer");
    const react_start_1 = require2("@tanstack/react-start");
    const auth_middleware_1 = require2("@/integrations/supabase/auth-middleware");
    async function buildOrigin() {
      const { getRequest } = await Promise.resolve().then(() => __importStar(require2("@tanstack/react-start/server")));
      const req = getRequest();
      const u = new URL(req.url);
      return `${u.protocol}//${u.host}`;
    }
    exports.startGoogleOAuth = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) {
        return { ok: false, error: "Google OAuth n\xE3o configurado. Pe\xE7a ao administrador para definir GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET." };
      }
      const { supabase, userId } = context;
      const { data: cu } = await supabase.from("company_user").select("company_id").eq("user_id", userId).eq("ativo", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      if (!cu)
        return { ok: false, error: "Sem empresa." };
      const { getCompanyPlan } = await Promise.resolve().then(() => __importStar(require2("src/lib/plan-limits.server")));
      const { featuresFor, PLAN_LABEL } = await Promise.resolve().then(() => __importStar(require2("src/lib/plan-features")));
      const plan = await getCompanyPlan(cu.company_id);
      if (!featuresFor(plan.slug).googleCalendar) {
        return { ok: false, error: `Google Agenda n\xE3o est\xE1 incluso no plano ${PLAN_LABEL[plan.slug]}. Fa\xE7a upgrade para Pro.` };
      }
      const origin = await buildOrigin();
      const redirectUri = `${origin}/api/public/google-callback`;
      const payload = buffer_1.Buffer.from(JSON.stringify({ companyId: cu.company_id, t: Date.now() })).toString("base64").replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
      const { signState } = await Promise.resolve().then(() => __importStar(require2("src/lib/google.server")));
      const state = signState(payload);
      const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      url.searchParams.set("client_id", clientId);
      url.searchParams.set("redirect_uri", redirectUri);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("access_type", "offline");
      url.searchParams.set("prompt", "consent");
      url.searchParams.set("include_granted_scopes", "true");
      url.searchParams.set("scope", "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email");
      url.searchParams.set("state", state);
      return { ok: true, url: url.toString() };
    });
    exports.disconnectGoogle = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const { supabase, userId } = context;
      const { data: cu } = await supabase.from("company_user").select("company_id,role").eq("user_id", userId).eq("ativo", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      if (!cu || !["owner", "admin"].includes(cu.role))
        return { ok: false };
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      await supabaseAdmin.from("google_integration").upsert({ company_id: cu.company_id, conectado: false, access_token: null, refresh_token: null, expiry: null, email: null, calendar_id: null }, { onConflict: "company_id" });
      return { ok: true };
    });
    exports.createGoogleCalendarEvent = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const { supabase, userId } = context;
      const { data: cu } = await supabase.from("company_user").select("company_id").eq("user_id", userId).eq("ativo", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      if (!cu)
        throw new Error("Sem empresa");
      const companyId = cu.company_id;
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { data: gi } = await supabaseAdmin.from("google_integration").select("*").eq("company_id", companyId).maybeSingle();
      if (!gi?.conectado)
        throw new Error("Google Agenda n\xE3o conectado");
      let accessToken = gi.access_token;
      if (gi.expiry && new Date(gi.expiry).getTime() < Date.now() + 6e4 && gi.refresh_token) {
        const tokRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: gi.refresh_token,
            grant_type: "refresh_token"
          })
        });
        const tok = await tokRes.json();
        if (tok.access_token) {
          accessToken = tok.access_token;
          await supabaseAdmin.from("google_integration").update({
            access_token: accessToken,
            expiry: new Date(Date.now() + (tok.expires_in ?? 3600) * 1e3).toISOString()
          }).eq("company_id", companyId);
        }
      }
      const calendarId = gi.calendar_id || "primary";
      const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: data.titulo,
          description: data.descricao || "",
          start: { dateTime: data.inicio },
          end: { dateTime: data.fim }
        })
      });
      if (!res.ok)
        throw new Error(`Google API: ${res.status}`);
      const ev = await res.json();
      await supabase.from("agendamento").insert({
        company_id: companyId,
        card_id: data.cardId ?? null,
        titulo: data.titulo,
        inicio: data.inicio,
        fim: data.fim,
        google_event_id: ev.id,
        status: "agendado"
      });
      return { ok: true, eventId: ev.id };
    });
  },
  "src/lib/google.server": (module, exports, require2, process) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.signState = signState;
    exports.verifyState = verifyState;
    exports.createCalendarEventForCompany = createCalendarEventForCompany;
    const buffer_1 = require2("buffer");
    const worker_crypto_1 = require2("src/lib/worker-crypto");
    const STATE_TTL_MS = 10 * 60 * 1e3;
    function stateSecret() {
      const secret = process.env.GOOGLE_OAUTH_STATE_SECRET || process.env.BLINK_SECRET_KEY;
      if (!secret)
        throw new Error("GOOGLE_OAUTH_STATE_SECRET n\xE3o configurado");
      return secret;
    }
    function signState(payload) {
      const sig = (0, worker_crypto_1.createHmac)("sha256", stateSecret()).update(payload).digest("base64url");
      return `${payload}.${sig}`;
    }
    function verifyState(state) {
      const parts2 = state.split(".");
      if (parts2.length !== 2)
        return null;
      const [payload, sig] = parts2;
      let expected;
      try {
        expected = (0, worker_crypto_1.createHmac)("sha256", stateSecret()).update(payload).digest("base64url");
      } catch {
        return null;
      }
      const suppliedBuffer = buffer_1.Buffer.from(sig);
      const expectedBuffer = buffer_1.Buffer.from(expected);
      if (suppliedBuffer.length !== expectedBuffer.length || !(0, worker_crypto_1.timingSafeEqual)(suppliedBuffer, expectedBuffer))
        return null;
      try {
        const obj = JSON.parse(buffer_1.Buffer.from(payload.replaceAll("-", "+").replaceAll("_", "/"), "base64").toString("utf8"));
        if (!obj.companyId || !Number.isFinite(obj.t) || Math.abs(Date.now() - Number(obj.t)) > STATE_TTL_MS)
          return null;
        return { companyId: obj.companyId };
      } catch {
        return null;
      }
    }
    async function createCalendarEventForCompany(admin, companyId, data) {
      const { data: gi } = await admin.from("google_integration").select("*").eq("company_id", companyId).maybeSingle();
      if (!gi?.conectado)
        throw new Error("Google Agenda n\xE3o conectado");
      let accessToken = gi.access_token;
      if (gi.expiry && new Date(gi.expiry).getTime() < Date.now() + 6e4 && gi.refresh_token) {
        const tokRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID || "",
            client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
            refresh_token: gi.refresh_token,
            grant_type: "refresh_token"
          })
        });
        const tok = await tokRes.json();
        if (tok.access_token) {
          accessToken = tok.access_token;
          await admin.from("google_integration").update({
            access_token: accessToken,
            expiry: new Date(Date.now() + (tok.expires_in ?? 3600) * 1e3).toISOString()
          }).eq("company_id", companyId);
        }
      }
      const calendarId = gi.calendar_id || "primary";
      const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: data.titulo,
          description: data.descricao || "",
          start: { dateTime: data.inicio },
          end: { dateTime: data.fim }
        })
      });
      if (!res.ok)
        throw new Error(`Google API: ${res.status}`);
      const ev = await res.json();
      await admin.from("agendamento").insert({
        company_id: companyId,
        card_id: data.cardId ?? null,
        titulo: data.titulo,
        inicio: data.inicio,
        fim: data.fim,
        google_event_id: ev.id,
        status: "agendado"
      });
      return { eventId: ev.id };
    }
  },
  "src/lib/worker-crypto": (module, exports, require2, process) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createHash = createHash;
    exports.createHmac = createHmac;
    exports.timingSafeEqual = timingSafeEqual;
    const sha2_js_1 = require2("@noble/hashes/sha2.js");
    const hmac_js_1 = require2("@noble/hashes/hmac.js");
    const buffer_1 = require2("buffer");
    function digestor(key) {
      const chunks = [];
      return { update(value2) {
        chunks.push(new TextEncoder().encode(value2));
        return this;
      }, digest(format) {
        const input = buffer_1.Buffer.concat(chunks);
        const result = key === void 0 ? (0, sha2_js_1.sha256)(input) : (0, hmac_js_1.hmac)(sha2_js_1.sha256, new TextEncoder().encode(key), input);
        if (!["hex", "base64url"].includes(format))
          throw new Error("Formato inv\xE1lido");
        const encoded = buffer_1.Buffer.from(result).toString(format === "base64url" ? "base64" : "hex");
        return format === "base64url" ? encoded.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "") : encoded;
      } };
    }
    function createHash(algorithm) {
      if (algorithm !== "sha256")
        throw new Error("Algoritmo inv\xE1lido");
      return digestor();
    }
    function createHmac(algorithm, key) {
      if (algorithm !== "sha256")
        throw new Error("Algoritmo inv\xE1lido");
      return digestor(key);
    }
    function timingSafeEqual(a, b) {
      if (a.length !== b.length)
        throw new Error("Tamanhos diferentes");
      let difference = 0;
      for (let i = 0; i < a.length; i++)
        difference |= a[i] ^ b[i];
      return difference === 0;
    }
  },
  "src/lib/integrations.functions": (module, exports, require2, process) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.revokeApiToken = exports.createApiToken = exports.listApiTokens = exports.listWebhookLogs = exports.deleteWebhook = exports.saveWebhook = exports.listWebhooks = void 0;
    const react_start_1 = require2("@tanstack/react-start");
    const auth_middleware_1 = require2("@/integrations/supabase/auth-middleware");
    async function resolveCompanyAdmin(supabase, userId) {
      const { data } = await supabase.from("company_user").select("company_id, role").eq("user_id", userId).eq("ativo", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      if (!data)
        throw new Error("Sem empresa.");
      if (!["owner", "admin"].includes(data.role))
        throw new Error("Apenas dono ou administrador pode gerenciar integra\xE7\xF5es.");
      return data.company_id;
    }
    exports.listWebhooks = (0, react_start_1.createServerFn)({ method: "GET" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const cid = await resolveCompanyAdmin(context.supabase, context.userId);
      const { data } = await context.supabase.from("webhook_endpoint").select("*").eq("company_id", cid).order("created_at", { ascending: false });
      return data ?? [];
    });
    exports.saveWebhook = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const cid = await resolveCompanyAdmin(context.supabase, context.userId);
      if (!/^https?:\/\//.test(data.url))
        throw new Error("URL deve come\xE7ar com http(s)://");
      const payload = { company_id: cid, nome: data.nome, url: data.url, eventos: data.eventos, ativo: data.ativo };
      if (data.id) {
        const { error } = await context.supabase.from("webhook_endpoint").update(payload).eq("id", data.id).eq("company_id", cid);
        if (error)
          throw new Error(error.message);
      } else {
        const { error } = await context.supabase.from("webhook_endpoint").insert(payload);
        if (error)
          throw new Error(error.message);
      }
      return { ok: true };
    });
    exports.deleteWebhook = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const cid = await resolveCompanyAdmin(context.supabase, context.userId);
      const { error } = await context.supabase.from("webhook_endpoint").delete().eq("id", data.id).eq("company_id", cid);
      if (error)
        throw new Error(error.message);
      return { ok: true };
    });
    exports.listWebhookLogs = (0, react_start_1.createServerFn)({ method: "GET" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const cid = await resolveCompanyAdmin(context.supabase, context.userId);
      const { data } = await context.supabase.from("webhook_delivery_log").select("*").eq("company_id", cid).order("created_at", { ascending: false }).limit(50);
      return data ?? [];
    });
    exports.listApiTokens = (0, react_start_1.createServerFn)({ method: "GET" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const cid = await resolveCompanyAdmin(context.supabase, context.userId);
      const { data } = await context.supabase.from("api_token").select("*").eq("company_id", cid).order("created_at", { ascending: false });
      return data ?? [];
    });
    exports.createApiToken = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const cid = await resolveCompanyAdmin(context.supabase, context.userId);
      const { data: sub } = await context.supabase.from("subscription").select("plan:plan(slug)").eq("company_id", cid).order("created_at", { ascending: false }).limit(1).maybeSingle();
      const slug = sub?.plan?.slug ?? "starter";
      if (slug !== "business")
        throw new Error("API p\xFAblica dispon\xEDvel apenas no plano Business.");
      const { data: row, error } = await context.supabase.from("api_token").insert({ company_id: cid, label: data.label, criado_por: context.userId }).select("*").maybeSingle();
      if (error || !row)
        throw new Error(error?.message ?? "Falha.");
      return row;
    });
    exports.revokeApiToken = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const cid = await resolveCompanyAdmin(context.supabase, context.userId);
      const { error } = await context.supabase.from("api_token").update({ revogado: true }).eq("id", data.id).eq("company_id", cid);
      if (error)
        throw new Error(error.message);
      return { ok: true };
    });
  },
  "src/lib/master.functions": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCompanyDetails = exports.resetCompanyOwnerPassword = exports.setSuperAdminEmails = exports.getSuperAdminEmails = exports.listPlansBasic = exports.createCompanyWithOwner = exports.extendTrial = exports.suspendCompany = exports.listCompanies = exports.listMasterSubscriptions = exports.masterKpis = void 0;
    const react_start_1 = require2("@tanstack/react-start");
    const auth_middleware_1 = require2("@/integrations/supabase/auth-middleware");
    const tenant_1 = require2("src/lib/tenant");
    async function assertSuper(supabase, userId) {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "super_admin").maybeSingle();
      if (error)
        throw error;
      if (!data)
        throw new Error("Acesso negado");
    }
    exports.masterKpis = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      await assertSuper(context.supabase, context.userId);
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const [{ data: companies }, { count: msgCount }, { count: cardsCount }, { data: subscriptions }] = await Promise.all([
        supabaseAdmin.from("company").select("id, status_cobranca, trial_ate, created_at"),
        supabaseAdmin.from("mensagens").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("crm_cards").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("subscription").select("status, plan:plan(preco_cents)")
      ]);
      const now = /* @__PURE__ */ new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      const all = companies ?? [];
      const subs = subscriptions ?? [];
      const stats = {
        total: all.length,
        ativas: all.filter((c) => c.status_cobranca === "ativo").length,
        trial: all.filter((c) => c.status_cobranca === "trial").length,
        suspensas: all.filter((c) => c.status_cobranca === "suspenso").length,
        novasMes: all.filter((c) => new Date(c.created_at).getTime() >= monthStart).length,
        mensagens: msgCount ?? 0,
        cards: cardsCount ?? 0,
        assinaturasAtivas: subs.filter((s) => s.status === "active").length,
        assinaturasTrial: subs.filter((s) => s.status === "trialing").length,
        mrr: subs.filter((s) => s.status === "active").reduce((sum, s) => sum + (s.plan?.preco_cents ?? 0), 0)
      };
      const series = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        const count = all.filter((c) => {
          const t = new Date(c.created_at).getTime();
          return t < next.getTime();
        }).length;
        series.push({ mes: d.toLocaleDateString("pt-BR", { month: "short" }), total: count });
      }
      return { stats, series };
    });
    exports.listMasterSubscriptions = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      await assertSuper(context.supabase, context.userId);
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { data, error } = await supabaseAdmin.from("subscription").select("*, plan:plan(nome,preco_cents,moeda,intervalo), company:company(nome,status_cobranca,email_corporativo)").order("created_at", { ascending: false });
      if (error)
        throw error;
      return { rows: data ?? [] };
    });
    exports.listCompanies = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => ({
      search: (d.search ?? "").trim().toLowerCase(),
      page: Math.max(0, d.page ?? 0)
    })).handler(async ({ context, data }) => {
      await assertSuper(context.supabase, context.userId);
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const pageSize = 20;
      let q = supabaseAdmin.from("company").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(data.page * pageSize, data.page * pageSize + pageSize - 1);
      if (data.search)
        q = q.ilike("nome", `%${data.search}%`);
      const { data: rows, count, error } = await q;
      if (error)
        throw error;
      const ids = (rows ?? []).map((c) => c.id);
      let ultByCompany = {};
      if (ids.length) {
        const { data: msgs } = await supabaseAdmin.from("mensagens").select("company_id, created_at").in("company_id", ids).order("created_at", { ascending: false }).limit(500);
        for (const m of msgs ?? []) {
          if (!ultByCompany[m.company_id])
            ultByCompany[m.company_id] = m.created_at;
        }
      }
      const list = (rows ?? []).map((c) => ({ ...c, ultima_atividade: ultByCompany[c.id] ?? null }));
      return { rows: list, total: count ?? 0, pageSize };
    });
    exports.suspendCompany = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      await assertSuper(context.supabase, context.userId);
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { error } = await supabaseAdmin.from("company").update({ status_cobranca: data.suspend ? "suspenso" : "ativo" }).eq("id", data.companyId);
      if (error)
        throw error;
      return { ok: true };
    });
    exports.extendTrial = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => ({
      companyId: d.companyId,
      days: Math.max(1, Math.min(365, Math.floor(d.days)))
    })).handler(async ({ context, data }) => {
      await assertSuper(context.supabase, context.userId);
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { data: c } = await supabaseAdmin.from("company").select("trial_ate").eq("id", data.companyId).maybeSingle();
      const base = c?.trial_ate ? new Date(c.trial_ate) : /* @__PURE__ */ new Date();
      const next = new Date(Math.max(base.getTime(), Date.now()) + data.days * 864e5);
      const { error } = await supabaseAdmin.from("company").update({ trial_ate: next.toISOString(), status_cobranca: "trial" }).eq("id", data.companyId);
      if (error)
        throw error;
      return { trial_ate: next.toISOString() };
    });
    exports.createCompanyWithOwner = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => {
      const nome = String(d.nome || "").trim();
      const ownerEmail = String(d.ownerEmail || "").trim().toLowerCase();
      if (nome.length < 2)
        throw new Error("Nome inv\xE1lido");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail))
        throw new Error("Email inv\xE1lido");
      const password = d.password ? String(d.password) : null;
      if (password && password.length < 8)
        throw new Error("Senha m\xEDnima de 8 caracteres");
      return {
        nome,
        ownerEmail,
        planId: d.planId || null,
        trialDays: Math.max(0, Math.min(90, Math.floor(d.trialDays ?? 3))),
        password
      };
    }).handler(async ({ context, data }) => {
      await assertSuper(context.supabase, context.userId);
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      let ownerId = null;
      const { data: prof } = await supabaseAdmin.from("profiles").select("user_id").eq("email", data.ownerEmail).maybeSingle();
      if (prof)
        ownerId = prof.user_id;
      let tempPassword = null;
      if (!ownerId) {
        tempPassword = data.password ?? Math.random().toString(36).slice(2, 10) + "A1!";
        const { data: c, error } = await supabaseAdmin.auth.admin.createUser({
          email: data.ownerEmail,
          password: tempPassword,
          email_confirm: true
        });
        if (error || !c.user)
          throw new Error(error?.message || "Falha ao criar usu\xE1rio");
        ownerId = c.user.id;
        await supabaseAdmin.from("profiles").upsert({ user_id: ownerId, email: data.ownerEmail });
      } else if (data.password) {
        const { error: upErr } = await supabaseAdmin.auth.admin.updateUserById(ownerId, {
          password: data.password,
          email_confirm: true
        });
        if (upErr)
          throw upErr;
        tempPassword = data.password;
      }
      let baseSlug = (0, tenant_1.slugify)(data.nome);
      let slug = baseSlug;
      for (let i = 1; i < 20; i++) {
        const { data: ex } = await supabaseAdmin.from("company").select("id").eq("slug", slug).maybeSingle();
        if (!ex)
          break;
        slug = `${baseSlug}-${i}`;
      }
      const trialMs = data.trialDays * 864e5;
      const trialEnd = new Date(Date.now() + trialMs).toISOString();
      const { data: comp, error: cErr } = await supabaseAdmin.from("company").insert({
        nome: data.nome,
        slug,
        created_by: ownerId,
        status_cobranca: data.trialDays > 0 ? "trial" : "ativo",
        trial_ate: trialEnd
      }).select("id").single();
      if (cErr || !comp)
        throw new Error(cErr?.message || "Falha ao criar empresa");
      await supabaseAdmin.from("company_user").insert({
        company_id: comp.id,
        user_id: ownerId,
        role: "owner",
        ativo: true,
        forcar_troca_senha: !data.password && !!tempPassword
      });
      if (data.planId) {
        await supabaseAdmin.from("subscription").insert({
          company_id: comp.id,
          plan_id: data.planId,
          status: data.trialDays > 0 ? "trialing" : "active",
          trial_ends_at: trialEnd,
          current_period_end: trialEnd
        });
      }
      return { ok: true, companyId: comp.id, tempPassword };
    });
    exports.listPlansBasic = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      await assertSuper(context.supabase, context.userId);
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { data } = await supabaseAdmin.from("plan").select("id, nome, preco_cents, moeda, intervalo, trial_days").eq("ativo", true).order("preco_cents", { ascending: true });
      return { plans: data ?? [] };
    });
    exports.getSuperAdminEmails = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      await assertSuper(context.supabase, context.userId);
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { data } = await supabaseAdmin.from("app_config").select("super_admin_emails").eq("id", true).maybeSingle();
      return { emails: data?.super_admin_emails ?? [] };
    });
    exports.setSuperAdminEmails = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => {
      const clean2 = Array.from(new Set((d.emails ?? []).map((e) => String(e).trim().toLowerCase()).filter(Boolean)));
      for (const e of clean2) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
          throw new Error(`Email inv\xE1lido: ${e}`);
      }
      return { emails: clean2 };
    }).handler(async ({ context, data }) => {
      await assertSuper(context.supabase, context.userId);
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { error } = await supabaseAdmin.from("app_config").upsert({ id: true, super_admin_emails: data.emails });
      if (error)
        throw error;
      if (data.emails.length) {
        const { data: profs } = await supabaseAdmin.from("profiles").select("user_id, email").in("email", data.emails);
        for (const p of profs ?? []) {
          await supabaseAdmin.from("user_roles").upsert({ user_id: p.user_id, role: "super_admin" }, { onConflict: "user_id,role" });
        }
      }
      return { ok: true };
    });
    exports.resetCompanyOwnerPassword = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => ({
      companyId: String(d.companyId),
      newPassword: d.newPassword ? String(d.newPassword) : void 0
    })).handler(async ({ context, data }) => {
      await assertSuper(context.supabase, context.userId);
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { data: cu } = await supabaseAdmin.from("company_user").select("user_id, role").eq("company_id", data.companyId).eq("ativo", true).order("created_at", { ascending: true });
      const owner = (cu ?? []).find((r) => r.role === "owner") ?? (cu ?? [])[0];
      if (!owner)
        throw new Error("Empresa sem usu\xE1rio respons\xE1vel");
      const password = data.newPassword && data.newPassword.length >= 8 ? data.newPassword : Math.random().toString(36).slice(2, 10) + "A1!";
      const { error: uErr } = await supabaseAdmin.auth.admin.updateUserById(owner.user_id, {
        password,
        email_confirm: true
      });
      if (uErr)
        throw uErr;
      if (!data.newPassword) {
        await supabaseAdmin.from("company_user").update({ forcar_troca_senha: true }).eq("company_id", data.companyId).eq("user_id", owner.user_id);
      }
      const { data: prof } = await supabaseAdmin.from("profiles").select("email").eq("user_id", owner.user_id).maybeSingle();
      return { ok: true, tempPassword: data.newPassword ? null : password, ownerEmail: prof?.email ?? null };
    });
    exports.getCompanyDetails = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => ({ companyId: String(d.companyId) })).handler(async ({ context, data }) => {
      await assertSuper(context.supabase, context.userId);
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { data: company, error } = await supabaseAdmin.from("company").select("*").eq("id", data.companyId).maybeSingle();
      if (error)
        throw error;
      if (!company)
        throw new Error("Empresa n\xE3o encontrada");
      const { data: members } = await supabaseAdmin.from("company_user").select("user_id, role, ativo, created_at").eq("company_id", data.companyId).order("created_at", { ascending: true });
      const userIds = (members ?? []).map((m) => m.user_id);
      let profilesById = {};
      if (userIds.length) {
        const { data: profs } = await supabaseAdmin.from("profiles").select("user_id, email, nome, telefone").in("user_id", userIds);
        for (const p of profs ?? [])
          profilesById[p.user_id] = p;
      }
      const membersFull = (members ?? []).map((m) => ({
        ...m,
        profile: profilesById[m.user_id] ?? null
      }));
      const { data: subscription } = await supabaseAdmin.from("subscription").select("*, plan:plan(nome, preco_cents, moeda, intervalo)").eq("company_id", data.companyId).maybeSingle();
      const [{ count: msgCount }, { count: contactsCount }, { count: cardsCount }] = await Promise.all([
        supabaseAdmin.from("mensagens").select("id", { count: "exact", head: true }).eq("company_id", data.companyId),
        supabaseAdmin.from("crm_cards").select("id", { count: "exact", head: true }).eq("company_id", data.companyId),
        supabaseAdmin.from("crm_cards").select("id", { count: "exact", head: true }).eq("company_id", data.companyId)
      ]);
      return {
        company,
        members: membersFull,
        subscription,
        stats: {
          mensagens: msgCount ?? 0,
          contatos: contactsCount ?? 0,
          cards: cardsCount ?? 0
        }
      };
    });
  },
  "src/lib/plan.functions": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.importContacts = exports.createContact = exports.getPlanUsage = void 0;
    const react_start_1 = require2("@tanstack/react-start");
    const auth_middleware_1 = require2("@/integrations/supabase/auth-middleware");
    async function resolveCompanyId(supabase, userId) {
      const { data, error } = await supabase.from("company_user").select("company_id").eq("user_id", userId).eq("ativo", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      if (error)
        throw error;
      if (!data)
        throw new Error("Sem empresa.");
      return data.company_id;
    }
    exports.getPlanUsage = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const companyId = await resolveCompanyId(context.supabase, context.userId);
      const { getCompanyPlanUsage } = await Promise.resolve().then(() => __importStar(require2("src/lib/plan-limits.server")));
      return getCompanyPlanUsage(companyId);
    });
    exports.createContact = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => {
      const numero = String(d.numero || "").replace(/\D/g, "");
      if (numero.length < 8)
        throw new Error("N\xFAmero inv\xE1lido.");
      return { numero, nome: (d.nome ?? "").toString().trim() || null };
    }).handler(async ({ context, data }) => {
      const companyId = await resolveCompanyId(context.supabase, context.userId);
      const { assertWithinLimit } = await Promise.resolve().then(() => __importStar(require2("src/lib/plan-limits.server")));
      const { data: existing } = await context.supabase.from("crm_cards").select("id").eq("company_id", companyId).eq("numero", data.numero).maybeSingle();
      if (!existing)
        await assertWithinLimit(companyId, "contatos");
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { data: firstStage } = await supabaseAdmin.from("crm_stage").select("id, nome").eq("company_id", companyId).order("ordem", { ascending: true }).limit(1).maybeSingle();
      const { error } = await supabaseAdmin.from("crm_cards").upsert({
        company_id: companyId,
        user_id: context.userId,
        numero: data.numero,
        nome: data.nome,
        status: firstStage?.nome ?? "Conversas",
        stage_id: firstStage?.id ?? null,
        ultima_em: (/* @__PURE__ */ new Date()).toISOString()
      }, { onConflict: "company_id,numero" });
      if (error)
        throw new Error(error.message);
      return { ok: true };
    });
    exports.importContacts = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => {
      const list = Array.isArray(d.contatos) ? d.contatos : [];
      const clean2 = list.map((c) => ({ numero: String(c.numero || "").replace(/\D/g, ""), nome: (c.nome ?? "")?.toString().trim() || null })).filter((c) => c.numero.length >= 8);
      return { contatos: clean2 };
    }).handler(async ({ context, data }) => {
      const companyId = await resolveCompanyId(context.supabase, context.userId);
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { getCompanyPlanUsage } = await Promise.resolve().then(() => __importStar(require2("src/lib/plan-limits.server")));
      const numeros = data.contatos.map((c) => c.numero);
      let existingNumeros = /* @__PURE__ */ new Set();
      if (numeros.length) {
        const { data: ex } = await supabaseAdmin.from("crm_cards").select("numero").eq("company_id", companyId).in("numero", numeros);
        existingNumeros = new Set((ex ?? []).map((r) => r.numero));
      }
      const novos = data.contatos.filter((c) => !existingNumeros.has(c.numero));
      if (novos.length > 0) {
        const { plan, usage } = await getCompanyPlanUsage(companyId);
        if (usage.contatos + novos.length > plan.limites.contatos) {
          const restante = Math.max(0, plan.limites.contatos - usage.contatos);
          throw new Error(`Importa\xE7\xE3o excede o limite do plano ${plan.nome} (${plan.limites.contatos.toLocaleString("pt-BR")} contatos). Voc\xEA ainda pode adicionar ${restante.toLocaleString("pt-BR")}.`);
        }
      }
      const { data: firstStage } = await supabaseAdmin.from("crm_stage").select("id, nome").eq("company_id", companyId).order("ordem", { ascending: true }).limit(1).maybeSingle();
      const payload = data.contatos.map((c) => ({
        company_id: companyId,
        user_id: context.userId,
        numero: c.numero,
        nome: c.nome,
        status: firstStage?.nome ?? "Conversas",
        stage_id: firstStage?.id ?? null,
        ultima_em: (/* @__PURE__ */ new Date()).toISOString()
      }));
      if (payload.length === 0)
        return { ok: true, inseridos: 0 };
      const { error } = await supabaseAdmin.from("crm_cards").upsert(payload, { onConflict: "company_id,numero" });
      if (error)
        throw new Error(error.message);
      return { ok: true, inseridos: novos.length };
    });
  },
  "src/lib/security.functions": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.exportLgpd = exports.listAuditLog = void 0;
    const react_start_1 = require2("@tanstack/react-start");
    const auth_middleware_1 = require2("@/integrations/supabase/auth-middleware");
    async function resolveCompanyId(supabase, userId) {
      const { data } = await supabase.from("company_user").select("company_id, role").eq("user_id", userId).eq("ativo", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      if (!data)
        throw new Error("Sem empresa.");
      return data.company_id;
    }
    async function requireOwnerOrAdmin(supabase, userId) {
      const { data } = await supabase.from("company_user").select("company_id, role").eq("user_id", userId).eq("ativo", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      if (!data)
        throw new Error("Sem empresa.");
      if (!["owner", "admin"].includes(String(data.role)))
        throw new Error("Apenas owner/admin.");
      return data.company_id;
    }
    exports.listAuditLog = (0, react_start_1.createServerFn)({ method: "GET" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const cid = await requireOwnerOrAdmin(context.supabase, context.userId);
      const { data } = await context.supabase.from("audit_log").select("*").eq("company_id", cid).order("created_at", { ascending: false }).limit(200);
      return data ?? [];
    });
    exports.exportLgpd = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const cid = await requireOwnerOrAdmin(context.supabase, context.userId);
      const s = context.supabase;
      const tables = [
        "company",
        "company_user",
        "profiles",
        "whatsapp_instances",
        "agent_config",
        "crm_stage",
        "crm_cards",
        "lead_nota",
        "lead_evento",
        "mensagens",
        "contact_pause",
        "agendamento",
        "produto",
        "message_template",
        "csat_response",
        "campaign",
        "campaign_target",
        "webhook_endpoint",
        "api_token",
        "audit_log"
      ];
      const out = {};
      for (const t of tables) {
        try {
          const tbl = s.from(t);
          const q = t === "company" ? tbl.select("*").eq("id", cid) : t === "profiles" ? tbl.select("*").eq("user_id", context.userId) : tbl.select("*").eq("company_id", cid);
          const { data } = await q;
          out[t] = data ?? [];
        } catch {
          out[t] = [];
        }
      }
      const { writeAudit } = await Promise.resolve().then(() => __importStar(require2("src/lib/audit.server")));
      await writeAudit({
        companyId: cid,
        userId: context.userId,
        actorEmail: context.claims?.email ?? null,
        acao: "lgpd.export",
        recurso: "company",
        detalhes: { tables: tables.length }
      });
      return {
        exported_at: (/* @__PURE__ */ new Date()).toISOString(),
        company_id: cid,
        data: out
      };
    });
  },
  "src/lib/audit.server": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.writeAudit = writeAudit;
    async function writeAudit(params) {
      try {
        const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
        await supabaseAdmin.from("audit_log").insert({
          company_id: params.companyId,
          user_id: params.userId ?? null,
          actor_email: params.actorEmail ?? null,
          acao: params.acao,
          recurso: params.recurso ?? null,
          detalhes: params.detalhes ?? {},
          ip: params.ip ?? null,
          user_agent: params.userAgent ?? null
        });
      } catch (e) {
        console.warn("[writeAudit]", e);
      }
    }
  },
  "src/lib/team.functions": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setMemberRole = exports.setMemberActive = exports.inviteMember = exports.listTeam = void 0;
    const react_start_1 = require2("@tanstack/react-start");
    const auth_middleware_1 = require2("@/integrations/supabase/auth-middleware");
    async function getOwnedCompanyId(supabase, userId) {
      const { data, error } = await supabase.from("company_user").select("company_id, role").eq("user_id", userId).eq("ativo", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      if (error)
        throw error;
      if (!data)
        throw new Error("Sem empresa.");
      return { companyId: data.company_id, role: data.role };
    }
    function assertAdmin(role) {
      if (role !== "owner" && role !== "admin") {
        throw new Error("Apenas owner/admin podem gerenciar a equipe.");
      }
    }
    exports.listTeam = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const { supabase, userId } = context;
      const { companyId } = await getOwnedCompanyId(supabase, userId);
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { data: members, error } = await supabaseAdmin.from("company_user").select("id, user_id, role, ativo, created_at").eq("company_id", companyId).order("created_at", { ascending: true });
      if (error)
        throw error;
      const ids = (members ?? []).map((m) => m.user_id);
      let profilesById = /* @__PURE__ */ new Map();
      if (ids.length) {
        const { data: profs } = await supabaseAdmin.from("profiles").select("user_id, email, nome").in("user_id", ids);
        (profs ?? []).forEach((p) => profilesById.set(p.user_id, { email: p.email, nome: p.nome }));
      }
      return {
        members: (members ?? []).map((m) => ({
          ...m,
          email: profilesById.get(m.user_id)?.email ?? null,
          nome: profilesById.get(m.user_id)?.nome ?? null
        }))
      };
    });
    exports.inviteMember = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => {
      const email = String(d.email || "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw new Error("Email inv\xE1lido");
      if (d.role !== "admin" && d.role !== "atendente")
        throw new Error("Role inv\xE1lida");
      return { email, role: d.role };
    }).handler(async ({ context, data }) => {
      const { supabase, userId } = context;
      const { companyId, role } = await getOwnedCompanyId(supabase, userId);
      assertAdmin(role);
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      let targetUserId = null;
      const { data: prof } = await supabaseAdmin.from("profiles").select("user_id").eq("email", data.email).maybeSingle();
      if (prof)
        targetUserId = prof.user_id;
      if (targetUserId) {
        const { data: alreadyLinked } = await supabaseAdmin.from("company_user").select("id, ativo").eq("company_id", companyId).eq("user_id", targetUserId).maybeSingle();
        if (!alreadyLinked?.ativo) {
          const { assertWithinLimit } = await Promise.resolve().then(() => __importStar(require2("src/lib/plan-limits.server")));
          await assertWithinLimit(companyId, "usuarios");
        }
      } else {
        const { assertWithinLimit } = await Promise.resolve().then(() => __importStar(require2("src/lib/plan-limits.server")));
        await assertWithinLimit(companyId, "usuarios");
      }
      let tempPassword = null;
      if (!targetUserId) {
        tempPassword = Math.random().toString(36).slice(2, 10) + "A1!";
        const { data: created, error: cErr } = await supabaseAdmin.auth.admin.createUser({
          email: data.email,
          password: tempPassword,
          email_confirm: true
        });
        if (cErr || !created.user)
          throw new Error(cErr?.message || "Falha ao criar usu\xE1rio");
        targetUserId = created.user.id;
        await supabaseAdmin.from("profiles").upsert({ user_id: targetUserId, email: data.email });
      }
      const { error: linkErr } = await supabaseAdmin.from("company_user").upsert({
        company_id: companyId,
        user_id: targetUserId,
        role: data.role,
        ativo: true,
        forcar_troca_senha: !!tempPassword
      }, { onConflict: "user_id,company_id" });
      if (linkErr)
        throw linkErr;
      return { ok: true, tempPassword };
    });
    exports.setMemberActive = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const { supabase, userId } = context;
      const { companyId, role } = await getOwnedCompanyId(supabase, userId);
      assertAdmin(role);
      if (data.ativo) {
        const { assertWithinLimit } = await Promise.resolve().then(() => __importStar(require2("src/lib/plan-limits.server")));
        await assertWithinLimit(companyId, "usuarios");
      }
      const { error } = await supabase.from("company_user").update({ ativo: data.ativo }).eq("id", data.memberId);
      if (error)
        throw error;
      return { ok: true };
    });
    exports.setMemberRole = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => d).handler(async ({ context, data }) => {
      const { supabase, userId } = context;
      const { role } = await getOwnedCompanyId(supabase, userId);
      if (role !== "owner")
        throw new Error("Apenas o owner pode alterar pap\xE9is.");
      const { error } = await supabase.from("company_user").update({ role: data.role }).eq("id", data.memberId);
      if (error)
        throw error;
      return { ok: true };
    });
  },
  "src/lib/templates.functions": (module, exports, require2, process) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBusinessHours = exports.saveBusinessHours = exports.deleteTemplate = exports.saveTemplate = exports.listTemplates = void 0;
    const react_start_1 = require2("@tanstack/react-start");
    const auth_middleware_1 = require2("@/integrations/supabase/auth-middleware");
    async function currentCompanyId(supabase, userId) {
      const { data } = await supabase.from("company_user").select("company_id").eq("user_id", userId).eq("ativo", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      if (!data?.company_id)
        throw new Error("Sem empresa ativa");
      return data.company_id;
    }
    exports.listTemplates = (0, react_start_1.createServerFn)({ method: "GET" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const cid = await currentCompanyId(context.supabase, context.userId);
      const { data, error } = await context.supabase.from("message_template").select("id, atalho, texto, updated_at").eq("company_id", cid).order("atalho", { ascending: true });
      if (error)
        throw new Error(error.message);
      return data ?? [];
    });
    exports.saveTemplate = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => {
      const atalho = (d?.atalho || "").trim().replace(/^\/+/, "").slice(0, 40);
      const texto = (d?.texto || "").trim().slice(0, 2e3);
      if (!/^[a-z0-9_-]{2,40}$/i.test(atalho)) {
        throw new Error("Atalho: 2-40 caracteres, s\xF3 letras, n\xFAmeros, _ ou -");
      }
      if (texto.length < 1)
        throw new Error("Texto obrigat\xF3rio");
      return { id: d?.id, atalho: atalho.toLowerCase(), texto };
    }).handler(async ({ data, context }) => {
      const cid = await currentCompanyId(context.supabase, context.userId);
      if (data.id) {
        const { error: error2 } = await context.supabase.from("message_template").update({ atalho: data.atalho, texto: data.texto }).eq("id", data.id).eq("company_id", cid);
        if (error2)
          throw new Error(error2.message);
        return { ok: true };
      }
      const { error } = await context.supabase.from("message_template").insert({ company_id: cid, user_id: context.userId, atalho: data.atalho, texto: data.texto });
      if (error)
        throw new Error(error.message);
      return { ok: true };
    });
    exports.deleteTemplate = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => {
      if (!d?.id)
        throw new Error("id obrigat\xF3rio");
      return { id: d.id };
    }).handler(async ({ data, context }) => {
      const cid = await currentCompanyId(context.supabase, context.userId);
      const { error } = await context.supabase.from("message_template").delete().eq("id", data.id).eq("company_id", cid);
      if (error)
        throw new Error(error.message);
      return { ok: true };
    });
    exports.saveBusinessHours = (0, react_start_1.createServerFn)({ method: "POST" }).middleware([auth_middleware_1.requireSupabaseAuth]).inputValidator((d) => {
      const m = (d?.mensagem || "").trim().slice(0, 600);
      if (!m)
        throw new Error("Mensagem fora do hor\xE1rio obrigat\xF3ria");
      const h = d?.horarios;
      if (!h || typeof h !== "object")
        throw new Error("Hor\xE1rios inv\xE1lidos");
      return { horarios: h, mensagem: m };
    }).handler(async ({ data, context }) => {
      const cid = await currentCompanyId(context.supabase, context.userId);
      const { error } = await context.supabase.from("agent_config").update({ horarios_atendimento: data.horarios, mensagem_fora_horario: data.mensagem }).eq("company_id", cid);
      if (error)
        throw new Error(error.message);
      return { ok: true };
    });
    exports.getBusinessHours = (0, react_start_1.createServerFn)({ method: "GET" }).middleware([auth_middleware_1.requireSupabaseAuth]).handler(async ({ context }) => {
      const cid = await currentCompanyId(context.supabase, context.userId);
      const { data } = await context.supabase.from("agent_config").select("horarios_atendimento, mensagem_fora_horario").eq("company_id", cid).maybeSingle();
      return {
        horarios: data?.horarios_atendimento ?? null,
        mensagem: data?.mensagem_fora_horario ?? ""
      };
    });
  },
  "src/routes/api/public/google-callback": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Route = void 0;
    const react_router_1 = require2("@tanstack/react-router");
    const google_server_1 = require2("src/lib/google.server");
    exports.Route = (0, react_router_1.createFileRoute)("/api/public/google-callback")({
      server: {
        handlers: {
          GET: async ({ request }) => {
            const url = new URL(request.url);
            const code = url.searchParams.get("code");
            const state = url.searchParams.get("state");
            if (!code || !state)
              return new Response("missing params", { status: 400 });
            const v = (0, google_server_1.verifyState)(state);
            if (!v)
              return new Response("invalid state", { status: 400 });
            const clientId = process.env.GOOGLE_CLIENT_ID;
            const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
            if (!clientId || !clientSecret)
              return new Response("oauth not configured", { status: 500 });
            const redirectUri = `${url.protocol}//${url.host}/api/public/google-callback`;
            const tokRes = await fetch("https://oauth2.googleapis.com/token", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: "authorization_code"
              })
            });
            const tok = await tokRes.json();
            if (!tok.access_token) {
              return new Response(`token exchange failed: ${JSON.stringify(tok)}`, { status: 400 });
            }
            let email = null;
            try {
              const infoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: { Authorization: `Bearer ${tok.access_token}` }
              });
              const info = await infoRes.json();
              email = info?.email ?? null;
            } catch {
            }
            const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
            await supabaseAdmin.from("google_integration").upsert({
              company_id: v.companyId,
              email,
              access_token: tok.access_token,
              refresh_token: tok.refresh_token ?? null,
              expiry: new Date(Date.now() + (tok.expires_in ?? 3600) * 1e3).toISOString(),
              calendar_id: "primary",
              conectado: true
            }, { onConflict: "company_id" });
            return new Response(`<!doctype html><meta charset="utf-8"><title>Google conectado</title>
<body style="font-family:system-ui;background:#081410;color:#e5f3ea;display:grid;place-items:center;min-height:100vh;margin:0">
<div style="text-align:center;padding:24px">
<h1>\u2705 Google Agenda conectado${email ? ` (${email})` : ""}</h1>
<p>Pode fechar esta aba.</p>
<script>setTimeout(()=>{window.close();location.href=${JSON.stringify((process.env.PUBLIC_APP_URL || `https://${process.env.BLINK_PROJECT_ID}.blinkpowered.com`) + "/app/agente")}},1500)<\/script>
</div></body>`, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
          }
        }
      }
    });
  },
  "src/routes/api/public/whatsapp-webhook": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Route = void 0;
    const react_router_1 = require2("@tanstack/react-router");
    exports.Route = (0, react_router_1.createFileRoute)("/api/public/whatsapp-webhook")({
      server: {
        handlers: {
          POST: async ({ request }) => {
            try {
              const payload = await request.json().catch(() => ({}));
              const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
              const { evoSendText, evoSendPresence } = await Promise.resolve().then(() => __importStar(require2("src/lib/evolution.server")));
              const { lovableAiChat } = await Promise.resolve().then(() => __importStar(require2("src/lib/lovable-ai.server")));
              const { buildSystemPrompt, parseAiOutput } = await Promise.resolve().then(() => __importStar(require2("src/lib/ai-prompt")));
              const event = payload?.event;
              const instanceName = payload?.instance || payload?.instanceName || payload?.data?.instance;
              if (!instanceName)
                return new Response("ok", { status: 200 });
              if (event && event !== "messages.upsert" && event !== "MESSAGES_UPSERT") {
                return new Response("ignored", { status: 200 });
              }
              const data = payload?.data ?? payload;
              const key = data?.key ?? {};
              const fromMe = !!key.fromMe;
              const whatsappMessageId = typeof key.id === "string" && key.id.trim() ? key.id.trim() : null;
              const remoteJid = key.remoteJid || "";
              if (!remoteJid)
                return new Response("no jid", { status: 200 });
              if (remoteJid.endsWith("@g.us"))
                return new Response("group", { status: 200 });
              if (fromMe)
                return new Response("fromMe", { status: 200 });
              const number = remoteJid.split("@")[0];
              const pushName = data?.pushName;
              const msg = data?.message ?? {};
              const mediaFallback = msg.audioMessage ? "[\xC1udio recebido \u2014 pe\xE7a ao contato para enviar a informa\xE7\xE3o por texto]" : msg.documentMessage ? `[Documento recebido${msg.documentMessage?.fileName ? `: ${msg.documentMessage.fileName}` : ""} \u2014 conte\xFAdo n\xE3o extra\xEDdo]` : msg.imageMessage ? "[Imagem recebida sem legenda \u2014 pe\xE7a uma breve descri\xE7\xE3o por texto]" : msg.videoMessage ? "[V\xEDdeo recebido sem legenda \u2014 pe\xE7a uma breve descri\xE7\xE3o por texto]" : msg.stickerMessage ? "[Figurinha recebida]" : "";
              const text = msg.conversation || msg.extendedTextMessage?.text || msg.imageMessage?.caption || msg.videoMessage?.caption || mediaFallback;
              if (!text || !text.trim())
                return new Response("no text", { status: 200 });
              const suppliedToken = new URL(request.url).searchParams.get("t") || request.headers.get("x-webhook-token") || "";
              const { data: inst } = await supabaseAdmin.from("whatsapp_instances").select("company_id, user_id, instance_name, webhook_token").eq("instance_name", instanceName).maybeSingle();
              if (!inst)
                return new Response("unknown instance", { status: 200 });
              if (!suppliedToken || suppliedToken !== inst.webhook_token) {
                return new Response("invalid webhook", { status: 401 });
              }
              const companyId = inst.company_id;
              const userId = inst.user_id;
              if (whatsappMessageId) {
                const { data: duplicate } = await supabaseAdmin.from("mensagens").select("id").eq("company_id", companyId).eq("whatsapp_message_id", whatsappMessageId).maybeSingle();
                if (duplicate)
                  return new Response("duplicate", { status: 200 });
              }
              const insertedAt = (/* @__PURE__ */ new Date()).toISOString();
              const { data: inserted } = await supabaseAdmin.from("mensagens").insert({
                company_id: companyId,
                user_id: userId,
                numero: number,
                contato_nome: pushName ?? null,
                direcao: "entrada",
                autor: "contato",
                texto: text,
                whatsapp_message_id: whatsappMessageId,
                created_at: insertedAt
              }).select("id, created_at").maybeSingle();
              const myCreatedAt = inserted?.created_at || insertedAt;
              try {
                const { emitWebhook } = await Promise.resolve().then(() => __importStar(require2("src/lib/webhooks.server")));
                void emitWebhook(companyId, "message.received", {
                  numero: number,
                  contato_nome: pushName ?? null,
                  texto: text,
                  message_id: inserted?.id
                });
              } catch {
              }
              try {
                const utmMatch = text.match(/\[utm:([^/\]]*)\/([^/\]]*)\/([^\]]*)\]/i);
                if (utmMatch) {
                  const [, s, m, c] = utmMatch;
                  await supabaseAdmin.from("crm_cards").update({
                    utm_source: s || null,
                    utm_medium: m || null,
                    utm_campaign: c || null
                  }).eq("company_id", companyId).eq("numero", number).is("utm_source", null);
                }
              } catch {
              }
              const { data: cfg } = await supabaseAdmin.from("agent_config").select("*").eq("company_id", companyId).maybeSingle();
              const palavraPausar = (cfg?.palavra_pausar || "/pausar").toLowerCase().trim();
              const palavraDespausar = (cfg?.palavra_despausar || "/despausar").toLowerCase().trim();
              const lower = text.toLowerCase().trim();
              const [{ data: stagesRows }, { data: produtosRows }] = await Promise.all([
                supabaseAdmin.from("crm_stage").select("id, nome, tipo, ordem").eq("company_id", companyId).order("ordem", { ascending: true }),
                supabaseAdmin.from("produto").select("nome, preco, descricao, ativo, ordem").eq("company_id", companyId).eq("ativo", true).order("ordem", { ascending: true })
              ]);
              const stages = stagesRows ?? [];
              const produtos = (produtosRows ?? []).map((p) => ({
                nome: p.nome,
                preco: p.preco,
                descricao: p.descricao
              }));
              if (isOptOutMessage(lower)) {
                await supabaseAdmin.from("contact_pause").upsert({ company_id: companyId, user_id: userId, numero: number, pausado: true }, { onConflict: "company_id,numero" });
                await upsertCard(supabaseAdmin, companyId, userId, number, pushName, text, stages);
                return new Response("opt-out", { status: 200 });
              }
              if (lower === palavraPausar) {
                await supabaseAdmin.from("contact_pause").upsert({ company_id: companyId, user_id: userId, numero: number, pausado: true }, { onConflict: "company_id,numero" });
                return new Response("paused", { status: 200 });
              }
              if (lower === palavraDespausar) {
                await supabaseAdmin.from("contact_pause").upsert({ company_id: companyId, user_id: userId, numero: number, pausado: false }, { onConflict: "company_id,numero" });
                return new Response("resumed", { status: 200 });
              }
              const { data: pauseRow } = await supabaseAdmin.from("contact_pause").select("pausado").eq("company_id", companyId).eq("numero", number).maybeSingle();
              if (pauseRow?.pausado) {
                await upsertCard(supabaseAdmin, companyId, userId, number, pushName, text, stages);
                return new Response("paused-contact", { status: 200 });
              }
              try {
                const { isWithinBusinessHours } = await Promise.resolve().then(() => __importStar(require2("src/lib/business-hours")));
                const horarios = cfg?.horarios_atendimento;
                if (horarios?.enabled && !isWithinBusinessHours(horarios)) {
                  const msgFora = cfg?.mensagem_fora_horario || "No momento estamos fora do hor\xE1rio de atendimento. Retornamos em breve.";
                  const { data: ultimaSaida } = await supabaseAdmin.from("mensagens").select("texto, created_at").eq("company_id", companyId).eq("numero", number).eq("direcao", "saida").order("created_at", { ascending: false }).limit(1).maybeSingle();
                  const ultimaFoiFora = ultimaSaida && ultimaSaida.texto === msgFora && Date.now() - new Date(ultimaSaida.created_at).getTime() < 6 * 60 * 6e4;
                  if (!ultimaFoiFora) {
                    try {
                      await evoSendText(instanceName, number, msgFora);
                      await supabaseAdmin.from("mensagens").insert({
                        company_id: companyId,
                        user_id: userId,
                        numero: number,
                        contato_nome: pushName ?? null,
                        direcao: "saida",
                        autor: "ia",
                        texto: msgFora
                      });
                    } catch (e) {
                      console.error("[off-hours send]", e?.message);
                    }
                  }
                  await upsertCard(supabaseAdmin, companyId, userId, number, pushName, text, stages);
                  return new Response("off-hours", { status: 200 });
                }
              } catch (e) {
                console.error("[business-hours]", e?.message);
              }
              const bufferSec = Math.max(0, Math.min(20, Number(cfg?.segundos_buffer ?? 8)));
              if (bufferSec > 0) {
                await new Promise((r) => setTimeout(r, bufferSec * 1e3));
              }
              const { data: newer } = await supabaseAdmin.from("mensagens").select("id, created_at").eq("company_id", companyId).eq("numero", number).eq("direcao", "entrada").gt("created_at", myCreatedAt).limit(1);
              if (newer && newer.length > 0) {
                await upsertCard(supabaseAdmin, companyId, userId, number, pushName, text, stages);
                return new Response("superseded", { status: 200 });
              }
              const { data: humanRecent } = await supabaseAdmin.from("mensagens").select("id, created_at, autor").eq("company_id", companyId).eq("numero", number).eq("direcao", "saida").eq("autor", "humano").gte("created_at", new Date(Date.now() - 9e4).toISOString()).limit(1);
              if (humanRecent && humanRecent.length > 0) {
                await upsertCard(supabaseAdmin, companyId, userId, number, pushName, text, stages);
                return new Response("human-active", { status: 200 });
              }
              const { data: histDesc } = await supabaseAdmin.from("mensagens").select("autor,direcao,texto,created_at").eq("company_id", companyId).eq("numero", number).order("created_at", { ascending: false }).limit(25);
              const historico = (histDesc ?? []).slice().reverse();
              const { data: cardRow } = await supabaseAdmin.from("crm_cards").select("status, nome, stage_id").eq("company_id", companyId).eq("numero", number).maybeSingle();
              const estagioAtual = cardRow?.status || stages[0]?.nome || "Conversas";
              const resumoContato = `${cardRow?.nome || pushName || "Contato"} (${number}), ${historico.length} mensagens trocadas`;
              const { data: googleIntegration } = await supabaseAdmin.from("google_integration").select("conectado").eq("company_id", companyId).maybeSingle();
              const responderEmPartes = cfg?.responder_em_partes ?? true;
              const system = buildSystemPrompt(cfg ?? {}, {
                responderEmPartes,
                estagioAtual,
                resumoContato,
                produtos,
                stages: stages.map((s) => ({ nome: s.nome, tipo: s.tipo })),
                googleConectado: !!googleIntegration?.conectado
              });
              const messages = [
                { role: "system", content: system },
                ...historico.map((m) => ({
                  role: m.direcao === "entrada" ? "user" : "assistant",
                  content: m.texto
                }))
              ];
              if (!messages.length || messages[messages.length - 1].role !== "user") {
                messages.push({ role: "user", content: text });
              }
              const { getCompanyPlan } = await Promise.resolve().then(() => __importStar(require2("src/lib/plan-limits.server")));
              const { allowsProvider } = await Promise.resolve().then(() => __importStar(require2("src/lib/plan-features")));
              const throttleReason = await getAiThrottleReason(supabaseAdmin, companyId, number);
              if (throttleReason) {
                await upsertCard(supabaseAdmin, companyId, userId, number, pushName, text, stages);
                console.warn("[whatsapp.safety] resposta pausada", throttleReason, companyId, number);
                return new Response(throttleReason, { status: 200 });
              }
              const plan = await getCompanyPlan(companyId);
              let providerChoice = cfg?.ai_provider || "gemini";
              let modelChoice = cfg?.ai_model || "google/gemini-2.5-flash";
              if (!allowsProvider(plan.slug, providerChoice)) {
                providerChoice = "gemini";
                modelChoice = "google/gemini-2.5-flash";
              }
              let rawReply = "";
              try {
                rawReply = await lovableAiChat(messages, {
                  provider: providerChoice,
                  model: modelChoice,
                  openaiKey: cfg?.openai_api_key || "",
                  anthropicKey: cfg?.anthropic_api_key || ""
                });
              } catch (e) {
                console.error("[ai]", e?.message);
              }
              if (!rawReply.trim()) {
                await upsertCard(supabaseAdmin, companyId, userId, number, pushName, text, stages);
                return new Response("ai_unavailable", { status: 200 });
              }
              const { parts: parts2, stage, agendar } = parseAiOutput(rawReply, stages.map((s) => ({ nome: s.nome, tipo: s.tipo })));
              const finalParts = sanitizeAiParts(responderEmPartes ? parts2 : [parts2.join(" ")]);
              if (finalParts.length === 0) {
                await upsertCard(supabaseAdmin, companyId, userId, number, pushName, text, stages);
                return new Response("ai_empty", { status: 200 });
              }
              const { data: hasCredit } = await supabaseAdmin.rpc("consume_ai_credit", {
                _company_id: companyId,
                _ref: number
              });
              if (!hasCredit) {
                await upsertCard(supabaseAdmin, companyId, userId, number, pushName, text, stages);
                console.warn("[credits] cr\xE9ditos esgotados \u2014 IA n\xE3o respondeu", companyId);
                return new Response("no_credits", { status: 200 });
              }
              let sentParts = 0;
              for (let i = 0; i < finalParts.length; i++) {
                const part = finalParts[i];
                if (!part)
                  continue;
                try {
                  const typingMs = Math.min(3e3, 1200 + Math.floor(part.length * 35));
                  await evoSendPresence(instanceName, number, "composing", typingMs);
                  await new Promise((r) => setTimeout(r, typingMs));
                  await evoSendText(instanceName, number, part);
                  await supabaseAdmin.from("mensagens").insert({
                    company_id: companyId,
                    user_id: userId,
                    numero: number,
                    contato_nome: pushName ?? null,
                    direcao: "saida",
                    autor: "ia",
                    texto: part
                  });
                  sentParts++;
                  if (i < finalParts.length - 1) {
                    await new Promise((r) => setTimeout(r, 700 + Math.floor(Math.random() * 800)));
                  }
                } catch (e) {
                  console.error("[send]", e?.message);
                }
              }
              if (sentParts === 0) {
                await supabaseAdmin.rpc("refund_ai_credit", {
                  _company_id: companyId,
                  _ref: number
                });
                await upsertCard(supabaseAdmin, companyId, userId, number, pushName, text, stages);
                return new Response("send_failed", { status: 200 });
              }
              if (agendar && googleIntegration?.conectado) {
                try {
                  const { createCalendarEventForCompany } = await Promise.resolve().then(() => __importStar(require2("src/lib/google.server")));
                  await createCalendarEventForCompany(supabaseAdmin, companyId, {
                    titulo: agendar.titulo,
                    inicio: agendar.inicio,
                    fim: agendar.fim,
                    descricao: `Agendado via WhatsApp \u2014 ${pushName || number}`
                  });
                } catch (e) {
                  console.error("[agendar]", e?.message);
                }
              }
              await upsertCard(supabaseAdmin, companyId, userId, number, pushName, finalParts[finalParts.length - 1] || text, stages, stage);
              return new Response("ok", { status: 200 });
            } catch (e) {
              console.error("[webhook]", e?.message, e?.stack);
              return new Response("error", { status: 200 });
            }
          },
          GET: async () => new Response("AtendeZap webhook online", { status: 200 })
        }
      }
    });
    const OPT_OUT_WORDS = ["parar", "pare", "cancelar", "sair", "remover", "descadastrar", "stop", "unsubscribe"];
    function isOptOutMessage(text) {
      const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
      return OPT_OUT_WORDS.some((word) => normalized === word || normalized.includes(` ${word} `));
    }
    function sanitizeAiParts(parts2) {
      return parts2.map((part) => part.replace(/\s+/g, " ").trim()).filter(Boolean).map((part) => part.length > 700 ? `${part.slice(0, 697).trim()}...` : part).slice(0, 2);
    }
    async function getAiThrottleReason(admin, companyId, numero) {
      const now = Date.now();
      const [contactRecent, companyRecent] = await Promise.all([
        admin.from("mensagens").select("id", { count: "exact", head: true }).eq("company_id", companyId).eq("numero", numero).eq("direcao", "saida").eq("autor", "ia").gte("created_at", new Date(now - 10 * 6e4).toISOString()),
        admin.from("mensagens").select("id", { count: "exact", head: true }).eq("company_id", companyId).eq("direcao", "saida").eq("autor", "ia").gte("created_at", new Date(now - 6e4).toISOString())
      ]);
      if ((contactRecent.count ?? 0) >= 6)
        return "contact-rate-limit";
      if ((companyRecent.count ?? 0) >= 20)
        return "company-rate-limit";
      return null;
    }
    async function upsertCard(admin, companyId, userId, numero, nome, ultimaMensagem, stages, proposedStageName) {
      const { data: existing } = await admin.from("crm_cards").select("status, nome, stage_id").eq("company_id", companyId).eq("numero", numero).maybeSingle();
      const stageByName = new Map(stages.map((s) => [s.nome.toLowerCase(), s]));
      const stageById = new Map(stages.map((s) => [s.id, s]));
      const currentStage = existing?.stage_id ? stageById.get(existing.stage_id) : void 0;
      const currentTipo = currentStage?.tipo ?? (existing?.status ? stageByName.get(String(existing.status).toLowerCase())?.tipo : void 0);
      const isLocked = currentTipo === "ganho" || currentTipo === "perda";
      const proposed = proposedStageName ? stageByName.get(proposedStageName.toLowerCase()) : void 0;
      let finalStage = currentStage;
      if (proposed && !isLocked)
        finalStage = proposed;
      if (!finalStage)
        finalStage = stages[0];
      const payload = {
        company_id: companyId,
        user_id: userId,
        numero,
        nome: existing?.nome || nome || null,
        ultima_mensagem: ultimaMensagem.slice(0, 240),
        ultima_em: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (finalStage) {
        payload.stage_id = finalStage.id;
        payload.status = finalStage.nome;
      } else if (existing?.status) {
        payload.status = existing.status;
      } else {
        payload.status = "Conversas";
      }
      await admin.from("crm_cards").upsert(payload, { onConflict: "company_id,numero" });
    }
  },
  "src/lib/webhooks.server": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.emitWebhook = emitWebhook;
    const worker_crypto_1 = require2("src/lib/worker-crypto");
    async function emitWebhook(companyId, event, payload) {
      try {
        const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
        const { data: endpoints } = await supabaseAdmin.from("webhook_endpoint").select("id, url, secret, eventos, ativo").eq("company_id", companyId).eq("ativo", true);
        const list = (endpoints ?? []).filter((e) => !e.eventos?.length || e.eventos.includes(event));
        if (!list.length)
          return;
        const body = JSON.stringify({ event, company_id: companyId, data: payload, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
        await Promise.all(list.map(async (ep) => {
          const sig = (0, worker_crypto_1.createHmac)("sha256", ep.secret).update(body).digest("hex");
          let status = null;
          let erro = null;
          try {
            const r = await fetch(ep.url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-AtendeZap-Event": event,
                "X-AtendeZap-Signature": `sha256=${sig}`
              },
              body,
              signal: AbortSignal.timeout(1e4)
            });
            status = r.status;
            if (!r.ok)
              erro = `HTTP ${r.status}`;
          } catch (e) {
            erro = String(e?.message ?? e).slice(0, 500);
          }
          await supabaseAdmin.from("webhook_delivery_log").insert({
            company_id: companyId,
            endpoint_id: ep.id,
            evento: event,
            status_code: status,
            erro
          });
        }));
      } catch (e) {
        console.warn("[emitWebhook]", e);
      }
    }
  },
  "src/lib/business-hours": (module, exports, require2, process) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DIA_LABEL = void 0;
    exports.defaultHours = defaultHours;
    exports.isWithinBusinessHours = isWithinBusinessHours;
    function defaultHours() {
      return {
        enabled: false,
        timezone: "America/Sao_Paulo",
        dias: {
          "0": null,
          "1": { abre: "09:00", fecha: "18:00" },
          "2": { abre: "09:00", fecha: "18:00" },
          "3": { abre: "09:00", fecha: "18:00" },
          "4": { abre: "09:00", fecha: "18:00" },
          "5": { abre: "09:00", fecha: "18:00" },
          "6": null
        }
      };
    }
    function getZonedParts(date, tz) {
      const fmt = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
      const parts2 = fmt.formatToParts(date);
      const wd = parts2.find((p) => p.type === "weekday")?.value ?? "Mon";
      const hh = Number(parts2.find((p) => p.type === "hour")?.value ?? "0");
      const mm = Number(parts2.find((p) => p.type === "minute")?.value ?? "0");
      const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { dow: map[wd] ?? 0, minutes: hh * 60 + mm };
    }
    function hhmmToMinutes(s) {
      const m = /^(\d{1,2}):(\d{2})$/.exec(s || "");
      if (!m)
        return null;
      const h = Number(m[1]);
      const mi = Number(m[2]);
      if (h < 0 || h > 23 || mi < 0 || mi > 59)
        return null;
      return h * 60 + mi;
    }
    function isWithinBusinessHours(h, now = /* @__PURE__ */ new Date()) {
      if (!h || !h.enabled)
        return true;
      const tz = h.timezone || "America/Sao_Paulo";
      let parts2;
      try {
        parts2 = getZonedParts(now, tz);
      } catch {
        parts2 = getZonedParts(now, "America/Sao_Paulo");
      }
      const day = h.dias?.[String(parts2.dow)] ?? null;
      if (!day)
        return false;
      const open = hhmmToMinutes(day.abre);
      const close = hhmmToMinutes(day.fecha);
      if (open == null || close == null)
        return false;
      if (close > open)
        return parts2.minutes >= open && parts2.minutes < close;
      return parts2.minutes >= open || parts2.minutes < close;
    }
    exports.DIA_LABEL = {
      "0": "Domingo",
      "1": "Segunda",
      "2": "Ter\xE7a",
      "3": "Quarta",
      "4": "Quinta",
      "5": "Sexta",
      "6": "S\xE1bado"
    };
  },
  "src/routes/api/public/billing/webhook": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Route = void 0;
    const react_router_1 = require2("@tanstack/react-router");
    const normalize_1 = require2("src/lib/billing/normalize");
    const worker_crypto_1 = require2("src/lib/worker-crypto");
    function tokenEnv(provider) {
      return provider === "kiwify" ? "KIWIFY_WEBHOOK_TOKEN" : provider === "cakto" ? "CAKTO_WEBHOOK_TOKEN" : "PERFECTPAY_WEBHOOK_TOKEN";
    }
    async function getAdmin() {
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      return supabaseAdmin;
    }
    async function findCompanyByEmail(supabase, email) {
      const { data: prof } = await supabase.from("profiles").select("user_id").ilike("email", email).maybeSingle();
      if (!prof?.user_id)
        return null;
      const { data: cu } = await supabase.from("company_user").select("company_id").eq("user_id", prof.user_id).eq("ativo", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      return cu?.company_id ?? null;
    }
    async function findPlanByRef(supabase, ref) {
      if (!ref)
        return null;
      const { data: bySlug } = await supabase.from("plan").select("id").eq("slug", ref).maybeSingle();
      if (bySlug?.id)
        return bySlug.id;
      const { data: byCheckout } = await supabase.from("plan").select("id").ilike("checkout_url", `%${ref}%`).maybeSingle();
      return byCheckout?.id ?? null;
    }
    async function applyEvent(evt, eventKey) {
      const supabase = await getAdmin();
      const logRow = {
        provider: evt.provider,
        event_type: evt.rawEventName || evt.eventType,
        external_id: evt.externalSubscriptionId,
        buyer_email: evt.buyerEmail,
        payload: evt,
        event_key: eventKey
      };
      const { data: log, error: logError } = await supabase.from("billing_event_log").insert(logRow).select("id").maybeSingle();
      if (logError?.code === "23505")
        return { duplicate: true };
      if (logError || !log)
        throw new Error(logError?.message || "Falha ao registrar evento de cobran\xE7a");
      const finishLog = (patch) => supabase.from("billing_event_log").update(patch).eq("id", log.id);
      if (!evt.buyerEmail) {
        await finishLog({ error: "sem email do comprador" });
        return { duplicate: false };
      }
      const companyId = await findCompanyByEmail(supabase, evt.buyerEmail);
      if (!companyId) {
        await finishLog({ error: "empresa n\xE3o encontrada para o email" });
        return { duplicate: false };
      }
      const planId = await findPlanByRef(supabase, evt.productRef);
      let subStatus = null;
      let companyStatus = null;
      switch (evt.eventType) {
        case "purchase_approved":
        case "subscription_renewed":
          subStatus = "active";
          companyStatus = "ativo";
          break;
        case "subscription_canceled":
          subStatus = "canceled";
          companyStatus = "suspenso";
          break;
        case "refunded":
        case "chargeback":
          subStatus = "canceled";
          companyStatus = "suspenso";
          break;
        case "payment_failed":
          subStatus = "past_due";
          companyStatus = "pendente";
          break;
        default:
          await finishLog({
            matched_company_id: companyId,
            processed: true,
            error: "evento ignorado"
          });
          return { duplicate: false };
      }
      const subPayload = {
        company_id: companyId,
        provider: evt.provider,
        external_subscription_id: evt.externalSubscriptionId,
        external_customer_id: evt.externalCustomerId,
        buyer_email: evt.buyerEmail,
        status: subStatus,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (planId)
        subPayload.plan_id = planId;
      if (evt.periodEnd)
        subPayload.current_period_end = evt.periodEnd;
      if (subStatus === "canceled")
        subPayload.canceled_at = (/* @__PURE__ */ new Date()).toISOString();
      await supabase.from("subscription").upsert(subPayload, { onConflict: "company_id" });
      if (companyStatus) {
        await supabase.from("company").update({ status_cobranca: companyStatus }).eq("id", companyId);
      }
      if (subStatus === "active" && planId) {
        const { data: planRow } = await supabase.from("plan").select("slug").eq("id", planId).maybeSingle();
        if (planRow?.slug) {
          await supabase.rpc("topup_plan_credits", { _company_id: companyId, _plan_slug: planRow.slug });
        }
      }
      await finishLog({
        matched_company_id: companyId,
        processed: true
      });
      return { duplicate: false };
    }
    exports.Route = (0, react_router_1.createFileRoute)("/api/public/billing/webhook")({
      server: {
        handlers: {
          POST: async ({ request }) => {
            const url = new URL(request.url);
            const provider = url.searchParams.get("provider") || "";
            if (!["kiwify", "cakto", "perfectpay"].includes(provider)) {
              return new Response("provider inv\xE1lido", { status: 400 });
            }
            let body = {};
            try {
              body = await request.json();
            } catch {
              try {
                const form = await request.formData();
                body = Object.fromEntries(form.entries());
              } catch {
                body = {};
              }
            }
            const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
            const token = request.headers.get("x-webhook-token") || bearer || (typeof body?.token === "string" ? body.token : "") || (typeof body?.webhook_token === "string" ? body.webhook_token : "");
            const expected = process.env[tokenEnv(provider)];
            if (!expected || token !== expected) {
              return new Response("token inv\xE1lido", { status: 401 });
            }
            try {
              const evt = (0, normalize_1.normalize)(provider, body);
              const eventKey = (0, worker_crypto_1.createHash)("sha256").update(`${provider}:${JSON.stringify(body)}`).digest("hex");
              const result = await applyEvent(evt, eventKey);
              return Response.json({ ok: true, duplicate: result.duplicate });
            } catch (e) {
              console.error("[billing.webhook]", provider, e);
              try {
                const admin = await getAdmin();
                await admin.from("billing_event_log").insert({
                  provider,
                  event_type: "error",
                  payload: body,
                  error: String(e?.message || e)
                });
              } catch (logError) {
                console.error("[billing.webhook.log]", logError);
              }
              return Response.json({ ok: false, error: String(e?.message || e) }, { status: 200 });
            }
          }
        }
      }
    });
  },
  "src/lib/billing/normalize": (module, exports, require2, process) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.normalizeKiwify = normalizeKiwify;
    exports.normalizeCakto = normalizeCakto;
    exports.normalizePerfectpay = normalizePerfectpay;
    exports.normalize = normalize;
    function lower(s) {
      return typeof s === "string" && s.trim() ? s.trim().toLowerCase() : null;
    }
    function pick(obj, ...paths) {
      for (const p of paths) {
        const v = p.split(".").reduce((acc, k) => acc == null ? acc : acc[k], obj);
        if (v !== void 0 && v !== null && v !== "")
          return v;
      }
      return null;
    }
    function mapKiwifyEvent(name) {
      const n = name.toLowerCase();
      if (n.includes("renewed") || n.includes("renovada"))
        return "subscription_renewed";
      if (n.includes("canceled") || n.includes("cancelada"))
        return "subscription_canceled";
      if (n.includes("refund"))
        return "refunded";
      if (n.includes("chargeback"))
        return "chargeback";
      if (n.includes("billet_overdue") || n.includes("payment_failed") || n.includes("rejected"))
        return "payment_failed";
      if (n.includes("approved") || n.includes("paid") || n.includes("aprovad"))
        return "purchase_approved";
      return "unknown";
    }
    function normalizeKiwify(body) {
      const eventName = pick(body, "webhook_event_type", "event") ?? "";
      return {
        provider: "kiwify",
        eventType: mapKiwifyEvent(eventName),
        rawEventName: eventName,
        buyerEmail: lower(pick(body, "Customer.email", "customer.email", "buyer.email")),
        externalSubscriptionId: pick(body, "Subscription.id", "subscription_id", "subscription.id", "order_id", "id") ?? null,
        externalCustomerId: pick(body, "Customer.id", "customer.id", "Customer.CPF") ?? null,
        productRef: pick(body, "Product.product_id", "product_id", "Product.id", "product.id") ?? null,
        amountCents: typeof body?.Commissions?.charge_amount === "number" ? body.Commissions.charge_amount : typeof body?.total_amount === "number" ? body.total_amount : null,
        periodEnd: pick(body, "Subscription.next_payment", "subscription.next_payment") ?? null
      };
    }
    function mapCaktoEvent(name) {
      const n = name.toUpperCase();
      if (n.includes("RENEW"))
        return "subscription_renewed";
      if (n.includes("CANCEL"))
        return "subscription_canceled";
      if (n.includes("REFUND"))
        return "refunded";
      if (n.includes("CHARGEBACK"))
        return "chargeback";
      if (n.includes("FAIL") || n.includes("REJECT"))
        return "payment_failed";
      if (n.includes("APPROVED") || n.includes("PAID"))
        return "purchase_approved";
      return "unknown";
    }
    function normalizeCakto(body) {
      const eventName = pick(body, "event", "event_type") ?? "";
      const data = body?.data ?? body;
      return {
        provider: "cakto",
        eventType: mapCaktoEvent(eventName),
        rawEventName: eventName,
        buyerEmail: lower(pick(data, "customer.email", "buyer.email", "customer_email")),
        externalSubscriptionId: pick(data, "subscription.id", "subscription_id", "transaction_id", "id") ?? null,
        externalCustomerId: pick(data, "customer.id", "customer_id") ?? null,
        productRef: pick(data, "product.id", "product_id", "offer_id") ?? null,
        amountCents: typeof data?.amount_cents === "number" ? data.amount_cents : typeof data?.amount === "number" ? Math.round(data.amount * 100) : null,
        periodEnd: pick(data, "subscription.next_charge_at", "next_charge_at") ?? null
      };
    }
    function mapPerfectpayEvent(status) {
      const n = (status || "").toLowerCase();
      if (n.includes("renew"))
        return "subscription_renewed";
      if (n.includes("cancel"))
        return "subscription_canceled";
      if (n.includes("refund") || n.includes("estorn"))
        return "refunded";
      if (n.includes("chargeback"))
        return "chargeback";
      if (n.includes("approved") || n.includes("paid") || n.includes("aprovad"))
        return "purchase_approved";
      if (n.includes("pending") || n.includes("aguardando"))
        return "unknown";
      return "unknown";
    }
    function normalizePerfectpay(body) {
      const status = pick(body, "sale_status_enum_key", "status", "transaction_status") ?? "";
      return {
        provider: "perfectpay",
        eventType: mapPerfectpayEvent(status),
        rawEventName: status,
        buyerEmail: lower(pick(body, "customer.email", "client.email", "email")),
        externalSubscriptionId: pick(body, "subscription.code", "code", "sale_id", "transaction_code") ?? null,
        externalCustomerId: pick(body, "customer.id", "customer_id") ?? null,
        productRef: pick(body, "product.code", "product_id", "code_product") ?? null,
        amountCents: typeof body?.sale_amount === "number" ? Math.round(body.sale_amount * 100) : null,
        periodEnd: pick(body, "subscription.next_charge", "date_next_charge") ?? null
      };
    }
    function normalize(provider, body) {
      switch (provider) {
        case "kiwify":
          return normalizeKiwify(body);
        case "cakto":
          return normalizeCakto(body);
        case "perfectpay":
          return normalizePerfectpay(body);
        default:
          throw new Error(`provedor desconhecido: ${provider}`);
      }
    }
  },
  "src/routes/api/public/hooks/process-campaigns": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Route = void 0;
    const react_router_1 = require2("@tanstack/react-router");
    exports.Route = (0, react_router_1.createFileRoute)("/api/public/hooks/process-campaigns")({
      server: {
        handlers: {
          POST: async ({ request }) => {
            try {
              const expectedSecret = process.env.CAMPAIGN_WORKER_SECRET;
              const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
              const suppliedSecret = request.headers.get("x-worker-secret") || bearer;
              if (!expectedSecret) {
                return new Response("worker n\xE3o configurado", { status: 503 });
              }
              if (!suppliedSecret || suppliedSecret !== expectedSecret) {
                return new Response("n\xE3o autorizado", { status: 401 });
              }
              const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
              const { evoSendText } = await Promise.resolve().then(() => __importStar(require2("src/lib/evolution.server")));
              await supabaseAdmin.from("campaign").update({ status: "enviando" }).eq("status", "agendada").lte("proximo_envio_em", (/* @__PURE__ */ new Date()).toISOString());
              const { data: due } = await supabaseAdmin.from("campaign").select("*").eq("status", "enviando").lte("proximo_envio_em", (/* @__PURE__ */ new Date()).toISOString()).limit(10);
              const processed = [];
              for (const c of due ?? []) {
                const { data: inst } = await supabaseAdmin.from("whatsapp_instances").select("instance_name, status").eq("company_id", c.company_id).maybeSingle();
                if (!inst || inst.status !== "connected") {
                  processed.push({ id: c.id, skipped: "sem_whatsapp" });
                  continue;
                }
                const batchSize = 5;
                const processingToken = crypto.randomUUID();
                const { data: pending, error: claimError } = await supabaseAdmin.rpc("claim_campaign_targets", { _campaign_id: c.id, _limit: batchSize, _token: processingToken });
                if (claimError)
                  throw claimError;
                if (!pending || pending.length === 0) {
                  const { count: remaining } = await supabaseAdmin.from("campaign_target").select("id", { count: "exact", head: true }).eq("campaign_id", c.id).eq("status", "pendente");
                  if ((remaining ?? 0) > 0) {
                    processed.push({ id: c.id, skipped: "alvos_em_processamento" });
                    continue;
                  }
                  await supabaseAdmin.from("campaign").update({
                    status: "concluida",
                    concluido_em: (/* @__PURE__ */ new Date()).toISOString()
                  }).eq("id", c.id);
                  processed.push({ id: c.id, done: true });
                  continue;
                }
                let enviados = 0;
                let falhas = 0;
                for (const t of pending) {
                  try {
                    const texto = String(c.mensagem || "").replace(/\{\{nome\}\}/gi, t.contato_nome || "");
                    await evoSendText(inst.instance_name, t.contato_numero, texto);
                    await supabaseAdmin.from("campaign_target").update({
                      status: "enviado",
                      enviado_em: (/* @__PURE__ */ new Date()).toISOString(),
                      processing_token: null,
                      processing_started_at: null
                    }).eq("id", t.id).eq("processing_token", processingToken);
                    if (c.created_by) {
                      await supabaseAdmin.from("mensagens").insert({
                        company_id: c.company_id,
                        user_id: c.created_by,
                        numero: t.contato_numero,
                        contato_nome: t.contato_nome,
                        direcao: "saida",
                        autor: "sistema",
                        texto
                      });
                    }
                    enviados++;
                  } catch (e) {
                    await supabaseAdmin.from("campaign_target").update({
                      status: "falhou",
                      erro: String(e?.message ?? e).slice(0, 500),
                      processing_token: null,
                      processing_started_at: null
                    }).eq("id", t.id).eq("processing_token", processingToken);
                    falhas++;
                  }
                }
                const minS = Math.max(2, c.intervalo_min_seg ?? 5);
                const maxS = Math.max(minS, c.intervalo_max_seg ?? 20);
                let nextDelaySeg = Math.floor(minS + Math.random() * (maxS - minS + 1));
                const totalEnviados = (c.total_enviados ?? 0) + enviados;
                const pausaApos = c.pausa_apos_envios ?? 50;
                const pausaDurMin = c.pausa_duracao_min ?? 10;
                if (pausaApos > 0 && Math.floor(totalEnviados / pausaApos) > Math.floor((c.total_enviados ?? 0) / pausaApos)) {
                  nextDelaySeg = pausaDurMin * 60;
                }
                await supabaseAdmin.from("campaign").update({
                  total_enviados: totalEnviados,
                  total_falhas: (c.total_falhas ?? 0) + falhas,
                  proximo_envio_em: new Date(Date.now() + nextDelaySeg * 1e3).toISOString()
                }).eq("id", c.id);
                processed.push({ id: c.id, enviados, falhas });
              }
              return Response.json({ ok: true, processed });
            } catch (e) {
              console.error("[process-campaigns]", e);
              return new Response(JSON.stringify({ ok: false, error: String(e?.message ?? e) }), { status: 500 });
            }
          }
        }
      }
    });
  },
  "src/routes/api/public/v1/$": (module, exports, require2, process) => {
    "use strict";
    var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    var __importStar = /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Route = void 0;
    const react_router_1 = require2("@tanstack/react-router");
    async function authToken(request) {
      const h = request.headers.get("authorization") || "";
      const m = h.match(/^Bearer\s+(azp_[a-z0-9]+)$/i);
      if (!m)
        return null;
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const { data } = await supabaseAdmin.from("api_token").select("id, company_id, criado_por, revogado").eq("token", m[1]).maybeSingle();
      if (!data || data.revogado)
        return null;
      await supabaseAdmin.from("api_token").update({ ultimo_uso_em: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", data.id);
      return { companyId: data.company_id, userId: data.criado_por };
    }
    async function handle(request) {
      const auth = await authToken(request);
      if (!auth)
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
      const { companyId, userId } = auth;
      const { supabaseAdmin } = await Promise.resolve().then(() => __importStar(require2("@/integrations/supabase/client.server")));
      const url = new URL(request.url);
      const resource = url.searchParams.get("resource") || "contacts";
      if (request.method === "GET") {
        if (resource === "contacts") {
          const { data } = await supabaseAdmin.from("crm_cards").select("id, numero, contato_nome, tags, stage_id, valor, utm_source, utm_medium, utm_campaign, created_at").eq("company_id", companyId).order("created_at", { ascending: false }).limit(200);
          return Response.json({ data: data ?? [] });
        }
        if (resource === "messages") {
          const numero = url.searchParams.get("numero") || "";
          let q = supabaseAdmin.from("mensagens").select("id, numero, direcao, autor, texto, created_at").eq("company_id", companyId).order("created_at", { ascending: false }).limit(100);
          if (numero)
            q = q.eq("numero", numero);
          const { data } = await q;
          return Response.json({ data: data ?? [] });
        }
        return new Response(JSON.stringify({ error: "Unknown resource" }), { status: 400 });
      }
      if (request.method === "POST") {
        const body = await request.json().catch(() => ({}));
        if (resource === "messages") {
          const numero = String(body.numero || "").replace(/\D/g, "");
          const texto = String(body.texto || "");
          if (!numero || !texto)
            return new Response(JSON.stringify({ error: "numero e texto obrigat\xF3rios" }), { status: 400 });
          const { data: inst } = await supabaseAdmin.from("whatsapp_instances").select("instance_name, status").eq("company_id", companyId).maybeSingle();
          if (!inst || inst.status !== "connected")
            return new Response(JSON.stringify({ error: "WhatsApp n\xE3o conectado" }), { status: 400 });
          if (!userId)
            return new Response(JSON.stringify({ error: "Token sem owner; recrie o token." }), { status: 400 });
          try {
            const { evoSendText } = await Promise.resolve().then(() => __importStar(require2("src/lib/evolution.server")));
            await evoSendText(inst.instance_name, numero, texto);
            await supabaseAdmin.from("mensagens").insert({
              company_id: companyId,
              user_id: userId,
              numero,
              direcao: "saida",
              autor: "api",
              texto
            });
            return Response.json({ ok: true });
          } catch (e) {
            return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 500 });
          }
        }
        return new Response(JSON.stringify({ error: "Unknown resource" }), { status: 400 });
      }
      return new Response("Method Not Allowed", { status: 405 });
    }
    exports.Route = (0, react_router_1.createFileRoute)("/api/public/v1/$")({
      server: {
        handlers: {
          GET: ({ request }) => handle(request),
          POST: ({ request }) => handle(request)
        }
      }
    });
  }
};
function loadDomain(ctx) {
  const cache = {};
  const external = { "qrcode": external0, "buffer": external1, "@noble/hashes/sha2.js": sha2_exports, "@noble/hashes/hmac.js": hmac_exports };
  function createServerFn() {
    let validate = (x) => x, needsAuth = false;
    const builder = { middleware() {
      needsAuth = true;
      return builder;
    }, inputValidator(fn) {
      validate = fn;
      return builder;
    }, handler(fn) {
      return async (args = {}) => {
        if (needsAuth && !ctx.identity.userId) throw new Error("Autentica\xE7\xE3o necess\xE1ria");
        return fn({ context: { supabase: ctx.scoped, userId: ctx.identity.userId, claims: ctx.identity }, data: validate(args.data), request: ctx.request });
      };
    } };
    return builder;
  }
  const special = { "@tanstack/react-router": { createFileRoute: () => (config) => config }, "@tanstack/react-start": { createServerFn }, "@tanstack/react-start/server": { getRequest: () => ctx.request }, "@/integrations/supabase/auth-middleware": { requireSupabaseAuth: {} }, "@/integrations/supabase/client.server": { supabaseAdmin: ctx.admin }, "@/integrations/supabase/client": { supabase: ctx.scoped }, "@/blink/client": { blink: ctx.blink }, "node:process": { env: ctx.env } };
  function load(id) {
    if (special[id]) return special[id];
    if (external[id]) return external[id];
    if (cache[id]) return cache[id].exports;
    if (!factories[id]) throw new Error("M\xF3dulo indispon\xEDvel");
    const module = { exports: {} };
    cache[id] = module;
    factories[id](module, module.exports, load, { env: ctx.env });
    return module.exports;
  }
  return load;
}

// server/index.ts
var app = new Hono2();
app.use("*", cors({ origin: "*" }));
app.onError((e, c) => {
  console.error("request failed", e.message);
  return c.json({ error: e.message || "Falha ao processar" }, 400);
});
app.get("/health", async (c) => {
  const ctx = await makeContext(c.req.raw, c.env);
  await ctx.blink.db.sql("SELECT id FROM plan LIMIT 1");
  return c.json({ ok: true, database: "connected", version: "native-v1" });
});
app.get("/api/bootstrap", async (c) => {
  const ctx = await makeContext(c.req.raw, c.env);
  if (!ctx.identity.userId) return c.json({ configured: !!(c.env.OWNER_USER_ID || c.env.OWNER_EMAIL) && c.env.OWNER_PROJECT_ID === c.env.BLINK_PROJECT_ID }, 401);
  return c.json({ configured: !!(c.env.OWNER_USER_ID || c.env.OWNER_EMAIL) && c.env.OWNER_PROJECT_ID === c.env.BLINK_PROJECT_ID, isSuperAdmin: ctx.identity.master });
});
app.post("/api/query", async (c) => {
  const ctx = await makeContext(c.req.raw, c.env);
  const spec = await c.req.json();
  const db = new Database(ctx.sql, ctx.identity);
  return c.json(await db.execute(spec));
});
app.post("/api/rpc", async (c) => {
  const ctx = await makeContext(c.req.raw, c.env), body = await c.req.json();
  if (!rpcAllowlist[body.module]?.includes(body.name)) return c.json({ error: "Opera\xE7\xE3o inexistente" }, 404);
  const publicOps = ["getCsatByToken", "submitCsat"];
  if (!ctx.identity.userId && !publicOps.includes(body.name)) return c.json({ error: "Autentica\xE7\xE3o necess\xE1ria" }, 401);
  const load = loadDomain(ctx), result = await load(body.module)[body.name]({ data: body.data });
  return c.json(result ?? null);
});
app.post("/api/database-operation", async (c) => {
  const ctx = await makeContext(c.req.raw, c.env);
  if (!ctx.identity.userId) return c.json({ error: "Autentica\xE7\xE3o necess\xE1ria" }, 401);
  const body = await c.req.json();
  return c.json(await ctx.scoped.rpc(body.name, body.args));
});
for (const [route, module] of Object.entries(publicRoutes)) app.all(route.replace("/$", "/*"), async (c) => {
  const ctx = await makeContext(c.req.raw, c.env, true), config = loadDomain(ctx)(module).Route;
  const handler = config.server?.handlers?.[c.req.method];
  if (!handler) return c.json({ error: "M\xE9todo n\xE3o permitido" }, 405);
  return handler({ request: c.req.raw, params: { _splat: c.req.path.split("/v1/")[1] || "" } });
});
var index_default = app;
export {
  index_default as default
};
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/
