import React, { useEffect } from 'react';
import { translate } from '../../../../assets/localisation';
import history from "../../../../web.history";

const NotFound = () => {
  useEffect(() => {
    const currentUserRole = localStorage.getItem("roles");
    if (currentUserRole) {
      if (currentUserRole == "TRANSLATOR" || currentUserRole == "ANNOTATOR") {
        history.push(`${process.env.PUBLIC_URL}/view-document`);
      } else {
        history.push(`${process.env.PUBLIC_URL}/user-details`);
      }
    }
  }, [])
  return (<div>
    <div style={{ textAlign: 'center' }}>
      <center>{translate('notFound.page.text.notFoundError')}</center>
    </div>
  </div>)
};

export default NotFound;
