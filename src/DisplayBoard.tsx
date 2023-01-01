import React from 'react';
import renderLine from './RenderLine'
import getDepartures from './DepartureData';
import { DepartureGroup } from './model';

interface DisplayBoardProps extends React.HTMLProps<React.HTMLInputTypeAttribute> { }

type DisplayBoardState = {
    latitude: number | null
    longitude: number | null
    hideBuses: boolean
    departures: DepartureGroup[]
    inputLatLong: string
    buttonGoDisabled: boolean
}

const localStorageInputLatLong = "inputLatLong"

export default class DisplayBoard extends React.Component<DisplayBoardProps> {
  state: DisplayBoardState;
  interval: NodeJS.Timer | any;
  
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

      this.interval = null

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

  onButtonCurrentLocationClick = () => {
    let errorFunction = () => {alert("Couldn't get current location");}
    let successFunction = (position: any) => {
        let state = {...this.state}
        state.inputLatLong = `${position.coords.latitude}, ${position.coords.longitude}`
        this.setState(state)
        this.handleLatLongSubmit()
    }
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    }
    else 
    {
        errorFunction()
    }    
  }
  
  handleLatLongSubmit = async () => {
    let state = {...this.state}
    state.buttonGoDisabled = true
    state.departures = []
    this.setState(state)
    let parsed = this.state.inputLatLong.split(",").map(s => s.trim())
    state.latitude = +parsed[0]
    state.longitude = +parsed[1]
    getDepartures(state.latitude, state.longitude).then(deps => {
        state.departures = deps
        state.buttonGoDisabled = false
        this.setState(state)
        localStorage.setItem(localStorageInputLatLong, this.state.inputLatLong)
    })
  }

  async componentDidMount() {
    let departuresFormatted = await getDepartures(this.state.latitude, this.state.longitude);
    let state = {...this.state}
    state.departures = departuresFormatted
    this.setState(state)
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 5_000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getDepartureTimesAsString = (times: Date[]) => {
    let now = new Date().getTime()
    return times.map(t => {
        return `${Math.floor((t.getTime() - now)/60000).toString()}`
    }).join(", ")
  }

  render() {
    return (
        <div>
            <input id="inputLatLong" type="text" placeholder="Latitude, Longitude" value={this.state.inputLatLong} onChange={this.onInputLatLongChange}/>
            <input type="button" value="Go" onClick={this.handleLatLongSubmit} disabled={this.state.buttonGoDisabled} />
            <br/>
            <input type="button" value="Use current location" onClick={this.onButtonCurrentLocationClick} />
            <label>
                <input type="checkbox" checked={this.state.hideBuses} onChange={this.handleHideBus}/>
                Hide buses
            </label>
            <table>
                <thead><tr>
                    <th>Stop</th>
                    <th>Line</th>
                    <th>Direction</th>
                    <th>Time (min)</th>
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
                            <td>{d.stopName}</td>
                            <td>{renderLine(d.mode, d.line)}</td>
                            <td>{d.direction}</td>
                            <td className="departureTime">{this.getDepartureTimesAsString(d.departureTimes)}</td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        </div>
    )
  }
}
