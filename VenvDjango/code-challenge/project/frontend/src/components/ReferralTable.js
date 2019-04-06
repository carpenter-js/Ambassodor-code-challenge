import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  getReferrals, 
  setEditingReferral, 
  putReferral, 
  saveNewReferral,
  deleteReferral 
} from '../actions/referrals';

class ReferralTable extends Component {
  componentDidMount() {
    this.props.dispatch(getReferrals());
  }

  // Sets state.editingId to match id of referral to edit
  handleEditClick(referralId) {
    this.props.dispatch(setEditingReferral(referralId));
  }

  // PUT with new referral title by id, set state.editingId null
  onSubmit(e, id) {
    e.preventDefault();
    const referralObj = {title: this.props.newReferral};
    this.props.dispatch(putReferral(referralObj, id));
    this.props.dispatch(setEditingReferral(null));
  }
  
  render() {
    if (this.props.loading) {
      return(
        <p>Loading...</p>
      );
    } else if (this.props.error) {
      return (
        <p>{this.props.error}</p>
      );
    }
    
    return (
      <table className='table is-striped'>
        <thead>
          <tr>
            <th>Referral</th>
            <th>Clicks</th> 
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {
            this.props.referrals.map((ref, index) => {
              return (
                <tr key={index}>
                  {/* Handles edit render logic */}
                  {this.props.editingId === ref.id ? (
                    <td>
                      <form onSubmit={e => this.onSubmit(e, ref.id)}>
                        <input 
                          placeholder={ref.title}
                          onChange={e => this.props.dispatch(saveNewReferral(e.target.value))}
                        />
                      </form>
                    </td>
                  ) : (
                    <td>{ref.title}</td>
                  )}

                  <td>{ref.click_count}</td>
                  {/* Handles edit render logic */}
                  <td>
                    {this.props.editingId === ref.id ? (
                      <button
                        onClick={() => this.handleEditClick(null)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => this.handleEditClick(ref.id)}
                      >
                        Edit
                      </button>
                    )}
                  </td>

                  <td>
                    <button
                      onClick={() => this.props.dispatch(deleteReferral(ref.id))}
                    >
                      Delete
                    </button>
                  </td>
                </tr> 
              );
            })
          }
        </tbody>
      </table>
    )
  }
}

const mapStateToProps = state => {
  return {
    referrals: state.referrals.referrals,
    loading: state.referrals.loading,
    error: state.referrals.error,
    editingId: state.referrals.editingId,
    newReferral: state.referrals.newReferral
  }
}

export default connect(mapStateToProps)(ReferralTable);