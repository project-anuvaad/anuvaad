package com.tarento.analytics.helper;

import com.tarento.analytics.dto.AggregateRequestDto;

import java.util.List;

public interface IComputedField {

    public void set(AggregateRequestDto requestDto, String postAggrTheoryName);
    public void add(Object data, List<String> fields, String newField);

}
