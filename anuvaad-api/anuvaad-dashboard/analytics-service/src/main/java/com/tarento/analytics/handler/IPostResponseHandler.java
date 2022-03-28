package com.tarento.analytics.handler;

import com.fasterxml.jackson.databind.node.ObjectNode;

public interface IPostResponseHandler {


    /**
     * Intecepts the response tree
     * @param responseNode
     */
    public void postResponse(ObjectNode responseNode);


}
