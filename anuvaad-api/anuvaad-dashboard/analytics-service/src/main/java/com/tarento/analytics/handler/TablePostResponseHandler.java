package com.tarento.analytics.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.constant.Constants;
import com.tarento.analytics.org.service.MdmsApiMappings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class TablePostResponseHandler implements IPostResponseHandler {
    private static Logger logger = LoggerFactory.getLogger(TablePostResponseHandler.class);


    @Autowired
    MdmsApiMappings mdmsApiMappings;



    public void preHandlerBuildQuery(ObjectNode filterNode, JsonNode query) {

        // from mdms ddrmap  add the filter [tenant Ids] whe no filter present :: name has to be generate dynamically

        if(filterNode.findValue("tenantId") == null){ //no tenantId filter present

            for (String key : mdmsApiMappings.getAll().keySet()){
                List<String> tenantIds = mdmsApiMappings.getAll().get(key);


            }
        } else {
            filterNode.findValue("tenantId");
        }
        // if present filter [tenant id ] -> find the ddr name from the ddr map :: name to be gererate dynmically

    }

    public void postHandlerBuildResponse(ObjectNode filterNode, JsonNode query) {

        // from mdms ddrmap  add the filter [tenant Ids] whe no filter present :: name has to be generate dynamically

        if(filterNode.findValue("tenantId") == null){ //no tenantId filter present

            for (String key : mdmsApiMappings.getAll().keySet()){

            }
        } else {
            filterNode.findValue("tenantId");
        }
        // if present filter [tenant id ] -> find the ddr name from the ddr map :: name to be gererate dynmically

    }

    /*String json = "{\"aggregations\":{\"dss-collection_v1\":{\"ULBs \":{\"doc_count_error_upper_bound\":0,\"sum_other_doc_count\":0,\"buckets\":[{\"key\":\"pb.derabassi\",\"doc_count\":448,\"Transactions\":{\"value\":448},\"Assessed Properties\":{\"value\":1251},\"Total Collection\":{\"value\":620938.0}},{\"key\":\"pb.nayagaon\",\"doc_count\":97,\"Transactions\":{\"value\":97},\"Assessed Properties\":{\"value\":235},\"Total Collection\":{\"value\":69108.0}}]}},\"dss-target_v1\":{\"ULBs \":{\"doc_count_error_upper_bound\":0,\"sum_other_doc_count\":0,\"buckets\":[{\"key\":\"pb.derabassi\",\"doc_count\":1,\"Target Collection\":{\"value\":1.5E7}},{\"key\":\"pb.nayagaon\",\"doc_count\":1,\"Target Collection\":{\"value\":3500000.0}}]}}}}";
    String json1 = "{\"aggregations\":{\"DDRCode \":{\"doc_count_error_upper_bound\":0,\"sum_other_doc_count\":0,\"buckets\":[{\"key\":\"1\",\"doc_count\":277,\"Transactions\":{\"value\":277},\"Assessed Properties\":{\"value\":805},\"Total Collection\":{\"value\":618472.0}},{\"key\":\"9\",\"doc_count\":2719,\"Transactions\":{\"value\":2719},\"Assessed Properties\":{\"value\":8434},\"Total Collection\":{\"value\":5572731.0}}]}}}";
    */

    /**
     * Post response handle for replacing the district names from MDMS service map
     * @param responseNode
     */
    @Override
    public void postResponse(ObjectNode responseNode){
        try {

            List<JsonNode> nodes = responseNode.findValues(Constants.MDMSKeys.KEY);
            Set<String> values = new HashSet();
            nodes.forEach(node -> {
                if(!values.contains(node.asText()))
                    replaceField(responseNode, Constants.MDMSKeys.KEY, node.asText(),mdmsApiMappings.getDDRNameByCode(node.asText()));
                values.add(node.asText());

            });
            logger.info("post response handling(DDR values) "+responseNode);

        }catch (Exception e){
            logger.error("post response handling(DDR values) "+e.getMessage());
        }

    }


    public static void replaceField(ObjectNode parent, String fieldName, String oldValue, String newValue) {
        if (parent.has(fieldName) && parent.get(fieldName).asText().equalsIgnoreCase(oldValue)) {
            parent.put(fieldName, newValue);
        }
        parent.fields().forEachRemaining(entry -> {
            JsonNode entryValue = entry.getValue();
            if (entryValue.isArray()) {
                for (int i = 0; i < entryValue.size(); i++) {
                    if (entry.getValue().get(i).isObject())
                        replaceField((ObjectNode) entry.getValue().get(i), fieldName, oldValue, newValue);
                }
            } else if (entryValue.isObject()) {
                replaceField((ObjectNode) entry.getValue(), fieldName, oldValue, newValue);
            }
        });
    }
}
