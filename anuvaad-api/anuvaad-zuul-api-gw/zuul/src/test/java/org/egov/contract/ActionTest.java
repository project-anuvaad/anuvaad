package org.egov.contract;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ActionTest {

    @Test
    public void test_should_convert_URI_with_dynamic_placeholders_to_regex_equivalent() {
        final Action action = new Action();
        action.setUrl("/pgr/seva/{id}/_update");

        final String actualRegexURI = action.getRegexUrl();

        assertEquals("/pgr/seva/\\w+/_update", actualRegexURI);
    }

}