package org.tarento.retail.contract;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Action {
    private static final String OPENING_BRACES = "{";
    private static final String CLOSING_BRACES = "}";
    private static final String PARAMETER_PLACEHOLDER_REGEX = "\\{\\w+\\}";
    private static final String ANY_WORD_REGEX = "\\\\w+";

    @JsonProperty("url")
    private String url;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @JsonIgnore
    public boolean hasDynamicFields() {
        return url.contains(OPENING_BRACES) & url.contains(CLOSING_BRACES);
    }

    @JsonIgnore
    public String getRegexUrl() {
        return url.replaceAll(PARAMETER_PLACEHOLDER_REGEX, ANY_WORD_REGEX);
    }
}