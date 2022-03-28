package com.tarento.analytics.helper;

import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.Data;
import com.tarento.analytics.dto.Plot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class PercentageComputedField implements IComputedField{

    public static final Logger logger = LoggerFactory.getLogger(PercentageComputedField.class);


    private String postAggrTheoryName;
    private AggregateRequestDto aggregateRequestDto;
    @Autowired
    private ComputeHelperFactory computeHelperFactory;

    @Override
    public void set(AggregateRequestDto requestDto, String postAggrTheoryName){
        this.aggregateRequestDto = requestDto;
        this.postAggrTheoryName = postAggrTheoryName;
    }

    @Override
    public void add(Object data1, List<String> fields, String newField) {
        Data data = (Data) data1;
        try {
            Map<String, Plot> plotMap = data.getPlots().stream().parallel().collect(Collectors.toMap(Plot::getName, Function.identity()));

            if ((double)plotMap.get(fields.get(0)).getValue() == 0.0 || (double)plotMap.get(fields.get(1)).getValue() == 0.0) {

                data.getPlots().add(new Plot(newField, 0.0, "percentage"));
            } else {
                double wholeValue = (double)plotMap.get(fields.get(1)).getValue();
                double fieldValue = (double)plotMap.get(fields.get(0)).getValue() / (double)plotMap.get(fields.get(1)).getValue() * 100;

                logger.error(newField +" wholeValue "+wholeValue);
                logger.error(newField+ " fieldValue "+fieldValue);

                if(postAggrTheoryName != null && !postAggrTheoryName.isEmpty()) {
                    ComputeHelper computeHelper = computeHelperFactory.getInstance(postAggrTheoryName);
                    fieldValue = computeHelper.compute(aggregateRequestDto, fieldValue);
                    wholeValue = computeHelper.compute(aggregateRequestDto, wholeValue);
                }
                data.getPlots().stream().filter(plot -> fields.get(1).equalsIgnoreCase(plot.getName())).findAny().orElse(null).setValue(wholeValue);
                data.getPlots().add(new Plot(newField, fieldValue, "percentage"));
            }

        } catch (Exception e) {
            // throw new RuntimeException("Computed field configuration not correctly provided");
            logger.error("ex occured "+e.getMessage());
            data.getPlots().add(new Plot(newField, 0.0, "percentage"));
        }

    }
}

