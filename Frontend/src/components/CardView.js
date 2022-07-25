import React from "react";
import addCommas from "../util/AddCommas";

// Card component for the gallery page
class CardView extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      cover: props.item.islandImg || "",
      title: props.item.name || "",
      rating: props.item.rating,
      area: props.item.land_size || "",
      price: props.item.price || "",
      id: props.item._id,
    };
  }
  render() {
    return (
      <div className="card" >
        <div className="card-body">
          <div className="card" style={{border: '1px solid rgba(0,0,0,.125)', padding: '6px', margin: '6px'}}>
            <img src={this.state.cover} className="card-img-top" alt="..." style={{flex: '1', aspectRatio: 3/2, resize: 'contain'}} />
            <div className="card-body">
              <h5 style={{display: 'flex',  justifyContent:'center'}} className="card-title">{this.state.title}</h5>
              <div className="card-info" style={{display: 'block'}}>
                {this.state.rating !== undefined &&
                  <div className="card-info-dot">
                    Rating: <div style={{marginLeft: 10}} className="card-info-number">{this.state.rating.toFixed(2)}</div>
                  </div>
                }
                <div className="card-info-dot">Area: {this.state.area} sq.m</div>
                <div className="card-info-dot">Price: ${addCommas(this.state.price.toFixed(2))}/night</div>
              </div>
            </div>
            <a href={`/reserve?island=${this.state.id}`} style={{margin: 10}}className="btn btn-primary btn-lg active -sm">
              Reserve Island
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default CardView;
