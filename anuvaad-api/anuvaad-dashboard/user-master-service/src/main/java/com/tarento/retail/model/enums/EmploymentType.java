package com.tarento.retail.model.enums;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * 
 * @author Darshan Nagesh
 *
 */

public enum EmploymentType {
	PERMANENT("PERMANENT"), CONTRACT("CONTRACT");

    private String value;

    EmploymentType(final String value) {
        this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
        return StringUtils.capitalize(name());
    }

    @JsonCreator
    public static EmploymentType fromValue(final String passedValue) {
        for (final EmploymentType obj : EmploymentType.values())
            if (String.valueOf(obj.value).equals(passedValue.toUpperCase()))
                return obj;
        return null;
    }
}
