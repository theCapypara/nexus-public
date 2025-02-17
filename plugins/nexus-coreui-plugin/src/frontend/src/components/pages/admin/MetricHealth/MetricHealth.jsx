/*
 * Sonatype Nexus (TM) Open Source Version
 * Copyright (c) 2008-present Sonatype, Inc.
 * All rights reserved. Includes the third-party code listed at http://links.sonatype.com/products/nexus/oss/attributions.
 *
 * This program and the accompanying materials are made available under the terms of the Eclipse Public License Version 1.0,
 * which accompanies this distribution and is available at http://www.eclipse.org/legal/epl-v10.html.
 *
 * Sonatype Nexus (TM) Professional Version is available from Sonatype, Inc. "Sonatype" and "Sonatype Nexus" are trademarks
 * of Sonatype, Inc. Apache Maven is a trademark of the Apache Software Foundation. M2eclipse is a trademark of the
 * Eclipse Foundation. All other trademarks are the property of their respective owners.
 */
import React from 'react';
import {useMachine} from '@xstate/react';

import './MetricHealth.scss';

import {faCheckCircle, faExclamationCircle, faMedkit} from '@fortawesome/free-solid-svg-icons';

import {
  ContentBody,
  ListMachineUtils,
  NxFontAwesomeIcon,
  NxTable,
  NxTableBody,
  NxTableCell,
  NxTableHead,
  NxTableRow,
  Page,
  PageHeader,
  PageTitle,
  Section
} from '@sonatype/nexus-ui-plugin';

import MetricHealthMachine from './MetricHealthMachine';

import UIStrings from "../../../../constants/UIStrings";

export default function MetricHealth() {
  const [current, send] = useMachine(MetricHealthMachine, {devTools: true});
  const isLoading = current.matches('loading');
  const data = current.context.data;
  const error = current.context.error;

  const nameSortDir = ListMachineUtils.getSortDirection('name', current.context);
  const messageSortDir = ListMachineUtils.getSortDirection('message', current.context);
  const errorSortDir = ListMachineUtils.getSortDirection('error', current.context);

  return <Page>
    <PageHeader><PageTitle icon={faMedkit} {...UIStrings.METRIC_HEALTH.MENU}/></PageHeader>
    <ContentBody className="nxrm-metric-health">
      <Section>
        <NxTable>
          <NxTableHead>
            <NxTableRow>
              <NxTableCell hasIcon />
              <NxTableCell onClick={() => send('SORT_BY_NAME')} isSortable sortDir={nameSortDir}>
                {UIStrings.METRIC_HEALTH.NAME_HEADER}
              </NxTableCell>
              <NxTableCell onClick={() => send('SORT_BY_MESSAGE')} isSortable sortDir={messageSortDir}
                >{UIStrings.METRIC_HEALTH.MESSAGE_HEADER}
              </NxTableCell>
              <NxTableCell onClick={() => send('SORT_BY_ERROR')} isSortable sortDir={errorSortDir}>
                {UIStrings.METRIC_HEALTH.ERROR_HEADER}
              </NxTableCell>
            </NxTableRow>
          </NxTableHead>
          <NxTableBody isLoading={isLoading} error={error}>
            {data.map(metric => (
              <NxTableRow key={metric.name}>
                <NxTableCell hasIcon>
                  <NxFontAwesomeIcon
                    className={metric.healthy ? 'healthy' : 'unhealthy'}
                    icon={metric.healthy ? faCheckCircle : faExclamationCircle}/>
                </NxTableCell>
                <NxTableCell>{metric.name}</NxTableCell>
                <NxTableCell><span dangerouslySetInnerHTML={{__html: metric.message}} /></NxTableCell>
                <NxTableCell>{metric.error ? metric.error.message : ''}</NxTableCell>
              </NxTableRow>
            ))}
          </NxTableBody>
        </NxTable>
      </Section>
    </ContentBody>
  </Page>;
}
