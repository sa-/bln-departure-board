
import svgS1 from './assets/s1.svg'
import svgS2 from './assets/s2.svg'
import svgS3 from './assets/s3.svg'
import svgS5 from './assets/s5.svg'
import svgS7 from './assets/s7.svg'
import svgS8 from './assets/s8.svg'
import svgS9 from './assets/s9.svg'
import svgS25 from './assets/s25.svg'
import svgS26 from './assets/s26.svg'
import svgS41 from './assets/s41.svg'
import svgS42 from './assets/s42.svg'
import svgS45 from './assets/s45.svg'
import svgS46 from './assets/s46.svg'
import svgS47 from './assets/s47.svg'
import svgS75 from './assets/s75.svg'
import svgS85 from './assets/s85.svg'
import svgU12 from './assets/u12.svg'
import svgU1 from './assets/u1.svg'
import svgU2 from './assets/u2.svg'
import svgU3 from './assets/u3.svg'
import svgU7 from './assets/u7.svg'
import svgU6 from './assets/u6.svg'
import svgU4 from './assets/u4.svg'
import svgU5 from './assets/u5.svg'
import svgU8 from './assets/u8.svg'
import svgU9 from './assets/u9.svg'
import svgU55 from './assets/u55.svg'
import svgBus from './assets/bus.svg'
import svgTram from './assets/tram.svg'

const tramLines = ["M1", "M2", "M4", "M5", "M6", "M8", "M10", "M13", "M17", "12", "16", "18", "21", "27", "37", "50", "60", "61", "62", "63", "67", "68"]

export default function renderLine(mode: string, line: string) {
    if (line === "S1") {
        return <img className="lineSvg" src={svgS1} alt="S1"/>
    }
    if (line === "S2") {
        return <img className="lineSvg" src={svgS2} alt={line} />
    }
    if (line === "S3") {
        return <img className="lineSvg" src={svgS3} alt={line} />
    }
    if (line === "S5") {
        return <img className="lineSvg" src={svgS5} alt={line} />
    }
    if (line === "S7") {
        return <img className="lineSvg" src={svgS7} alt={line} />
    }
    if (line === "S8") {
        return <img className="lineSvg" src={svgS8} alt={line} />
    }
    if (line === "S9") {
        return <img className="lineSvg" src={svgS9} alt={line} />
    }
    if (line === "S25") {
        return <img className="lineSvg" src={svgS25} alt={line} />
    }
    if (line === "S26") {
        return <img className="lineSvg" src={svgS26} alt={line} />
    }
    if (line === "S41") {
        return <span><img className="lineSvg" src={svgS41} alt={line} />↻</span>
    }
    if (line === "S42") {
        return <span><img className="lineSvg" src={svgS42} alt={line} />↺</span>
    }
    if (line === "S45") {
        return <img className="lineSvg" src={svgS45} alt={line} />
    }
    if (line === "S46") {
        return <img className="lineSvg" src={svgS46} alt={line} />
    }
    if (line === "S47") {
        return <img className="lineSvg" src={svgS47} alt={line} />
    }
    if (line === "S75") {
        return <img className="lineSvg" src={svgS75} alt={line} />
    }
    if (line === "S85") {
        return <img className="lineSvg" src={svgS85} alt={line} />
    }
    if (line === "U12") {
        return <img className="lineSvg" src={svgU12} alt={line} />
      }
      if (line === "U1") {
        return <img className="lineSvg" src={svgU1} alt={line} />
      }
      if (line === "U2") {
        return <img className="lineSvg" src={svgU2} alt={line} />
      }
      if (line === "U3") {
        return <img className="lineSvg" src={svgU3} alt={line} />
      }
      if (line === "U7") {
        return <img className="lineSvg" src={svgU7} alt={line} />
      }
      if (line === "U6") {
        return <img className="lineSvg" src={svgU6} alt={line} />
      }
      if (line === "U4") {
        return <img className="lineSvg" src={svgU4} alt={line} />
      }
      if (line === "U5") {
        return <img className="lineSvg" src={svgU5} alt={line} />
      }
      if (line === "U8") {
        return <img className="lineSvg" src={svgU8} alt={line} />
      }
      if (line === "U9") {
        return <img className="lineSvg" src={svgU9} alt={line} />
      }
      if (line === "U55") {
        return <img className="lineSvg" src={svgU55} alt={line} />
      }
    if(tramLines.includes(line)) {
        return <span><img className="lineSvg" src={svgTram} alt="Tram"/> <span className="lineDisplayText">{line}</span></span>
    }
    if (mode === "bus") {
        return <div className="modeCol"><img className="lineSvg" src={svgBus} alt="Bus"/> <span className="lineDisplayText">{line}</span></div>
    }
    if (mode === "train") {
       return <div className="modeCol">🚂 &nbsp; <span className="train-badge">{line}</span></div>
    }

    return <div>{mode} {line}</div>
}