from .users import USER_MANAGEMENT_BLUEPRINT
from .user_org import ORGANIZATION_BLUEPRINT
from .extension import EXTENSION_BLUEPRINT

# enable mfa-apis only if mfa enabled in config 
from config import MFA_ENABLED
if MFA_ENABLED:
    from .mfa import MFA_BLUEPRINT 