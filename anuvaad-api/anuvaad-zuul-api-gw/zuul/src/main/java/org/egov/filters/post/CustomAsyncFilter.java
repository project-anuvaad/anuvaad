package org.egov.filters.post;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.egov.model.CustomAsyncRequest;
import org.egov.wrapper.CustomRequestWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.io.CharStreams;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class CustomAsyncFilter extends ZuulFilter {

	@Value("#{'${egov.custom.async.uris}'.split(',')}")
	private List<String> sourceUri;

	@Value("${egov.custom.async.filter.topic}")
	private String topic;

	@Autowired
	private KafkaTemplate<String, Object> kafkaTemplate;

	@Override
	public Object run() {
		log.info("Executing CustomAsyncFilter");
		RequestContext ctx = RequestContext.getCurrentContext();
		HttpServletRequest request = ctx.getRequest();
		try {
			CustomAsyncRequest customAsyncRequest = CustomAsyncRequest.builder().request(jsonToMap(readRequestBody(request)))
					.response(jsonToMap(readResponseBody(ctx))).sourceUri(request.getRequestURI())
					.queryParamMap(ctx.getRequestQueryParams()).build();
			log.info("CustomAsyncFilter Topic:" + topic);
			kafkaTemplate.send(topic, customAsyncRequest);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}

	@Override
	public boolean shouldFilter() {
		RequestContext ctx = RequestContext.getCurrentContext();
		String uri = ctx.getRequest().getRequestURI();
		return sourceUri.contains(uri);
	}

	@Override
	public int filterOrder() {
		return 2;
	}

	@Override
	public String filterType() {
		return "post";
	}

	private String readResponseBody(RequestContext ctx) {
		String responseBody = null;
		try (final InputStream responseDataStream = ctx.getResponseDataStream()) {

			if (responseDataStream != null)
				responseBody = CharStreams.toString(new InputStreamReader(responseDataStream, "UTF-8"));
			ctx.setResponseBody(responseBody);
		} catch (IOException e) {
			log.info("Error reading body", e);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return responseBody;
	}

	private Map<String, Object> jsonToMap(String json) {
		Map<String, Object> resMap = null;
		if (json != null) {
			try {
				resMap = new ObjectMapper().readValue(json, new TypeReference<Map<String, Object>>() {
				});
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return resMap;
	}

	private String readRequestBody(HttpServletRequest request) {
		CustomRequestWrapper requestWrapper = new CustomRequestWrapper(request);
		String body = requestWrapper.getPayload();
		log.info("body:" + body);
		return body;
	}

}
