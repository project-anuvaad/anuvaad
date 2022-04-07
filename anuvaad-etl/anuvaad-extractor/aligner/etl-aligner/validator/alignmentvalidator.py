#!/bin/python
from utilities.alignmentutils import AlignmentUtils

util = AlignmentUtils()


class AlignmentValidator:
    def __init__(self):
        pass

    # Validator that validates the input request for initiating the alignment job
    def validate_input(self, data):
        if 'source' not in data.keys():
            return util.error_handler("SOURCE_NOT_FOUND", "Details of the source not available", None, False)
        else:
            source = data["source"]
            if 'filepath' not in source.keys():
                return util.error_handler("SOURCE_FILE_NOT_FOUND", "Details of the source file not available",
                                          None, False)
            elif 'locale' not in source.keys():
                return util.error_handler("SOURCE_LOCALE_NOT_FOUND", "Details of the source locale not available",
                                          None, False)
        if 'target' not in data.keys():
            return util.error_handler("TARGET_NOT_FOUND", "Details of the target not available", None, False)
        else:
            target = data["target"]
            if 'filepath' not in target.keys():
                return util.error_handler("TARGET_FILE_NOT_FOUND", "Details of the target file not available",
                                          None, False)
            elif 'locale' not in target.keys():
                return util.error_handler("TARGET_LOCALE_NOT_FOUND", "Details of the target locale not available",
                                          None, False)



