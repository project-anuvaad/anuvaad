package org.anuvaad.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Action {

    @JsonProperty("id")
    public String id;

    @JsonProperty("uri")
    public String uri;

    @JsonProperty("module")
    public String module;

    @JsonProperty("active")
    public Boolean active;

    @JsonProperty("whiteList")
    public Boolean whiteList;

    @JsonProperty("description")
    public String description;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getWhiteList() {
        return whiteList;
    }

    public void setWhiteList(Boolean whiteList) {
        this.whiteList = whiteList;
    }

    @Override
    public String toString() {
        return "Action{" +
                "id='" + id + '\'' +
                ", uri='" + uri + '\'' +
                ", module='" + module + '\'' +
                ", active=" + active +
                ", whiteList=" + whiteList +
                ", description='" + description + '\'' +
                '}';
    }

    public Action(String id, String uri, String module, Boolean active, Boolean whiteList, String description) {
        this.id = id;
        this.uri = uri;
        this.module = module;
        this.active = active;
        this.whiteList = whiteList;
        this.description = description;
    }

    public Action() {}
}
