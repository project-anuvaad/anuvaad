import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import StarIcon from '@material-ui/icons/Star';
import SendIcon from '@material-ui/icons/Send';
import MailIcon from '@material-ui/icons/Mail';
import DeleteIcon from '@material-ui/icons/Delete';
import ReportIcon from '@material-ui/icons/Report';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';

export const menuFolderListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <InboxIcon style={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        disableTypography
        primary={(
<Typography type="body2" style={{ color: '#FFFFFF' }}>
            Inbox
          </Typography>
)}
      />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <StarIcon style={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        disableTypography
        primary={(
<Typography type="body2" style={{ color: '#FFFFFF' }}>
            Starred
          </Typography>
)}
      />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <SendIcon style={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        disableTypography
        primary={(
<Typography type="body2" style={{ color: '#FFFFFF' }}>
            Send mail
          </Typography>
)}
      />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DraftsIcon style={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        disableTypography
        primary={(
<Typography type="body2" style={{ color: '#FFFFFF' }}>
            Drafts
          </Typography>
)}
      />
    </ListItem>
  </div>
);

export const otherMenuFolderListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <MailIcon style={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        disableTypography
        primary={(
<Typography type="body2" style={{ color: '#FFFFFF' }}>
            All mail
          </Typography>
)}
      />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DeleteIcon style={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        disableTypography
        primary={(
<Typography type="body2" style={{ color: '#FFFFFF' }}>
            Trash
          </Typography>
)}
      />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ReportIcon style={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        disableTypography
        primary={(
<Typography type="body2" style={{ color: '#FFFFFF' }}>
            Spam
          </Typography>
)}
      />
    </ListItem>
  </div>
);
