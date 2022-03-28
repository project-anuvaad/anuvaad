package com.tarento.analytics.model;

import java.util.ArrayList;
import java.util.List;

public class ComputedFields {

    private String postAggregationTheory;
    private String actionName;
    private List<String> fields = new ArrayList<>();
    private String newField;

    public String getPostAggregationTheory() {
        return postAggregationTheory;
    }

    public void setPostAggregationTheory(String postAggregationTheory) {
        this.postAggregationTheory = postAggregationTheory;
    }

    public String getActionName() {
        return actionName;
    }

    public void setActionName(String actionName) {
        this.actionName = actionName;
    }

    public List<String> getFields() {
        return fields;
    }

    public void setFields(List<String> fields) {
        this.fields = fields;
    }

    public String getNewField() {
        return newField;
    }

    public void setNewField(String newField) {
        this.newField = newField;
    }
}
