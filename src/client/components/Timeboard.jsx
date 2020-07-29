import React, { Component } from 'react';
import '../scss/application.css';
import dateFormat from 'dateformat';
import { ClipLoader } from 'react-spinners';
import { css } from 'react-emotion';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

class Timeboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curTime: '',
    };
    
  }

  componentDidMount() {
    setInterval(() => {
      const now = new Date();
      this.setState({
        curTime: dateFormat(now, 'HH:MM'),
      });
    }, 1000);
  }

  createTableRows() {
    const table = this.props.currentDB;
    let data = '';

    for (let i = 0; i < table.length; i += 1) { // Adding calculated time left to for each JSON object.
      const calcTimeLeft = this.calculateTimeLeft(table[i].rtTime, table[i].time, table[i].date);
      table[i].calcTimeLeft = calcTimeLeft;
    }

    table.sort((a, b) => a.calcTimeLeft - b.calcTimeLeft);

    try {
      data = table.map((journey) => {
        if (journey.calcTimeLeft === 0) {
          journey.calcTimeLeft = 'Nu';
        }
        return (
          <div class="Rtable-row">
          <div class="Rtable-cell name-cell">
            <div class="Rtable-cell--content date-content"><div className="journeyIcon" style={{ backgroundColor: journey.fgColor, color: journey.bgColor }}>{journey.sname}</div></div>
          </div>
          <div class="Rtable-cell destination-cell">
            <div class="Rtable-cell--content title-content">{journey.direction}</div>
          </div>
          <div class="Rtable-cell timeleft-cell">
            <div class="Rtable-cell--content timeleft-content">{journey.calcTimeLeft}</div>
          </div>
          <div class="Rtable-cell track-cell">
            <div class="Rtable-cell--content track-content">{journey.track}</div>
          </div>
        </div>
        );
      });
    } catch (error) {
      console.log(error);
      console.log('Could not createTableRows!');
    }

    return data;
  }

  // Takes the realtime or the tabletime from the API and converts it to minutes.
  calculateTimeLeft(journeyrtTime, journeyTableTime, journeyDate) {
    const JRT = journeyrtTime;
    const JTT = journeyTableTime;
    const JD = `${journeyDate} `;

    let roundedMinutes = '';
  
    if (typeof JRT !== 'undefined') {

      const timestamp = JD.concat(JRT);
      const arr = timestamp.split(/[- :]/);
      let date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4]);
      const diffMs = Math.abs(new Date() - new Date(date));
      const diffSeconds = (diffMs / 1000);
      const diffMinutes = (diffSeconds / 60);     
      roundedMinutes = Math.round(diffMinutes);

    } else if (typeof JRT === 'undefined') {

      const timestamp = JD.concat(JTT);
      const arr = timestamp.split(/[- :]/);
      let date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4]);    
      const diffMs = Math.abs(new Date() - new Date(date));
      const diffSeconds = (diffMs / 1000);
      const diffMinutes = (diffSeconds / 60);      
      roundedMinutes = Math.round(diffMinutes);

    }
    return roundedMinutes;
  }

  render() {
    return (
      <div class="wrapper">
        <div class="Rtable Rtable--4cols Rtable--collapse">
          <div class="Rtable-row Rtable-row--head">
            <div class="Rtable-cell name-cell column-heading nameTableHeader">Linje</div>
            <div class="Rtable-cell destination-cell column-heading">Destination</div>
            <div class="Rtable-cell timeleft-cell column-heading">Avgår</div>
            <div class="Rtable-cell track-cell column-heading">Läge</div>
          </div>    
            {this.props.isDBLoaded ? this.createTableRows() : (
                  <div className='loadingSpinner'>
                    <ClipLoader
                      className={override}
                      sizeUnit="px"
                      size={100}
                      color="#3C4650"
                      loading
                    />
                  </div>
            )}
          </div>
      </div>
    );
  }
}

export default Timeboard;
