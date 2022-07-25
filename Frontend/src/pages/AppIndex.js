import React from 'react';
import './appIndex.css';
import CardView from '../components/CardView.js';
import HttpRequest from '../components/HttpRequest.js';
import Navbar from "../components/Navbar.js";

// Component for the Gallery Page
class AppIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      searchText: "",
      //0 land size desc 1 land size asc
      //2 price desc 3 price asc
      //4 rating desc 5 rating asc
      // searchText for searching for specific islands
      sortBy:-1
    }
    //http请求
    new HttpRequest().get("/islands")
    .then((response) => {
      this.setState({
        list: response.data
      });
    })
  }
  handleClick(type) {
    this.setState({
      list: []
    });
    if(type === 0){ // Sort by land size
      if(this.state.sortBy === 0){ // Land size descending
        this.setState({
          sortBy:1
        });
        new HttpRequest().get("/islands/land_size/desc")
        .then((response) => {
          this.setState({
            list: response.data
          });
        })
      }else{ // Land size ascending
        this.setState({
          sortBy:0
        });
        new HttpRequest().get("/islands/land_size/asc")
        .then((response) => {
          this.setState({
            list: response.data
          });
        })
      }
    }else if(type === 1){ // Sort by price
      if(this.state.sortBy === 2){ // Price descending
        this.setState({
          sortBy:3
        });
        new HttpRequest().get("/islands/price/desc")
        .then((response) => {
          this.setState({
            list: response.data
          });
        })
      }else{ // Price ascending
        this.setState({
          sortBy:2
        });
        new HttpRequest().get("/islands/price/asc")
        .then((response) => {
          this.setState({
            list: response.data
          });
        })
      }
    }else if(type === 2){ // Sort by average rating
      if(this.state.sortBy === 4){ // Rating descending
        this.setState({
          sortBy:5
        });
        new HttpRequest().get("/islands/rating/desc")
        .then((response) => {
          this.setState({
            list: response.data
          });
        })
      }else{ // Rating ascending
        this.setState({
          sortBy:4
        });
        new HttpRequest().get("/islands/rating/asc")
        .then((response) => {
          this.setState({
            list: response.data
          });
        })
      }
    }
  }
  render(){
    // Get a list of all islands
    const list = this.state.list;
    // Filter islands based on search bar
    const filteredData = list.filter((newList) => {
      // If no search bar input, display all islands
      if (this.state.input === '') {
          return newList;
      }
      // Return islands where name matches search bar input
      else {
          return newList.name.toLowerCase().includes(this.state.searchText.toLowerCase());
      }
    });
    // Display filtered islands by mapping them
    const listItems = filteredData.map((item) =>
    <div key={item._id} className="col-lg-3 col-md-4 col-sm-12">
      <CardView item={item}/>
    </div>
    );
    return (
      <>
        <Navbar page="Gallery" />
        <div className="row">
          <div className='col-12'>
            <div className="btn-group buttons" role="group" aria-label="Basic example">
              <button type="button" className="btn btn-outline-dark" onClick={() => this.handleClick(0)}>Land Size{this.state.sortBy === 0 ? <i className='triangle-up'></i> : <></>}{this.state.sortBy === 1 ? <i className='triangle-down'></i> : <></>}</button>
              <button type="button" className="btn btn-outline-dark" onClick={() => this.handleClick(1)}>Price{this.state.sortBy === 2 ? <i className='triangle-up'></i> : <></>}{this.state.sortBy === 3 ? <i className='triangle-down'></i> : <></>}</button>
              <button type="button" className="btn btn-outline-dark" onClick={() => this.handleClick(2)}>Rating{this.state.sortBy === 4 ? <i className='triangle-up'></i> : <></>}{this.state.sortBy === 5 ? <i className='triangle-down'></i> : <></>}</button>
            </div>
            <div className="search" style={{margin: 10}}>
              <input
                  type="text"
                  className="form-control"
                  id="search"
                  placeholder="Search"
                  value={this.state.searchText}
                  onChange={(e) => this.setState({ searchText: e.target.value })}
                />
            </div>
          </div>
          {listItems}
        </div>
      </>
    );
   }
 }

 export default AppIndex;