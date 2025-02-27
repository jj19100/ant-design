import type { ReactNode } from 'react';
import React from 'react';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import classNames from 'classnames';

import useClosable from '../_util/hooks/useClosable';
import type { ButtonProps } from '../button';
import Button from '../button';
import { useLocale } from '../locale';
import defaultLocale from '../locale/en_US';
import type { TourStepProps } from './interface';

function isValidNode(node: ReactNode): boolean {
  return node !== undefined && node !== null;
}

interface TourPanelProps {
  stepProps: TourStepProps;
  current: number;
  type: TourStepProps['type'];
  indicatorsRender?: TourStepProps['indicatorsRender'];
  closeIcon?: ReactNode;
}

// Due to the independent design of Panel, it will be too coupled to put in rc-tour,
// so a set of Panel logic is implemented separately in antd.
const TourPanel: React.FC<TourPanelProps> = (props) => {
  const { stepProps, current, type, closeIcon, indicatorsRender } = props;
  const {
    prefixCls,
    total = 1,
    title,
    onClose,
    onPrev,
    onNext,
    onFinish,
    cover,
    description,
    nextButtonProps,
    prevButtonProps,
    type: stepType,
    closeIcon: stepCloseIcon,
  } = stepProps;

  const mergedType = stepType ?? type;

  const mergedCloseIcon = stepCloseIcon ?? closeIcon;

  const mergedClosable = mergedCloseIcon !== false && mergedCloseIcon !== null;

  const [closable, mergedDisplayCloseIcon] = useClosable({
    closable: mergedClosable,
    closeIcon: mergedCloseIcon,
    // eslint-disable-next-line react/no-unstable-nested-components
    customCloseIconRender: (icon) => (
      <span onClick={onClose} aria-label="Close" className={`${prefixCls}-close`}>
        {icon}
      </span>
    ),
    defaultCloseIcon: <CloseOutlined className={`${prefixCls}-close-icon`} />,
    defaultClosable: true,
  });

  const isLastStep = current === total - 1;

  const prevBtnClick = () => {
    onPrev?.();
    prevButtonProps?.onClick?.();
  };

  const nextBtnClick = () => {
    if (isLastStep) {
      onFinish?.();
    } else {
      onNext?.();
    }
    nextButtonProps?.onClick?.();
  };

  const headerNode = isValidNode(title) ? (
    <div className={`${prefixCls}-header`}>
      <div className={`${prefixCls}-title`}>{title}</div>
    </div>
  ) : null;

  const descriptionNode = isValidNode(description) ? (
    <div className={`${prefixCls}-description`}>{description}</div>
  ) : null;

  const coverNode = isValidNode(cover) ? <div className={`${prefixCls}-cover`}>{cover}</div> : null;

  let mergeIndicatorNode: ReactNode;

  if (indicatorsRender) {
    mergeIndicatorNode = indicatorsRender(current, total);
  } else {
    mergeIndicatorNode = [...Array.from({ length: total }).keys()].map<ReactNode>(
      (stepItem, index) => (
        <span
          key={stepItem}
          className={classNames(
            index === current && `${prefixCls}-indicator-active`,
            `${prefixCls}-indicator`,
          )}
        />
      ),
    );
  }

  const mainBtnType = mergedType === 'primary' ? 'default' : 'primary';

  const secondaryBtnProps: ButtonProps = {
    type: 'default',
    ghost: mergedType === 'primary',
  };

  const [contextLocale] = useLocale('Tour', defaultLocale.Tour);

  return (
    <div className={`${prefixCls}-content`}>
      <div className={`${prefixCls}-inner`}>
        {closable && mergedDisplayCloseIcon}
        {coverNode}
        {headerNode}
        {descriptionNode}
        <div className={`${prefixCls}-footer`}>
          {total > 1 && <div className={`${prefixCls}-indicators`}>{mergeIndicatorNode}</div>}
          <div className={`${prefixCls}-buttons`}>
            {current !== 0 ? (
              <Button
                {...secondaryBtnProps}
                {...prevButtonProps}
                onClick={prevBtnClick}
                size="small"
                className={classNames(`${prefixCls}-prev-btn`, prevButtonProps?.className)}
              >
                {prevButtonProps?.children ?? contextLocale?.Previous}
              </Button>
            ) : null}
            <Button
              type={mainBtnType}
              {...nextButtonProps}
              onClick={nextBtnClick}
              size="small"
              className={classNames(`${prefixCls}-next-btn`, nextButtonProps?.className)}
            >
              {nextButtonProps?.children ??
                (isLastStep ? contextLocale?.Finish : contextLocale?.Next)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPanel;
