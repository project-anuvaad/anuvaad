package com.tarento.retail.model.enums;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * 
 * @author Darshan Nagesh
 *
 */

public enum CountryList {
	SWEDEN("SWEDEN","Sweden"), FINLAND("FINLAND","Finland"), NORWAY("NORWAY","Norway");

    private String value;

    @Override
    @JsonValue
    public String toString() {
        return StringUtils.capitalize(name());
    }

    @JsonCreator
    public static CountryList fromValue(final String passedValue) {
        for (final CountryList obj : CountryList.values())
            if (String.valueOf(obj.value).equals(passedValue.toUpperCase()))
                return obj;
        return null;
    }
    
    private String abbreviation;

    // Reverse-lookup map for getting a day from an abbreviation
    private static final Map<String, CountryList> lookup = new HashMap<String, CountryList>();

    static {
        for (CountryList list : CountryList.values()) {
            lookup.put(list.getAbbreviation(), list);
        }
    }

    private CountryList(String abbreviation, final String value) {
        this.abbreviation = abbreviation;
        this.value = value;
    }
    
    private CountryList(final String value) {
        this.value = value;
    }

    public String getAbbreviation() {
        return abbreviation; 
    }
    
    public String getValue() {
    	return value;
    }

    public static CountryList get(String abbreviation) {
        return lookup.get(abbreviation);
    }
}
