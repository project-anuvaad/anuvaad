package com.tarento.retail.model.contract;


import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Status Information object will hold the run time status and the live response obtained from the server for the respective API Call.
 */
@AllArgsConstructor
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Setter
@ToString
public class StatusInfo {
  
  private Integer statusCode;

  
  private String statusMessage;

  
  private Long errorCode;

  
  private String errorMessage;




  
}

