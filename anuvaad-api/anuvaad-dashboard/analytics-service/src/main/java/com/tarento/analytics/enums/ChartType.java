package com.tarento.analytics.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ChartType {

	XTABLE("xtable"), TABLE("table"), PERFORM("perform"), METRIC("metric"), PIE("pie"), LINE("line"), BAR(
			"bar"), MULTIBAR("multibar"), STACKEDBAR("stackedbar"), DONUT("donut"), HORIZONTALBAR(
					"horizontalbar"), POLARAREA("polararea"), METRICCOLLECTION("metriccollection"), TREEMAP(
							"treemap"), BUBBLECHART("bubblechart"), INDIAMAP("indiamap"), INDIADISTRICTMAP(
									"indiadistrictmap"), REPORT("report"), DYNAMICTABLE(
											"dynamictable"), LINE_BAR("line_bar"), CALENDARHEATMAP("calendarheatmap");

	private String value;

	ChartType(final String value) {
		this.value = value;
	}

	@JsonValue
	@Override
	public String toString() {
		return value;
	}

	@JsonCreator
	public static ChartType fromValue(final String passedValue) {
		for (final ChartType obj : ChartType.values())
			if (String.valueOf(obj.value).equalsIgnoreCase(passedValue))
				return obj;
		return null;
	}
}
