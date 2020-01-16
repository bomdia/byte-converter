const decimal = 1000
const binary = 1024

const conversionMap = {
  b: Math.pow(binary, 0),
  B: Math.pow(binary, 0),
  kb: Math.pow(decimal, 1),
  kB: Math.pow(decimal, 1),
  Kib: Math.pow(binary, 2),
  KiB: Math.pow(binary, 2),
  Mb: Math.pow(decimal, 2),
  MB: Math.pow(decimal, 2),
  Mib: Math.pow(binary, 2),
  MiB: Math.pow(binary, 2),
  Gb: Math.pow(decimal, 3),
  GB: Math.pow(decimal, 3),
  Gib: Math.pow(binary, 3),
  GiB: Math.pow(binary, 3),
  Tb: Math.pow(decimal, 4),
  TB: Math.pow(decimal, 4),
  Tib: Math.pow(binary, 4),
  TiB: Math.pow(binary, 4),
  Pb: Math.pow(decimal, 5),
  PB: Math.pow(decimal, 5),
  Pib: Math.pow(binary, 5),
  PiB: Math.pow(binary, 5),
  Eb: Math.pow(binary, 6),
  EB: Math.pow(binary, 6),
  Eib: Math.pow(decimal, 6),
  EiB: Math.pow(decimal, 6),
  Zb: Math.pow(binary, 7),
  ZB: Math.pow(binary, 7),
  Zib: Math.pow(decimal, 7),
  ZiB: Math.pow(decimal, 7),
  Yb: Math.pow(binary, 8),
  YB: Math.pow(binary, 8),
  Yib: Math.pow(decimal, 8),
  YiB: Math.pow(decimal, 8)
}

const isByte = function (str) {
  if (str && str.length && str.length > 0) {
    const character = str[str.length - 1]
    return character === character.toUpperCase()
  } else throw new Error('not a valid string')
}

export default function convert (value, from, to) {
  if (value) {
    if (conversionMap[from] && conversionMap[to]) {
      const fromIsByte = isByte(from)
      const toIsByte = isByte(to)
      let reduced = -1
      if ((fromIsByte && toIsByte) || (!fromIsByte && !toIsByte)) {
        reduced = value * conversionMap[from]
      } else if (fromIsByte && !toIsByte) {
        reduced = value * conversionMap[from] * 8
      } else if (!fromIsByte && toIsByte) {
        reduced = value * conversionMap[from] / 8
      }
      return reduced / conversionMap[to]
    } else throw new Error('Can\'t find the conversion unit')
  } else throw new Error('no value supplied')
}
