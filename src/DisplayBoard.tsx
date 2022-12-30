import React from 'react';
import axios from 'axios';

interface DisplayBoardProps extends React.HTMLProps<React.HTMLInputTypeAttribute> { }

type DisplayBoardState = {
    latitude: number | null
    longitude: number | null
    hideBuses: boolean
    departures: Departure[]
    inputLatLong: string
    buttonGoDisabled: boolean
}

type Departure = {
    line: string
    direction: string
    stopName: string
    departureTime: Date
    mode: string
}

async function getDeparturesForStop(stopId: string) {
    let url = `https://v5.bvg.transport.rest/stops/${stopId}/departures?duration=30&linesOfStops=false`
    let response = await axios.get(url)
    return response.data
}

const localStorageInputLatLong = "inputLatLong"

export default class DisplayBoard extends React.Component<DisplayBoardProps> {
  state: DisplayBoardState;
  
  
  constructor(props: DisplayBoardProps) {
      super(props);

      let previousInputLatLong = localStorage.getItem(localStorageInputLatLong) ?? "52.520284731741135, 13.388098977894254"
      let latitude = 52.520284731741135
      let longitude = 13.388098977894254
      let inputLatLong = `${latitude}, ${longitude}`
      if(previousInputLatLong !== "") {
        let parsed = previousInputLatLong.split(",").map(s => s.trim())
        latitude = +parsed[0]
        longitude = +parsed[1]
        inputLatLong = previousInputLatLong
      }

      this.state = {
          latitude: latitude,
          longitude: longitude,
          hideBuses: false,
          departures: [],
          inputLatLong: inputLatLong,
          buttonGoDisabled: false
      };

  }

  handleHideBus = (e: any) => {
    let state = {...this.state}
    state.hideBuses = !this.state.hideBuses
    this.setState(state)
  }

  onInputLatLongChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let state = {...this.state}
    state.inputLatLong = e.target.value
    this.setState(state)
  }
  
  handleLatLongSubmit = async () => {
    localStorage.setItem(localStorageInputLatLong, this.state.inputLatLong)
    let state = {...this.state}
    state.buttonGoDisabled = true
    state.departures = []
    this.setState(state)
    let parsed = this.state.inputLatLong.split(",").map(s => s.trim())
    state.latitude = +parsed[0]
    state.longitude = +parsed[1]
    this.getDepartures(state.latitude, state.longitude).then(deps => {
        state.departures = deps
        state.buttonGoDisabled = false
        this.setState(state)
    })
  }

  async componentDidMount() {

    let departuresFormatted = await this.getDepartures(this.state.latitude, this.state.longitude);

    let state = {...this.state}
    state.departures = departuresFormatted
    this.setState(state)
  }

    private async getDepartures(latitude: number | null, longitude: number | null) {
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
            }).sort(function (a: Departure, b: Departure) {
                if (a.stopName < b.stopName) return -1;
                if (a.stopName > b.stopName) return 1;
                if (a.line < b.line) return -1;
                if (a.line > b.line) return 1;
                if (a.departureTime < b.departureTime) return -1;
                if (a.departureTime > b.departureTime) return 1;
                return 0;
            });
        return departuresFormatted;
    }

  render() {
    let now = new Date().getTime()
    return (
        <div>
            <input id="inputLatLong" type="text" placeholder="Latitude, Longitude" value={this.state.inputLatLong} onChange={this.onInputLatLongChange}/>
            <input type="button" value="Go" onClick={this.handleLatLongSubmit} disabled={this.state.buttonGoDisabled} />
            <br/>
            <label>
                <input type="checkbox" checked={this.state.hideBuses} onChange={this.handleHideBus}/>
                Hide buses
            </label>
            <table>
                <thead><tr>
                    <th>Mode</th>
                    <th>Stop</th>
                    <th>Line</th>
                    <th>Direction</th>
                    <th>Time</th>
                </tr></thead>
                <tbody>
                {
                this.state.departures
                    .filter(d => {
                        if(this.state.hideBuses && d.mode === "bus") return false
                        return true
                    })
                    .map(d => 
                        <tr>
                            <td>{d.mode}</td>
                            <td>{d.stopName}</td>
                            <td>{d.line}</td>
                            <td>{d.direction}</td>
                            <td>{Math.floor((d.departureTime.getTime() - now)/60000).toString()} min</td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        </div>
    )
  }
}
