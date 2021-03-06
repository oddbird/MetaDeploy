import Card from '@salesforce/design-system-react/components/card';
import Icon from '@salesforce/design-system-react/components/icon';
import { format, parseISO } from 'date-fns';
import i18n from 'i18next';
import * as React from 'react';

import ScratchOrgInfo from '@/components/scratchOrgs/scratchOrgInfo';
import { Job } from '@/store/jobs/reducer';
import { ScratchOrg } from '@/store/scratchOrgs/reducer';

const UserInfo = ({
  job,
  scratchOrg,
}: {
  job: Job;
  scratchOrg?: ScratchOrg | null;
}) => {
  let contents = null;
  if (scratchOrg?.expires_at) {
    const date = format(parseISO(scratchOrg.expires_at), 'PP');
    contents = <ScratchOrgInfo date={date} />;
  } else if (job.creator?.username || job.org_name || job.org_type) {
    const username = job.creator?.username;
    const { org_name, org_type } = job;
    contents = (
      <Card
        bodyClassName="slds-card__body_inner"
        heading={i18n.t('Salesforce Org Information')}
        icon={<Icon category="utility" name="user" />}
      >
        <ul>
          {username ? (
            <li>
              <strong>{i18n.t('User:')}</strong> {username}
            </li>
          ) : null}
          {org_name ? (
            <li>
              <strong>{i18n.t('Org:')}</strong> {org_name}
            </li>
          ) : null}
          {org_type ? (
            <li>
              <strong>{i18n.t('Type:')}</strong> {org_type}
            </li>
          ) : null}
        </ul>
      </Card>
    );
  }
  return contents ? (
    <div
      className="slds-p-around_medium
        slds-size_1-of-1
        slds-medium-size_1-of-2"
    >
      {contents}
    </div>
  ) : null;
};

export default UserInfo;
