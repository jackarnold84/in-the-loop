export const palette = {
  primary: '#2166b1',
  bus: '#0b67be',
}

export const getTrainColor = (route) => {
  const trainColorsMap = {
    "Red": "#c60c30",
    "Blue": "#00a1de",
    "Brown": "#62361b",
    "Green": "#009b3a",
    "Orange": "#f9461c",
    "Pink": "#e27ea6",
    "Purple": "#522398",
    "Yellow": "#f9e300",
  }
  return trainColorsMap[route] || "#000000"
}
