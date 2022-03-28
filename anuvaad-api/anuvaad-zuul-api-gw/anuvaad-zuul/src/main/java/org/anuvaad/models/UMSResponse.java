package org.anuvaad.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class UMSResponse {

    @JsonProperty("count")
    public Integer count;

    @JsonProperty("data")
    public User data;

    @JsonProperty("why")
    public String why;

    @JsonProperty("ok")
    public Boolean ok;

    @JsonProperty("http")
    public Map<String, Integer> http;

    @Override
    public String toString() {
        return "UMSResponse{" +
                "count=" + count +
                ", data=" + data +
                ", why='" + why + '\'' +
                ", http=" + http +
                '}';
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public void setData(User data) {
        this.data = data;
    }

    public void setWhy(String why) {
        this.why = why;
    }

    public Boolean getOk() {
        return ok;
    }

    public void setOk(Boolean ok) {
        this.ok = ok;
    }

    public void setHttp(Map<String, Integer> http) {
        this.http = http;
    }

    public Integer getCount() {
        return count;
    }

    public User getData() {
        return data;
    }

    public String getWhy() {
        return why;
    }

    public Map<String, Integer> getHttp() {
        return http;
    }

    public UMSResponse() { }

    public UMSResponse(Integer count, User data, String why, Boolean ok, Map<String, Integer> http) {
        this.count = count;
        this.data = data;
        this.why = why;
        this.ok = ok;
        this.http = http;
    }
}
