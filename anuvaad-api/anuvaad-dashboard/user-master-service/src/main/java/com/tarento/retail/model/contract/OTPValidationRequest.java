package com.tarento.retail.model.contract;

import java.util.Objects;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * OTPValidationRequest
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.languages.SpringCodegen", date = "2018-07-12T05:30:16.631Z")

public class OTPValidationRequest   {
  @JsonProperty("orderId")
  private String orderId = null;

  @JsonProperty("storeId")
  private Long storeId = null;

  @JsonProperty("storeCode")
  private String storeCode = null;

  @JsonProperty("otp")
  private String otp = null;

  @JsonProperty("textComments")
  private String textComments = null;

  @JsonProperty("bypassFlag")
  private Boolean bypassFlag = null;

  public OTPValidationRequest orderId(String orderId) {
    this.orderId = orderId;
    return this;
  }

  /**
   * Unique identifier representing a specific order.
   * @return orderId
  **/


  public String getOrderId() {
    return orderId;
  }

  public void setOrderId(String orderId) {
    this.orderId = orderId;
  }

  public OTPValidationRequest storeId(Long storeId) {
    this.storeId = storeId;
    return this;
  }

  /**
   * Unique identifier representing a store record
   * @return storeId
  **/


  public Long getStoreId() {
    return storeId;
  }

  public void setStoreId(Long storeId) {
    this.storeId = storeId;
  }

  public OTPValidationRequest storeCode(String storeCode) {
    this.storeCode = storeCode;
    return this;
  }

  /**
   * This field carries the Store Code for which the order has been assigned
   * @return storeCode
  **/


  public String getStoreCode() {
    return storeCode;
  }

  public void setStoreCode(String storeCode) {
    this.storeCode = storeCode;
  }

  public OTPValidationRequest otp(String otp) {
    this.otp = otp;
    return this;
  }

  /**
   * One Time Password which the customer shares with the Store Personnel is passed here
   * @return otp
  **/


  public String getOtp() {
    return otp;
  }

  public void setOtp(String otp) {
    this.otp = otp;
  }

  public OTPValidationRequest textComments(String textComments) {
    this.textComments = textComments;
    return this;
  }

  /**
   * Comments added by Store Personnel if any has to be recorded
   * @return textComments
  **/


  public String getTextComments() {
    return textComments;
  }

  public void setTextComments(String textComments) {
    this.textComments = textComments;
  }

  public OTPValidationRequest bypassFlag(Boolean bypassFlag) {
    this.bypassFlag = bypassFlag;
    return this;
  }

  /**
   * Bypass Flag indicates that the OTP Validation has to be bypassed if the Customer has not carried the OTP
   * @return bypassFlag
  **/


  public Boolean isBypassFlag() {
    return bypassFlag;
  }

  public void setBypassFlag(Boolean bypassFlag) {
    this.bypassFlag = bypassFlag;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    OTPValidationRequest otPValidationRequest = (OTPValidationRequest) o;
    return Objects.equals(this.orderId, otPValidationRequest.orderId) &&
        Objects.equals(this.storeId, otPValidationRequest.storeId) &&
        Objects.equals(this.storeCode, otPValidationRequest.storeCode) &&
        Objects.equals(this.otp, otPValidationRequest.otp) &&
        Objects.equals(this.textComments, otPValidationRequest.textComments) &&
        Objects.equals(this.bypassFlag, otPValidationRequest.bypassFlag);
  }

  @Override
  public int hashCode() {
    return Objects.hash(orderId, storeId, storeCode, otp, textComments, bypassFlag);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class OTPValidationRequest {\n");
    
    sb.append("    orderId: ").append(toIndentedString(orderId)).append("\n");
    sb.append("    storeId: ").append(toIndentedString(storeId)).append("\n");
    sb.append("    storeCode: ").append(toIndentedString(storeCode)).append("\n");
    sb.append("    otp: ").append(toIndentedString(otp)).append("\n");
    sb.append("    textComments: ").append(toIndentedString(textComments)).append("\n");
    sb.append("    bypassFlag: ").append(toIndentedString(bypassFlag)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(java.lang.Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

