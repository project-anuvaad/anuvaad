package com.tarento.analytics.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AlwaysView {
	MONTHWISE("monthwise");

	private String value;

	AlwaysView(final String value) {
		this.value = value;
	}

	@JsonValue
	@Override
	public String toString() {
		return value;
	}

	@JsonCreator
	public static AlwaysView fromValue(final String passedValue) {
		for (final AlwaysView obj : AlwaysView.values())
			if (String.valueOf(obj.value).equalsIgnoreCase(passedValue))
				return obj;
		return null;
	}
}