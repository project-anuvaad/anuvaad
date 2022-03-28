package com.tarento.analytics.helper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ComputedFieldFactory {

    @Autowired
    private PercentageComputedField percentageComputedField;

    public IComputedField getInstance(String className){

        if(className.equalsIgnoreCase(percentageComputedField.getClass().getSimpleName())){
            return percentageComputedField;
        } else {
            throw new RuntimeException("Computer field not found for className "+className);
        }

    }

}
