export const palette = {
  primary: '#2166b1',
  bus: '#0b67be',
  alertRed: '#db0000',
}

export const getTrainColor = (route: string): string => {
  const trainColorsMap: { [key: string]: string } = {
    "Red": "#c60c30",
    "Red Line": "#c60c30",
    "Blue": "#00a1de",
    "Blue Line": "#00a1de",
    "Brown": "#62361b",
    "Brown Line": "#62361b",
    "Green": "#009b3a",
    "Green Line": "#009b3a",
    "Orange": "#f9461c",
    "Orange Line": "#f9461c",
    "Pink": "#e27ea6",
    "Pink Line": "#e27ea6",
    "Purple": "#522398",
    "Purple Line": "#522398",
    "Yellow": "#f9e300",
    "Yellow Line": "#f9e300",
  }
  return trainColorsMap[route] || "#000000"
}
