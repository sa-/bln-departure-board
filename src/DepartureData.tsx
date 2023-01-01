
import { groupBy } from './util';
import axios from 'axios';
import { Departure, DepartureGroup, modeSBahn, modeTram, modeUBahn, tramLines } from './model';



async function getDeparturesForStop(stopId: string) {
    let url = `https://v5.bvg.transport.rest/stops/${stopId}/departures?duration=30&linesOfStops=false`
    let response = await axios.get(url)
    return response.data
}

function getMode(line: string, suppliedMode: string) {
    if(line[0] === "U") {
        return modeUBahn
    }
    if(line[0] === "S") {
        return modeSBahn
    }
    if(tramLines.includes(line)) {
        return modeTram
    }
    return suppliedMode
}

export default async function getDepartures(latitude: number | null, longitude: number | null) {
    if (latitude == null || longitude == null) { return [] }
    let url = `https://v5.bvg.transport.rest/stops/nearby?latitude=${latitude}&longitude=${longitude}`;
    let response = await axios.get(url);
    let nearbyStops = response.data;

    let departuresRaw = await Promise.all(nearbyStops
        .map((s: any) => getDeparturesForStop(s.id)));

    let flattened = departuresRaw.reduce((accumulator: any, value: any) => accumulator.concat(value), []);

    let departuresFormatted = flattened
        .map((d: any) => {
            return {
                direction: d.direction,
                line: d.line.name,
                stopName: d.stop.name,
                departureTime: new Date(d.when),
                mode: d.line.mode
            };
        })

    let tmpDepartureGroups = groupBy(departuresFormatted, (i: Departure) => `${i.stopName}, ${i.line}, ${i.direction}`)

    let departureGroups: DepartureGroup[] = Object.entries(tmpDepartureGroups).map((group: any) => {
        let departures: Departure[] = group[1]
        return {
            direction: departures[0].direction,
            line: departures[0].line,
            stopName: departures[0].stopName,
            mode: getMode(departures[0].line, departures[0].mode),
            departureTimes: departures.map(d => d.departureTime).sort()
        }
    })
        
    let departuredSorted = departureGroups.sort(function (a: DepartureGroup, b: DepartureGroup) {
        // asc
        if (a.stopName < b.stopName) return -1;
        if (a.stopName > b.stopName) return 1;
        // desc
        if (a.mode < b.mode) return 1;
        if (a.mode > b.mode) return -1;
        // asc
        if (a.departureTimes[0] < b.departureTimes[0]) return -1;
        if (a.departureTimes[0] > b.departureTimes[0]) return 1;
        return 0;
    });
    return departuredSorted;
}