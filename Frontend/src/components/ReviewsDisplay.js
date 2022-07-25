import React from "react";
import moment from 'moment';
import addCommas from "../util/AddCommas";

// Component that shows user's past reservations that they can leave reviews on
class ReviewsDisplay extends React.Component {
  render() {
    return (
      <div className="card" style={{border: '1px solid rgba(0,0,0,.125)', padding: '6px', margin: '6px'}}>
        <div className="card-body">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-4 col-12">
                  <h5 className="card-title" style={{fontWeight: 'bold'}}>{(this.props.idx + 1).toString() + ": " + this.props.entry.island_name}</h5>
                  <div className="card-info-dot">Start Date: {moment(this.props.entry.startDate).format('MM/DD/YYYY')}</div>
                  <div className="card-info-dot">End Date: {moment(this.props.entry.endDate).format('MM/DD/YYYY')}</div>
                  <div className="card-info-dot">Date Reserved: {moment(this.props.entry.reservationDate).format('MM/DD/YYYY')}</div>
                  <div className="card-info-dot">
                    Amount Paid: ${addCommas(this.props.entry.amountPaid.toFixed(2))}
                  </div>
                  <div className="card-info-dot">
                    <a href={`/review/?island=${this.props.entry.island_id}`}  className="btn btn-primary">
                      Review
                    </a>
                  </div>
                </div>
                <div className="col-sm-8 col-12" style={{textAlign: 'right', verticalAlign: 'middle'}}>
                  <img src={this.props.entry.island_img} style={{ height: '164px'}} alt="Island"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReviewsDisplay;