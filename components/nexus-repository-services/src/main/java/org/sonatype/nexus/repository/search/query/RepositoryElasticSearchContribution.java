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
package org.sonatype.nexus.repository.search.query;

import java.util.List;
import java.util.Optional;

import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;

import org.sonatype.nexus.repository.Repository;
import org.sonatype.nexus.repository.group.GroupFacet;
import org.sonatype.nexus.repository.manager.RepositoryManager;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;

import static org.sonatype.nexus.repository.search.index.SearchConstants.REPOSITORY_NAME;

/**
 * @since 3.15.2
 */
@Named(RepositoryElasticSearchContribution.NAME)
@Singleton
public class RepositoryElasticSearchContribution
    extends DefaultElasticSearchContribution
{
  public static final String NAME = REPOSITORY_NAME;

  private final RepositoryManager repositoryManager;

  @Inject
  public RepositoryElasticSearchContribution(final RepositoryManager repositoryManager) {
    this.repositoryManager = repositoryManager;
  }

  @Override
  public void contribute(final BoolQueryBuilder query, final String type, final String value) {
    if (value == null) {
      return;
    }

    Repository repository = repositoryManager.get(value);

    if (repository != null) {
      Optional<GroupFacet> groupFacet = repository.optionalFacet(GroupFacet.class);
      if (groupFacet.isPresent()) {
        List<Repository> members = groupFacet.get().leafMembers();

        query.must(QueryBuilders.termsQuery(type, members.stream().map(Repository::getName).toArray(String[]::new)));
        return;
      }
    }

    super.contribute(query, type, value);
  }
}
