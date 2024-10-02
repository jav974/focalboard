// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {useCallback} from 'react'
import {FormattedMessage, IntlShape, useIntl} from 'react-intl'

import {ThunkDispatch} from '@reduxjs/toolkit'

import {BlockTypes} from '../../blocks/block'
import {Utils} from '../../utils'
import Button from '../../widgets/buttons/button'
import Menu from '../../widgets/menu'
import MenuWrapper from '../../widgets/menuWrapper'

import {contentRegistry} from '../content/contentRegistry'

import {touchCard} from '../../store/cards'

import {useAppDispatch} from '../../store/hooks'

import {useCardDetailContext} from './cardDetailContext'

function addContentMenu(intl: IntlShape, type: BlockTypes, dispatch: ThunkDispatch<any, any, any>): JSX.Element {
    const handler = contentRegistry.getHandler(type)
    if (!handler) {
        Utils.logError(`addContentMenu, unknown content type: ${type}`)
        return <></>
    }
    const cardDetail = useCardDetailContext()
    const addElement = useCallback(async () => {
        const {card} = cardDetail
        const index = card.fields.contentOrder.length
        cardDetail.addBlock(handler, index, false)
        dispatch(touchCard(card.id))
    }, [cardDetail, handler])

    return (
        <Menu.Text
            key={type}
            id={type}
            name={handler.getDisplayText(intl)}
            icon={handler.getIcon()}
            onClick={addElement}
        />
    )
}

const CardDetailContentsMenu = () => {
    const intl = useIntl()
    const dispatch = useAppDispatch()
    return (
        <div className='CardDetailContentsMenu content add-content'>
            <MenuWrapper>
                <Button>
                    <FormattedMessage
                        id='CardDetail.add-content'
                        defaultMessage='Add content'
                    />
                </Button>
                <Menu position='top'>
                    {contentRegistry.contentTypes.map((type) => addContentMenu(intl, type, dispatch))}
                </Menu>
            </MenuWrapper>
        </div>
    )
}

export default React.memo(CardDetailContentsMenu)
