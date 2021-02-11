package com.tarento.analytics.dto;

public class Plot {

    private Object label;
    private String name;
    private Object value;
    private String valueLabel; 
    private String symbol;
    private String parentName; 
    private String parentLabel; 
    
    public Plot() {} 
    
    public String getParentLabel() {
		return parentLabel;
	}



	public void setParentLabel(String parentLabel) {
		this.parentLabel = parentLabel;
	}



	public Plot(String name, Object value, String symbol) {
        this.name = name;
        this.value = value;
        this.symbol = symbol;
    }
    
    public Plot(String name, Object value, String symbol, String headerLabel, String valueLabel) {
        this.name = name;
        this.value = value;
        this.symbol = symbol;
        this.label = headerLabel; 
        this.valueLabel = valueLabel; 
    }
    
    public Plot(String name, Object value, String symbol, String parentName, String headerLabel, String valueLabel) {
        this.name = name;
        this.value = value;
        this.symbol = symbol;
        this.parentName = parentName; 
        this.label = headerLabel; 
        this.valueLabel = valueLabel; 
    }
    
    public Plot(String name, Object value, String symbol, String parentName, String headerLabel, String valueLabel, String parentLabel) {
        this.name = name;
        this.value = value;
        this.symbol = symbol;
        this.parentName = parentName; 
        this.label = headerLabel; 
        this.valueLabel = valueLabel; 
        this.parentLabel = parentLabel; 
    }
    
    public String getValueLabel() {
		return valueLabel;
	}

	public void setValueLabel(String valueLabel) {
		this.valueLabel = valueLabel;
	}

	public String getParentName() {
		return parentName;
	}

	public void setParentName(String parentName) {
		this.parentName = parentName;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}

	public String getName() {
        return name;
    }

    public Object getValue() {
        return value;
    }

    public String getSymbol() {
        return symbol;
    }

    public Object getLabel() {
        return label;
    }

    public void setLabel(Object label) {
        this.label = label;
    }
    public void setValue(Object value) {
        this.value = value;
    }
}
