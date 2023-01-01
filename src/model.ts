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