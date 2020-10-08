package org.egov.wrapper;

import org.apache.commons.io.IOUtils;
import org.egov.Resources;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import java.io.IOException;
import java.io.StringReader;

import static org.junit.Assert.*;

public class CustomRequestWrapperTest {
    private final Resources resources = new Resources();

    @Test
    public void test_should_allow_play_load_to_be_retrieved_multiple_times() throws IOException {
        final MockHttpServletRequest request = new MockHttpServletRequest();
        final String expectedContent = "foobar";
        request.setContent(IOUtils.toByteArray(new StringReader(expectedContent)));
        final CustomRequestWrapper wrapper = new CustomRequestWrapper(request);

        assertEquals(expectedContent, new String(IOUtils.toByteArray(wrapper.getInputStream())));
        assertEquals(expectedContent, new String(IOUtils.toByteArray(wrapper.getInputStream())));
    }

    @Test
    public void test_should_allow_play_load_to_set() throws IOException {
        final MockHttpServletRequest request = new MockHttpServletRequest();
        final String expectedContent = "foobar";
        request.setContent(IOUtils.toByteArray(new StringReader("originalContent")));
        final CustomRequestWrapper wrapper = new CustomRequestWrapper(request);

        wrapper.setPayload(expectedContent);

        assertEquals(expectedContent, new String(IOUtils.toByteArray(wrapper.getInputStream())));
    }

    @Test
    public void test_should_return_pay_load_length() throws IOException {
        final MockHttpServletRequest request = new MockHttpServletRequest();
        request.setContent(IOUtils.toByteArray(new StringReader("foobar")));
        final CustomRequestWrapper wrapper = new CustomRequestWrapper(request);

        assertEquals(6, wrapper.getContentLength());
        assertEquals(6, wrapper.getContentLengthLong());
    }

    private byte[] getContent(String fileName) {
        try {
            return IOUtils.toByteArray(IOUtils.toInputStream(resources.getFileContents(fileName)));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}