import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import Timeboard from './Timeboard';

let refreshRateInterval = '';
const refreshRate = (20 * 1000);
const regenerateATRate = (1000 * 60 * 60);

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      selectedStopID: '',
      stopSelected: false,
      autocompleteData: [],
      currentDB: [],
      isDBLoaded: true,
    };
    this.refreshCurrentDB = this.refreshCurrentDB.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.getItemValue = this.getItemValue.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.searchStopData = this.searchStopData.bind(this);
    this.debounceAutocomplete = _.debounce(this.searchStopData, 250);
  }

  componentDidMount() {
    this.generateAccessToken();
    setInterval(this.generateAccessToken, regenerateATRate);
  }

  onChange(e) {
    this.setState({
      value: e.target.value,
      autocompleteData: [],
      stopSelected: false,
    });

    e.persist();

    if (!e.target.value.includes(' ') || (!e.target.value === (''))) {
      const value = this.state.value;
      this.debounceAutocomplete(value);
    }
    clearInterval(refreshRateInterval);
  }

  onSelect(val) {
    this.setState({
      selectedStopID: val,
      stopSelected: true,
    });
    this.getDepartureBoard(val);
    refreshRateInterval = setInterval(this.refreshCurrentDB, refreshRate);
  }

  getItemValue(item) {
    return item.id;
  }

  async getDepartureBoard(stopID) {
    if (!this.state.stopSelected) {
      this.setState({
        isDBLoaded: false,
      });
    }

    if (stopID !== '') {
      try {
        const res = await fetch(`/getDB/${stopID}`);
        const result = await res.json();
        this.setState({
          currentDB: result,
          isDBLoaded: true,
        });
      } catch (err) {
        console.log(err);
        console.log('Could not get departureboard!')
      }
    }
    this.setState({
      value: this.state.currentDB[0].stop,
    });
  }

  async searchStopData(searchText) {
    if (typeof searchText !== 'undefined') {
      try {
        const res = await fetch(`/searchStop/${searchText}`);
        const result = await res.json();
        this.setState({ autocompleteData: result });
      } catch (err) {
        console.log(err);
        console.log('Could not search stopdata!')
      }
    }
  }

  generateAccessToken() {
    try {
      fetch('/generateAT');
    } catch (err) {
      console.log(err);
      console.log('Could not generate accesstoken!')
    }
  }

  
  refreshCurrentDB() {
    this.getDepartureBoard(this.state.selectedStopID);
  }
  

  renderItem(item, isHighlighted) {
    return (
      <div style={{ background: isHighlighted ? '#EEEEEE' : 'white' }}>
        {item.name}
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="searchBar">
          <Autocomplete
            getItemValue={this.getItemValue}
            items={this.state.autocompleteData}
            renderItem={this.renderItem}
            value={this.state.value}
            onChange={this.onChange}
            onSelect={this.onSelect}
            inputProps={
              {
                placeholder: 'Sök hållplats',
                style: {
                  width: '100%',
                  height: '60%',
                  'margin-top': '10px',
                  'font-size': '17px',
                  border: '1px solid #c4c4c4',
                  'border-radius': '5px',
                  'padding-left': '7px',
                },
              }
            }
            wrapperStyle={
              {
                width: '63%', 
                height: '100%',
                margin: '2px auto',
              }
            }

            menuStyle={
              {
                borderRadius: '3px', 
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '2px 0',
                fontSize: '17px',
                position: 'fixed',
                overflow: 'auto',
                maxHeight: '50%',
                'padding-left': '7px',
              }
            }
          />
        </div>
        <div>
          <Timeboard
            currentDB={this.state.currentDB}
            isDBLoaded={this.state.isDBLoaded}
            stopSelected={this.state.stopSelected}
          />
        </div>
      </div>
    );
  }
}

export default SearchBar;