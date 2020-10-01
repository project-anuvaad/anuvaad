import React from 'react';
import Stepper from "./Stepper";




    
const ExtractionSteps = (a)=> NewExtraction=> {
    return class LoadingHOC extends React.Component {
        render(){
        return (
              <div>
                <Stepper steps={["Token extraction", "Apply token", "Extract sentences"] } activeStep={a} alternativeLabel></Stepper>
                <NewExtraction/>
            </div>

        );
    }
}
}



export default ExtractionSteps;