import re

class KhattTransform(object):
    def __call__(self, sample):
        sample = sample[::-1]
        return sample

class IamWordTransform(object):
    def __call__(self, sample):
        sample = sample.replace('-', '*')
        return sample

class Lowercase(object):
    def __call__(self, sample):
        sample = sample.lower()
        return sample

class Alphanumeric(object):
    def __call__(self, sample):
        pattern = re.compile('[\W_]+')
        sample = pattern.sub('', sample)
        return sample
        