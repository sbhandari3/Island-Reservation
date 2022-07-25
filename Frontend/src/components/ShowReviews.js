import React from "react";

// Component for reviews of island, shown on bottom of the reserve page
class ShowReviews extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      userRating: props.item.userReview || "",
      rating: props.item.rating || "",
    };
  }
  render() {
    return (
      <div className="card" style={{border: '1px solid rgba(0,0,0,.125)', marginTop: '10px'}}>
        <div className="card-body">
          <div className="card">
            <div className="card-body">
                <div className="card-info-dot" style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>{this.state.userRating}</div>
                <div className="card-info-dot"> Rating: {this.state.rating} / 5</div>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShowReviews;