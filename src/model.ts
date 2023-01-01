export type Departure = {
    line: string
    direction: string
    stopName: string
    departureTime: Date
    mode: string
}

export type DepartureGroup = {
    line: string
    direction: string
    stopName: string
    departureTimes: Date[]
    mode: string
}

export const tramLines = ["M1", "M2", "M4", "M5", "M6", "M8", "M10", "M13", "M17", "12", "16", "18", "21", "27", "37", "50", "60", "61", "62", "63", "67", "68"]
export const modeUBahn = "ubahn";
export const modeSBahn = "sbahn";
export const modeTram = "tram";
export const modeTrain = "train";
export const modeBus = "bus";
export const modeOther = "other";
