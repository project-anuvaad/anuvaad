package com.tarento.retail.util;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.cxf.jaxrs.ext.MessageContext;

public class ResponseUtil {

	/**
	 * Method to throw bad request with error message
	 * 
	 * @param errorDescription
	 */
	public static void sendBadRequest(String errorDescription) {
		ResponseBuilder resp = Response.status(Response.Status.BAD_REQUEST);
		resp.entity(errorDescription);
		WebApplicationException ex = new WebApplicationException(resp.build());
		throw ex;
	}

	/**
	 * Method to throw Unauthorized request with error message
	 * 
	 * @param errorDescription
	 */
	public static Response sendUnauthorized(String errorDescription) throws JsonProcessingException{
		ResponseBuilder resp = Response.status(Response.Status.UNAUTHORIZED);
		resp.entity(ResponseGenerator.failureResponse(errorDescription));
		return resp.build();
	}
	
	/**
	 * Method to throw Internal server error
	 * 
	 * @param errorDescription
	 */
	public static Response sendServerError(String errorDescription) {
		ResponseBuilder resp = Response.status(Response.Status.INTERNAL_SERVER_ERROR);
		resp.entity(errorDescription);
		return resp.build();
	}

	/**
	 * Method to throw Unauthorized request with error message
	 *
	 * @param errorDescription
	 */
	public static void unauthorizedResponse(HttpServletResponse response, String errorDescription) throws IOException {
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		response.setContentType("application/json");
		response.getWriter().write(errorDescription);
	}

	public static Response sendOK(ObjectNode obj) {
		ResponseBuilder resp = Response.status(Response.Status.OK);
		resp.entity(obj);
		return resp.build();
	}
	
	public static Response sendOK(String obj) {
		ResponseBuilder resp = Response.status(Response.Status.OK);
		resp.entity(obj);
		return resp.build();
	}
	
	public static void sendRedirect(MessageContext context, String path){
		try{
		HttpServletResponse response = context.getHttpServletResponse();
		response.sendRedirect(path);
		}catch(Exception e){
			sendServerError("Unable to redirect");
		}
	}
	
	public static void sendInternalError(String errorDescription) throws JsonProcessingException {
		ResponseBuilder resp = Response.status(Response.Status.INTERNAL_SERVER_ERROR);
		resp.entity(ResponseGenerator.failureResponse(errorDescription));
		WebApplicationException ex = new WebApplicationException(resp.build());
		throw ex;
	}
	
	public static void sendInternalError() throws JsonProcessingException {
		ResponseBuilder resp = Response.status(Response.Status.INTERNAL_SERVER_ERROR);
		resp.entity(ResponseGenerator.failureResponse());
		WebApplicationException ex = new WebApplicationException(resp.build());
		throw ex;
	}
}
