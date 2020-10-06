/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { useFeature } from 'flagged';
import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { TransformProvider } from '../../../../../edit-story/components/transform';
import { UnitsProvider } from '../../../../../edit-story/units';
import {
  Layout,
  StandardViewContentGutter,
  InfiniteScroller,
} from '../../../../components';
import {
  SAVED_TEMPLATE_CONTEXT_MENU_ITEMS,
  TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS,
} from '../../../../constants';
import { TemplateActionsPropType, TemplatesPropType } from '../../../../types';
import { PagePropTypes, ViewPropTypes } from '../../../../utils/useStoryView';
import FontProvider from '../../../font/fontProvider';
import { SavedTemplateGridView, EmptyContentMessage } from '../../shared';

function Content({
  allPagesFetched,
  initialFocusId,
  isLoading,
  page,
  search,
  templates,
  actions,
  view,
}) {
  const [contextMenuId, setContextMenuId] = useState(-1);
  const enableInProgressStoryActions = useFeature(
    'enableInProgressStoryActions'
  );

  const handleMenuItemSelected = useCallback(() => {
    setContextMenuId(-1);
    // TODO add context menu actions
  }, []);

  const enabledMenuItems = useMemo(() => {
    if (enableInProgressStoryActions) {
      return SAVED_TEMPLATE_CONTEXT_MENU_ITEMS;
    }
    return SAVED_TEMPLATE_CONTEXT_MENU_ITEMS.filter((item) => !item.inProgress);
  }, [enableInProgressStoryActions]);

  const templateMenu = useMemo(() => {
    return {
      handleMenuToggle: setContextMenuId,
      contextMenuId,
      handleMenuItemSelected,
      menuItems: enabledMenuItems,
    };
  }, [
    setContextMenuId,
    contextMenuId,
    handleMenuItemSelected,
    enabledMenuItems,
  ]);

  return (
    <Layout.Scrollable>
      <FontProvider>
        <TransformProvider>
          <UnitsProvider
            pageSize={{
              width: view.pageSize.width,
              height: view.pageSize.height,
            }}
          >
            <StandardViewContentGutter>
              {/* Add empty view from task/clean-up-repeat-dashboard-text-components */}
              {templates.length > 0 ? (
                <>
                  <SavedTemplateGridView
                    bottomActionLabel={__('Use template', 'web-stories')}
                    centerActionLabelByStatus={
                      TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS
                    }
                    actions={actions}
                    pageSize={view.pageSize}
                    templateMenu={templateMenu}
                    templates={templates}
                    returnFocusId={initialFocusId}
                  />
                  <InfiniteScroller
                    allDataLoadedMessage={__(
                      'No more templates',
                      'web-stories'
                    )}
                    isLoading={isLoading}
                    canLoadMore={!allPagesFetched}
                    onLoadMore={page.requestNextPage}
                  />
                </>
              ) : (
                <EmptyContentMessage>
                  {search?.keyword
                    ? sprintf(
                        /* translators: %s: search term. */
                        __(
                          'Sorry, we couldn\'t find any results matching "%s"',
                          'web-stories'
                        ),
                        search.keyword
                      )
                    : __(
                        'Bookmark a story or template to get started!',
                        'web-stories'
                      )}
                </EmptyContentMessage>
              )}
            </StandardViewContentGutter>
          </UnitsProvider>
        </TransformProvider>
      </FontProvider>
    </Layout.Scrollable>
  );
}

export default Content;

Content.propTypes = {
  view: ViewPropTypes.isRequired,
  page: PagePropTypes.isRequired,
  templates: TemplatesPropType,
  initialFocusId: PropTypes.number,
  isLoading: PropTypes.bool,
  allPagesFetched: PropTypes.bool,
  actions: TemplateActionsPropType,
  search: PropTypes.object,
};