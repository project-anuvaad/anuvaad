package org.tarento.retail.wrapper;

import com.netflix.zuul.http.HttpServletRequestWrapper;
import com.netflix.zuul.http.ServletInputStreamWrapper;
import org.apache.commons.io.IOUtils;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public class CustomRequestWrapper extends HttpServletRequestWrapper {

    private String payload;

    public CustomRequestWrapper(HttpServletRequest request) {
        super(request);
        convertInputStreamToString(request);
    }

    private void convertInputStreamToString(HttpServletRequest request) {
        try {
            payload = IOUtils.toString(request.getInputStream());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload){
        this.payload = payload;
    }

    @Override
    public int getContentLength() {
        return payload.length();
    }

    @Override
    public long getContentLengthLong() {
        return payload.length();
    }

    @Override
    public ServletInputStream getInputStream() {
        return new ServletInputStreamWrapper(payload.getBytes());
    }
}
