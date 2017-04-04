const colorsCode = [
  '96, 125, 139',
  '0, 188, 212',
  '121, 85, 72',
  '0, 150, 136',
  '255, 235, 59',
  '244, 67, 54',
  '63, 81, 181',
  '255, 87, 34',
  '76, 175, 80',
  '156, 39, 176',
];

export default function (colorNumber, alpha) {
  const index = colorNumber.toString().slice(-1);
  return `rgba(${colorsCode[+index]}, ${alpha})`;
}
