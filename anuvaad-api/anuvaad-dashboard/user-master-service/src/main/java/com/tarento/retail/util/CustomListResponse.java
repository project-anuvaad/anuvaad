package com.tarento.retail.util;

public class CustomListResponse {
	 private int page;
	    private int pageSize;
	    private int count;

	    public int getPage() {
	        return page;
	    }

	    public void setPage(int page) {
	        this.page = page;
	    }

	    public int getPageSize() {
	        return pageSize;
	    }

	    public void setPageSize(int pageSize) {
	        this.pageSize = pageSize;
	    }

	    public int getCount() {
	        return count;
	    }

	    public void setCount(int count) {
	        this.count = count;
	    }
}
