package com.tarento.analytics.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Transaction Object which gets posted to Elastic Search 
 * @author Darshan Nagesh
 *
 */
public class Transaction {

	@JsonProperty("transactionId")
	private Long transactionId;
	@JsonProperty("receiptNo")
	private String receiptNo;
	@JsonProperty("transType")
	private String transType;
	@JsonProperty("storeCode")
	private Long storeCode;
	@JsonProperty("posTerminalNo")
	private String posTerminalNo;
	@JsonProperty("staffId")
	private Long staffId;
	@JsonProperty("transDate")
	private String transDate;
	@JsonProperty("transTime")
	private String transTime;
	@JsonProperty("customerNo")
	private Long consumerNo;
	@JsonProperty("salesType")
	private String salesType;
	@JsonProperty("netAmt")
	private Double netAmt;
	@JsonProperty("grossAmt")
	private Double grossAmt;
	@JsonProperty("payment")
	private Double payment;
	@JsonProperty("discountAmt")
	private Double discountAmt;
	@JsonProperty("costAmt")
	private Double costAmt;
	@JsonProperty("managerId")
	private Long managerId;
	@JsonProperty("isTraining")
	private Boolean isTraining;
	@JsonProperty("statementNo")
	private String statementNo;
	@JsonProperty("postingStatus")
	private String postingStatus;
	@JsonProperty("postStatementNo")
	private String postStatementNo;
	@JsonProperty("customerAgeGroup")
	private String customerAgeGroup; 
	@JsonProperty("customerGender")
	private String customerGender; 
	@JsonProperty("items")
	private List<Item> items;
	@JsonProperty("itemDetails")
	private List<Item> itemDetails;
	@JsonProperty("orgId")
	private Long orgId;
	
	public Long getOrgId() {
		return orgId;
	}

	public void setOrgId(Long orgId) {
		this.orgId = orgId;
	}

	public List<Item> getItemDetails() {
		return itemDetails;
	}

	public void setItemDetails(List<Item> itemDetails) {
		this.itemDetails = itemDetails;
	}

	public List<Item> getItems() {
		return items;
	}

	public void setItems(List<Item> items) {
		this.items = items;
	}

	public String getCustomerAgeGroup() {
		return customerAgeGroup;
	}

	public void setCustomerAgeGroup(String customerAgeGroup) {
		this.customerAgeGroup = customerAgeGroup;
	}

	public String getCustomerGender() {
		return customerGender;
	}

	public void setCustomerGender(String customerGender) {
		this.customerGender = customerGender;
	}

	public Long getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(Long transactionId) {
		this.transactionId = transactionId;
	}

	public String getReceiptNo() {
		return receiptNo;
	}

	public void setReceiptNo(String receiptNo) {
		this.receiptNo = receiptNo;
	}

	public String getTransType() {
		return transType;
	}

	public void setTransType(String transType) {
		this.transType = transType;
	}

	public Long getStoreCode() {
		return storeCode;
	}

	public void setStoreCode(Long storeCode) {
		this.storeCode = storeCode;
	}

	public String getPosTerminalNo() {
		return posTerminalNo;
	}

	public void setPosTerminalNo(String posTerminalNo) {
		this.posTerminalNo = posTerminalNo;
	}

	public Long getStaffId() {
		return staffId;
	}

	public void setStaffId(Long staffId) {
		this.staffId = staffId;
	}

	public String getTransDate() {
		return transDate;
	}

	public void setTransDate(String transDate) {
		this.transDate = transDate;
	}

	public String getTransTime() {
		return transTime;
	}

	public void setTransTime(String transTime) {
		this.transTime = transTime;
	}

	public Long getConsumerNo() {
		return consumerNo;
	}

	public void setConsumerNo(Long consumerNo) {
		this.consumerNo = consumerNo;
	}

	public String getSalesType() {
		return salesType;
	}

	public void setSalesType(String salesType) {
		this.salesType = salesType;
	}

	public Double getNetAmt() {
		return netAmt;
	}

	public void setNetAmt(Double netAmt) {
		this.netAmt = netAmt;
	}

	public Double getGrossAmt() {
		return grossAmt;
	}

	public void setGrossAmt(Double grossAmt) {
		this.grossAmt = grossAmt;
	}

	public Double getPayment() {
		return payment;
	}

	public void setPayment(Double payment) {
		this.payment = payment;
	}

	public Double getDiscountAmt() {
		return discountAmt;
	}

	public void setDiscountAmt(Double discountAmt) {
		this.discountAmt = discountAmt;
	}

	public Double getCostAmt() {
		return costAmt;
	}

	public void setCostAmt(Double costAmt) {
		this.costAmt = costAmt;
	}

	public Long getManagerId() {
		return managerId;
	}

	public void setManagerId(Long managerId) {
		this.managerId = managerId;
	}

	public Boolean getIsTraining() {
		return isTraining;
	}

	public void setIsTraining(Boolean isTraining) {
		this.isTraining = isTraining;
	}

	public String getStatementNo() {
		return statementNo;
	}

	public void setStatementNo(String statementNo) {
		this.statementNo = statementNo;
	}

	public String getPostingStatus() {
		return postingStatus;
	}

	public void setPostingStatus(String postingStatus) {
		this.postingStatus = postingStatus;
	}

	public String getPostStatementNo() {
		return postStatementNo;
	}

	public void setPostStatementNo(String postStatementNo) {
		this.postStatementNo = postStatementNo;
	}
}
