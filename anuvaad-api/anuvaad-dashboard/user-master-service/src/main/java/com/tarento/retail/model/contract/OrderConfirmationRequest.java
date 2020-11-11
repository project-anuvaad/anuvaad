package com.tarento.retail.model.contract;

import java.util.Objects;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * OrderConfirmationRequest
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.languages.SpringCodegen", date = "2018-07-12T05:30:16.631Z")

public class OrderConfirmationRequest   {
  @JsonProperty("orderId")
  private String orderId = null;

  @JsonProperty("storeId")
  private Long storeId = null;

  @JsonProperty("storeCode")
  private String storeCode = null;

  @JsonProperty("textComments")
  private String textComments = null;

  @JsonProperty("orderStatus")
  private String orderStatus = null;

  public OrderConfirmationRequest orderId(String orderId) {
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

  public OrderConfirmationRequest storeId(Long storeId) {
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

  public OrderConfirmationRequest storeCode(String storeCode) {
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

  public OrderConfirmationRequest textComments(String textComments) {
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

  public OrderConfirmationRequest orderStatus(String orderStatus) {
    this.orderStatus = orderStatus;
    return this;
  }

  /**
   * Status of the order which defines at what stage the order has reached as of now
   * @return orderStatus
  **/


  public String getOrderStatus() {
    return orderStatus;
  }

  public void setOrderStatus(String orderStatus) {
    this.orderStatus = orderStatus;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    OrderConfirmationRequest orderConfirmationRequest = (OrderConfirmationRequest) o;
    return Objects.equals(this.orderId, orderConfirmationRequest.orderId) &&
        Objects.equals(this.storeId, orderConfirmationRequest.storeId) &&
        Objects.equals(this.storeCode, orderConfirmationRequest.storeCode) &&
        Objects.equals(this.textComments, orderConfirmationRequest.textComments) &&
        Objects.equals(this.orderStatus, orderConfirmationRequest.orderStatus);
  }

  @Override
  public int hashCode() {
    return Objects.hash(orderId, storeId, storeCode, textComments, orderStatus);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class OrderConfirmationRequest {\n");
    
    sb.append("    orderId: ").append(toIndentedString(orderId)).append("\n");
    sb.append("    storeId: ").append(toIndentedString(storeId)).append("\n");
    sb.append("    storeCode: ").append(toIndentedString(storeCode)).append("\n");
    sb.append("    textComments: ").append(toIndentedString(textComments)).append("\n");
    sb.append("    orderStatus: ").append(toIndentedString(orderStatus)).append("\n");
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

