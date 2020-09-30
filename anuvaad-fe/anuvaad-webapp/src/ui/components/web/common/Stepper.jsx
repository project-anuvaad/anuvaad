import React from 'react';
import PropTypes from 'prop-types';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';


class HorizontalLabelPositionBelowStepper extends React.Component {

  render() {
    const { steps, style,activeStep, alternativeLabel } = this.props;

    return (
      <div>
        <Stepper activeStep={activeStep} alternativeLabel={alternativeLabel} style={style}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel StepIconProps={{
      color:"blue"
    }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>       
      </div>
    );
  }
}

HorizontalLabelPositionBelowStepper.propTypes = {
  classes: PropTypes.object,
};

export default (HorizontalLabelPositionBelowStepper);
