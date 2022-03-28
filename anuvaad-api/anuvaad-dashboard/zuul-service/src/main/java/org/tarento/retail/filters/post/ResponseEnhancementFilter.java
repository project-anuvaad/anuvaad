package org.tarento.retail.filters.post;

import static org.tarento.retail.constants.RequestContextConstants.CORRELATION_ID_KEY;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;
import org.springframework.util.StringUtils;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;

/**
 * Sets the correlation id to the response header.
 */
@Component
public class ResponseEnhancementFilter extends ZuulFilter {

    private static final String CORRELATION_HEADER_NAME = "x-correlation-id";
    private static final String RECEIVED_RESPONSE_MESSAGE = "Received response code: {} from upstream URI {}";
    private Logger logger = LoggerFactory.getLogger(this.getClass());
    protected static final String SEND_ERROR_FILTER_RAN = "sendErrorFilter.ran";

    @Value("${error.path:/error}")
	private String errorPath;
    
    @Override
    public String filterType() {
        return "post";
    }

    @Override
    public int filterOrder() {
        return 1;
    }

    @Override
    public boolean shouldFilter() {
    	if("OPTIONS".equals(RequestContext.getCurrentContext().getRequest().getMethod())) { 
    		return false; 
    	}
    	RequestContext ctx = RequestContext.getCurrentContext();
		// only forward to errorPath if it hasn't been forwarded to already
		return !ctx.getBoolean("RbacAvailable") && !ctx.getBoolean(SEND_ERROR_FILTER_RAN, false);
    }

    @Override
	public Object run() {
		try {
			RequestContext ctx = RequestContext.getCurrentContext();
			HttpServletRequest request = ctx.getRequest();
			Integer exceptionStatusCode = null;
			exceptionStatusCode = 400;
			request.setAttribute("javax.servlet.error.status_code", 400);
			request.setAttribute("javax.servlet.error.message", "RbacFilter");
			ctx.addZuulResponseHeader(CORRELATION_HEADER_NAME, getCorrelationId());
			ExceptionHolder exception = findZuulException(ctx.getThrowable());
			request.setAttribute("javax.servlet.error.status_code", exception.getStatusCode());
			exceptionStatusCode = exception.getStatusCode();
			logger.warn("Error during filtering", exception.getThrowable());
			request.setAttribute("javax.servlet.error.exception", exception.getThrowable());
			if (StringUtils.hasText(exception.getErrorCause())) {
				request.setAttribute("javax.servlet.error.message", exception.getErrorCause());
			}

			RequestDispatcher dispatcher = request.getRequestDispatcher(this.errorPath);
			if (dispatcher != null) {
				ctx.set(SEND_ERROR_FILTER_RAN, true);
				if (!ctx.getResponse().isCommitted()) {
					ctx.setResponseStatusCode(exceptionStatusCode);
					dispatcher.forward(request, ctx.getResponse());
				}
			}
		} catch (Exception ex) {
			ReflectionUtils.rethrowRuntimeException(ex);
		}
		return null;
	}

    private String getCorrelationId() {
        RequestContext ctx = RequestContext.getCurrentContext();
        logger.info(RECEIVED_RESPONSE_MESSAGE,
            ctx.getResponse().getStatus(), ctx.getRequest().getRequestURI());
        return (String) ctx.get(CORRELATION_ID_KEY);
    }
    
    protected ExceptionHolder findZuulException(Throwable throwable) {

		if (throwable.getCause() instanceof ZuulException) {
			// wrapped zuul exception
			return  new ZuulExceptionHolder((ZuulException) throwable.getCause());
		}

		if (throwable instanceof ZuulException) {
			// exception thrown by zuul lifecycle
			return new ZuulExceptionHolder((ZuulException) throwable);
		}

		// fallback
		return new DefaultExceptionHolder(throwable);
	}

	protected interface ExceptionHolder {
		Throwable getThrowable();

	    default int getStatusCode() {
	    	return HttpStatus.INTERNAL_SERVER_ERROR.value();
		}

	    default String getErrorCause() {
	    	return null;
		}
	}

	protected static class DefaultExceptionHolder implements ExceptionHolder {
		private final Throwable throwable;

		public DefaultExceptionHolder(Throwable throwable) {
			this.throwable = throwable;
		}

		@Override
		public Throwable getThrowable() {
			return this.throwable;
		}
	}

	protected static class ZuulExceptionHolder implements ExceptionHolder {
		private final ZuulException exception;

		public ZuulExceptionHolder(ZuulException exception) {
			this.exception = exception;
		}

		@Override
		public Throwable getThrowable() {
			return this.exception;
		}

		@Override
		public int getStatusCode() {
			return this.exception.nStatusCode;
		}

		@Override
		public String getErrorCause() {
			return this.exception.errorCause;
		}
	}

	public void setErrorPath(String errorPath) {
		this.errorPath = errorPath;
	}
}
