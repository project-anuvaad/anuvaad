package com.tarento.retail.model.contract;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * RequestInfo should be used to carry meta information about the requests to the server as described in the fields below. Some of this information will be returned back from the server as part of the ResponseInfo in the response body to ensure correlation
 */
@AllArgsConstructor
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Setter
@ToString
public class RequestInfo {
  
  private String apiId;

  
  private String ver;

  
  private Long ts;

  
  private String action;

  
  private String did;

  
  private String key;

  
  private String msgId;

  
  private String requesterId;

  
  private String authToken;

  
  private String correlationId;

  


}

