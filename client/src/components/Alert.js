import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Alert.css';

function Alert(props) {
  const { alerts } = props;

  if (alerts !== null && alerts.length > 0) {
    return alerts.map(alert => (
      <div className='alert' key={alert.id}>
        {alert.msg}
      </div>
    ));
  } else {
    return null;
  }
}

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
