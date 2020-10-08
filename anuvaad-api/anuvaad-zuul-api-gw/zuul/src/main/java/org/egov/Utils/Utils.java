package org.egov.Utils;

import com.netflix.zuul.context.RequestContext;
import org.apache.commons.io.IOUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Optional;

import static org.egov.constants.RequestContextConstants.FILESTORE_REGEX;
import static org.egov.constants.RequestContextConstants.POST;

public class Utils {

    private static final String EMPTY_STRING = "";
    private static final String JSON_TYPE = "json";

    public static String getResponseBody(RequestContext ctx) throws IOException {
        String body = ctx.getResponseBody();

        if (body == null) {
            body = IOUtils.toString(ctx.getResponseDataStream());
            ctx.setResponseBody(body);
        }
        
        return body;
    }

    public static boolean isRequestBodyCompatible(HttpServletRequest servletRequest) {
        return POST.equalsIgnoreCase(getRequestMethod(servletRequest))
            && !getRequestURI(servletRequest).matches(FILESTORE_REGEX)
            && getRequestContentType(servletRequest).contains(JSON_TYPE);
    }

    private static String getRequestMethod(HttpServletRequest servletRequest) {
        return servletRequest.getMethod();
    }

    private static String getRequestContentType(HttpServletRequest servletRequest) {
        return Optional.ofNullable(servletRequest.getContentType()).orElse(EMPTY_STRING).toLowerCase();
    }

    private static String getRequestURI(HttpServletRequest servletRequest) {
        return servletRequest.getRequestURI();
    }
}
